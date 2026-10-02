import pandas as pd
from matplotlib.backends.backend_pdf import PdfPages
import matplotlib.pyplot as plt
import seaborn as sns
import datetime

def create_pdf_report():
    try:
        df = pd.read_csv('supermarket_sales.csv')
    except FileNotFoundError:
        print("Data file not found. Run generate_data.py first.")
        return

    print("Generating PDF Business Report...")
    pdf_filename = 'Supermarket_Business_Report.pdf'
    
    with PdfPages(pdf_filename) as pdf:
        # Title Page / Overall Distribution
        fig = plt.figure(figsize=(10,6))
        sns.histplot(df['Total'], color='navy')
        plt.title(f'Supermarket Total Sales Distribution\nGenerated on {datetime.date.today()}')
        pdf.savefig(fig)
        plt.close(fig)
        
        # Transactions by Branch
        fig = plt.figure(figsize=(10,6))
        sns.countplot(data=df, x='Branch', hue='Gender', palette='Set2')
        plt.title('Transactions by Branch and Gender')
        pdf.savefig(fig)
        plt.close(fig)
        
        # Sales by Product Line
        fig = plt.figure(figsize=(10,8))
        sales_by_product = df.groupby('Product line')['Total'].sum().sort_values(ascending=False)
        sns.barplot(x=sales_by_product.values, y=sales_by_product.index, palette="mako")
        plt.title('Total Revenue by Product Line')
        plt.tight_layout()
        pdf.savefig(fig)
        plt.close(fig)
        
    print(f"Successfully generated {pdf_filename}!")

if __name__ == '__main__':
    create_pdf_report()
