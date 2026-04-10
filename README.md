# Oltin Olma Daraxt - Gamified Earning System

Telegram orqali autentifikatsiya qilinadigan, daraxt o'stirish va mukofot olish tizimi.

## 📋 Loyiha Haqida

Bu loyiha foydalanuvchilarga "Oltin Olma Daraxt" sotib olish va har kuni olma yig'ish orqali daromad topish imkonini beradi. 7 kun davomida har kuni olma yig'ilsa, foydalanuvchi 50,000 - 500,000 UZS orasida mukofot oladi.

### Asosiy Xususiyatlar

- ✅ Telegram orqali autentifikatsiya
- ✅ Daraxt sotib olish tizimi (50,000 UZS)
- ✅ Har 8 soatda olma yig'ish (kuniga 3 marta)
- ✅ 7 kunlik progress tracking
- ✅ Profit-safe mukofot algoritmi
- ✅ Real-time WebSocket ulanishi
- ✅ Admin panel (statistika va foydalanuvchilarni boshqarish)
- ✅ Dark fantasy UI dizayni
- ✅ To'lov tizimi integratsiyasi (Payme, Click, Mock)

## 🏗️ Texnologiyalar

### Backend
- Node.js + Express + TypeScript
- PostgreSQL (database)
- JWT (autentifikatsiya)
- WebSocket (real-time)
- Telegram Bot API

### Frontend
- Next.js 14 + React 18
- TypeScript
- Tailwind CSS
- Framer Motion (animatsiyalar)
- Zustand (state management)
- Axios (HTTP client)

## 📁 Loyiha Strukturasi

```
golden-apple-tree/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── database.ts
│   │   ├── middleware/
│   │   │   └── auth.ts
│   │   ├── models/
│   │   │   ├── User.ts
│   │   │   ├── Tree.ts
│   │   │   ├── Collection.ts
│   │   │   ├── Reward.ts
│   │   │   ├── Transaction.ts
│   │   │   └── SystemStats.ts
│   │   ├── routes/
│   │   │   ├── auth.ts
│   │   │   ├── tree.ts
│   │   │   └── admin.ts
│   │   ├── services/
│   │   │   └── rewardAlgorithm.ts
│   │   └── index.ts
│   ├── database/
│   │   └── schema.sql
│   ├── package.json
│   ├── tsconfig.json
│   └── .env.example
├── frontend/
│   ├── app/
│   │   ├── page.tsx (Login)
│   │   ├── dashboard/
│   │   │   └── page.tsx
│   │   ├── purchase/
│   │   │   └── page.tsx
│   │   ├── admin/
│   │   │   └── page.tsx
│   │   ├── layout.tsx
│   │   └── globals.css
│   ├── components/
│   │   ├── GlassCard.tsx
│   │   ├── TreeVisualization.tsx
│   │   ├── CountdownTimer.tsx
│   │   ├── ProgressBar.tsx
│   │   ├── Button.tsx
│   │   └── Notification.tsx
│   ├── store/
│   │   └── useStore.ts
│   ├── hooks/
│   │   ├── useWebSocket.ts
│   │   └── useCountdown.ts
│   ├── package.json
│   ├── tsconfig.json
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   ├── next.config.js
│   └── .env.local.example
└── package.json
```

## 🚀 O'rnatish va Ishga Tushirish

### 1. Talablar

- Node.js 18+ va npm
- PostgreSQL 14+
- Telegram Bot Token

### 2. Database O'rnatish

PostgreSQL o'rnatilganidan keyin:

```bash
# PostgreSQL ga kirish
psql -U postgres

# Database yaratish
CREATE DATABASE golden_apple_db;

# Database'ga ulanish
\c golden_apple_db

# Schema yuklash
\i backend/database/schema.sql
```

### 3. Backend O'rnatish

```bash
# Backend papkasiga kirish
cd backend

# Dependencies o'rnatish
npm install

# .env fayl yaratish
cp .env.example .env

# .env faylni tahrirlash (ma'lumotlarni to'ldiring)
# DATABASE_URL, JWT_SECRET, TELEGRAM_BOT_TOKEN va boshqalar

# Development rejimida ishga tushirish
npm run dev

# Yoki build qilib ishga tushirish
npm run build
npm start
```

Backend `http://localhost:5000` da ishga tushadi.

### 4. Frontend O'rnatish

```bash
# Frontend papkasiga kirish
cd frontend

# Dependencies o'rnatish
npm install

# .env.local fayl yaratish
cp .env.local.example .env.local

# .env.local faylni tahrirlash

# Development rejimida ishga tushirish
npm run dev

# Yoki build qilib ishga tushirish
npm run build
npm start
```

Frontend `http://localhost:3000` da ishga tushadi.

### 5. Ikkala Serverni Bir Vaqtda Ishga Tushirish

Root papkadan:

```bash
# Dependencies o'rnatish
npm install

# Ikkala serverni ishga tushirish
npm run dev
```

## 🔧 Konfiguratsiya

### Backend Environment Variables (.env)

```env
PORT=5000
DATABASE_URL=postgresql://username:password@localhost:5432/golden_apple_db
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
TELEGRAM_BOT_TOKEN=your_telegram_bot_token_here
TELEGRAM_BOT_USERNAME=your_bot_username
FRONTEND_URL=http://localhost:3000
NODE_ENV=development

# Payment Gateway
PAYME_MERCHANT_ID=your_payme_merchant_id
CLICK_MERCHANT_ID=your_click_merchant_id
CLICK_SECRET_KEY=your_click_secret_key

# System Configuration
TREE_COST=50000
MIN_REWARD=50000
MAX_REWARD=500000
COLLECTION_INTERVAL_HOURS=8
WEEKLY_DAYS=7
```

