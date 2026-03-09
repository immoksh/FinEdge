const cache = new Map();

function cacheMiddleware(durationInSeconds) {
    return (req, res, next) => {
        if (req.method !== 'GET') {
            return next();
        }

        // Create a key based on user ID and query
        const key = `__express__${req.user ? req.user.userId : 'anonymous'}_${req.originalUrl || req.url}`;
        const cachedBody = cache.get(key);

        if (cachedBody) {
            if (Date.now() < cachedBody.expiry) {
                return res.json(cachedBody.data);
            } else {
                cache.delete(key);
            }
        }

        // Intercept res.json to populate cache
        const originalJson = res.json.bind(res);
        res.json = (body) => {
            // Only cache successful status codes
            if (res.statusCode >= 200 && res.statusCode < 300) {
                cache.set(key, {
                    data: body,
                    expiry: Date.now() + durationInSeconds * 1000
                });
            }
            return originalJson(body);
        };

        next();
    };
}

module.exports = cacheMiddleware;
