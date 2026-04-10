# SETUP GUIDE - Oltin Olma Daraxt

## Tezkor Boshlash (5 daqiqa)

### 1. PostgreSQL O'rnatish

**Windows:**
1. PostgreSQL yuklab oling: https://www.postgresql.org/download/windows/
2. O'rnatish jarayonida parol o'rnating (masalan: `postgres`)
3. pgAdmin 4 avtomatik o'rnatiladi

**Mac:**
```bash
brew install postgresql
brew services start postgresql
```

**Linux:**
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
```

### 2. Database Yaratish

```bash
# PostgreSQL ga kirish
psql -U postgres

# Yoki Windows'da pgAdmin 4 ishlatish mumkin
```

PostgreSQL console'da:
```sql
-- Database yaratish
CREATE DATABASE golden_apple_db;

-- Database'ga ulanish
\c golden_apple_db

-- Schema yuklash (yoki pgAdmin'da SQL faylni import qiling)
-- backend/database/schema.sql faylini ochib, ichidagi SQL kodlarni copy-paste qiling
```

### 3. Telegram Bot Yaratish

1. Telegram'da @BotFather ni toping
2. `/newbot` buyrug'ini yuboring
3. Bot nomi va username kiriting
4. Bot token oling (masalan: `1234567890:ABCdefGHIjklMNOpqrsTUVwxyz`)
5. Bot username'ni eslab qoling (masalan: `@golden_apple_bot`)

### 4. Backend Sozlash

```bash
cd backend
npm install
```

`.env` fayl yarating:
```env
PORT=5000
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/golden_apple_db
JWT_SECRET=my_super_secret_key_12345
TELEGRAM_BOT_TOKEN=1234567890:ABCdefGHIjklMNOpqrsTUVwxyz
TELEGRAM_BOT_USERNAME=golden_apple_bot
FRONTEND_URL=http://localhost:3000
NODE_ENV=development

TREE_COST=50000
MIN_REWARD=50000
MAX_REWARD=500000
COLLECTION_INTERVAL_HOURS=8
WEEKLY_DAYS=7
```

Backend'ni ishga tushiring:
```bash
npm run dev
```

### 5. Frontend Sozlash

Yangi terminal oching:
```bash
cd frontend
npm install
```

`.env.local` fayl yarating:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_WS_URL=ws://localhost:5000
NEXT_PUBLIC_TELEGRAM_BOT_USERNAME=golden_apple_bot
```

Frontend'ni ishga tushiring:
```bash
npm run dev
```

### 6. Brauzerda Ochish

1. Brauzerda `http://localhost:3000` ni oching
2. "Telegram orqali kirish" tugmasini bosing (Mock login)
3. Dashboard ochiladi

### 7. Admin Yaratish

PostgreSQL console'da:
```sql
-- Avval o'zingizning user ID'ingizni toping
SELECT * FROM users;

-- Admin qilish (id ni o'zgartiring)
UPDATE users SET is_admin = true WHERE id = 1;
```

Admin panel: `http://localhost:3000/admin`

## Muammolarni Hal Qilish

### Database ulanmayapti
```bash
# PostgreSQL ishlab turganini tekshiring
# Windows:
services.msc # PostgreSQL service'ni toping

# Mac/Linux:
sudo systemctl status postgresql
```

### Port band
Agar 5000 yoki 3000 portlar band bo'lsa, `.env` faylda portni o'zgartiring.

### npm install xatosi
```bash
# Cache tozalash
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

## Production Deploy

### Backend (Heroku/Railway/Render)

1. PostgreSQL database yarating
2. Environment variables o'rnating
3. `npm run build && npm start`

### Frontend (Vercel/Netlify)

1. GitHub'ga push qiling
2. Vercel/Netlify'ga ulanish
3. Environment variables o'rnating
4. Deploy

## Xavfsizlik (Production)

1. `.env` fayllarni git'ga qo'shmang
2. JWT_SECRET ni kuchli qiling (32+ belgi)
3. DATABASE_URL ni himoyalang
4. CORS ni to'g'ri sozlang
5. Rate limiting qo'shing
6. HTTPS ishlatish

## Qo'shimcha Sozlamalar

### Email Bildirishnomalar
`nodemailer` o'rnating va sozlang

### Real Telegram Login
Telegram Login Widget integratsiya qiling

### Real To'lov
Payme/Click API integratsiya qiling

---

Savollar bo'lsa, README.md faylga qarang yoki issue oching.
