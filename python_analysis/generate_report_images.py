"""
Generate all output images from the Supermarket Sales Analysis Dashboard project.
These images will be embedded in the Internship Report.
"""
import pandas as pd
import matplotlib
matplotlib.use('Agg')  # Non-interactive backend
import matplotlib.pyplot as plt
import seaborn as sns
from sklearn.cluster import KMeans
from sklearn.linear_model import LinearRegression
import os

# Ensure output directory exists
os.makedirs('report_images', exist_ok=True)

# Load data
df = pd.read_csv('supermarket_sales.csv')
sns.set_theme(style="whitegrid")

print("Generating report images...")

# 1. Sales by Product Line
plt.figure(figsize=(10, 6))
sales_by_product = df.groupby('Product line')['Total'].sum().sort_values(ascending=False)
sns.barplot(x=sales_by_product.values, y=sales_by_product.index, palette="viridis")
plt.title('Total Sales by Product Line', fontsize=14, fontweight='bold')
plt.xlabel('Total Sales ($)')
plt.ylabel('Product Line')
plt.tight_layout()
plt.savefig('report_images/01_sales_by_product_line.png', dpi=150)
plt.close()
print("  [1/6] Sales by Product Line ✓")

# 2. Transactions by Branch and Gender
plt.figure(figsize=(8, 6))
sns.countplot(data=df, x='Branch', hue='Gender', palette="pastel")
plt.title('Number of Transactions by Branch and Gender', fontsize=14, fontweight='bold')
plt.ylabel('Count')
plt.tight_layout()
plt.savefig('report_images/02_transactions_by_branch_gender.png', dpi=150)
plt.close()
print("  [2/6] Transactions by Branch ✓")

# 3. Rating Distribution
plt.figure(figsize=(8, 6))
sns.histplot(df['Rating'], bins=10, kde=True, color='skyblue')
plt.title('Distribution of Customer Ratings', fontsize=14, fontweight='bold')
plt.xlabel('Rating (1-10)')
plt.ylabel('Frequency')
plt.tight_layout()
plt.savefig('report_images/03_rating_distribution.png', dpi=150)
plt.close()
print("  [3/6] Rating Distribution ✓")

# 4. Correlation Heatmap
plt.figure(figsize=(10, 8))
numeric_cols = ['Unit price', 'Quantity', 'Tax 5%', 'Total', 'cogs', 'gross income', 'Rating']
corr_matrix = df[numeric_cols].corr()
sns.heatmap(corr_matrix, annot=True, cmap="coolwarm", fmt=".2f", linewidths=.5)
plt.title('Correlation Matrix of Numerical Features', fontsize=14, fontweight='bold')
plt.tight_layout()
plt.savefig('report_images/04_correlation_matrix.png', dpi=150)
plt.close()
print("  [4/6] Correlation Matrix ✓")

# 5. Customer Segmentation (K-Means)
X = df[['Unit price', 'Quantity']]
kmeans = KMeans(n_clusters=3, random_state=42, n_init=10)
df['Cluster'] = kmeans.fit_predict(X)
plt.figure(figsize=(8, 6))
sns.scatterplot(data=df, x='Unit price', y='Quantity', hue='Cluster', palette='viridis')
plt.title('Customer Segmentation (K-Means Clustering)', fontsize=14, fontweight='bold')
plt.tight_layout()
plt.savefig('report_images/05_customer_segments.png', dpi=150)
plt.close()
print("  [5/6] Customer Segmentation ✓")

# 6. Total Sales Distribution (for PDF report)
plt.figure(figsize=(10, 6))
sns.histplot(df['Total'], color='navy', kde=True)
plt.title('Supermarket Total Sales Distribution', fontsize=14, fontweight='bold')
plt.xlabel('Total ($)')
plt.ylabel('Frequency')
plt.tight_layout()
plt.savefig('report_images/06_total_sales_distribution.png', dpi=150)
plt.close()
print("  [6/6] Total Sales Distribution ✓")

print(f"\nAll 6 images saved to report_images/ directory!")
print("Files:")
for f in sorted(os.listdir('report_images')):
    print(f"  - report_images/{f}")
