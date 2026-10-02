import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns
import os

def analyze_export_modal():
    csv_file = 'supermarket_sales.csv'
    
    # Check if run from python_analysis dir or root
    if not os.path.exists(csv_file):
        csv_file = '../python_analysis/supermarket_sales.csv'
        if not os.path.exists(csv_file):
            print("Error: supermarket_sales.csv not found.")
            return

    print("Loading data for ExportModal analysis...")
    df = pd.read_csv(csv_file)

    print("\n--- ExportModal Data Summary ---")
    # Generic summary for this component
    print(df.describe(include='all').head())

    # Create plot directory
    os.makedirs('plots', exist_ok=True)

    # Generate a plot based on the component name
    plt.figure(figsize=(10, 6))
    sns.set_theme(style="whitegrid")
    
    # Using 'Total' as a generic metric for the plot
    sns.histplot(data=df, x='Total', kde=True, color='teal')
    plt.title('ExportModal - Total Sales Distribution')
    plt.xlabel('Total ($)')
    plt.ylabel('Frequency')
    
    plot_path = 'plots/export_modal_analysis.png'
    plt.tight_layout()
    plt.savefig(plot_path)
    plt.close()
    
    print(f"Saved ExportModal analysis plot to {plot_path}")

if __name__ == "__main__":
    analyze_export_modal()
