import pandas as pd
from sklearn.cluster import KMeans
from sklearn.linear_model import LinearRegression
import matplotlib.pyplot as plt
import seaborn as sns
import os

def run_ml_pipeline():
    try:
        df = pd.read_csv('supermarket_sales.csv')
    except FileNotFoundError:
        print("Data file not found. Run generate_data.py first.")
        return

    print("Starting Machine Learning Pipeline...")
    os.makedirs('plots/ml', exist_ok=True)
    
    # 1. Customer Segmentation (Clustering)
    print("1. Training K-Means Clustering Model for Customer Segmentation...")
    X = df[['Unit price', 'Quantity']]
    kmeans = KMeans(n_clusters=3, random_state=42, n_init=10)
    df['Cluster'] = kmeans.fit_predict(X)
    
    plt.figure(figsize=(8,6))
    sns.scatterplot(data=df, x='Unit price', y='Quantity', hue='Cluster', palette='viridis')
    plt.title('Customer Segmentation (K-Means Clustering)')
    plt.savefig('plots/ml/customer_segments.png')
    plt.close()
    
    # 2. Linear Regression (Predicting Total based on Tax and cogs)
    print("2. Training Linear Regression Model...")
    X_reg = df[['cogs', 'Tax 5%']]
    y_reg = df['Total']
    model = LinearRegression()
    model.fit(X_reg, y_reg)
    
    print(f"ML Pipeline completed successfully.")
    print(f"Regression Model R^2 Score: {model.score(X_reg, y_reg):.4f}")
    print("Plots saved in plots/ml/")

if __name__ == '__main__':
    run_ml_pipeline()
