# RENDER.COM DEPLOY GUIDE (Bitta Service)

## 🚀 Render'ga Bitta Web Service Sifatida Deploy Qilish

Endi frontend va backend bitta Render Web Service'da ishlaydi.

## 📋 Tayyorgarlik

### 1. PostgreSQL Database Yaratish

1. Render.com'ga kiring: https://render.com
2. **"New +"** → **"PostgreSQL"**
3. Sozlamalar:
   - **Name**: `golden-apple-db`
   - **Database**: `golden_apple_db`
   - **Region**: Frankfurt (yoki yaqin)
   - **Plan**: **Free**
4. **"Create Database"**
5. **"Internal Database URL"** ni nusxalang

### 2. Database Schema Yuklash

```bash
# PSQL Command bilan ulanish (Render dashboard'dan oling)
psql postgresql://user:pass@host/golden_apple_db

# Schema yuklash
\i backend/database/schema.sql

# Yoki
psql postgresql://user:pass@host/golden_apple_db < backend/database/schema.sql
```

## 🌐 Web Service Deploy Qilish

### 1. Render'da Web Service Yaratish

1. **"New +"** → **"Web Service"**
2. **"Build and deploy from a Git repository"**
3. GitHub repository: `Ramzjan21/oltin-olma`
4. **"Connect"**

### 2. Service Sozlamalari

**Basic Settings:**
- **Name**: `golden-apple-tree`
- **Region**: Frankfurt (database bilan bir xil)
- **Branch**: `main`
- **Root Directory**: (bo'sh qoldiring - root)
- **Runtime**: `Node`
- **Build Command**: 
  ```bash
  npm install && cd frontend && npm install && npm run build && cd ../backend && npm install && npm run build
  ```
- **Start Command**: 
  ```bash
  node server.js
  ```
- **Plan**: **Free**

### 3. Environment Variables

**"Advanced"** → **"Environment Variables"** qo'shing:

```env
PORT=10000
NODE_ENV=production

# Database
DATABASE_URL=postgresql://user:pass@host/golden_apple_db

# JWT
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production_12345

# Telegram
TELEGRAM_BOT_TOKEN=your_telegram_bot_token
TELEGRAM_BOT_USERNAME=your_bot_username

# URLs (Render URL bilan to'ldiriladi)
FRONTEND_URL=https://golden-apple-tree.onrender.com

# System Config
TREE_COST=50000
MIN_REWARD=50000
MAX_REWARD=500000
COLLECTION_INTERVAL_HOURS=8
WEEKLY_DAYS=7
```

### 4. Deploy Qilish

1. **"Create Web Service"**
2. Deploy boshlanadi (10-15 daqiqa)
3. Logs'ni kuzatib boring

## ✅ Deploy Tugagandan Keyin

### 1. URL Olish

Deploy tugagach, Render sizga URL beradi:
```
https://golden-apple-tree.onrender.com
```

### 2. Environment Variables Yangilash

1. Service Settings → Environment
2. **FRONTEND_URL** ni yangilang:
   ```
   FRONTEND_URL=https://golden-apple-tree.onrender.com
   ```
3. **"Save Changes"** → Service restart bo'ladi

### 3. Telegram Bot Sozlash

@BotFather'da:
```
/editapp
```
- Web App URL: `https://golden-apple-tree.onrender.com`

### 4. Test Qilish

1. URL'ni oching: `https://golden-apple-tree.onrender.com`
2. Login qiling
3. Barcha funksiyalarni test qiling
4. Telegram bot orqali ham test qiling

## 🔧 Muammolarni Hal Qilish

### Build Failed?

Render Logs'da xatoni ko'ring:
```bash
# Logs → Build Logs
```

Keng tarqalgan xatolar:
- `npm install` failed → package.json tekshiring
- `npm run build` failed → TypeScript xatolari
- Memory limit → Free plan 512MB

### Server Crash?

```bash
# Logs → Deploy Logs
```

Tekshirish:
- Database connection
- Environment variables
- Port (Render avtomatik PORT beradi)

### Frontend Ko'rinmayapti?

1. Build to'g'ri bo'lganini tekshiring
2. `frontend/.next` papka yaratilganini tekshiring
3. `server.js` to'g'ri ishlayotganini tekshiring

## 📊 Render Free Plan

- **750 soat/oy** (31 kun = 744 soat)
- **512MB RAM**
- **15 daqiqa** faoliyatsizlikdan keyin sleep
- Birinchi request'da uyg'onadi (30-60 soniya)

## 🎯 Production Checklist

- [ ] PostgreSQL database yaratildi
- [ ] Schema yuklandi
- [ ] Web Service yaratildi
- [ ] Build command to'g'ri
- [ ] Start command to'g'ri
- [ ] Environment variables to'g'ri
- [ ] FRONTEND_URL yangilandi
- [ ] Telegram bot yangilandi
- [ ] Test qilindi

## 🚀 Deploy Qilish

Hammasi tayyor! Endi:

```bash
# Local'da test qiling
npm run dev:all

# GitHub'ga push qiling
git add .
git commit -m "Ready for Render deployment"
git push

# Render avtomatik deploy qiladi
```

Render'da bitta service - frontend va backend birga! 🎉
