// Amazon content script for Bargain Hunter

// Listen for messages from the background script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'extractProductInfo') {
    const productInfo = extractAmazonProductInfo();
    if (productInfo) {
      chrome.runtime.sendMessage({
        action: 'productInfoExtracted',
        productInfo
      });
    }
  }
});

// Function to extract product information from Amazon
function extractAmazonProductInfo() {
  try {
    // Extract product title
    let title = '';
    const titleElement = document.getElementById('productTitle');
    if (titleElement) {
      title = titleElement.innerText.trim();
    }

    // Extract product price
    let price = '';
    // Try multiple price selectors as Amazon's structure can vary
    const priceSelectors = [
      '#priceblock_ourprice',
      '#priceblock_dealprice',
      '.a-price .a-offscreen',
      '.a-price .a-price-whole',
      '#corePrice_feature_div .a-price .a-offscreen'
    ];

    for (const selector of priceSelectors) {
      const priceElement = document.querySelector(selector);
      if (priceElement) {
        // For elements with content in a child element
        if (selector === '.a-price .a-offscreen') {
          price = priceElement.innerText.trim();
          break;
        } else {
          price = priceElement.innerText.trim();
          break;
        }
      }
    }

    // If we couldn't find the price using the selectors, try the API data
    if (!price) {
      // Amazon sometimes stores data in a script tag
      const scripts = document.querySelectorAll('script');
      for (const script of scripts) {
        if (script.textContent.includes('priceAmount')) {
          const match = script.textContent.match(/"priceAmount":\s*([0-9.]+)/);
          if (match && match[1]) {
            price = `₹${match[1]}`;
            break;
          }
        }
      }
    }

    // Get product URL
    const url = window.location.href;

    // Only return if we have both title and price
    if (title && price) {
      return {
        title,
        price,
        url,
        site: 'amazon',
        timestamp: new Date().toISOString()
      };
    }
    
    return null;
  } catch (error) {
    console.error('Error extracting Amazon product info:', error);
    return null;
  }
}

// Execute extraction when page loads in case we're navigating directly to a product
document.addEventListener('DOMContentLoaded', () => {
  const isProductPage = window.location.href.includes('/dp/') || 
                        window.location.href.includes('/gp/product/');
  
  if (isProductPage) {
    const productInfo = extractAmazonProductInfo();
    if (productInfo) {
      chrome.runtime.sendMessage({
        action: 'productInfoExtracted',
        productInfo
      });
    }
  }
});