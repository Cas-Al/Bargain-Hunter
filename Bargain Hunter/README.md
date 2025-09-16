# Bargain Hunter Chrome Extension

A Chrome extension that compares product prices between Amazon.in and Flipkart.com to help you find the best deals.

## Features

- Automatically detects product pages on Amazon.in and Flipkart.com
- Extracts product information (title, price)
- Compares prices between the two platforms
- Highlights the cheaper option
- Provides a history of recent comparisons
- Manual refresh capability for updated pricing

## Installation

1. Clone or download this repository
2. Open Chrome and navigate to `chrome://extensions/`
3. Enable "Developer mode" (toggle in the top right)
4. Click "Load unpacked" and select the folder containing the extension files
5. The extension should now be installed and visible in your Chrome toolbar

## Usage

1. Visit a product page on Amazon.in or Flipkart.com
2. Click the Bargain Hunter icon in your Chrome toolbar
3. View the price comparison between the two platforms
4. Click the "View Product" link to visit the product on the other platform
5. Use the refresh button to update the comparison if needed

## Project Structure

- `manifest.json`: Extension configuration file
- `background.js`: Background service worker for handling events
- `content-scripts/`: Scripts that run on the target websites
  - `amazon.js`: Extracts product info from Amazon
  - `flipkart.js`: Extracts product info from Flipkart
- `popup.html`: HTML for the extension popup
- `popup.css`: Styles for the popup
- `popup.js`: JavaScript for the popup functionality
- `icons/`: Extension icons

## Notes for Further Development

- The current implementation simulates the comparison to demonstrate UI functionality
- To fully implement the comparison, you would need to:
  1. Use the extracted product title to search the other site
  2. Parse the search results to find matching products
  3. Extract the price and URL of the best match

## License

MIT