from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
import numpy as np
from statsmodels.tsa.arima.model import ARIMA

app = Flask(__name__)
CORS(app)

# Load dataset
df = pd.read_csv("south_india_commodities_2020_2025.csv")
df['Arrival_Date'] = pd.to_datetime(df['Arrival_Date'])


def predict_price(state, district, market, commodity, period):

    try:
        # 1️⃣ Filter Data
        filtered = df[
            (df['State'] == state) &
            (df['District'] == district) &
            (df['Market'] == market) &
            (df['Commodity'] == commodity)
        ].copy()

        if len(filtered) < 30:
            return {"error": "Not enough historical data for prediction."}

        # 2️⃣ Sort data
        filtered = filtered.sort_values('Arrival_Date')

        # 3️⃣ Prepare for ARIMA
        data = filtered[['Arrival_Date', 'Modal_Price']]
        data = data.set_index('Arrival_Date')

        # 4️⃣ Train ARIMA model
        model = ARIMA(data, order=(5, 1, 0))
        model_fit = model.fit()

        # 5️⃣ Predict future
        forecast = model_fit.forecast(steps=period)

        predicted_prices = forecast.values

        # 6️⃣ Generate future dates (from today)
        today = pd.Timestamp.today().normalize()
        future_dates = pd.date_range(
            start=today,
            periods=period,
            freq='D'
        ).strftime('%Y-%m-%d')

        # 7️⃣ Convert to per kg (from quintal)
        predicted_prices = predicted_prices / 100

        # 8️⃣ Current price = last known price
        current_price = data['Modal_Price'].iloc[-1] / 100
        future_price = predicted_prices[-1]

        # 9️⃣ Calculate surge %
        surge_percent = ((future_price - current_price) / current_price) * 100

        # 🔟 Trend logic
        if surge_percent > 15:
            trend = "High Increase"
            recommendation = "Buy Early"
        elif surge_percent > 5:
            trend = "Moderate Increase"
            recommendation = "Buy Soon"
        elif surge_percent < -10:
            trend = "Price Drop"
            recommendation = "Wait to Buy"
        else:
            trend = "Stable"
            recommendation = "Safe to Buy"

        # 1️⃣1️⃣ Explanation
        explanation = (
            f"Predicted price of {commodity} in {market} today "
            f"is ₹{round(current_price,2)} per kg. "
            f"It is expected to change to ₹{round(future_price,2)} per kg "
            f"in the next {period} days. "
            f"Trend: {trend} ({round(surge_percent,2)}%). "
            f"Recommendation: {recommendation}."
        )

        # 1️⃣2️⃣ Return response
        return {
            "current_price": float(round(current_price, 2)),
            "future_price": float(round(future_price, 2)),
            "surge_percent": float(round(surge_percent, 2)),
            "trend": trend,
            "recommendation": recommendation,
            "future_dates": list(future_dates),
            "predicted_prices": [float(p) for p in predicted_prices],
            "explanation": explanation
        }

    except Exception as e:
        return {"error": "Prediction failed for this combination."}


# 🔮 Predict API
@app.route("/predict", methods=["POST"])
def predict():
    data = request.json

    result = predict_price(
        state=data["state"],
        district=data["district"],
        market=data["market"],
        commodity=data["commodity"],
        period=int(data["period"])
    )

    return jsonify(result)


# 📍 Dropdown APIs
@app.route("/states")
def get_states():
    return jsonify(sorted(df['State'].unique().tolist()))


@app.route("/districts/<state>")
def get_districts(state):
    districts = df[df['State'] == state]['District'].unique()
    return jsonify(sorted(districts.tolist()))


@app.route("/markets/<state>/<district>")
def get_markets(state, district):
    markets = df[
        (df['State'] == state) &
        (df['District'] == district)
    ]['Market'].unique()
    return jsonify(sorted(markets.tolist()))


@app.route("/commodities/<state>/<district>/<market>")
def get_commodities(state, district, market):
    commodities = df[
        (df['State'] == state) &
        (df['District'] == district) &
        (df['Market'] == market)
    ]['Commodity'].unique()
    return jsonify(sorted(commodities.tolist()))


if __name__ == "__main__":
    app.run(debug=True)