### Frontend Environment Variables (.env.local)

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_WS_URL=ws://localhost:5000
NEXT_PUBLIC_TELEGRAM_BOT_USERNAME=your_bot_username
```

## 📡 API Endpoints

### Authentication
- `POST /api/auth/telegram-auth` - Telegram orqali kirish
- `GET /api/auth/me` - Joriy foydalanuvchi ma'lumotlari

### Tree Management
- `POST /api/tree/purchase` - Daraxt sotib olish
- `GET /api/tree/active` - Faol daraxt ma'lumotlari
- `POST /api/tree/collect` - Olma yig'ish
- `POST /api/tree/claim-reward` - Mukofot olish
- `GET /api/tree/history` - Daraxtlar tarixi

### Admin (Admin faqat)
- `GET /api/admin/stats` - Tizim statistikasi
- `GET /api/admin/users` - Barcha foydalanuvchilar
- `POST /api/admin/users/:userId/ban` - Foydalanuvchini bloklash
- `GET /api/admin/trees` - Barcha daraxtlar
- `GET /api/admin/rewards` - Barcha mukofotlar
- `GET /api/admin/transactions` - Barcha tranzaksiyalar

## 🎮 Qanday Ishlaydi

### Foydalanuvchi Oqimi

1. **Kirish**: Telegram orqali autentifikatsiya
2. **Daraxt Sotib Olish**: 50,000 UZS to'lab daraxt sotib olish
3. **Olma Yig'ish**: Har 8 soatda bir marta (kuniga 3 marta)
4. **7 Kun Davom Ettirish**: Har kuni kamida 1 marta yig'ish
5. **Mukofot Olish**: 7 kundan keyin 50,000 - 500,000 UZS mukofot

### Muhim Qoidalar

- ⚠️ Agar 1 kun ham o'tkazib yuborsangiz, daraxt o'ladi
- ⚠️ O'lgan daraxt uchun pul qaytarilmaydi
- ⚠️ Har kuni kamida 1 marta olma yig'ish kerak
- ✅ Kuniga maksimal 3 marta yig'ish mumkin

## 💰 Mukofot Algoritmi

Mukofot algoritmi tizim foydasini hisobga oladi:

```typescript
// Foyda foiziga qarab mukofot taqsimlanadi
if (profitMargin > 50%) {
  // 60% high, 30% medium, 10% low mukofot
} else if (profitMargin > 30%) {
  // 30% high, 50% medium, 20% low mukofot
} else if (profitMargin > 10%) {
  // 10% high, 40% medium, 50% low mukofot
} else {
  // 5% high, 15% medium, 80% low mukofot
}
```

Bu algoritm tizimning zarar ko'rmasligini ta'minlaydi.

## 🔒 Xavfsizlik

- JWT token autentifikatsiya
- Telegram hash verification
- Server-side validation
- SQL injection himoyasi (parameterized queries)
- XSS himoyasi
- CORS konfiguratsiyasi
- Rate limiting (qo'shish mumkin)

## 🎨 UI Xususiyatlari

- Dark fantasy dizayni
- Glassmorphism effektlari
- Smooth animatsiyalar (Framer Motion)
- Lightning background
- Glow effektlari
- Responsive dizayn
- Real-time yangilanishlar

## 👨‍💼 Admin Panel

Admin panel orqali:
- Tizim statistikasini ko'rish
- Foydalanuvchilarni boshqarish
- Foydalanuvchilarni bloklash/blokdan chiqarish
- Daraxtlar va mukofotlarni ko'rish
- Tranzaksiyalarni kuzatish

Admin yaratish uchun database'da `is_admin` ni `true` qiling:

```sql
UPDATE users SET is_admin = true WHERE telegram_id = YOUR_TELEGRAM_ID;
```

## 🐛 Debugging

### Backend Logs
Backend console'da barcha so'rovlar va xatolar ko'rsatiladi.

### Frontend Logs
Browser console'da WebSocket ulanishi va API so'rovlari ko'rsatiladi.

### Database Tekshirish
```sql
-- Foydalanuvchilarni ko'rish
SELECT * FROM users;

-- Faol daraxtlarni ko'rish
SELECT * FROM trees WHERE status = 'active';

-- Tizim statistikasini ko'rish
SELECT * FROM system_stats;
```

## 📝 Keyingi Qadamlar

- [ ] Real Telegram Bot integratsiyasi
- [ ] Real to'lov tizimi (Payme, Click)
- [ ] Email bildirishnomalar
- [ ] Push notifications
- [ ] Referral tizimi
- [ ] Daraxt levellari (Level 2, 3, ...)
- [ ] Leaderboard
- [ ] Mobil ilova (React Native)

## 🤝 Hissa Qo'shish

Pull request'lar qabul qilinadi. Katta o'zgarishlar uchun avval issue oching.

## 📄 Litsenziya

MIT

## 📞 Aloqa

Savollar yoki muammolar bo'lsa, issue oching yoki bog'laning.

---

**Diqqat**: Bu demo versiya. Production'da ishlatish uchun qo'shimcha xavfsizlik choralari va optimizatsiyalar kerak.
