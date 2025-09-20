// Content centralization for all app pages
// This provides a structured way to manage page-specific data and content

export const appContentData = {
  dashboard: {
    title: "Fruitful Global Dashboard",
    description: "Central command center for all Fruitful Global operations",
    features: ["Real-time metrics", "System overview", "Quick actions"],
    status: "active",
    lastUpdated: new Date().toISOString()
  },
  
  documents: {
    title: "Documents & Articles",
    description: "Comprehensive document management and article repository",
    features: ["Document search", "Version control", "Collaboration tools"],
    status: "active",
    lastUpdated: new Date().toISOString()
  },
  
  gallery: {
    title: "Visual Gallery",
    description: "Multimedia content management and visual asset library",
    features: ["Image management", "Video library", "Asset organization"],
    status: "active",
    lastUpdated: new Date().toISOString()
  },
  
  conversations: {
    title: "AI Conversations",
    description: "Intelligent conversation management and AI interaction hub",
    features: ["Chat history", "AI responses", "Context management"],
    status: "active",
    lastUpdated: new Date().toISOString()
  },
  
  compliance: {
    title: "Compliance Monitor",
    description: "Regulatory compliance tracking and monitoring system",
    features: ["Audit trails", "Compliance reports", "Risk assessment"],
    status: "active",
    lastUpdated: new Date().toISOString()
  },
  
  brands: {
    title: "Brand Management",
    description: "Comprehensive brand asset and identity management",
    features: ["Brand guidelines", "Asset library", "Usage tracking"],
    status: "active",
    lastUpdated: new Date().toISOString()
  },
  
  automation: {
    title: "Automation Engine",
    description: "Workflow automation and process optimization platform",
    features: ["Workflow builder", "Task automation", "Process monitoring"],
    status: "active",
    lastUpdated: new Date().toISOString()
  },
  
  'global-view': {
    title: "Global View GPT",
    description: "Comprehensive global perspective and intelligence platform",
    features: ["Global insights", "Market analysis", "Trend monitoring"],
    status: "active",
    lastUpdated: new Date().toISOString()
  },
  
  'fruitful-america': {
    title: "Fruitful America™",
    description: "North American operations and market engagement platform",
    features: ["Market data", "Regional insights", "Opportunity tracking"],
    status: "active",
    lastUpdated: new Date().toISOString()
  },
  
  'wildlife-dashboard': {
    title: "Wildlife Grid",
    description: "Environmental and wildlife management dashboard",
    features: ["Species tracking", "Habitat monitoring", "Conservation metrics"],
    status: "active",
    lastUpdated: new Date().toISOString()
  }
};

/**
 * Get content for a specific page with safe fallback
 * @param {string} pageKey - The key identifying the page
 * @returns {object} Page content object with fallback data
 */
export function getContent(pageKey) {
  // Validate input
  if (!pageKey || typeof pageKey !== 'string') {
    console.warn('getContent: Invalid pageKey provided:', pageKey);
    return getDefaultContent('unknown');
  }
  
  // Normalize the page key (remove leading slash, lowercase)
  const normalizedKey = pageKey.replace(/^\//, '').toLowerCase();
  
  // Try to find exact match first
  if (appContentData[normalizedKey]) {
    return {
      ...appContentData[normalizedKey],
      pageKey: normalizedKey,
      _timestamp: Date.now()
    };
  }
  
  // Try to find partial matches (for dynamic routes)
  const partialMatch = Object.keys(appContentData).find(key => 
    normalizedKey.includes(key) || key.includes(normalizedKey)
  );
  
  if (partialMatch) {
    return {
      ...appContentData[partialMatch],
      pageKey: normalizedKey,
      _timestamp: Date.now(),
      _partialMatch: true
    };
  }
  
  // Fallback to default content
  console.info(`getContent: No content found for '${pageKey}', using fallback`);
  return getDefaultContent(normalizedKey);
}

/**
 * Get default content structure for unknown pages
 * @param {string} pageKey - The page key for the unknown page
 * @returns {object} Default content structure
 */
function getDefaultContent(pageKey) {
  return {
    title: formatPageTitle(pageKey),
    description: `Welcome to ${formatPageTitle(pageKey)} - Part of the Fruitful Global ecosystem`,
    features: ["Dynamic content", "Real-time updates", "Integrated workflow"],
    status: "developing",
    lastUpdated: new Date().toISOString(),
    pageKey: pageKey,
    _fallback: true,
    _timestamp: Date.now()
  };
}

/**
 * Format page key into a readable title
 * @param {string} pageKey - The page key to format
 * @returns {string} Formatted title
 */
function formatPageTitle(pageKey) {
  if (!pageKey) return 'Fruitful Global';
  
  return pageKey
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

/**
 * Get all available page keys
 * @returns {string[]} Array of all available page keys
 */
export function getAvailablePages() {
  return Object.keys(appContentData);
}

/**
 * Get content summary for multiple pages
 * @param {string[]} pageKeys - Array of page keys
 * @returns {object} Object with page summaries
 */
export function getContentSummary(pageKeys = []) {
  const summary = {};
  
  const keysToProcess = pageKeys.length > 0 ? pageKeys : getAvailablePages();
  
  keysToProcess.forEach(key => {
    const content = getContent(key);
    summary[key] = {
      title: content.title,
      status: content.status,
      lastUpdated: content.lastUpdated,
      featuresCount: content.features ? content.features.length : 0
    };
  });
  
  return summary;
}

// Export content data for direct access if needed
export default appContentData;