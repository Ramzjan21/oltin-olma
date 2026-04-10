# API DOCUMENTATION

## Base URL
```
http://localhost:5000/api
```

## Authentication
Barcha himoyalangan endpointlar uchun JWT token kerak:
```
Authorization: Bearer <token>
```

---

## 🔐 Authentication Endpoints

### POST /auth/telegram-auth
Telegram orqali kirish yoki ro'yxatdan o'tish

**Request Body:**
```json
{
  "id": 123456789,
  "first_name": "John",
  "last_name": "Doe",
  "username": "johndoe",
  "auth_date": 1234567890,
  "hash": "telegram_hash_here"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Muvaffaqiyatli kirdingiz",
  "token": "jwt_token_here",
  "user": {
    "id": 1,
    "telegramId": 123456789,
    "username": "johndoe",
    "firstName": "John",
    "lastName": "Doe",
    "balance": 0,
    "isAdmin": false
  }
}
```

### GET /auth/me
Joriy foydalanuvchi ma'lumotlarini olish

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "user": {
    "id": 1,
    "telegramId": 123456789,
    "username": "johndoe",
    "firstName": "John",
    "lastName": "Doe",
    "balance": 50000,
    "isAdmin": false
  }
}
```

---

## 🌳 Tree Management Endpoints

### POST /tree/purchase
Daraxt sotib olish

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "paymentMethod": "payme",
  "paymentId": "PAYME_1234567890"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Daraxt muvaffaqiyatli sotib olindi",
  "tree": {
    "id": 1,
    "level": 1,
    "status": "active",
    "appleCount": 0,
    "daysCollected": 0,
    "weekStartDate": "2026-04-10T15:00:00.000Z",
    "lastCollectionTime": null
  },
  "transaction": {
    "id": 1,
    "amount": 50000,
    "status": "completed"
  }
}
```

### GET /tree/active
Faol daraxt ma'lumotlarini olish

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "tree": {
    "id": 1,
    "level": 1,
    "status": "active",
    "appleCount": 5,
    "daysCollected": 2,
    "weekStartDate": "2026-04-10T15:00:00.000Z",
    "lastCollectionTime": "2026-04-10T14:00:00.000Z",
    "nextCollectionTime": "2026-04-10T22:00:00.000Z",
    "canCollect": false,
    "canClaimReward": false
  }
}
```

### POST /tree/collect
Olma yig'ish

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "message": "Olma muvaffaqiyatli yig'ildi",
  "tree": {
    "id": 1,
    "appleCount": 6,
    "daysCollected": 2,
    "nextCollectionTime": "2026-04-10T23:00:00.000Z",
    "canClaimReward": false
  }
}
```

**Error Response:**
```json
{
  "success": false,
  "message": "Hali yig'ish vaqti kelmadi",
  "nextCollectionTime": "2026-04-10T22:00:00.000Z"
}
```

### POST /tree/claim-reward
Mukofot olish (7 kundan keyin)

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "message": "Mukofot muvaffaqiyatli olindi!",
  "reward": {
    "amount": 250000,
    "newBalance": 250000
  }
}
```

**Error Response:**
```json
{
  "success": false,
  "message": "7 kun davomida har kuni olma yig'ishingiz kerak"
}
```

### GET /tree/history
Foydalanuvchining barcha daraxtlari

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "trees": [
    {
      "id": 1,
      "level": 1,
      "status": "completed",
      "appleCount": 21,
      "daysCollected": 7,
      "purchaseDate": "2026-04-03T15:00:00.000Z",
      "weekStartDate": "2026-04-03T15:00:00.000Z"
    },
    {
      "id": 2,
      "level": 1,
      "status": "active",
      "appleCount": 5,
      "daysCollected": 2,
      "purchaseDate": "2026-04-10T15:00:00.000Z",
      "weekStartDate": "2026-04-10T15:00:00.000Z"
    }
  ]
}
```

---

## 👨‍💼 Admin Endpoints

