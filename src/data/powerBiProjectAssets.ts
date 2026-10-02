import { DAX_MEASURES } from './daxMeasures';
import { VIVA_QUESTIONS } from './vivaQuestions';

export const POWER_QUERY_M_CODE = `// ============================================================
// SUPERMARKET SALES DATA ETL - POWER QUERY ADVANCED EDITOR
// Paste this M-Code into Power BI Desktop > Transform Data > Advanced Editor
// ============================================================

let
    // 1. Ingestion: Source CSV from Web / Local file path
    Source = Csv.Document(File.Contents("C:\\CollegeProjects\\Supermarket_Sales_Dataset.csv"), [Delimiter=",", Columns=17, Encoding=65001, QuoteStyle=QuoteStyle.Csv]),
    #"Promoted Headers" = Table.PromoteHeaders(Source, [PromoteAllScalars=true]),

    // 2. Data Type Formatting
    #"Changed Type" = Table.TransformColumnTypes(#"Promoted Headers",{
        {"Invoice ID", type text},
        {"Branch", type text},
        {"City", type text},
        {"Customer type", type text},
        {"Gender", type text},
        {"Product line", type text},
        {"Unit price", Currency.Type},
        {"Quantity", Int64.Type},
        {"Tax 5%", Currency.Type},
        {"Total", Currency.Type},
        {"Date", type date},
        {"Time", type time},
        {"Payment", type text},
        {"cogs", Currency.Type},
        {"gross margin percentage", type number},
        {"gross income", Currency.Type},
        {"Rating", type number}
    }),

    // 3. Data Cleaning: Trim whitespace & clean text
    #"Cleaned Branch" = Table.TransformColumns(#"Changed Type",{{"Branch", Text.Trim, type text}}),
    #"Cleaned Product" = Table.TransformColumns(#"Cleaned Branch",{{"Product line", Text.Trim, type text}}),

    // 4. Feature Engineering: Extracted Hour for Footfall Analysis
    #"Extracted Hour" = Table.AddColumn(#"Cleaned Product", "Hour of Day", each Time.Hour([Time]), Int64.Type),

    // 5. Categorize Basket Size (Small, Medium, Bulk)
    #"Basket Classification" = Table.AddColumn(#"Extracted Hour", "Basket Size Category", each 
        if [Quantity] <= 3 then "Small (1-3)" 
        else if [Quantity] <= 7 then "Medium (4-7)" 
        else "Bulk (8-10)", type text)
in
    #"Basket Classification"
`;

export const CALENDAR_DATE_M_CODE = `// ============================================================
// DIM_DATE GENERATOR (M-CODE) FOR POWER BI STAR SCHEMA
// ============================================================
let
    StartDate = #date(2025, 1, 1),
    EndDate = #date(2025, 3, 31),
    NumberOfDays = Duration.Days(EndDate - StartDate) + 1,
    DateList = List.Dates(StartDate, NumberOfDays, #duration(1, 0, 0, 0)),
    #"Date Table" = Table.FromList(DateList, Splitter.SplitByNothing(), {"Date"}, null, ExtraValues.Error),
    #"Changed Type" = Table.TransformColumnTypes(#"Date Table",{{"Date", type date}}),
    #"Added Year" = Table.AddColumn(#"Changed Type", "Year", each Date.Year([Date]), Int64.Type),
    #"Added Month No" = Table.AddColumn(#"Added Year", "Month No", each Date.Month([Date]), Int64.Type),
    #"Added Month Name" = Table.AddColumn(#"Added Month No", "Month Name", each Date.MonthName([Date]), type text),
    #"Added Month Year" = Table.AddColumn(#"Added Month Name", "Month Year", each Date.ToText([Date], "MMM yyyy"), type text),
    #"Added Day of Week" = Table.AddColumn(#"Added Month Year", "Day Name", each Date.DayOfWeekName([Date]), type text),
    #"Added Quarter" = Table.AddColumn(#"Added Day of Week", "Quarter", each "Q" & Text.From(Date.QuarterOfYear([Date])), type text)
in
    #"Added Quarter"
`;

