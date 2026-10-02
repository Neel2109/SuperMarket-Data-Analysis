from fastapi import FastAPI
import pandas as pd

app = FastAPI(title="Supermarket Data API")

@app.get("/")
def read_root():
    return {"message": "Welcome to the Supermarket Data API. Access /docs for the interactive Swagger UI."}

@app.get("/sales")
def get_sales(limit: int = 100):
    try:
        df = pd.read_csv('supermarket_sales.csv')
        return df.head(limit).to_dict(orient='records')
    except FileNotFoundError:
        return {"error": "Data file not found. Run generate_data.py first."}

@app.get("/summary")
def get_summary():
    try:
        df = pd.read_csv('supermarket_sales.csv')
        return {
            "total_sales": float(df['Total'].sum()),
            "total_transactions": len(df),
            "average_rating": float(df['Rating'].mean())
        }
    except FileNotFoundError:
         return {"error": "Data file not found."}

if __name__ == "__main__":
    import uvicorn
    # To run this API locally: python api.py
    uvicorn.run(app, host="127.0.0.1", port=8000)
