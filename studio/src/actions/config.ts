/**
 * Configuration for the image fetching service
 */

// Pexels configuration
export const IMAGE_API_CONFIG = {
  pexels: {
    apiKey: process.env.SANITY_STUDIO_PEXELS_API_KEY,
    baseUrl: 'https://api.pexels.com/v1',
    searchEndpoint: '/search',
    defaultParams: {
      per_page: 5,
      orientation: 'portrait'
    }
  },
  
  // Fallback 
  searchTerms: {
    fallbacks: ['green plant', 'houseplant', 'indoor plant', 'botanical', 'foliage'],
    qualityKeywords: ['plant', 'green', 'leaf', 'botanical', 'nature', 'garden'],
    excludeKeywords: ['person', 'people', 'face', 'animal', 'food']
  },
  
  imageFilter: {
    minWidth: 400,
    minHeight: 300,
    preferredAspectRatio: 'portrait'
  }
}

export const RATE_LIMIT_CONFIG = {
  maxRetries: 3,
  retryDelay: 1000, // ms
  cooldownPeriod: 60000 // ms
}