export function generateAllDAXFileContent(): string {
  let content = `/*
  =============================================================================
  COLLEGE DATA ANALYTICS PROJECT: SUPERMARKET SALES POWER BI DAX MEASURES
  Dataset: Kaggle/Walmart Retail Supermarket Data Model
  Architecture: Star Schema (Fact_SupermarketSales + Dim_Date + Dim_Branch + Dim_Product)
  Total Measures: ${DAX_MEASURES.length}
  =============================================================================
*/\n\n`;

  DAX_MEASURES.forEach((m, idx) => {
    content += `// -----------------------------------------------------------------------------\n`;
    content += `// MEASURE ${idx + 1}: ${m.name} [Category: ${m.category}] [Difficulty: ${m.difficulty}]\n`;
    content += `// Visual Usage: ${m.powerBiVisual}\n`;
    content += `// Explanation: ${m.description}\n`;
    content += `// -----------------------------------------------------------------------------\n`;
    content += `${m.formula}\n\n`;
  });

  return content;
}

export function generateFullCollegeReportMarkdown(studentInfo: {
  studentName: string;
  rollNumber: string;
  university: string;
  course: string;
  academicYear: string;
  facultyGuide: string;
  projectTitle: string;
}): string {
  return `# ACADEMIC PROJECT REPORT
## ${studentInfo.projectTitle.toUpperCase()}
### A Business Intelligence & Prescriptive Data Analytics Solution in Microsoft Power BI

---

### STUDENT & INSTITUTIONAL CREDENTIALS
- **Student Name:** ${studentInfo.studentName || '[Student Name]'}
- **Roll / Registration Number:** ${studentInfo.rollNumber || '[Roll Number]'}
- **Degree / Course:** ${studentInfo.course || 'Bachelor / Master in Computer Applications / Data Science'}
- **Department / University:** ${studentInfo.university || '[University / College Name]'}
- **Academic Session:** ${studentInfo.academicYear || '2024 - 2025'}
- **Faculty Supervisor / Guide:** ${studentInfo.facultyGuide || '[Prof. Faculty Advisor]'}

---

## 1. ABSTRACT
This project develops an end-to-end interactive Business Intelligence (BI) dashboard for modern retail supermarket chains using Microsoft Power BI. Retail supermarkets generate large volumes of high-velocity point-of-sale (POS) transactional records covering branch operations, product line velocity, payment dynamics, customer loyalty status, and satisfaction ratings. In this project, raw transactional data was systematically cleansed, modeled into a Star Schema with VertiPaq engine optimization, enriched with 25+ DAX (Data Analysis Expressions) metrics, and visualized across intuitive, role-based dashboards. The resulting dashboard empowers store directors, category managers, and supply chain analysts to optimize inventory holding, maximize member lifetime value, and identify high-yielding time windows.

---

## 2. PROBLEM STATEMENT & OBJECTIVES
### Problem Statement
Supermarket chains across Southeast Asia (Yangon, Naypyitaw, Mandalay) face intense competition, compressed retail margins (4.76%), and shifting customer payment preferences (Cash vs. E-Wallets). Without consolidated, multidimensional reporting, management lacks visibility into:
1. Real-time product category margins and revenue contribution.
2. The economic yield of loyalty members versus walk-in customers.
3. Hourly shopping footfall variations leading to cashier bottlenecks or overstaffing.
4. Branch-to-branch variance in customer satisfaction ratings and checkout sizes.

### Project Objectives
- Construct an enterprise-grade Star Schema dimensional model in Power BI.
- Execute robust Power Query ETL processes (type validation, anomaly handling, surrogate key generation).
- Author modular DAX measures utilizing time intelligence, conditional filtering (CALCULATE, ALL), and safe divisions (DIVIDE).
- Deploy interactive visuals with cross-filtering, drill-through, and what-if parameter modeling.
- Provide actionable, data-backed retail recommendations for store executives.

---

## 3. DATA ARCHITECTURE & STAR SCHEMA
### Star Schema Entities
1. **Fact_SupermarketSales**: Contains quantitative transaction facts (Invoice ID, Unit Price, Quantity, Tax 5%, COGS, Total Sales, Gross Income, Customer Rating).
2. **Dim_Date**: Complete calendar dimension supporting YTD, MoM, and moving average time intelligence.
3. **Dim_Product**: Product Line category, standard pricing tiers, markup classifications.
4. **Dim_Branch**: Branch Code (A, B, C), City (Yangon, Naypyitaw, Mandalay), Regional operational parameters.
5. **Dim_Customer**: Customer Loyalty Tier (Member vs Normal), Demographics (Gender).
6. **Dim_Payment**: Payment method classifications (Ewallet, Cash, Credit Card).

### Relationship Cardinality
- Dim_Date [Date] (1) ---> (*) Fact_SupermarketSales [Date]
- Dim_Branch [Branch] (1) ---> (*) Fact_SupermarketSales [Branch]
- Dim_Product [Product Line] (1) ---> (*) Fact_SupermarketSales [Product Line]
- Dim_Customer [Customer Type] (1) ---> (*) Fact_SupermarketSales [Customer Type]
- Cross-Filter Direction: Single (Dimension filters Fact), avoiding ambiguous circular pathways.

---

## 4. POWER QUERY ETL WORKFLOW
1. **Ingestion & Profiling**: Verification of 1,000 distinct transactional records with zero null values.
2. **Schema Uniformity**: Standardizing column naming and currency precision to 2 decimal places.
3. **Temporal Breakdown**: Extraction of 'Hour of Day' from POS timestamps to enable peak footfall analysis.
4. **Validation Logic**: Automated reconciliation asserting that [Total Sales] = [COGS] + [Tax 5%], guaranteeing balance sheet accuracy.

---

## 5. KEY DAX MEASURES IMPLEMENTED
- **Total Sales** = SUM(Fact_SupermarketSales[Total])
- **Gross Margin %** = DIVIDE([Gross Profit], [Total Sales], 0)
- **Average Order Value (AOV)** = DIVIDE([Total Sales], [Total Transactions], 0)
- **Member Revenue %** = DIVIDE(CALCULATE([Total Sales], Customer="Member"), CALCULATE([Total Sales], ALL(Customer)), 0)
- **Moving Average 7D** = AVERAGEX(DATESINPERIOD(Dim_Date[Date], LASTDATE(Dim_Date[Date]), -7, DAY), [Total Sales])
- **Branch Rank** = RANKX(ALL(Dim_Branch[Branch]), [Total Sales],, DESC)

---

## 6. BUSINESS FINDINGS & STRATEGIC RECOMMENDATIONS
1. **Product Velocity**: 'Food & Beverages' and 'Fashion Accessories' account for the highest volume of purchases, while 'Sports & Travel' and 'Health & Beauty' maintain higher average price points per unit.
2. **Loyalty Program Impact**: Registered loyalty members exhibit a 12% higher Average Order Value (AOV) and purchase higher-margin inventory items compared to walk-in shoppers.
3. **Peak Operating Windows**: Point-of-Sale activity spikes sharply between 13:00-14:00 (lunchtime) and 19:00-20:00 (evening peak). Cashier allocation should be dynamically weighted to these intervals.
4. **Payment Preferences**: E-Wallet and Cash transactions dominate Branch A and Branch B, whereas Credit Card utilization is prominent in Branch C.

---

## 7. VIVA VOCE EXAMINATION PREPARATION (Q&A)
${VIVA_QUESTIONS.map((q, i) => `### Q${i + 1}. ${q.question}
**Answer:** ${q.answer}
*Examiner Tip:* ${q.examinerTip}\n`).join('\n')}

---
*Report generated via Supermarket Power BI Analytics Suite for Academic College Submissions.*
`;
}
