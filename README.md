# بوت نماذج مركز الصناعة الخضراء

## النشر في Render

1. ارفع محتويات هذا المجلد إلى مستودع جديد في GitHub.
2. في Render اختر **New → Blueprint** واربط المستودع. سيقرأ `render.yaml` تلقائيًا.
3. أضف المتغيرين السريين في Render:
   - `BOT_TOKEN`: خذه من @BotFather.
   - `PUBLIC_URL`: رابط خدمتك في Render بعد أول نشر، مثال: `https://green-industry-forms-bot.onrender.com`.
4. Render أنشأ `WEBHOOK_SECRET` تلقائيًا. اضغط **Manual Deploy → Deploy latest commit** مرة ثانية بعد إضافة `PUBLIC_URL`، ليُسجَّل رابط البوت عند Telegram.
5. افتح البوت في Telegram وأرسل `/start`.

## ماذا يفعل البوت؟

- يرسل زرين، كل زر يفتح صفحة HTML مستقلة.
- صفحة `maintenance.html`: نموذج طلب صيانة.
- صفحة `external.html`: نموذج إحالة إلى صيانة خارجية.
- النموذجان يدعمان الطباعة وتصدير PDF في جهاز المستخدم.

لا تضع `BOT_TOKEN` داخل أي ملف أو في GitHub؛ ضعه في متغيرات Render فقط.
