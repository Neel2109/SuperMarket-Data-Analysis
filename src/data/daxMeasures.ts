import { DAXMeasure } from '../types';

export const DAX_MEASURES: DAXMeasure[] = [
  {
    id: 'dax-1',
    name: 'Total Sales Revenue',
    category: 'Key Metrics',
    formula: `Total Sales = 
SUM ( Fact_SupermarketSales[Total] )`,
    description: 'Calculates the aggregate gross revenue across all supermarket transactions including tax.',
    powerBiVisual: 'Card Visual / KPI Card / Line Chart Value',
    difficulty: 'Beginner',
  },
  {
    id: 'dax-2',
    name: 'Total Cost of Goods Sold (COGS)',
    category: 'Key Metrics',
    formula: `Total COGS = 
SUM ( Fact_SupermarketSales[cogs] )`,
    description: 'Calculates total wholesale cost incurred for purchasing the sold merchandise inventory.',
    powerBiVisual: 'Card Visual / Stacked Column Chart',
    difficulty: 'Beginner',
  },
  {
    id: 'dax-3',
    name: 'Gross Profit',
    category: 'Profitability',
    formula: `Gross Profit = 
[Total Sales] - [Total COGS]`,
    description: 'Gross operating surplus earned before overhead, representing net tax & merchant margin contribution.',
    powerBiVisual: 'KPI Card / Gauge Chart Target',
    difficulty: 'Beginner',
  },
  {
    id: 'dax-4',
    name: 'Gross Profit Margin %',
    category: 'Profitability',
    formula: `Gross Margin % = 
DIVIDE ( 
    [Gross Profit], 
    [Total Sales], 
    0 
)`,
    description: 'Safe division measure yielding the percentage profitability per dollar of sales (avoids divide-by-zero errors).',
    powerBiVisual: 'Gauge Chart / Matrix Column formatting',
    difficulty: 'Intermediate',
  },
  {
    id: 'dax-5',
    name: 'Total Transactions (Invoices)',
    category: 'Key Metrics',
    formula: `Total Transactions = 
DISTINCTCOUNT ( Fact_SupermarketSales[Invoice ID] )`,
    description: 'Counts unique customer shopping checkouts, ensuring duplicates or multi-line orders are counted accurately.',
    powerBiVisual: 'Card Visual / Ribbon Chart',
    difficulty: 'Beginner',
  },
  {
    id: 'dax-6',
    name: 'Average Order Value (AOV / Basket Size)',
    category: 'Customer & Basket',
    formula: `Average Order Value = 
DIVIDE ( 
    [Total Sales], 
    [Total Transactions], 
    0 
)`,
    description: 'Crucial retail KPI representing average expenditure per checkout basket.',
    powerBiVisual: 'Multi-row Card / Scatter Plot Y-Axis',
    difficulty: 'Intermediate',
  },
  {
    id: 'dax-7',
    name: 'Average Customer Rating',
    category: 'Key Metrics',
    formula: `Average Rating = 
AVERAGE ( Fact_SupermarketSales[Rating] )`,
    description: 'Measures customer satisfaction score across branches and product categories on a 1-10 scale.',
    powerBiVisual: 'Card Visual / Star Rating Visual',
    difficulty: 'Beginner',
  },
  {
    id: 'dax-8',
    name: 'Total Units Sold',
    category: 'Key Metrics',
    formula: `Total Units Sold = 
SUM ( Fact_SupermarketSales[Quantity] )`,
    description: 'Aggregates physical volume of items scanned across all retail checkouts.',
    powerBiVisual: 'Clustered Bar Chart / KPI Card',
    difficulty: 'Beginner',
  },
  {
    id: 'dax-9',
    name: 'Sales Year to Date (YTD)',
    category: 'Time Intelligence',
    formula: `Sales YTD = 
TOTALYTD ( 
    [Total Sales], 
    Dim_Date[Date] 
)`,
    description: 'Computes cumulative sales from the beginning of the calendar year up to the selected date.',
    powerBiVisual: 'Area Chart Cumulative Timeline',
    difficulty: 'Intermediate',
  },
  {
    id: 'dax-10',
    name: 'Sales Previous Month (MOM)',
    category: 'Time Intelligence',
    formula: `Sales PM = 
CALCULATE ( 
    [Total Sales], 
    DATEADD ( Dim_Date[Date], -1, MONTH ) 
)`,
    description: 'Calculates the sales volume for the corresponding period in the preceding calendar month using time travel.',
    powerBiVisual: 'Line Chart Comparison / KPI Indicator',
    difficulty: 'Intermediate',
  },
  {
    id: 'dax-11',
    name: 'Month-over-Month (MoM) Growth %',
    category: 'Time Intelligence',
    formula: `MoM Growth % = 
VAR CurrentSales = [Total Sales]
VAR PriorSales = [Sales PM]
RETURN
    DIVIDE ( 
        CurrentSales - PriorSales, 
        PriorSales, 
        0 
    )`,
    description: 'Variables (VAR/RETURN) pattern to compute clean growth percentage with conditional trend indicators.',
    powerBiVisual: 'KPI Indicator / Conditional Color Formatting',
    difficulty: 'Intermediate',
  },
  {
    id: 'dax-12',
    name: 'Member vs Normal Revenue Contribution %',
    category: 'Customer & Basket',
    formula: `Member Sales % = 
DIVIDE ( 
    CALCULATE ( [Total Sales], Fact_SupermarketSales[Customer type] = "Member" ), 
    CALCULATE ( [Total Sales], ALL ( Fact_SupermarketSales[Customer type] ) ), 
    0 
)`,
    description: 'Evaluates the loyalty membership penetration rate by overriding the customer type filter context.',
    powerBiVisual: 'Donut Chart / 100% Stacked Bar Chart',
    difficulty: 'Intermediate',
  },
  {
    id: 'dax-13',
    name: 'Branch Performance Rank',
    category: 'Ranking & Pareto',
    formula: `Branch Rank by Sales = 
RANKX ( 
    ALL ( Dim_Branch[Branch] ), 
    [Total Sales], 
    , 
    DESC, 
    DENSE 
)`,
    description: 'Dynamically ranks supermarket retail locations from highest to lowest revenue generator.',
    powerBiVisual: 'Matrix Visual with Top Branch Badges',
    difficulty: 'Advanced',
  },
  {
    id: 'dax-14',
    name: 'Top 3 Product Categories Filter',
    category: 'Ranking & Pareto',
    formula: `Is Top 3 Product Line = 
VAR ProdRank = 
    RANKX ( 
        ALL ( Dim_Product[Product line] ), 
        [Total Sales], 
        , 
        DESC 
    )
RETURN
    IF ( ProdRank <= 3, 1, 0 )`,
    description: 'Boolean flag measure used in visual-level filters to showcase the top 3 best-selling merchandise lines.',
    powerBiVisual: 'Visual-Level Filter Pane (Filter = 1)',
    difficulty: 'Advanced',
  },
  {
    id: 'dax-15',
    name: 'Sales 7-Day Moving Average',
    category: 'Time Intelligence',
    formula: `Sales 7D Moving Avg = 
AVERAGEX ( 
    DATESINPERIOD ( 
        Dim_Date[Date], 
        LASTDATE ( Dim_Date[Date] ), 
        -7, 
        DAY 
    ), 
    [Total Sales] 
)`,
    description: 'Smooths out weekend spikes and weekday troughs to highlight underlying retail demand trajectory.',
    powerBiVisual: 'Line Chart Trend Overlay',
    difficulty: 'Advanced',
  },
  {
    id: 'dax-16',
    name: 'Basket Complexity (Units Per Basket)',
    category: 'Customer & Basket',
    formula: `Units Per Basket = 
DIVIDE ( 
    [Total Units Sold], 
    [Total Transactions], 
    0 
)`,
    description: 'Calculates the average number of inventory units purchased per customer visit.',
    powerBiVisual: 'Summary Card / Correlation Scatterplot',
    difficulty: 'Intermediate',
  },
  {
    id: 'dax-17',
    name: 'What-If Projected Sales with Price Elasticity',
    category: 'Profitability',
    formula: `Projected Sales = 
[Total Sales] * ( 1 + 'Price Adjustment'[Price Adjustment Value] / 100 ) 
    * ( 1 - ('Price Adjustment'[Price Adjustment Value] * 0.4) / 100 )`,
    description: 'Models price elasticity where a price hike increases margin but dampens checkout volume.',
    powerBiVisual: 'What-If Parameter Slicer + Gauge',
    difficulty: 'Advanced',
  },
];
