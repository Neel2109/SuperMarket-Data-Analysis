export interface VivaQuestion {
  id: string;
  category: 'Power BI Architecture' | 'DAX & Formulas' | 'Data Modeling' | 'Business Analytics' | 'ETL & Power Query';
  question: string;
  answer: string;
  examinerTip: string;
}

export const VIVA_QUESTIONS: VivaQuestion[] = [
  {
    id: 'viva-1',
    category: 'Data Modeling',
    question: 'Why did you design a Star Schema instead of keeping a single flat denormalized table or using a Snowflake schema?',
    answer: 'A Star Schema organizes data into a central Fact Table (Fact_SupermarketSales) surrounded by Dimension Tables (Dim_Date, Dim_Product, Dim_Branch, Dim_Customer, Dim_Payment). Star Schema is the gold standard for Power BI because the VertiPaq engine achieves maximum in-memory columnar compression and optimal 1-to-many relationship traversal. A Snowflake schema adds unnecessary normalization joins which slow down filter propagation, while a single flat table increases redundancy and memory consumption.',
    examinerTip: 'Emphasize VertiPaq engine performance and simplicity of 1-to-many single-direction relationships.',
  },
  {
    id: 'viva-2',
    category: 'DAX & Formulas',
    question: 'What is the fundamental difference between CALCULATE and FILTER in DAX?',
    answer: 'CALCULATE is the single most powerful function in DAX because it transitions Row Context into Filter Context and allows us to modify, add, or clear existing filters on the data model. FILTER, on the other hand, is an iterator function that scans a table row-by-row and returns a subset table meeting a boolean condition. Using FILTER inside CALCULATE (e.g., CALCULATE([Total Sales], FILTER(ALL(Table), Condition))) allows precise contextual overriding.',
    examinerTip: 'Mention context transition and why wrapping CALCULATE around naked measures is standard practice.',
  },
  {
    id: 'viva-3',
    category: 'DAX & Formulas',
    question: 'Why is DIVIDE() preferred over the forward slash (/) operator in DAX?',
    answer: 'The forward slash operator (A / B) returns NaN or throws an unhandled error when the denominator B is 0 or BLANK. The DAX DIVIDE(A, B, [alternateResult]) function includes built-in internal error handling and mathematically evaluates safely to 0 or null without terminating the visual or slowing down execution.',
    examinerTip: 'State that DIVIDE improves dashboard reliability, especially when users apply granular slicers.',
  },
  {
    id: 'viva-4',
    category: 'ETL & Power Query',
    question: 'What ETL transformations did you perform in Power Query before loading the data into the Power BI data model?',
    answer: '1. Promoted headers and verified correct data types (Date as Date, Time as Time, Financial figures as Fixed Decimal Currency). 2. Created distinct dimension surrogate keys. 3. Generated a dedicated Date Calendar table using Power Query M-code (including Year, Month, Month-Year, Day of Week, Quarter). 4. Calculated Tax and COGS verification checks to ensure zero discrepancy. 5. Handled null or trailing whitespace in Branch and Product Line strings.',
    examinerTip: 'Show that data cleaning was done upstream in Power Query rather than relying on calculated columns in DAX.',
  },
  {
    id: 'viva-5',
    category: 'Business Analytics',
    question: 'What were the major retail business insights uncovered by your Supermarket dashboard?',
    answer: '1. Food & Beverages and Fashion Accessories generated the highest aggregate revenue, whereas Health & Beauty showed the highest average basket margin. 2. Branch A (Yangon) and Branch C (Naypyitaw) had consistent customer loyalty program engagement (~50% Member penetration), while Branch B showed higher Cash checkout volumes. 3. Peak sales occur between 13:00-14:00 (lunchtime) and 19:00-20:00 (evening after work), signaling opportunities for targeted flash promotions.',
    examinerTip: 'Link analytical numbers directly to actionable retail operational decisions like staff scheduling and inventory restocking.',
  },
  {
    id: 'viva-6',
    category: 'Power BI Architecture',
    question: 'What is the difference between a Calculated Column and a DAX Measure? When should each be used?',
    answer: 'Calculated Columns are evaluated during data refresh row-by-row and stored physically in RAM memory within the VertiPaq table. DAX Measures are dynamic aggregations evaluated on-the-fly at query time based on whatever slicers and visual filter contexts are active. For KPIs (Total Sales, Margin %, AOV), always use Measures to minimize memory footprint. Use Calculated Columns only when you need row-level categorization for slicers or axis groupings.',
    examinerTip: 'Professors love when you highlight that Measures do not consume file storage space, keeping the .pbix lean.',
  },
  {
    id: 'viva-7',
    category: 'DAX & Formulas',
    question: 'How does ALL() function alter the filter context in a measure like Member Sales %?',
    answer: 'The ALL(Fact_SupermarketSales[Customer type]) function strips away any active filter context on the Customer type column, returning the total denominator regardless of whether the user clicked "Member" or "Normal". This enables percentage-of-total calculations without being constrained by the current slice.',
    examinerTip: 'Illustrate with formula: DIVIDE(CALCULATE([Sales], Customer="Member"), CALCULATE([Sales], ALL(Customer)), 0).',
  },
  {
    id: 'viva-8',
    category: 'Power BI Architecture',
    question: 'What is the purpose of Row-Level Security (RLS) in an enterprise Supermarket deployment?',
    answer: 'RLS restricts data access for specific users based on their login identity (USERPRINCIPALNAME()). For example, Branch Managers at Branch A (Yangon) can only view transactions and staff performance for Branch A, while Regional Directors have access to all branches across Myanmar.',
    examinerTip: 'Mentioning RLS shows the examiner you understand real-world enterprise deployment and security compliance.',
  },
];
