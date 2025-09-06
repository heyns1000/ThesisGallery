import { firebaseAdmin } from './firebase-admin';
import { storage } from './storage';
import cron from 'node-cron';

interface CartItem {
  productId: string;
  productName: string;
  quantity: number;
  price: number;
  imageUrl?: string;
}

interface AbandonedCart {
  cartId: string;
  userId: string;
  userToken?: string;
  userName?: string;
  userEmail?: string;
  items: CartItem[];
  totalValue: number;
  itemCount: number;
  createdAt: Date;
  lastModifiedAt: Date;
  abandonedAt?: Date;
  remindersSent: number;
  status: 'active' | 'abandoned' | 'recovered' | 'expired';
}

interface CartReminderConfig {
  firstReminderDelayMinutes: number;
  secondReminderDelayHours: number;
  finalReminderDelayDays: number;
  maxReminders: number;
  expirationDays: number;
}

export class AbandonedCartService {
  private static instance: AbandonedCartService;
  private abandonedCarts: Map<string, AbandonedCart> = new Map();
  private cartTimeouts: Map<string, NodeJS.Timeout> = new Map();
  
  private config: CartReminderConfig = {
    firstReminderDelayMinutes: 30,     // 30 minutes after cart creation
    secondReminderDelayHours: 4,       // 4 hours after first reminder
    finalReminderDelayDays: 1,         // 1 day after second reminder
    maxReminders: 3,
    expirationDays: 7                  // Cart expires after 7 days
  };

  private constructor() {
    this.startCartCleanupScheduler();
  }

  static getInstance(): AbandonedCartService {
    if (!AbandonedCartService.instance) {
      AbandonedCartService.instance = new AbandonedCartService();
    }
    return AbandonedCartService.instance;
  }

  // Track cart creation/modification
  trackCart(cartData: {
    cartId: string;
    userId: string;
    userToken?: string;
    userName?: string;
    userEmail?: string;
    items: CartItem[];
  }): void {
    const totalValue = cartData.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const itemCount = cartData.items.reduce((sum, item) => sum + item.quantity, 0);
    const now = new Date();

    // Check if cart already exists
    const existingCart = this.abandonedCarts.get(cartData.cartId);
    
    if (existingCart) {
      // Update existing cart
      existingCart.items = cartData.items;
      existingCart.totalValue = totalValue;
      existingCart.itemCount = itemCount;
      existingCart.lastModifiedAt = now;
      existingCart.status = 'active';
      
      // Clear any existing timeout and set new one
      this.clearCartTimeout(cartData.cartId);
      this.scheduleAbandonmentCheck(cartData.cartId);
      
      console.log(`Updated cart ${cartData.cartId} - ${itemCount} items, $${totalValue.toFixed(2)}`);
    } else {
      // Create new cart tracking
      const newCart: AbandonedCart = {
        cartId: cartData.cartId,
        userId: cartData.userId,
        userToken: cartData.userToken,
        userName: cartData.userName,
        userEmail: cartData.userEmail,
        items: cartData.items,
        totalValue,
        itemCount,
        createdAt: now,
        lastModifiedAt: now,
        remindersSent: 0,
        status: 'active'
      };

      this.abandonedCarts.set(cartData.cartId, newCart);
      this.scheduleAbandonmentCheck(cartData.cartId);
      
      console.log(`Tracking new cart ${cartData.cartId} - ${itemCount} items, $${totalValue.toFixed(2)}`);
    }
  }

  // Track cart completion (purchase)
  completeCart(cartId: string): void {
    const cart = this.abandonedCarts.get(cartId);
    if (cart) {
      cart.status = 'recovered';
      this.clearCartTimeout(cartId);
      
      // Send recovery analytics
      this.trackCartRecovery(cart);
      
      console.log(`Cart ${cartId} completed - $${cart.totalValue.toFixed(2)} recovered`);
      
      // Remove from tracking after a delay
      setTimeout(() => {
        this.abandonedCarts.delete(cartId);
      }, 60000); // Keep for 1 minute for analytics
    }
  }

  // Schedule abandonment check
  private scheduleAbandonmentCheck(cartId: string): void {
    const timeout = setTimeout(() => {
      this.markCartAsAbandoned(cartId);
    }, this.config.firstReminderDelayMinutes * 60 * 1000);

    this.cartTimeouts.set(cartId, timeout);
  }

