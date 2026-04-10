import { Router, Response } from 'express';
import { AuthRequest, authenticateToken } from '../middleware/auth';
import { TreeModel } from '../models/Tree';
import { CollectionModel } from '../models/Collection';
import { RewardModel } from '../models/Reward';
import { TransactionModel } from '../models/Transaction';
import { UserModel } from '../models/User';
import { SystemStatsModel } from '../models/SystemStats';
import { RewardAlgorithm } from '../services/rewardAlgorithm';

const router = Router();

// Barcha routelarga auth middleware qo'llash
router.use(authenticateToken);

/**
 * Daraxt sotib olish
 */
router.post('/purchase', async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const { paymentMethod, paymentId } = req.body;

    // Foydalanuvchini tekshirish
    const user = await UserModel.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'Foydalanuvchi topilmadi' });
    }

    if (user.is_banned) {
      return res.status(403).json({ success: false, message: 'Sizning hisobingiz bloklangan' });
    }

    // Faol daraxt borligini tekshirish
    const existingTree = await TreeModel.findActiveByUserId(userId);
    if (existingTree) {
      return res.status(400).json({ success: false, message: 'Sizda allaqachon faol daraxt bor' });
    }

    const treeCost = parseInt(process.env.TREE_COST || '50000');

    // Transaction yaratish
    const transaction = await TransactionModel.create(
      userId,
      'purchase',
      treeCost,
      'completed',
      paymentMethod || 'mock',
      paymentId || `MOCK_${Date.now()}`,
      'Oltin olma daraxti sotib olish'
    );

    // Daraxt yaratish
    const tree = await TreeModel.create(userId, 1);

    // Tizim statistikasini yangilash
    await SystemStatsModel.incrementRevenue(treeCost);

    res.json({
      success: true,
      message: 'Daraxt muvaffaqiyatli sotib olindi',
      tree: {
        id: tree.id,
        level: tree.level,
        status: tree.status,
        appleCount: tree.apple_count,
        daysCollected: tree.days_collected,
        weekStartDate: tree.week_start_date,
        lastCollectionTime: tree.last_collection_time
      },
      transaction: {
        id: transaction.id,
        amount: transaction.amount,
        status: transaction.status
      }
    });
  } catch (error) {
    console.error('Daraxt sotib olish xatosi:', error);
    res.status(500).json({ success: false, message: 'Server xatosi' });
  }
});

/**
 * Faol daraxt ma'lumotlarini olish
 */
router.get('/active', async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;

    const tree = await TreeModel.findActiveByUserId(userId);

    if (!tree) {
      return res.json({
        success: true,
        tree: null,
        message: 'Faol daraxt yo\'q'
      });
    }

    // Daraxt o'lganligini tekshirish
    if (tree.last_collection_time && tree.status === 'active') {
      const isDead = RewardAlgorithm.isTreeDead(tree.last_collection_time, tree.days_collected);
      if (isDead) {
        await TreeModel.updateStatus(tree.id, 'dead');
        return res.json({
          success: true,
          tree: {
            ...tree,
            status: 'dead'
          },
          message: 'Daraxt o\'ldi. Siz 1 kun o\'tkazib yubordingiz.'
        });
      }
    }

    // Keyingi yig'ish vaqti
    const nextCollectionTime = RewardAlgorithm.getNextCollectionTime(tree.last_collection_time);
    const canCollect = RewardAlgorithm.canCollectNow(tree.last_collection_time);
    const canClaimReward = RewardAlgorithm.canClaimReward(tree.days_collected, tree.week_start_date);

    res.json({
      success: true,
      tree: {
        id: tree.id,
        level: tree.level,
        status: tree.status,
        appleCount: tree.apple_count,
        daysCollected: tree.days_collected,
        weekStartDate: tree.week_start_date,
        lastCollectionTime: tree.last_collection_time,
        nextCollectionTime,
        canCollect,
        canClaimReward
      }
    });
  } catch (error) {
    console.error('Daraxt ma\'lumotlarini olish xatosi:', error);
    res.status(500).json({ success: false, message: 'Server xatosi' });
  }
});

/**
 * Olma yig'ish
 */
