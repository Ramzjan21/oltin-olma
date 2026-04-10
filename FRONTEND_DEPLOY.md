# Frontend va Backend Render'da Alohida Deploy

## Backend (Allaqachon deploy qilingan)
- URL: https://oltin-olma.onrender.com
- API: https://oltin-olma.onrender.com/api

## Frontend Deploy (Render'ga)

### 1. Yangi Web Service Yaratish

1. Render.com → **New +** → **Web Service**
2. Repository: `Ramzjan21/oltin-olma`
3. Sozlamalar:
   - **Name**: `oltin-olma-frontend`
   - **Root Directory**: `frontend`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
   - **Plan**: Free

### 2. Environment Variables

```env
NEXT_PUBLIC_API_URL=https://oltin-olma.onrender.com/api
NEXT_PUBLIC_WS_URL=wss://oltin-olma.onrender.com
NEXT_PUBLIC_TELEGRAM_BOT_USERNAME=your_bot_username
```

### 3. Backend CORS Yangilash

Backend service'da (https://oltin-olma.onrender.com):

Environment Variables → **FRONTEND_URL** qo'shing:
```env
FRONTEND_URL=https://oltin-olma-frontend.onrender.com
```

### 4. Deploy

**"Create Web Service"** → Deploy boshlanadi

---

## Tavsiya: Vercel Ishlatish

Frontend uchun Vercel yaxshiroq chunki:
- ✅ Tezroq (CDN)
- ✅ Bepul (unlimited)
- ✅ Sleep mode yo'q
- ✅ Avtomatik HTTPS
- ✅ Git push = avtomatik deploy

Render:
- ⚠️ 750 soat/oy
- ⚠️ 15 daqiqa sleep
- ⚠️ Sekinroq

## Qaysi Variantni Tanlaysiz?

1. **Vercel (tavsiya)** - Frontend Vercel'da, Backend Render'da
2. **Render** - Ikkisi ham Render'da
