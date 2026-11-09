import os
import requests
from flask import Flask, abort, request, send_from_directory

app = Flask(__name__, static_folder="site", static_url_path="")

BOT_TOKEN = os.environ.get("BOT_TOKEN", "")
PUBLIC_URL = os.environ.get("PUBLIC_URL", "").rstrip("/")
WEBHOOK_SECRET = os.environ.get("WEBHOOK_SECRET", "")


def telegram(method, payload):
    """Call the Telegram Bot API without ever logging the bot token."""
    if not BOT_TOKEN:
        return
    requests.post(
        f"https://api.telegram.org/bot{BOT_TOKEN}/{method}",
        json=payload,
        timeout=15,
    ).raise_for_status()


def send_menu(chat_id):
    telegram("sendMessage", {
        "chat_id": chat_id,
        "text": "مرحبًا بك في نماذج مركز الصناعة الخضراء. اختر النموذج المطلوب:",
        "reply_markup": {
            "inline_keyboard": [[
                {"text": "🔧 نموذج طلب صيانة", "url": f"{PUBLIC_URL}/maintenance.html"},
                {"text": "📤 نموذج إحالة خارجية", "url": f"{PUBLIC_URL}/external.html"},
            ]]
        },
    })


@app.get("/")
def home():
    return send_from_directory("site", "maintenance.html")


@app.post("/telegram-webhook")
def telegram_webhook():
    # Telegram sends this header only when the webhook was configured with a secret.
    if not WEBHOOK_SECRET or request.headers.get("X-Telegram-Bot-Api-Secret-Token") != WEBHOOK_SECRET:
        abort(403)

    update = request.get_json(silent=True) or {}
    message = update.get("message") or {}
    text = (message.get("text") or "").strip()
    chat_id = (message.get("chat") or {}).get("id")
    if chat_id and (text.startswith("/start") or text == "نماذج"):
        send_menu(chat_id)
    return {"ok": True}


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=int(os.environ.get("PORT", 10000)))
