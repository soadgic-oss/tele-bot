import os
import sys
import requests

token = os.environ.get("BOT_TOKEN")
public_url = os.environ.get("PUBLIC_URL", "").rstrip("/")
secret = os.environ.get("WEBHOOK_SECRET")

if not all([token, public_url, secret]):
    print("Webhook setup skipped: BOT_TOKEN, PUBLIC_URL, and WEBHOOK_SECRET are required.")
    sys.exit(0)

response = requests.post(
    f"https://api.telegram.org/bot{token}/setWebhook",
    json={"url": f"{public_url}/telegram-webhook", "secret_token": secret, "allowed_updates": ["message"]},
    timeout=15,
)
response.raise_for_status()
print("Telegram webhook configured.")
