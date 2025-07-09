// HTTP caching middleware
export const cacheControl = (maxAge = '5m') => {
    return (req, res, next) => {
        res.set('Cache-Control', `public, max-age=${maxAge}`);
        next();
    };
};

// Cache control for different content types
export const staticCache = cacheControl('1d'); // 1 day for static content
export const apiCache = cacheControl('5m'); // 5 minutes for API responses
export const shortCache = cacheControl('1m'); // 1 minute for frequently changing data

// ETag middleware for conditional requests
export const etagCache = (req, res, next) => {
    res.set('ETag', `"${Date.now()}"`);
    next();
};

// No cache middleware for sensitive data
export const noCache = (req, res, next) => {
    res.set('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.set('Pragma', 'no-cache');
    res.set('Expires', '0');
    next();
}; 