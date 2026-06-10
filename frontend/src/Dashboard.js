import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

function Dashboard() {
  const [states, setStates] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [markets, setMarkets] = useState([]);
  const [commodities, setCommodities] = useState([]);

  const [selection, setSelection] = useState({
    state: "",
    district: "",
    market: "",
    commodity: "",
    period: 7,
  });

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    axios.get("http://127.0.0.1:5000/states")
      .then(res => setStates(res.data));
  }, []);

  const handleChange = async (e) => {
    const { name, value } = e.target;
    setSelection({ ...selection, [name]: value });

    if (name === "state") {
      const res = await axios.get(`http://127.0.0.1:5000/districts/${value}`);
      setDistricts(res.data);
      setMarkets([]);
      setCommodities([]);
    }

    if (name === "district") {
      const res = await axios.get(`http://127.0.0.1:5000/markets/${selection.state}/${value}`);
      setMarkets(res.data);
      setCommodities([]);
    }

    if (name === "market") {
      const res = await axios.get(`http://127.0.0.1:5000/commodities/${selection.state}/${selection.district}/${value}`);
      setCommodities(res.data);
    }
  };

  const handlePredict = async () => {
    // 🔒 Validation
  if (!selection.state || !selection.district || !selection.market || !selection.commodity) {
    alert("Please complete all selections.");
    return;
  }
  try {
    setLoading(true);
    const res = await axios.post("http://127.0.0.1:5000/predict", selection);

    if (res.data.error) {
      alert(res.data.error);
      setResult(null);
    } else {
      setResult(res.data);
    }

  } catch (error) {
    alert("Prediction failed. Please try again.");
  } finally {
    setLoading(false);
  }
};

  const chartData = result && result.future_dates
  ? result.future_dates.map((date, index) => ({
      date,
      price: result.predicted_prices[index],
    }))
  : [];

  const trendColor =
    result?.trend === "High Increase" ? "bg-red-500" :
    result?.trend === "Moderate Increase" ? "bg-yellow-500" :
    result?.trend === "Price Drop" ? "bg-blue-500" :
    "bg-green-500";

  return (
    <div className="min-h-screen bg-gradient-to-r from-indigo-500 to-purple-600 p-6">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-6xl mx-auto">

        <h1 className="text-4xl font-bold text-center mb-8 text-indigo-700">
          📈 Price Forecast Dashboard
        </h1>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
          <select name="state" onChange={handleChange} className="p-3 border rounded-lg">
            <option>Select State</option>
            {states.map(s => <option key={s}>{s}</option>)}
          </select>

          <select name="district" onChange={handleChange} className="p-3 border rounded-lg">
            <option>Select District</option>
            {districts.map(d => <option key={d}>{d}</option>)}
          </select>

          <select name="market" onChange={handleChange} className="p-3 border rounded-lg">
            <option>Select Market</option>
            {markets.map(m => <option key={m}>{m}</option>)}
          </select>

          <select name="commodity" onChange={handleChange} className="p-3 border rounded-lg">
            <option>Select Commodity</option>
            {commodities.map(c => <option key={c}>{c}</option>)}
          </select>

          <select name="period" onChange={handleChange} className="p-3 border rounded-lg">
            <option value={7}>Next 7 Days</option>
            <option value={30}>Next 30 Days</option>
          </select>

          <button
            onClick={handlePredict}
            className="bg-indigo-600 text-white rounded-lg p-3 hover:bg-indigo-700 transition"
          >
            {loading ? "Predicting..." : "🔮 Predict Price"}
          </button>
        </div>

        {result && (
          <>
            {/* Metric Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
              <div className="bg-indigo-100 p-4 rounded-xl shadow text-center">
                <p className="text-sm text-gray-600">Current Price</p>
                <p className="text-xl font-bold">₹{result.current_price}</p>
              </div>

              <div className="bg-purple-100 p-4 rounded-xl shadow text-center">
                <p className="text-sm text-gray-600">Future Price</p>
                <p className="text-xl font-bold">₹{result.future_price}</p>
              </div>

              <div className="bg-yellow-100 p-4 rounded-xl shadow text-center">
                <p className="text-sm text-gray-600">Surge %</p>
                <p className="text-xl font-bold">{result.surge_percent}%</p>
              </div>

              <div className={`${trendColor} text-white p-4 rounded-xl shadow text-center`}>
                <p className="text-sm">Trend</p>
                <p className="text-xl font-bold">{result.trend}</p>
              </div>
            </div>

            {/* Explanation */}
            <div className="bg-gray-100 p-6 rounded-xl mb-8">

  <p className="text-lg mb-4">
    {result.explanation}
  </p>

  {/* Highlighted Recommendation */}
  <div className="mt-4 text-center">
    <span
      className={`px-6 py-3 rounded-full text-white font-semibold text-lg shadow
        ${result.recommendation === "Buy Early" ? "bg-red-600" :
          result.recommendation === "Buy Soon" ? "bg-yellow-500" :
          result.recommendation === "Wait to Buy" ? "bg-blue-600" :
          "bg-green-600"}
      `}
    >
      💡 Recommendation: {result.recommendation}
    </span>
  </div>

</div>

            {/* Chart */}
            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="price" stroke="#4f46e5" strokeWidth={3} />
              </LineChart>
            </ResponsiveContainer>
          </>
        )}

        <div className="text-center mt-10 text-gray-500 text-sm">
          Built with React + Flask + ARIMA 🚀
        </div>
      </div>
    </div>
  );
}

export default Dashboard;