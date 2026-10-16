# Upnur — veb-sayt

Faqat frontend (HTML + CSS + JS). Hech qanday server yoki build kerak emas — GitHub Pages'da shundayligicha ishlaydi.

## Sahifalar

| Fayl | Bo'lim |
|---|---|
| `index.html` | Bosh sahifa: Upnur, kurslar, Ustoz Elite boti reklamasi, loyihalar |
| `kurslar.html` | Python, Matematika, Ingliz tili |
| `loyihalar.html` | Ustoz Elite, Uni-test, Feasto |
| `biz-haqimizda.html` | Kompaniya haqida |
| `qiziqarli.html` | Dasturlash haqida qiziqarli faktlar |
| `ariza.html` | Ariza formasi → Telegram'ga yuboriladi |

`ariza.html?kurs=python` (yoki `matematika`, `ingliz`) — kurs oldindan tanlangan holda ochiladi.

## Arizalar Telegram'ga kelishi uchun (1 marta)

1. Telegram'da **@BotFather** → `/newbot` → faqat arizalar uchun **yangi** bot oching.
   ⚠️ Ustoz Elite yoki boshqa ishlayotgan botning tokenini qo'ymang: sayt kodi hammaga ochiq.
2. BotFather bergan tokenni `js/config.js` dagi `BOT_TOKEN` ga qo'ying.
3. O'z akkauntingizdan (ID `6564190093`) yangi botga kirib **Start** ni bosing.
4. Saytda sinov ariza yuboring — xabar shu botdan sizga keladi.

## GitHub Pages'ga joylash

1. GitHub'da yangi repo oching (masalan `upnur`).
2. Shu papkadagi **hamma fayllarni** repo ildiziga yuklang (`index.html` repo ildizida bo'lsin).
3. Repo → **Settings → Pages** → Source: `Deploy from a branch`, Branch: `main` / `/ (root)` → Save.
4. 1–2 daqiqadan keyin sayt `https://<github-login>.github.io/upnur/` manzilida ochiladi.

## O'zgartirish

- Ranglar, shriftlar: `css/style.css` boshidagi `:root` bo'limi.
- Ustoz Elite havolasi: `js/config.js` → `ELITE_BOT`.
- Logotiplar: `assets/img/` (PDF'dan olingan vektor SVG).
