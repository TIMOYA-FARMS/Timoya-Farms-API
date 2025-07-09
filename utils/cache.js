// Simple in-memory cache with TTL (Time To Live)
class SimpleCache {
    constructor() {
        this.cache = new Map();
        this.TTL = 5 * 60 * 1000; // 5 minutes default
    }

    set(key, value, ttl = this.TTL) {
        this.cache.set(key, {
            value,
            timestamp: Date.now(),
            ttl
        });
    }

    get(key) {
        const item = this.cache.get(key);
        if (!item) return null;

        const isExpired = Date.now() - item.timestamp > item.ttl;
        if (isExpired) {
            this.cache.delete(key);
            return null;
        }

        return item.value;
    }

    delete(key) {
        return this.cache.delete(key);
    }

    clear() {
        this.cache.clear();
    }

    has(key) {
        return this.cache.has(key) && this.get(key) !== null;
    }
}

// Create cache instances for different data types
export const productCache = new SimpleCache();
export const galleryCache = new SimpleCache();
export const userCache = new SimpleCache();

// Cache keys
export const CACHE_KEYS = {
    PRODUCTS: 'products',
    PRODUCTS_CATEGORY: 'products_category_',
    GALLERY: 'gallery',
    USER_CART: 'user_cart_',
    GUEST_CART: 'guest_cart_'
};

// Helper functions
export const cacheProducts = async (products, category = null) => {
    const key = category ? `${CACHE_KEYS.PRODUCTS_CATEGORY}${category}` : CACHE_KEYS.PRODUCTS;
    productCache.set(key, products, 10 * 60 * 1000); // 10 minutes for products
};

export const getCachedProducts = (category = null) => {
    const key = category ? `${CACHE_KEYS.PRODUCTS_CATEGORY}${category}` : CACHE_KEYS.PRODUCTS;
    return productCache.get(key);
};

export const cacheGallery = async (images) => {
    galleryCache.set(CACHE_KEYS.GALLERY, images, 30 * 60 * 1000); // 30 minutes for gallery
};

export const getCachedGallery = () => {
    return galleryCache.get(CACHE_KEYS.GALLERY);
};

export const invalidateProductCache = () => {
    productCache.clear();
};

export const invalidateGalleryCache = () => {
    galleryCache.clear();
}; 