router.post('/collect', async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;

    const tree = await TreeModel.findActiveByUserId(userId);

    if (!tree) {
      return res.status(404).json({ success: false, message: 'Faol daraxt topilmadi' });
    }

    if (tree.status !== 'active') {
      return res.status(400).json({ success: false, message: 'Daraxt faol emas' });
    }

    // Yig'ish mumkinligini tekshirish
    const canCollect = RewardAlgorithm.canCollectNow(tree.last_collection_time);
    if (!canCollect) {
      const nextTime = RewardAlgorithm.getNextCollectionTime(tree.last_collection_time);
      return res.status(400).json({
        success: false,
        message: 'Hali yig\'ish vaqti kelmadi',
        nextCollectionTime: nextTime
      });
    }

    // Bugungi yig'ishlar sonini tekshirish (maksimal 3 marta)
    const todayCollections = await CollectionModel.getTodayCollections(tree.id);
    if (todayCollections >= 3) {
      return res.status(400).json({
        success: false,
        message: 'Bugun maksimal 3 marta yig\'ish mumkin'
      });
    }

    // Yangi kun boshlanganligini tekshirish
    const lastCollectionDate = tree.last_collection_time ? new Date(tree.last_collection_time).toDateString() : null;
    const today = new Date().toDateString();
    const isNewDay = lastCollectionDate !== today;

    let newDaysCollected = tree.days_collected;
    if (isNewDay && todayCollections === 0) {
      newDaysCollected += 1;
    }

    // Olma yig'ish
    const newAppleCount = tree.apple_count + 1;
    await TreeModel.updateAppleCount(tree.id, newAppleCount);
    await TreeModel.updateLastCollection(tree.id, newDaysCollected);

    // Collection yozuvi yaratish
    await CollectionModel.create(tree.id, userId, newDaysCollected, 1);

    const nextCollectionTime = RewardAlgorithm.getNextCollectionTime(new Date());
    const canClaimReward = RewardAlgorithm.canClaimReward(newDaysCollected, tree.week_start_date);

    res.json({
      success: true,
      message: 'Olma muvaffaqiyatli yig\'ildi',
      tree: {
        id: tree.id,
        appleCount: newAppleCount,
        daysCollected: newDaysCollected,
        nextCollectionTime,
        canClaimReward
      }
    });
  } catch (error) {
    console.error('Olma yig\'ish xatosi:', error);
    res.status(500).json({ success: false, message: 'Server xatosi' });
  }
});

/**
 * Mukofot olish (7 kundan keyin)
 */
router.post('/claim-reward', async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;

    const tree = await TreeModel.findActiveByUserId(userId);

    if (!tree) {
      return res.status(404).json({ success: false, message: 'Faol daraxt topilmadi' });
    }

    if (tree.status !== 'active') {
      return res.status(400).json({ success: false, message: 'Daraxt faol emas' });
    }

    // Mukofot olish mumkinligini tekshirish
    const canClaim = RewardAlgorithm.canClaimReward(tree.days_collected, tree.week_start_date);
    if (!canClaim) {
      return res.status(400).json({
        success: false,
        message: '7 kun davomida har kuni olma yig\'ishingiz kerak'
      });
    }

    // Mukofot miqdorini hisoblash
    const rewardAmount = await RewardAlgorithm.calculateReward();

    // Mukofot berish
    await RewardModel.create(tree.id, userId, rewardAmount);
    await UserModel.updateBalance(userId, rewardAmount);

    // Daraxtni completed holatiga o'tkazish
    await TreeModel.updateStatus(tree.id, 'completed');

    // Transaction yaratish
    await TransactionModel.create(
      userId,
      'reward',
      rewardAmount,
      'completed',
      undefined,
      undefined,
      '7 kunlik mukofot'
    );

    // Tizim statistikasini yangilash
    await SystemStatsModel.incrementRewardsPaid(rewardAmount);

    // Yangilangan balansni olish
    const user = await UserModel.findById(userId);

    res.json({
      success: true,
      message: 'Mukofot muvaffaqiyatli olindi!',
      reward: {
        amount: rewardAmount,
        newBalance: user?.balance || 0
      }
    });
  } catch (error) {
    console.error('Mukofot olish xatosi:', error);
    res.status(500).json({ success: false, message: 'Server xatosi' });
  }
});

/**
 * Foydalanuvchining barcha daraxtlari
 */
router.get('/history', async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;

    const trees = await TreeModel.getAllByUserId(userId);

    res.json({
      success: true,
      trees: trees.map(tree => ({
        id: tree.id,
        level: tree.level,
        status: tree.status,
        appleCount: tree.apple_count,
        daysCollected: tree.days_collected,
        purchaseDate: tree.purchase_date,
        weekStartDate: tree.week_start_date
      }))
    });
  } catch (error) {
    console.error('Tarix olish xatosi:', error);
    res.status(500).json({ success: false, message: 'Server xatosi' });
  }
});

export default router;
