import { SystemStatsModel } from '../models/SystemStats';

/**
 * PROFIT-SAFE REWARD ALGORITHM
 * 
 * Bu algoritm tizim uchun zarar keltirmaydigan mukofot miqdorini hisoblaydi.
 * 
 * Asosiy printsiplar:
 * 1. Tizim balansi va foydasini hisobga oladi
 * 2. Foyda foiziga qarab mukofot taqsimlaydi
 * 3. Weighted random distribution ishlatadi (sof random emas)
 * 4. Minimal va maksimal mukofot chegaralarini saqlaydi
 */

export class RewardAlgorithm {
  private static readonly MIN_REWARD = parseInt(process.env.MIN_REWARD || '50000');
  private static readonly MAX_REWARD = parseInt(process.env.MAX_REWARD || '500000');
  private static readonly TREE_COST = parseInt(process.env.TREE_COST || '50000');

  /**
   * Asosiy mukofot hisoblash funksiyasi
   */
  static async calculateReward(): Promise<number> {
    const stats = await SystemStatsModel.get();
    
    const totalRevenue = stats.total_revenue;
    const totalRewardsPaid = stats.total_rewards_paid;
    const currentProfit = stats.total_profit;
    const activeTrees = stats.active_trees;

    // Foyda foizini hisoblash
    const profitMargin = totalRevenue > 0 ? (currentProfit / totalRevenue) * 100 : 0;

    // Weighted distribution: foyda yuqori bo'lsa, yuqori mukofot ehtimoli ko'proq
    let rewardTier: 'low' | 'medium' | 'high';
    
    if (profitMargin > 50) {
      // Juda yaxshi foyda - yuqori mukofot berish mumkin
      rewardTier = this.getWeightedTier([10, 30, 60]); // 60% high, 30% medium, 10% low
    } else if (profitMargin > 30) {
      // Yaxshi foyda - o'rtacha mukofot
      rewardTier = this.getWeightedTier([20, 50, 30]); // 30% high, 50% medium, 20% low
    } else if (profitMargin > 10) {
      // Past foyda - past mukofot
      rewardTier = this.getWeightedTier([50, 40, 10]); // 10% high, 40% medium, 50% low
    } else {
      // Juda past foyda - faqat minimal mukofot
      rewardTier = this.getWeightedTier([80, 15, 5]); // 5% high, 15% medium, 80% low
    }

    // Tier asosida mukofot miqdorini aniqlash
    let reward: number;
    
    switch (rewardTier) {
      case 'high':
        // 70% - 100% oralig'ida (350,000 - 500,000)
        reward = this.MIN_REWARD + (this.MAX_REWARD - this.MIN_REWARD) * (0.7 + Math.random() * 0.3);
        break;
      case 'medium':
        // 40% - 70% oralig'ida (230,000 - 350,000)
        reward = this.MIN_REWARD + (this.MAX_REWARD - this.MIN_REWARD) * (0.4 + Math.random() * 0.3);
        break;
      case 'low':
      default:
        // 0% - 40% oralig'ida (50,000 - 230,000)
        reward = this.MIN_REWARD + (this.MAX_REWARD - this.MIN_REWARD) * (Math.random() * 0.4);
        break;
    }

    // Mukofot tizim foydasidan oshmasligi kerak
    const maxSafeReward = currentProfit > 0 ? Math.min(reward, currentProfit * 0.8) : this.MIN_REWARD;
    
    // Minimal mukofotdan kam bo'lmasligi kerak
    const finalReward = Math.max(this.MIN_REWARD, Math.min(reward, maxSafeReward));

    // Yaxlitlash (100 ga)
    return Math.round(finalReward / 100) * 100;
  }

  /**
   * Weighted random tier selection
   * weights: [low, medium, high] foizlarda
   */
  private static getWeightedTier(weights: [number, number, number]): 'low' | 'medium' | 'high' {
    const random = Math.random() * 100;
    
    if (random < weights[0]) {
      return 'low';
    } else if (random < weights[0] + weights[1]) {
      return 'medium';
    } else {
      return 'high';
    }
  }

  /**
   * Mukofot olish imkoniyatini tekshirish
   */
  static canClaimReward(daysCollected: number, weekStartDate: Date): boolean {
    const requiredDays = parseInt(process.env.WEEKLY_DAYS || '7');
    const daysPassed = Math.floor((Date.now() - new Date(weekStartDate).getTime()) / (1000 * 60 * 60 * 24));
    
    return daysCollected >= requiredDays && daysPassed >= requiredDays;
  }

  /**
   * Keyingi yig'ish vaqtini hisoblash
   */
  static getNextCollectionTime(lastCollectionTime?: Date): Date | null {
    if (!lastCollectionTime) {
      return null; // Birinchi marta yig'ish mumkin
    }

    const collectionInterval = parseInt(process.env.COLLECTION_INTERVAL_HOURS || '8');
    const nextTime = new Date(lastCollectionTime);
    nextTime.setHours(nextTime.getHours() + collectionInterval);

    return nextTime;
  }

  /**
   * Yig'ish mumkinligini tekshirish
   */
  static canCollectNow(lastCollectionTime?: Date): boolean {
    if (!lastCollectionTime) {
      return true; // Birinchi marta
    }

    const nextTime = this.getNextCollectionTime(lastCollectionTime);
    if (!nextTime) return true;

    return Date.now() >= nextTime.getTime();
  }

  /**
   * Daraxt o'lganligini tekshirish (1 kun o'tkazib yuborilgan)
   */
  static isTreeDead(lastCollectionTime: Date, daysCollected: number): boolean {
    if (daysCollected === 0) {
      // Birinchi kun - 24 soat ichida yig'ish kerak
      const hoursSinceStart = (Date.now() - new Date(lastCollectionTime).getTime()) / (1000 * 60 * 60);
      return hoursSinceStart > 24;
    }

    // Oxirgi yig'ishdan keyin 24 soat o'tgan bo'lsa
    const hoursSinceLastCollection = (Date.now() - new Date(lastCollectionTime).getTime()) / (1000 * 60 * 60);
    return hoursSinceLastCollection > 24;
  }
}
