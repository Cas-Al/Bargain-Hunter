// Background service worker for Bargain Hunter extension

// Listen for tab updates to detect product pages
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && tab.url) {
    const isAmazon = tab.url.includes('amazon.in') && 
      (tab.url.includes('/dp/') || tab.url.includes('/gp/product/'));
    const isFlipkart = tab.url.includes('flipkart.com') && tab.url.includes('/p/');

    // If it's a product page, tell the content script to extract information
    if (isAmazon || isFlipkart) {
      chrome.tabs.sendMessage(tabId, { action: 'extractProductInfo' });
    }
  }
});

// Listen for messages from content scripts and popup
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'productInfoExtracted') {
    // Store the product info for use in the popup
    chrome.storage.local.set({ 
      currentProduct: message.productInfo,
      lastUpdated: new Date().toISOString()
    });

    // Add to history (keeping only the last 5)
    chrome.storage.local.get('history', (data) => {
      const history = data.history || [];
      
      // Check if this product is already in history to avoid duplicates
      const existingIndex = history.findIndex(item => 
        item.title === message.productInfo.title && 
        item.site === message.productInfo.site
      );
      
      if (existingIndex >= 0) {
        // Update existing entry
        history[existingIndex] = message.productInfo;
      } else {
        // Add new entry
        history.unshift(message.productInfo);
        // Keep only the last 5 entries
        if (history.length > 5) {
          history.pop();
        }
      }
      
      chrome.storage.local.set({ history });
    });

    // Compare with the other site
    compareWithOtherSite(message.productInfo);
  }
});

// Function to compare with the other site
async function compareWithOtherSite(productInfo) {
  const otherSite = productInfo.site === 'amazon' ? 'flipkart' : 'amazon';
  
  
  setTimeout(() => {
    // Store comparison result
    chrome.storage.local.set({ 
      comparisonResult: {
        status: 'completed',
        otherSite: {
          site: otherSite,
          title: productInfo.title,
          
          
          price: simulatePriceComparison(productInfo.price),
          url: `https://www.${otherSite}.com/search?q=${encodeURIComponent(productInfo.title)}`
        },
        cheaper: Math.random() > 0.5 ? productInfo.site : otherSite
      }
    });
  }, 1500);
}

// Helper function to simulate a different price
function simulatePriceComparison(originalPrice) {
  // Remove any currency symbols and commas
  const numericPrice = parseFloat(originalPrice.replace(/[₹,]/g, ''));
  
  // Generate a price that's randomly up to 1% higher or lower
  const priceDifference = numericPrice * (Math.random() * 0.02 - 0.01);
  const newPrice = numericPrice + priceDifference;
  
  // Format the price similar to the original
  return `₹${newPrice.toFixed(2)}`;
}