  // Clear cart timeout
  private clearCartTimeout(cartId: string): void {
    const timeout = this.cartTimeouts.get(cartId);
    if (timeout) {
      clearTimeout(timeout);
      this.cartTimeouts.delete(cartId);
    }
  }

  // Mark cart as abandoned and send first reminder
  private async markCartAsAbandoned(cartId: string): Promise<void> {
    const cart = this.abandonedCarts.get(cartId);
    if (!cart || cart.status !== 'active') {
      return;
    }

    cart.status = 'abandoned';
    cart.abandonedAt = new Date();
    
    console.log(`Cart ${cartId} marked as abandoned - sending first reminder`);
    
    // Send first reminder immediately
    await this.sendAbandonedCartReminder(cart, 'first');
    
    // Schedule second reminder
    setTimeout(() => {
      this.sendSecondReminder(cartId);
    }, this.config.secondReminderDelayHours * 60 * 60 * 1000);
  }

  // Send second reminder
  private async sendSecondReminder(cartId: string): Promise<void> {
    const cart = this.abandonedCarts.get(cartId);
    if (!cart || cart.status !== 'abandoned' || cart.remindersSent >= 2) {
      return;
    }

    console.log(`Sending second reminder for cart ${cartId}`);
    await this.sendAbandonedCartReminder(cart, 'second');
    
    // Schedule final reminder
    setTimeout(() => {
      this.sendFinalReminder(cartId);
    }, this.config.finalReminderDelayDays * 24 * 60 * 60 * 1000);
  }

  // Send final reminder
  private async sendFinalReminder(cartId: string): Promise<void> {
    const cart = this.abandonedCarts.get(cartId);
    if (!cart || cart.status !== 'abandoned' || cart.remindersSent >= 3) {
      return;
    }

    console.log(`Sending final reminder for cart ${cartId}`);
    await this.sendAbandonedCartReminder(cart, 'final');
    
    // Schedule cart expiration
    setTimeout(() => {
      this.expireCart(cartId);
    }, (this.config.expirationDays - this.config.finalReminderDelayDays) * 24 * 60 * 60 * 1000);
  }

  // Send abandoned cart reminder notification
  private async sendAbandonedCartReminder(cart: AbandonedCart, reminderType: 'first' | 'second' | 'final'): Promise<void> {
    if (!cart.userToken) {
      console.warn(`No user token for cart ${cart.cartId} - cannot send push notification`);
      return;
    }

    const reminderMessages = {
      first: {
        title: '🛒 Items waiting in your cart!',
        body: `Don't miss out! You have ${cart.itemCount} items worth $${cart.totalValue.toFixed(2)} waiting. Complete your purchase to support our 140 seedlings! 🌱`,
        urgency: 'gentle'
      },
      second: {
        title: '⏰ Still thinking about your cart?',
        body: `Your ${cart.itemCount} items are still available! Checkout now and get free shipping. Every purchase helps our seedling family grow! 💚`,
        urgency: 'medium'
      },
      final: {
        title: '🔥 Last chance for your cart!',
        body: `Final reminder: Your cart expires soon! Don't lose your ${cart.itemCount} carefully selected items. Complete purchase now! ⚡`,
        urgency: 'high'
      }
    };

    const message = reminderMessages[reminderType];
    
    try {
      const success = await firebaseAdmin.sendAbandonedCartNotification(cart.userToken, {
        itemCount: cart.itemCount,
        totalValue: cart.totalValue,
        cartId: cart.cartId,
        customerName: cart.userName
      });

      if (success) {
        cart.remindersSent++;
        console.log(`Sent ${reminderType} reminder for cart ${cart.cartId}`);
        
        // Track analytics
        this.trackReminderSent(cart, reminderType);
      } else {
        console.error(`Failed to send ${reminderType} reminder for cart ${cart.cartId}`);
      }
    } catch (error) {
      console.error(`Error sending ${reminderType} reminder for cart ${cart.cartId}:`, error);
    }
  }

  // Expire cart
  private expireCart(cartId: string): void {
    const cart = this.abandonedCarts.get(cartId);
    if (cart && cart.status === 'abandoned') {
      cart.status = 'expired';
      console.log(`Cart ${cartId} expired - removing from tracking`);
      
      // Track analytics
      this.trackCartExpiration(cart);
      
      // Remove from tracking
      this.abandonedCarts.delete(cartId);
      this.clearCartTimeout(cartId);
    }
  }

