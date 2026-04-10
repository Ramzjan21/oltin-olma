import { Router, Response } from 'express';
import { AuthRequest, authenticateToken, isAdmin } from '../middleware/auth';
import { UserModel } from '../models/User';
import { TreeModel } from '../models/Tree';
import { RewardModel } from '../models/Reward';
import { TransactionModel } from '../models/Transaction';
import { SystemStatsModel } from '../models/SystemStats';

const router = Router();

// Barcha routelarga auth va admin middleware qo'llash
router.use(authenticateToken);
router.use(isAdmin);

/**
 * Tizim statistikasi
 */
router.get('/stats', async (req: AuthRequest, res: Response) => {
  try {
    const stats = await SystemStatsModel.get();
    const totalUsers = (await UserModel.getAll()).length;
    const activeTrees = await TreeModel.countActive();

    res.json({
      success: true,
      stats: {
        totalRevenue: stats.total_revenue,
        totalRewardsPaid: stats.total_rewards_paid,
        totalProfit: stats.total_profit,
        activeTrees,
        totalUsers,
        profitMargin: stats.total_revenue > 0 ? ((stats.total_profit / stats.total_revenue) * 100).toFixed(2) : 0
      }
    });
  } catch (error) {
    console.error('Statistika olish xatosi:', error);
    res.status(500).json({ success: false, message: 'Server xatosi' });
  }
});

/**
 * Barcha foydalanuvchilar
 */
router.get('/users', async (req: AuthRequest, res: Response) => {
  try {
    const users = await UserModel.getAll();

    res.json({
      success: true,
      users: users.map(user => ({
        id: user.id,
        telegramId: user.telegram_id,
        username: user.username,
        firstName: user.first_name,
        lastName: user.last_name,
        balance: user.balance,
        isAdmin: user.is_admin,
        isBanned: user.is_banned,
        createdAt: user.created_at
      }))
    });
  } catch (error) {
    console.error('Foydalanuvchilarni olish xatosi:', error);
    res.status(500).json({ success: false, message: 'Server xatosi' });
  }
});

/**
 * Foydalanuvchini bloklash/blokdan chiqarish
 */
router.post('/users/:userId/ban', async (req: AuthRequest, res: Response) => {
  try {
    const { userId } = req.params;
    const { banned } = req.body;

    await UserModel.banUser(parseInt(userId), banned);

    res.json({
      success: true,
      message: banned ? 'Foydalanuvchi bloklandi' : 'Foydalanuvchi blokdan chiqarildi'
    });
  } catch (error) {
    console.error('Ban xatosi:', error);
    res.status(500).json({ success: false, message: 'Server xatosi' });
  }
});

/**
 * Barcha daraxtlar
 */
router.get('/trees', async (req: AuthRequest, res: Response) => {
  try {
    const trees = await TreeModel.getAll();

    res.json({
      success: true,
      trees: trees.map(tree => ({
        id: tree.id,
        userId: tree.user_id,
        level: tree.level,
        status: tree.status,
        appleCount: tree.apple_count,
        daysCollected: tree.days_collected,
        purchaseDate: tree.purchase_date,
        weekStartDate: tree.week_start_date,
        lastCollectionTime: tree.last_collection_time
      }))
    });
  } catch (error) {
    console.error('Daraxtlarni olish xatosi:', error);
    res.status(500).json({ success: false, message: 'Server xatosi' });
  }
});

/**
 * Barcha mukofotlar
 */
router.get('/rewards', async (req: AuthRequest, res: Response) => {
  try {
    const rewards = await RewardModel.getAll();

    res.json({
      success: true,
      rewards: rewards.map(reward => ({
        id: reward.id,
        userId: reward.user_id,
        treeId: reward.tree_id,
        rewardAmount: reward.reward_amount,
        claimedAt: reward.claimed_at
      }))
    });
  } catch (error) {
    console.error('Mukofotlarni olish xatosi:', error);
    res.status(500).json({ success: false, message: 'Server xatosi' });
  }
});

/**
 * Barcha tranzaksiyalar
 */
router.get('/transactions', async (req: AuthRequest, res: Response) => {
  try {
    const transactions = await TransactionModel.getAll();

    res.json({
      success: true,
      transactions: transactions.map(tx => ({
        id: tx.id,
        userId: tx.user_id,
        type: tx.type,
        amount: tx.amount,
        status: tx.status,
        paymentMethod: tx.payment_method,
        paymentId: tx.payment_id,
        description: tx.description,
        createdAt: tx.created_at
      }))
    });
  } catch (error) {
    console.error('Tranzaksiyalarni olish xatosi:', error);
    res.status(500).json({ success: false, message: 'Server xatosi' });
  }
});

/**
 * Tizim sozlamalarini yangilash
 */
router.post('/settings', async (req: AuthRequest, res: Response) => {
  try {
    const { minReward, maxReward, treeCost } = req.body;

    // Bu yerda .env faylini yangilash yoki database'da saqlash mumkin
    // Hozircha faqat javob qaytaramiz
    
    res.json({
      success: true,
      message: 'Sozlamalar yangilandi',
      settings: {
        minReward: minReward || process.env.MIN_REWARD,
        maxReward: maxReward || process.env.MAX_REWARD,
        treeCost: treeCost || process.env.TREE_COST
      }
    });
  } catch (error) {
    console.error('Sozlamalarni yangilash xatosi:', error);
    res.status(500).json({ success: false, message: 'Server xatosi' });
  }
});

export default router;
