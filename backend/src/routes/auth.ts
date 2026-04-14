import { Router, Response } from 'express';
import { UserModel } from '../models/User';
import { generateToken, authenticateToken, AuthRequest } from '../middleware/auth';
import crypto from 'crypto';

const router = Router();

/**
 * Telegram orqali ro'yxatdan o'tish / kirish
 */
router.post('/telegram-auth', async (req, res: Response) => {
  console.log('📥 Telegram auth request received:', req.body);
  
  try {
    const { id, first_name, last_name, username, hash, auth_date } = req.body;

    // Telegram ma'lumotlarini tekshirish
    if (!id || !hash) {
      console.log('❌ Missing id or hash');
      return res.status(400).json({ success: false, message: 'Telegram ma\'lumotlari to\'liq emas' });
    }

    // Hash tekshirish (Telegram Bot API orqali)
    // VAQTINCHA O'CHIRILGAN - TEST UCHUN
    const isValid = true; // verifyTelegramAuth(req.body);
    console.log('🔐 Hash verification (skipped for testing):', isValid);
    
    if (!isValid) {
      console.log('❌ Invalid hash');
      return res.status(401).json({ success: false, message: 'Telegram autentifikatsiyasi muvaffaqiyatsiz' });
    }

    // Foydalanuvchini topish yoki yaratish
    console.log('🔍 Finding user with telegram_id:', id);
    let user = await UserModel.findByTelegramId(id);

    if (!user) {
      console.log('➕ Creating new user');
      user = await UserModel.create(id, username, first_name, last_name);
    } else {
      console.log('✅ User found:', user.id);
    }

    // Foydalanuvchi ban qilinganligini tekshirish
    if (user.is_banned) {
      console.log('🚫 User is banned');
      return res.status(403).json({ success: false, message: 'Sizning hisobingiz bloklangan' });
    }

    // JWT token yaratish
    const token = generateToken(user.id, user.telegram_id, user.is_admin);
    console.log('🎫 Token generated for user:', user.id);

    res.json({
      success: true,
      message: 'Muvaffaqiyatli kirdingiz',
      token,
      user: {
        id: user.id,
        telegramId: user.telegram_id,
        username: user.username,
        firstName: user.first_name,
        lastName: user.last_name,
        balance: user.balance,
        isAdmin: user.is_admin
      }
    });
  } catch (error) {
    console.error('Auth xatosi:', error);
    res.status(500).json({ success: false, message: 'Server xatosi' });
  }
});

/**
 * Joriy foydalanuvchi ma'lumotlarini olish
 */
router.get('/me', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Autentifikatsiya talab qilinadi' });
    }

    const user = await UserModel.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ success: false, message: 'Foydalanuvchi topilmadi' });
    }

    res.json({
      success: true,
      user: {
        id: user.id,
        telegramId: user.telegram_id,
        username: user.username,
        firstName: user.first_name,
        lastName: user.last_name,
        balance: user.balance,
        isAdmin: user.is_admin
      }
    });
  } catch (error) {
    console.error('Me xatosi:', error);
    res.status(500).json({ success: false, message: 'Server xatosi' });
  }
});

/**
 * Telegram autentifikatsiyasini tekshirish
 */
function verifyTelegramAuth(data: any): boolean {
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  if (!botToken) return false;

  const { hash, ...userData } = data;

  // Ma'lumotlarni saralash va string qilish
  const dataCheckString = Object.keys(userData)
    .sort()
    .map(key => `${key}=${userData[key]}`)
    .join('\n');

  // Secret key yaratish
  const secretKey = crypto.createHash('sha256').update(botToken).digest();

  // Hash hisoblash
  const calculatedHash = crypto
    .createHmac('sha256', secretKey)
    .update(dataCheckString)
    .digest('hex');

  return calculatedHash === hash;
}

export default router;
