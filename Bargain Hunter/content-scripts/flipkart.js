// Flipkart content script for Bargain Hunter

// Listen for messages from the background script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'extractProductInfo') {
    const productInfo = extractFlipkartProductInfo();
    if (productInfo) {
      chrome.runtime.sendMessage({
        action: 'productInfoExtracted',
        productInfo
      });
    }
  }
});

// Function to extract product information from Flipkart
function extractFlipkartProductInfo() {
  try {
    // Extract product title
    let title = '';
    const titleElement = document.querySelector('.B_NuCI');
    if (titleElement) {
      title = titleElement.innerText.trim();
    }

    // Extract product price
    let price = '';
    // Try multiple price selectors as Flipkart's structure can vary
    const priceSelectors = [
      '._30jeq3._16Jk6d',
      '._30jeq3',
      '.dyC4hf ._30jeq3'
    ];

    for (const selector of priceSelectors) {
      const priceElement = document.querySelector(selector);
      if (priceElement) {
        price = priceElement.innerText.trim();
        break;
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
        site: 'flipkart',
        timestamp: new Date().toISOString()
      };
    }
    
    return null;
  } catch (error) {
    console.error('Error extracting Flipkart product info:', error);
    return null;
  }
}

// Execute extraction when page loads in case we're navigating directly to a product
document.addEventListener('DOMContentLoaded', () => {
  const isProductPage = window.location.href.includes('flipkart.com/p/');
  
  if (isProductPage) {
    const productInfo = extractFlipkartProductInfo();
    if (productInfo) {
      chrome.runtime.sendMessage({
        action: 'productInfoExtracted',
        productInfo
      });
    }
  }
});