import streamlit as st
import pandas as pd
import seaborn as sns
import matplotlib.pyplot as plt
import os

st.set_page_config(page_title="Supermarket Dashboard", layout="wide")
st.title("📊 Supermarket Interactive Dashboard")

@st.cache_data
def load_data():
    if os.path.exists('supermarket_sales.csv'):
        return pd.read_csv('supermarket_sales.csv')
    else:
        st.error("Data file not found. Run generate_data.py first.")
        return pd.DataFrame()

df = load_data()

if not df.empty:
    # Top KPI metrics
    col1, col2, col3 = st.columns(3)
    col1.metric("Total Revenue", f"${df['Total'].sum():,.2f}")
    col2.metric("Total Transactions", f"{len(df):,}")
    col3.metric("Average Rating", f"{df['Rating'].mean():.2f}/10")

    st.markdown("---")
    
    # Interactive Data filtering
    st.sidebar.header("Filters")
    selected_branch = st.sidebar.multiselect("Select Branch", options=df['Branch'].unique(), default=df['Branch'].unique())
    filtered_df = df[df['Branch'].isin(selected_branch)]

    col_chart1, col_chart2 = st.columns(2)
    
    with col_chart1:
        st.subheader("Revenue by Product Line")
        fig, ax = plt.subplots(figsize=(6,4))
        sns.barplot(data=filtered_df, y='Product line', x='Total', estimator=sum, errorbar=None, palette="viridis", ax=ax)
        st.pyplot(fig)
        
    with col_chart2:
        st.subheader("Customer Type Distribution")
        fig2, ax2 = plt.subplots(figsize=(6,4))
        sns.countplot(data=filtered_df, x='Customer type', hue='Gender', palette="pastel", ax=ax2)
        st.pyplot(fig2)

    st.markdown("---")
    st.subheader("Raw Data Preview")
    st.dataframe(filtered_df.head(50))
