# TELEGRAM WEBAPP SETUP GUIDE

## Telegram WebApp uchun sozlash

Loyiha endi Telegram WebApp va mobil qurilmalar uchun to'liq optimallashtirilgan.

## 🎯 Yangi Xususiyatlar

### Mobile Optimizatsiya
- ✅ Responsive dizayn (telefon, planshet, desktop)
- ✅ Touch-friendly tugmalar (48px minimal o'lcham)
- ✅ Haptic feedback (vibration)
- ✅ Safe area support (notch qurilmalar uchun)
- ✅ Pull-to-refresh oldini olish
- ✅ Zoom oldini olish
- ✅ Telegram WebApp SDK integratsiyasi

### Telegram WebApp SDK
- Auto-login (Telegram ma'lumotlari bilan)
- Haptic feedback (light, medium, heavy, success, error)
- Theme colors (Telegram ranglariga moslashish)
- Main Button va Back Button support
- Closing confirmation

## 📱 Telegram Bot Yaratish

### 1. Bot Yaratish

Telegram'da @BotFather ni toping va quyidagi buyruqlarni yuboring:

```
/newbot
```

Bot nomi va username kiriting:
- Nom: `Oltin Olma Daraxt`
- Username: `golden_apple_tree_bot` (yoki boshqa)

Bot token oling va saqlang.

### 2. WebApp Sozlash

@BotFather'da:

```
/newapp
```

Bot'ni tanlang va quyidagi ma'lumotlarni kiriting:

- **Title**: Oltin Olma Daraxt
- **Description**: Har kuni olma yig'ing va katta mukofotlar qo'lga kiriting!
- **Photo**: 640x360 rasm yuklang (daraxt rasmi)
- **Demo GIF**: (ixtiyoriy)
- **Short name**: `golden_apple` (URL uchun)
- **Web App URL**: `https://your-domain.com` (yoki ngrok URL test uchun)

### 3. Menu Button Sozlash

```
/setmenubutton
```

Bot'ni tanlang:
- **Button text**: 🌳 O'yinni boshlash
- **Web App URL**: `https://your-domain.com`

## 🚀 Local Test (ngrok bilan)

### 1. ngrok O'rnatish

```bash
# Windows
choco install ngrok

# Mac
brew install ngrok

# Linux
snap install ngrok
```

### 2. Frontend'ni Ishga Tushirish

```bash
cd frontend
npm run dev
```

### 3. ngrok Tunnel Yaratish

```bash
ngrok http 3000
```

ngrok sizga HTTPS URL beradi (masalan: `https://abc123.ngrok.io`)

### 4. Telegram Bot'ga URL Qo'shish

@BotFather'da `/newapp` yoki `/editapp` orqali ngrok URL'ni qo'shing.

### 5. Test Qilish

Telegram'da bot'ni oching va menu tugmasini bosing. WebApp ochiladi!

## 🌐 Production Deploy

### Frontend (Vercel)

1. GitHub'ga push qiling
2. Vercel'ga ulanish: https://vercel.com
3. Repository'ni import qiling
4. Environment variables qo'shing:
   ```
   NEXT_PUBLIC_API_URL=https://your-backend-url.com/api
   NEXT_PUBLIC_WS_URL=wss://your-backend-url.com
   NEXT_PUBLIC_TELEGRAM_BOT_USERNAME=your_bot_username
   ```
5. Deploy qiling

### Backend (Railway/Render)

1. GitHub'ga push qiling
2. Railway/Render'ga ulanish
3. PostgreSQL database yarating
4. Environment variables qo'shing
5. Deploy qiling

### Telegram Bot'ni Yangilash

@BotFather'da production URL'ni qo'shing:
```
/editapp
```

## 📱 Telegram WebApp Xususiyatlari

### Auto-Login

Foydalanuvchi Telegram'dan ochganda avtomatik login bo'ladi:

```typescript
const { webApp, user } = useTelegramWebApp();

if (user) {
  // Telegram user ma'lumotlari mavjud
  console.log(user.first_name, user.username);
}
```

### Haptic Feedback

```typescript
import { hapticFeedback } from '@/hooks/useTelegramWebApp';

// Tugma bosilganda
hapticFeedback.light();

// Muvaffaqiyatli amal
hapticFeedback.success();

// Xato
hapticFeedback.error();
```

### Theme Colors

WebApp avtomatik ravishda Telegram theme ranglariga moslashadi:

```typescript
const { webApp } = useTelegramWebApp();

// Header rangini o'zgartirish
webApp?.setHeaderColor('#0a0a0f');

// Background rangini o'zgartirish
webApp?.setBackgroundColor('#0a0a0f');
```

### Main Button

```typescript
const { webApp } = useTelegramWebApp();

// Tugmani ko'rsatish
webApp?.MainButton.setText('Davom etish');
webApp?.MainButton.show();

// Click handler
webApp?.MainButton.onClick(() => {
  console.log('Main button bosildi');
});
```

## 🎨 Mobile UI Xususiyatlari

### Responsive Breakpoints

- **Mobile**: < 768px
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px

### Touch Targets

Barcha tugmalar kamida 48px balandlikda (Apple va Google standartlari).

### Safe Area

iPhone notch va boshqa qurilmalar uchun:

```css
.safe-area-top {
  padding-top: max(1rem, env(safe-area-inset-top));
}

.safe-area-bottom {
  padding-bottom: max(1rem, env(safe-area-inset-bottom));
}
```

### Font Sizes

iOS'da zoom oldini olish uchun minimal 16px font size.

## 🔧 Debugging

### Telegram WebApp Console

Telegram Desktop'da WebApp ochib, Developer Tools ishlatish mumkin:
- Windows/Linux: `Ctrl + Shift + I`
- Mac: `Cmd + Option + I`

### Mobile Debugging

Chrome DevTools orqali:
1. Chrome'da `chrome://inspect` oching
2. Telefon'ni USB orqali ulang
3. WebApp'ni telefonda oching
4. Chrome'da "Inspect" bosing

### ngrok Logs

```bash
ngrok http 3000 --log=stdout
```

## 📝 Test Checklist

- [ ] Telegram WebApp'da ochiladi
- [ ] Auto-login ishlaydi
- [ ] Haptic feedback ishlaydi
- [ ] Barcha sahifalar mobile'da to'g'ri ko'rinadi
- [ ] Tugmalar oson bosiladi (48px+)
- [ ] Scroll ishlaydi
- [ ] Pull-to-refresh yo'q
- [ ] Zoom yo'q
- [ ] Safe area to'g'ri (notch qurilmalarda)
- [ ] Landscape mode ishlaydi
- [ ] Loading states ko'rinadi
- [ ] Error messages ko'rinadi

## 🎯 Telegram Bot Commands

Bot'ga quyidagi commandlarni qo'shing (@BotFather orqali):

```
/start - O'yinni boshlash
/help - Yordam
/balance - Balansni ko'rish
/tree - Daraxt holati
```

## 📚 Qo'shimcha Resurslar

- [Telegram WebApp Documentation](https://core.telegram.org/bots/webapps)
- [Telegram Bot API](https://core.telegram.org/bots/api)
- [ngrok Documentation](https://ngrok.com/docs)

---

Savollar bo'lsa, README.md yoki SETUP.md faylga qarang.