**Diqqat:** Barcha admin endpointlar faqat admin foydalanuvchilar uchun.

### GET /admin/stats
Tizim statistikasi

**Headers:**
```
Authorization: Bearer <admin_token>
```

**Response:**
```json
{
  "success": true,
  "stats": {
    "totalRevenue": 500000,
    "totalRewardsPaid": 300000,
    "totalProfit": 200000,
    "activeTrees": 15,
    "totalUsers": 25,
    "profitMargin": "40.00"
  }
}
```

### GET /admin/users
Barcha foydalanuvchilar

**Headers:**
```
Authorization: Bearer <admin_token>
```

**Response:**
```json
{
  "success": true,
  "users": [
    {
      "id": 1,
      "telegramId": 123456789,
      "username": "johndoe",
      "firstName": "John",
      "lastName": "Doe",
      "balance": 250000,
      "isAdmin": false,
      "isBanned": false,
      "createdAt": "2026-04-10T15:00:00.000Z"
    }
  ]
}
```

### POST /admin/users/:userId/ban
Foydalanuvchini bloklash/blokdan chiqarish

**Headers:**
```
Authorization: Bearer <admin_token>
```

**Request Body:**
```json
{
  "banned": true
}
```

**Response:**
```json
{
  "success": true,
  "message": "Foydalanuvchi bloklandi"
}
```

### GET /admin/trees
Barcha daraxtlar

**Headers:**
```
Authorization: Bearer <admin_token>
```

**Response:**
```json
{
  "success": true,
  "trees": [
    {
      "id": 1,
      "userId": 1,
      "level": 1,
      "status": "active",
      "appleCount": 5,
      "daysCollected": 2,
      "purchaseDate": "2026-04-10T15:00:00.000Z",
      "weekStartDate": "2026-04-10T15:00:00.000Z",
      "lastCollectionTime": "2026-04-10T14:00:00.000Z"
    }
  ]
}
```

### GET /admin/rewards
Barcha mukofotlar

**Headers:**
```
Authorization: Bearer <admin_token>
```

**Response:**
```json
{
  "success": true,
  "rewards": [
    {
      "id": 1,
      "userId": 1,
      "treeId": 1,
      "rewardAmount": 250000,
      "claimedAt": "2026-04-10T15:00:00.000Z"
    }
  ]
}
```

### GET /admin/transactions
Barcha tranzaksiyalar

**Headers:**
```
Authorization: Bearer <admin_token>
```

**Response:**
```json
{
  "success": true,
  "transactions": [
    {
      "id": 1,
      "userId": 1,
      "type": "purchase",
      "amount": 50000,
      "status": "completed",
      "paymentMethod": "payme",
      "paymentId": "PAYME_1234567890",
      "description": "Oltin olma daraxti sotib olish",
      "createdAt": "2026-04-10T15:00:00.000Z"
    }
  ]
}
```

---

## ⚠️ Error Responses

### 401 Unauthorized
```json
{
  "success": false,
  "message": "Token topilmadi"
}
```

### 403 Forbidden
```json
{
  "success": false,
  "message": "Ruxsat yo'q. Faqat admin"
}
```

### 404 Not Found
```json
{
  "success": false,
  "message": "Foydalanuvchi topilmadi"
}
```

### 500 Internal Server Error
```json
{
  "success": false,
  "message": "Server xatosi"
}
```

---

## 🔌 WebSocket Events

### Connection
```javascript
const ws = new WebSocket('ws://localhost:5000');

ws.onopen = () => {
  console.log('Connected');
};

ws.onmessage = (event) => {
  const data = JSON.parse(event.data);
  console.log('Message:', data);
};
```

### Ping Event
Server har 30 sekundda ping yuboradi:
```json
{
  "type": "ping",
  "timestamp": 1712761513305
}
```

---

## 📝 Notes

- Barcha vaqtlar ISO 8601 formatida (UTC)
- Barcha summalar UZS da
- Token 30 kun amal qiladi
- Rate limiting: hozircha yo'q (production'da qo'shing)
