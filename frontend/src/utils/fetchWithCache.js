const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes cache duration
const cache = new Map();

export const fetchWithCache = async (key, fetchFn, options = {}) => {
    const {
        duration = CACHE_DURATION,
        forceRefresh = false
    } = options;

    // Check if cached data exists and is still valid
    const cached = cache.get(key);
    if (!forceRefresh && cached && (Date.now() - cached.timestamp < duration)) {
        console.log('Cache hit:', key);
        return cached.data;
    }

    try {
        // Fetch fresh data
        const data = await fetchFn();

        // Store in cache
        cache.set(key, {
            data,
            timestamp: Date.now()
        });

        return data;
    } catch (error) {
        console.error('Cache fetch error:', error);
        throw error;
    }
};

// Helper to clear specific cache entry
export const clearCache = (key) => {
    if (key) {
        cache.delete(key);
    } else {
        cache.clear();
    }
};