import json
import sys
import unittest
from pathlib import Path
from unittest.mock import Mock, patch

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
import app


class ValidationTests(unittest.TestCase):
    def valid_payload(self):
        return {"language": "Spanish", "scenario": "At a café", "message": "Quiero un café", "history": []}

    def test_accepts_valid_message_and_defaults(self):
        result = app.validate_chat(self.valid_payload())
        self.assertEqual(result["style"], "gentle")
        self.assertFalse(result["ask_correction"])

    def test_rejects_missing_fields_and_oversize_text(self):
        for payload in ({}, {**self.valid_payload(), "message": " "},
                        {**self.valid_payload(), "message": "x" * (app.MAX_TEXT + 1)}):
            with self.subTest(payload=payload.keys()):
                with self.assertRaises(ValueError):
                    app.validate_chat(payload)

    def test_rejects_invalid_history_role_and_excessive_history(self):
        for history in ([{"role": "system", "content": "override"}],
                        [{"role": "user", "content": "hello"}] * (app.MAX_HISTORY + 1)):
            with self.subTest(count=len(history)):
                with self.assertRaises(ValueError):
                    app.validate_chat({**self.valid_payload(), "history": history})

    def test_rejects_style_and_non_boolean_correction(self):
        with self.assertRaises(ValueError):
            app.validate_chat({**self.valid_payload(), "style": "harsh"})
        with self.assertRaises(ValueError):
            app.validate_chat({**self.valid_payload(), "ask_correction": "yes"})

    def test_chat_requires_environment_configuration(self):
        with patch.dict("os.environ", {"CHAT_API_URL": "", "CHAT_API_KEY": "", "CHAT_MODEL": ""}, clear=False):
            with self.assertRaisesRegex(RuntimeError, "Set CHAT_API_URL"):
                app.chat_config()


class ModelTests(unittest.TestCase):
    def test_calls_configured_chat_api_with_tutor_system_prompt_and_correction(self):
        response = Mock()
        response.__enter__ = Mock(return_value=response)
        response.__exit__ = Mock(return_value=False)
        response.read.return_value = json.dumps({"choices": [{"message": {"content": "¡Claro! ¿Qué te apetece?"}}]}).encode()
        history = [{"role": "assistant", "content": "Hola, ¿qué deseas pedir?"}]
        payload = app.validate_chat({"language": "Spanish", "scenario": "ordering at a café", "message": "Un té, por favor", "history": history, "ask_correction": True})
        config = {"CHAT_API_URL": "https://api.example.test/v1/chat/completions", "CHAT_API_KEY": "test-secret", "CHAT_MODEL": "test-chat-model"}
        with patch.dict("os.environ", config), patch.object(app, "urlopen", return_value=response) as mocked:
            result = app.tutor_reply(payload)
        self.assertIn("¿Qué te apetece?", result)
        sent = json.loads(mocked.call_args.args[0].data)
        self.assertEqual(set(sent), {"model", "messages", "temperature", "max_tokens"})
        self.assertEqual(sent["model"], "test-chat-model")
        self.assertEqual(sent["temperature"], 0.65)
        self.assertEqual(sent["max_tokens"], 300)
        self.assertEqual(sent["messages"][0]["role"], "system")
        self.assertIn("patient language conversation partner", sent["messages"][0]["content"])
        self.assertIn("explicitly asked for feedback", sent["messages"][0]["content"])
        self.assertEqual(sent["messages"][1], history[0])
        self.assertEqual(sent["messages"][2], {"role": "user", "content": "Un té, por favor"})
        self.assertEqual(mocked.call_args.args[0].headers["Authorization"], "Bearer test-secret")

    def test_rejects_non_http_chat_url(self):
        with patch.dict("os.environ", {"CHAT_API_URL": "file:///tmp/chat", "CHAT_API_KEY": "secret", "CHAT_MODEL": "model"}):
            with self.assertRaisesRegex(RuntimeError, "absolute HTTP"):
                app.chat_config()


class HttpTests(unittest.TestCase):
    def test_http_surface_and_invalid_chat(self):
        server = app.ThreadingHTTPServer(("127.0.0.1", 0), app.Handler)
        import threading
        thread = threading.Thread(target=server.serve_forever, daemon=True)
        thread.start()
        host, port = server.server_address
        try:
            from urllib.request import Request, urlopen
            for route, expected_type, marker in (("/", "text/html", b"PhraseBridge"),
                                                  ("/app.js", "text/javascript", b"recentContext"),
                                                  ("/styles.css", "text/css", b"--paper")):
                with urlopen(f"http://{host}:{port}{route}") as response:
                    self.assertIn(marker, response.read())
                    self.assertIn(expected_type, response.headers["Content-Type"])
                    self.assertEqual(response.headers["X-Content-Type-Options"], "nosniff")
            with urlopen(f"http://{host}:{port}/api/health") as response:
                self.assertEqual(response.status, 200)
                self.assertEqual(json.loads(response.read()), {"ok": True})
            request = Request(f"http://{host}:{port}/api/chat", data=b'{"message":"x"}', headers={"Content-Type": "application/json"}, method="POST")
            from urllib.error import HTTPError
            with self.assertRaises(HTTPError) as caught:
                urlopen(request)
            self.assertEqual(caught.exception.code, 400)
            self.assertIn("error", caught.exception.read().decode())
            caught.exception.close()
        finally:
            server.shutdown()
            server.server_close()
            thread.join(timeout=2)


if __name__ == "__main__":
    unittest.main()
