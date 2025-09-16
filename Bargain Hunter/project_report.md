# Bargain Hunter Chrome Extension - Project Report

# **Chapter 1: Introduction**
*Times New Roman, 14 pt, Bold*

## **1.1 Problem Statement**
*Times New Roman, 12 pt, Bold*

In the current e-commerce landscape, consumers face the challenge of finding the best deals across multiple platforms. With Amazon.in and Flipkart.com being two of India's largest e-commerce platforms, price disparities for the same product can be significant. The manual process of comparing prices between these platforms is time-consuming and inefficient, often leading to missed opportunities for savings.

## **1.2 Objective**
*Times New Roman, 12 pt, Bold*

The primary objective of the Bargain Hunter Chrome Extension is to:
1. Automate the price comparison process between Amazon.in and Flipkart.com
2. Provide real-time price information to users while shopping
3. Streamline the decision-making process for online purchases
4. Save users both time and money through intelligent price tracking

### *1.2.1 Project Goals*
*Times New Roman, 12 pt, Italic*

- Develop a seamless browser extension that integrates with Chrome
- Implement accurate product detection and price extraction
- Create an intuitive user interface for price comparison
- Maintain a history of recent comparisons for user reference
- Enable manual refresh capabilities for real-time price updates

## **1.3 Project Scope**
*Times New Roman, 12 pt, Bold*

### *1.3.1 Included Scope*
*Times New Roman, 12 pt, Italic*

- Product price monitoring on Amazon.in and Flipkart.com
- Automatic product detection and information extraction
- Price comparison and best deal identification
- Historical price tracking (up to 5 recent items)
- Browser extension popup interface
- Real-time price updates through manual refresh

### *1.3.2 Limitations and Boundaries*
*Times New Roman, 12 pt, Italic*

- Limited to Amazon.in and Flipkart.com platforms
- Focuses on direct product matches only
- Stores limited history of recent comparisons
- Requires active browser extension and internet connection

---
*Note: This document follows the specified formatting guidelines. When converting to a word processor format, please ensure:*
- *Chapter titles: Times New Roman, 14 pt, Bold*
- *Main section headings: Times New Roman, 12 pt, Bold*
- *Subsection headings: Times New Roman, 12 pt, Italic*

# **Chapter 2: Methodology**
*Times New Roman, 14 pt, Bold*

## **2.1 Development Stack**
*Times New Roman, 12 pt, Bold*

The project utilizes a modern web development stack:
- **Frontend Framework**: React 18.3.1 with TypeScript
- **Build Tool**: Vite 5.4.2
- **Styling**: TailwindCSS 3.4.1
- **Code Quality**: ESLint and TypeScript for type safety
- **Browser Extension**: Chrome Extension Manifest V3

## **2.2 Technical Architecture**
*Times New Roman, 12 pt, Bold*

### *2.2.1 Core Components*
*Times New Roman, 12 pt, Italic*

1. **Background Service Worker**
   - Manages extension lifecycle
   - Handles communication between components
   - Processes product data and comparisons

2. **Content Scripts**
   - Injects into Amazon.in and Flipkart.com
   - Extracts product information using DOM manipulation
   - Implements multiple price selector strategies for reliability

3. **Popup Interface**
   - React-based user interface
   - Real-time price comparison display
   - Historical data visualization

## **2.3 Data Extraction Methodology**
*Times New Roman, 12 pt, Bold*

### *2.3.1 Product Information Extraction*
*Times New Roman, 12 pt, Italic*

The extension employs several techniques for reliable data extraction:
- Multiple CSS selector strategies for price elements
- Fallback mechanisms for varying page structures
- API data parsing from embedded scripts
- Error handling and validation

### *2.3.2 Price Comparison Logic*
*Times New Roman, 12 pt, Italic*

The comparison system implements:
- Real-time price extraction and normalization
- Cross-platform product matching
- Historical price tracking
- Automated best deal identification

## **2.4 Development Tools**
*Times New Roman, 12 pt, Bold*

### *2.4.1 Development Environment*
*Times New Roman, 12 pt, Italic*

- Visual Studio Code with TypeScript support
- Chrome DevTools for extension debugging
- ESLint for code quality enforcement
- Vite for rapid development and building

### *2.4.2 Version Control*
*Times New Roman, 12 pt, Italic*

- Git for source code management
- Feature-based development workflow
- `.gitignore` configuration for development artifacts 

# **Chapter 3: Data Management**
*Times New Roman, 14 pt, Bold*

## **3.1 Storage Architecture**
*Times New Roman, 12 pt, Bold*

### *3.1.1 Local Storage Implementation*
*Times New Roman, 12 pt, Italic*

1. Chrome Storage API utilization
2. Cached data management
3. History retention policies
4. Data compression strategies

### *3.1.2 Data Models*
*Times New Roman, 12 pt, Italic*

interface ProductData {
  id: string;
  title: string;
  currentPrice: number;
  historicalPrices: PricePoint[];
  platform: 'amazon' | 'flipkart';
  lastUpdated: timestamp;
} 