import localforage from 'localforage';
import { Product } from '../../models/product';

// Configure localForage with IndexedDB
localforage.config({
  name: 'KalaSetuApp',
  storeName: 'artisan_offline_cache',
  description: 'Offline database cache for marginalized artisans',
});

export interface QueuedUploadItem {
  id: string;
  artisanId: string;
  product: Product;
  queuedAt: string;
  status: 'pending' | 'syncing' | 'synced';
}

const QUEUE_KEY = 'kalasetu_offline_upload_queue';

class OfflineSyncService {
  private isOnlineStatus: boolean = typeof navigator !== 'undefined' ? navigator.onLine : true;
  private listeners: Array<(isOnline: boolean) => void> = [];

  constructor() {
    if (typeof window !== 'undefined') {
      window.addEventListener('online', () => {
        this.isOnlineStatus = true;
        this.notifyListeners(true);
      });

      window.addEventListener('offline', () => {
        this.isOnlineStatus = false;
        this.notifyListeners(false);
      });
    }
  }

  public isOnline(): boolean {
    return typeof navigator !== 'undefined' ? navigator.onLine : true;
  }

  public subscribeOnlineStatus(listener: (isOnline: boolean) => void): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  private notifyListeners(isOnline: boolean) {
    this.listeners.forEach((l) => l(isOnline));
  }

  // Queue product upload in IndexedDB
  public async queueProduct(product: Product): Promise<void> {
    try {
      const existingQueue = (await localforage.getItem<QueuedUploadItem[]>(QUEUE_KEY)) || [];
      const newItem: QueuedUploadItem = {
        id: 'queued-' + Date.now(),
        artisanId: product.artisanId,
        product,
        queuedAt: new Date().toISOString(),
        status: 'pending',
      };
      await localforage.setItem(QUEUE_KEY, [newItem, ...existingQueue]);
    } catch (err) {
      console.warn('[OfflineSync] Failed to queue product in localForage:', err);
    }
  }

  // Get all queued items for current artisan
  public async getQueuedProducts(artisanId?: string): Promise<QueuedUploadItem[]> {
    try {
      const queue = (await localforage.getItem<QueuedUploadItem[]>(QUEUE_KEY)) || [];
      if (!artisanId) return queue;
      return queue.filter((item) => item.artisanId === artisanId);
    } catch {
      return [];
    }
  }

  // Remove item from queue once synced
  public async removeQueuedItem(id: string): Promise<void> {
    try {
      const queue = (await localforage.getItem<QueuedUploadItem[]>(QUEUE_KEY)) || [];
      const updated = queue.filter((item) => item.id !== id);
      await localforage.setItem(QUEUE_KEY, updated);
    } catch (err) {
      console.warn('[OfflineSync] Failed to remove item from queue:', err);
    }
  }

  // Auto-sync pending items to main app when online
  public async syncPendingQueue(
    onPublish: (product: Product) => void,
    artisanId?: string
  ): Promise<number> {
    if (!this.isOnline()) return 0;

    try {
      const queue = await this.getQueuedProducts(artisanId);
      if (queue.length === 0) return 0;

      let syncedCount = 0;
      for (const item of queue) {
        onPublish(item.product);
        await this.removeQueuedItem(item.id);
        syncedCount++;
      }
      return syncedCount;
    } catch (err) {
      console.warn('[OfflineSync] Sync failed:', err);
      return 0;
    }
  }
}

export const offlineSyncService = new OfflineSyncService();
