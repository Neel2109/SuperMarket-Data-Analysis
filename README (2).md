# Supermarket Sales Analytics Project

This project is a React + Vite web application for a supermarket sales data analytics dashboard. It includes Firebase authentication, Firestore persistence, and Gemini AI-powered insights for Power BI and DAX support.

## Required tools

To run this project, you need:

- VS Code
- Node.js LTS (18 or later)
- npm
- A valid Google Gemini API key
- Firebase configuration file already included in the project

## Required files

The main project files are:

- [package.json](package.json) – project dependencies and scripts
- [vite.config.ts](vite.config.ts) – Vite config and environment setup
- [tsconfig.json](tsconfig.json) – TypeScript config
- [index.html](index.html) – app entry page
- [firebase-applet-config.json](firebase-applet-config.json) – Firebase project configuration
- [src/main.tsx](src/main.tsx) – React app bootstrap
- [src/App.tsx](src/App.tsx) – main app layout
- [src/services/firebase.ts](src/services/firebase.ts) – Firebase Auth + Firestore setup
- [src/services/gemini.ts](src/services/gemini.ts) – Gemini AI integration
- [src/data](src/data) – sample supermarket and analytics data
- [src/components](src/components) – UI components

## Recommended VS Code extensions

These are not mandatory, but they help with development:

- ES7+ React/Redux/React Native snippets
- Tailwind CSS IntelliSense
- Prettier - Code formatter
- Auto Rename Tag

## Setup steps

1. Open the project in VS Code.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env.local` file in the project root and add your Gemini API key:
   ```bash
   GEMINI_API_KEY=your_api_key_here
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```
5. Open the local URL shown in the terminal, usually:
   ```bash
   http://localhost:3000
   ```

## Notes

- Firebase is connected through [src/services/firebase.ts](src/services/firebase.ts) and [firebase-applet-config.json](firebase-applet-config.json).
- Gemini AI is connected through [src/services/gemini.ts](src/services/gemini.ts).
- If Firebase or Gemini keys are missing or invalid, the app may not function correctly.

## Scripts

```bash
npm install
npm run dev
npm run build
npm run lint
```

## Project purpose

This application is designed to help with:

- supermarket sales analytics
- Power BI / DAX explanations
- data modeling and reporting
- customer insights and business recommendations
- AI-assisted project analysis

## Professional Report Design Requirements

Use a consistent professional visual language across every report page.

Keep the Executive Overview concise; detailed analysis belongs on dedicated pages.

Use KPI cards for high-level metrics and charts for comparisons and trends.

Use slicers consistently across pages and preserve filter context where appropriate.

Use drill-through pages for Product, Customer and Branch details.

Use report/page/tooltips to expose additional detail without overcrowding the page.

Use blue as the primary accent, with restrained secondary colors for positive/negative states.

Maintain strong spacing, readable labels, compact number formatting and clear chart titles.

Avoid unnecessary 3D charts and decorative visuals that reduce analytical clarity.

### Report Navigation

1. Executive Overview
2. Customers & Products
3. Branch & Footfall
4. Sales Analytics
5. Profitability
6. Inventory Analytics
7. Payment Analytics
8. Discount & Promotion
9. Advanced Analytics
10. What-If Simulator
11. Star Schema Model
12. DAX Measures
13. Raw Dataset

### Global Filters / Slicers

- Date
- Branch
- Category
- Subcategory
- Product
- Brand
- Customer
- Payment
- Customer Type
- Discount

### Executive Overview requirements

- Total Sales KPI
- Total COGS KPI
- Gross Profit KPI
- Gross Margin KPI
- Invoices KPI
- Average Basket KPI
- Monthly Revenue & Profit line/combo chart
- Product Category Contribution horizontal bar
- Branch Performance matrix
- Payment Channel Breakdown bar chart
- Sales Target vs Actual gauge/bullet
- Growth KPI

### Additional design rule

The report should prioritize decision-support visuals over the number of charts. Every visual must answer a specific business question, use consistent definitions, respect the active filter context and avoid duplicating information already available elsewhere. Where a requested metric requires data that is not present in the source dataset, label the visual as conditional and implement it only after the required fields are added.

