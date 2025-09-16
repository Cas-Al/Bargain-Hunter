// Popup script for Bargain Hunter

document.addEventListener('DOMContentLoaded', () => {
  // Get UI elements
  const productNotFound = document.getElementById('productNotFound');
  const loadingComparison = document.getElementById('loadingComparison');
  const comparisonResults = document.getElementById('comparisonResults');
  const history = document.getElementById('history');
  
  const productTitle = document.getElementById('productTitle');
  const currentSiteName = document.getElementById('currentSiteName');
  const currentSitePrice = document.getElementById('currentSitePrice');
  const currentSiteLink = document.getElementById('currentSiteLink');
  const currentSiteCard = document.getElementById('currentSiteCard');
  
  const otherSiteName = document.getElementById('otherSiteName');
  const otherSitePrice = document.getElementById('otherSitePrice');
  const otherSiteLink = document.getElementById('otherSiteLink');
  const otherSiteCard = document.getElementById('otherSiteCard');
  
  const priceDifference = document.getElementById('priceDifference');
  const savingsMessage = document.getElementById('savingsMessage');
  const lastUpdated = document.getElementById('lastUpdated');
  const historyList = document.getElementById('historyList');
  const refreshBtn = document.getElementById('refreshBtn');
  
  // Get current tab to check for product page
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const currentTab = tabs[0];
    
    // Check if current tab is Amazon or Flipkart
    const isAmazon = currentTab.url.includes('amazon.in');
    const isFlipkart = currentTab.url.includes('flipkart.com');
    
    if (isAmazon || isFlipkart) {
      // Check if we have product info stored
      chrome.storage.local.get(['currentProduct', 'comparisonResult', 'lastUpdated'], (data) => {
        if (data.currentProduct) {
          // We have product info
          updateUIWithProductInfo(data.currentProduct, data.comparisonResult);
          
          // Show last updated time
          if (data.lastUpdated) {
            const lastUpdatedDate = new Date(data.lastUpdated);
            const now = new Date();
            const diffMinutes = Math.floor((now - lastUpdatedDate) / (1000 * 60));
            
            if (diffMinutes < 1) {
              lastUpdated.textContent = 'Just now';
            } else if (diffMinutes === 1) {
              lastUpdated.textContent = '1 minute ago';
            } else if (diffMinutes < 60) {
              lastUpdated.textContent = `${diffMinutes} minutes ago`;
            } else {
              const diffHours = Math.floor(diffMinutes / 60);
              if (diffHours === 1) {
                lastUpdated.textContent = '1 hour ago';
              } else {
                lastUpdated.textContent = `${diffHours} hours ago`;
              }
            }
          }
          
          // If we don't have comparison result yet, show loading
          if (!data.comparisonResult || data.comparisonResult.status !== 'completed') {
            loadingComparison.classList.remove('hidden');
            comparisonResults.classList.add('hidden');
          }
        } else {
          // No product info, check if it's a product page
          const isProductPage = 
            (isAmazon && (currentTab.url.includes('/dp/') || currentTab.url.includes('/gp/product/'))) ||
            (isFlipkart && currentTab.url.includes('/p/'));
          
          if (isProductPage) {
            // It's a product page, but we don't have info yet
            // Ask content script to extract info
            chrome.tabs.sendMessage(currentTab.id, { action: 'extractProductInfo' });
            loadingComparison.classList.remove('hidden');
          } else {
            // Not a product page
            productNotFound.classList.remove('hidden');
          }
        }
        
        // Show history
        updateHistoryList();
      });
    } else {
      // Not on Amazon or Flipkart
      productNotFound.classList.remove('hidden');
      // Still show history if available
      updateHistoryList();
    }
  });
  
  // Function to update UI with product info and comparison
  function updateUIWithProductInfo(productInfo, comparisonResult) {
    // Set product title
    productTitle.textContent = productInfo.title;
    
    // Update current site info
    currentSiteName.textContent = capitalizeFirstLetter(productInfo.site);
    currentSitePrice.textContent = productInfo.price;
    currentSiteLink.href = productInfo.url;
    
    // Check if we have comparison result
    if (comparisonResult && comparisonResult.status === 'completed') {
      // Update other site info
      otherSiteName.textContent = capitalizeFirstLetter(comparisonResult.otherSite.site);
      otherSitePrice.textContent = comparisonResult.otherSite.price;
      otherSiteLink.href = comparisonResult.otherSite.url;
      
      // Calculate price difference
      const currentPrice = parsePriceValue(productInfo.price);
      const otherPrice = parsePriceValue(comparisonResult.otherSite.price);
      
      if (currentPrice && otherPrice) {
        const difference = otherPrice - currentPrice;
        const percentDiff = (difference / currentPrice) * 100;
        
        if (difference > 0) {
          // Current site is cheaper
          priceDifference.textContent = `+₹${Math.abs(difference).toFixed(2)} (${Math.abs(percentDiff).toFixed(1)}%)`;
          priceDifference.className = 'price-difference price-higher';
          currentSiteCard.classList.add('highlight');
          otherSiteCard.classList.remove('highlight');
          savingsMessage.textContent = `Save ₹${Math.abs(difference).toFixed(2)} by buying on ${capitalizeFirstLetter(productInfo.site)}!`;
          savingsMessage.classList.remove('hidden');
        } else if (difference < 0) {
          // Other site is cheaper
          priceDifference.textContent = `-₹${Math.abs(difference).toFixed(2)} (${Math.abs(percentDiff).toFixed(1)}%)`;
          priceDifference.className = 'price-difference price-lower';
          otherSiteCard.classList.add('highlight');
          currentSiteCard.classList.remove('highlight');
          savingsMessage.textContent = `Save ₹${Math.abs(difference).toFixed(2)} by buying on ${capitalizeFirstLetter(comparisonResult.otherSite.site)}!`;
          savingsMessage.classList.remove('hidden');
        } else {
          // Same price
          priceDifference.textContent = 'Same price';
          priceDifference.className = 'price-difference';
          currentSiteCard.classList.remove('highlight');
          otherSiteCard.classList.remove('highlight');
          savingsMessage.textContent = 'Both sites have the same price for this product.';
          savingsMessage.classList.remove('hidden');
        }
      }
      
      // Show comparison results
      comparisonResults.classList.remove('hidden');
      loadingComparison.classList.add('hidden');
    } else {
      // Still loading comparison
      loadingComparison.classList.remove('hidden');
      comparisonResults.classList.add('hidden');
    }
  }
  
  // Function to update history list
  function updateHistoryList() {
    chrome.storage.local.get('history', (data) => {
      if (data.history && data.history.length > 0) {
        history.classList.remove('hidden');
        
        // Clear current list
        historyList.innerHTML = '';
        
        // Add items to list
        data.history.forEach((item, index) => {
          const li = document.createElement('li');
          li.className = 'history-item';
          li.dataset.index = index;
          
          const title = document.createElement('div');
          title.className = 'history-item-title';
          title.textContent = item.title;
          
          const meta = document.createElement('div');
          meta.className = 'history-item-meta';
          
          const site = document.createElement('span');
          site.textContent = capitalizeFirstLetter(item.site);
          
          const price = document.createElement('span');
          price.textContent = item.price;
          
          meta.appendChild(site);
          meta.appendChild(price);
          
          li.appendChild(title);
          li.appendChild(meta);
          
          // Add click event to load this product
          li.addEventListener('click', () => {
            chrome.storage.local.set({ 
              currentProduct: item,
              lastUpdated: new Date().toISOString()
            });
            
            // Compare with other site
            chrome.runtime.sendMessage({
              action: 'productInfoExtracted',
              productInfo: item
            });
            
            // Update UI
            loadingComparison.classList.remove('hidden');
            comparisonResults.classList.add('hidden');
          });
          
          historyList.appendChild(li);
        });
      }
    });
  }
  
  // Refresh button event
  refreshBtn.addEventListener('click', () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const currentTab = tabs[0];
      
      // Ask content script to extract info again
      chrome.tabs.sendMessage(currentTab.id, { action: 'extractProductInfo' });
      
      // Show loading
      loadingComparison.classList.remove('hidden');
      comparisonResults.classList.add('hidden');
      
      // Add animation to button
      refreshBtn.classList.add('pulse');
      setTimeout(() => {
        refreshBtn.classList.remove('pulse');
      }, 500);
    });
  });
  
  // Listen for storage changes to update UI
  chrome.storage.onChanged.addListener((changes) => {
    if (changes.currentProduct || changes.comparisonResult) {
      chrome.storage.local.get(['currentProduct', 'comparisonResult'], (data) => {
        if (data.currentProduct) {
          updateUIWithProductInfo(data.currentProduct, data.comparisonResult);
        }
      });
    }
    
    if (changes.history) {
      updateHistoryList();
    }
  });
  
  // Helper function to capitalize first letter
  function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }
  
  // Helper function to parse price value
  function parsePriceValue(priceString) {
    // Remove currency symbol and commas
    const numericString = priceString.replace(/[₹,]/g, '');
    return parseFloat(numericString);
  }
});