  // Get abandoned cart statistics
  getAbandonedCartStats(): {
    total: number;
    active: number;
    abandoned: number;
    recovered: number;
    expired: number;
    totalValue: number;
    averageValue: number;
    topItems: { productName: string; abandonedCount: number }[];
  } {
    const carts = Array.from(this.abandonedCarts.values());
    const stats = {
      total: carts.length,
      active: carts.filter(c => c.status === 'active').length,
      abandoned: carts.filter(c => c.status === 'abandoned').length,
      recovered: carts.filter(c => c.status === 'recovered').length,
      expired: carts.filter(c => c.status === 'expired').length,
      totalValue: carts.reduce((sum, c) => sum + c.totalValue, 0),
      averageValue: 0,
      topItems: this.getTopAbandonedItems(carts)
    };

    stats.averageValue = stats.total > 0 ? stats.totalValue / stats.total : 0;
    return stats;
  }

  // Get top abandoned items
  private getTopAbandonedItems(carts: AbandonedCart[]): { productName: string; abandonedCount: number }[] {
    const itemCounts = new Map<string, number>();
    
    carts.filter(c => c.status === 'abandoned').forEach(cart => {
      cart.items.forEach(item => {
        const current = itemCounts.get(item.productName) || 0;
        itemCounts.set(item.productName, current + item.quantity);
      });
    });

    return Array.from(itemCounts.entries())
      .map(([productName, abandonedCount]) => ({ productName, abandonedCount }))
      .sort((a, b) => b.abandonedCount - a.abandonedCount)
      .slice(0, 10);
  }

  // Track cart recovery analytics
  private trackCartRecovery(cart: AbandonedCart): void {
    console.log(`Cart Recovery Analytics: ${cart.cartId} - $${cart.totalValue.toFixed(2)} - ${cart.remindersSent} reminders sent`);
    
    // This would be sent to your analytics service
    // analyticsService.trackConversion('cart_recovery', cart.totalValue);
  }

  // Track reminder sent analytics
  private trackReminderSent(cart: AbandonedCart, reminderType: string): void {
    console.log(`Reminder Analytics: ${reminderType} reminder sent for cart ${cart.cartId} - $${cart.totalValue.toFixed(2)}`);
    
    // This would be sent to your analytics service
    // analyticsService.trackNotificationInteraction('sent', 'abandoned_cart');
  }

  // Track cart expiration analytics
  private trackCartExpiration(cart: AbandonedCart): void {
    console.log(`Cart Expiration Analytics: ${cart.cartId} - $${cart.totalValue.toFixed(2)} lost - ${cart.remindersSent} reminders sent`);
    
    // This would be sent to your analytics service
    // analyticsService.trackCustomEvent({ name: 'cart_expired', parameters: { value: cart.totalValue, reminders: cart.remindersSent } });
  }

  // Start cleanup scheduler for expired carts
  private startCartCleanupScheduler(): void {
    // Clean up expired carts daily at 2 AM
    cron.schedule('0 2 * * *', () => {
      this.cleanupExpiredCarts();
    });
  }

  // Clean up expired carts
  private cleanupExpiredCarts(): void {
    const now = new Date();
    const expirationTime = this.config.expirationDays * 24 * 60 * 60 * 1000;
    let cleanedCount = 0;

    this.abandonedCarts.forEach((cart, cartId) => {
      const timeSinceCreation = now.getTime() - cart.createdAt.getTime();
      
      if (timeSinceCreation > expirationTime && cart.status === 'abandoned') {
        this.expireCart(cartId);
        cleanedCount++;
      }
    });

    if (cleanedCount > 0) {
      console.log(`Cleaned up ${cleanedCount} expired carts`);
    }
  }

  // Get all abandoned carts (for admin dashboard)
  getAllAbandonedCarts(): AbandonedCart[] {
    return Array.from(this.abandonedCarts.values())
      .filter(cart => cart.status === 'abandoned')
      .sort((a, b) => b.totalValue - a.totalValue);
  }

  // Force send reminder (for admin use)
  async forceSendReminder(cartId: string): Promise<boolean> {
    const cart = this.abandonedCarts.get(cartId);
    if (!cart || cart.status !== 'abandoned') {
      return false;
    }

    await this.sendAbandonedCartReminder(cart, 'second');
    return true;
  }

  // Update notification settings
  updateConfig(newConfig: Partial<CartReminderConfig>): void {
    this.config = { ...this.config, ...newConfig };
    console.log('Abandoned cart service config updated:', this.config);
  }
}

export const abandonedCartService = AbandonedCartService.getInstance();