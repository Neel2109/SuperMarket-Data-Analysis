import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns
import os

def analyze_and_plot():
    csv_file = 'supermarket_sales.csv'
    
    if not os.path.exists(csv_file):
        print(f"Error: {csv_file} not found. Please run generate_data.py first.")
        return

    # Load data
    print(f"Loading data from {csv_file}...")
    df = pd.read_csv(csv_file)

    # Basic data exploration
    print("\n--- Data Overview ---")
    print(df.info())
    print("\n--- Summary Statistics ---")
    print(df.describe())

    # Create output directory for plots
    os.makedirs('plots', exist_ok=True)

    # Set seaborn style
    sns.set_theme(style="whitegrid")

    # 1. Total Sales by Product Line
    plt.figure(figsize=(10, 6))
    sales_by_product = df.groupby('Product line')['Total'].sum().sort_values(ascending=False)
    sns.barplot(x=sales_by_product.values, y=sales_by_product.index, palette="viridis")
    plt.title('Total Sales by Product Line')
    plt.xlabel('Total Sales ($)')
    plt.ylabel('Product Line')
    plt.tight_layout()
    plt.savefig('plots/sales_by_product_line.png')
    plt.close()
    print("Saved plot: plots/sales_by_product_line.png")

    # 2. Sales Distribution by Branch and Gender
    plt.figure(figsize=(8, 6))
    sns.countplot(data=df, x='Branch', hue='Gender', palette="pastel")
    plt.title('Number of Transactions by Branch and Gender')
    plt.ylabel('Count')
    plt.tight_layout()
    plt.savefig('plots/transactions_by_branch_gender.png')
    plt.close()
    print("Saved plot: plots/transactions_by_branch_gender.png")

    # 3. Rating Distribution
    plt.figure(figsize=(8, 6))
    sns.histplot(df['Rating'], bins=10, kde=True, color='skyblue')
    plt.title('Distribution of Customer Ratings')
    plt.xlabel('Rating (1-10)')
    plt.ylabel('Frequency')
    plt.tight_layout()
    plt.savefig('plots/rating_distribution.png')
    plt.close()
    print("Saved plot: plots/rating_distribution.png")

    # 4. Correlation Heatmap for Numerical Values
    plt.figure(figsize=(10, 8))
    numeric_cols = ['Unit price', 'Quantity', 'Tax 5%', 'Total', 'cogs', 'gross income', 'Rating']
    corr_matrix = df[numeric_cols].corr()
    sns.heatmap(corr_matrix, annot=True, cmap="coolwarm", fmt=".2f", linewidths=.5)
    plt.title('Correlation Matrix of Numerical Features')
    plt.tight_layout()
    plt.savefig('plots/correlation_matrix.png')
    plt.close()
    print("Saved plot: plots/correlation_matrix.png")
    
    print("\nData analysis complete. Plots have been saved to the 'plots/' directory.")

if __name__ == "__main__":
    analyze_and_plot()
