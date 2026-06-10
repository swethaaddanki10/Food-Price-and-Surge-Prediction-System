# 🌾 Food Price Forecasting & Surge Prediction System

## 📌 Overview

The Food Price Forecasting & Surge Prediction System is a full-stack web application that predicts future agricultural commodity prices using the ARIMA time-series forecasting model. The system analyzes historical market price data and provides short-term price forecasts, trend analysis, surge detection, and smart buying recommendations to help users make informed decisions.

## 🚀 Features

- 📈 Agricultural price forecasting using ARIMA
- 📅 7-day and 30-day future price prediction
- ⚠️ Price surge detection and trend analysis
- 💡 Smart recommendations (Buy Early, Buy Soon, Wait to Buy, Safe to Buy)
- 🌍 Dynamic filtering by State, District, Market, and Commodity
- 📊 Interactive dashboard with visual price trends

## 🛠️ Tech Stack

### Frontend
- React.js

### Backend
- Flask
- Python

### Data Analysis & Forecasting
- ARIMA (AutoRegressive Integrated Moving Average)
- Pandas
- NumPy

### Visualization
- Recharts

## 📂 Dataset

The project uses historical agricultural commodity price data containing:

- State
- District
- Market
- Commodity
- Arrival Date
- Minimum Price
- Maximum Price
- Modal Price

The dataset is preprocessed and converted into time-series format before forecasting.

## ⚙️ System Workflow

1. **User selects:**
   - State
   - District
   - Market
   - Commodity
   - Forecast Period (7/30 Days)

2. Backend filters relevant historical data
3. Data is cleaned and converted into time-series format
4. ARIMA model generates future price forecasts
5. System calculates surge percentage and trend
6. Recommendation is generated based on forecasted trend
7. Results are displayed through an interactive dashboard

## 📊 Output

The dashboard displays:

- Current Price
- Future Predicted Price
- Surge Percentage
- Trend Classification
- Smart Recommendation
- Forecast Graph

## ▶️ Running the Project

### Backend

```bash
cd backend
venv\Scripts\activate
python app.py
