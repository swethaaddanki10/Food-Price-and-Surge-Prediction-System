import { useNavigate } from "react-router-dom";

function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-600 text-white">

      {/* Hero Section */}
      <div className="flex flex-col items-center justify-center text-center px-6 py-20">

        <h1 className="text-5xl font-extrabold mb-6">
          🌾Food Price Forecasting
        </h1>

        <p className="text-xl max-w-3xl mb-8 leading-relaxed">
          Know tomorrow’s market prices today.  
          This system predicts future commodity prices, detects sudden price
          increases (surges), and gives smart buying recommendations.
        </p>

        <button
          onClick={() => navigate("/dashboard")}
          className="bg-white text-purple-700 px-8 py-4 rounded-full text-lg font-bold shadow-lg hover:scale-110 transition transform"
        >
          🚀 Get Started
        </button>

      </div>

      {/* Explanation Section */}
      <div className="bg-white text-gray-800 py-16 px-8 rounded-t-3xl shadow-2xl">

        <h2 className="text-3xl font-bold text-center mb-12">
          🔍 Understanding the System
        </h2>

        <div className="grid md:grid-cols-3 gap-8 text-center">

          {/* Forecast Explanation */}
          <div className="p-6 bg-indigo-100 rounded-xl shadow">
            <h3 className="text-xl font-semibold mb-4">📈 What is Forecast?</h3>
            <p>
              Forecast means predicting future prices based on past data.
              Using historical market trends, the system estimates how much
              a commodity may cost in the next 7 or 30 days.
            </p>
          </div>

          {/* Surge Explanation */}
          <div className="p-6 bg-pink-100 rounded-xl shadow">
            <h3 className="text-xl font-semibold mb-4">⚠️ What is Price Surge?</h3>
            <p>
              A surge means a sudden increase in price.
              If the system detects a significant rise (for example +15%),
              it alerts users to buy early before prices go higher.
            </p>
          </div>

          {/* Trend Explanation */}
          <div className="p-6 bg-purple-100 rounded-xl shadow">
            <h3 className="text-xl font-semibold mb-4">📊 What is Trend?</h3>
            <p>
              Trend shows whether the price is expected to increase,
              decrease, or remain stable. This helps users decide whether
              to buy now or wait.
            </p>
          </div>

        </div>

        {/* Why It Helps Section */}
        <div className="mt-16 text-center max-w-3xl mx-auto">
          <h3 className="text-2xl font-bold mb-4">💡 Why This Is Useful?</h3>
          <p>
            Farmers, traders, and consumers can plan their purchases better.
            By knowing future price trends, users can avoid unexpected
            inflation spikes and make informed financial decisions.
          </p>
        </div>

        {/* Tech Section */}
        <div className="mt-12 text-center max-w-3xl mx-auto">
          <h3 className="text-2xl font-bold mb-4">🧠 Powered by AI</h3>
          <p>
            Built using React, Flask, and ARIMA.
            The system dynamically trains forecasting models
            to generate real-time price predictions for each market.
          </p>
        </div>

      </div>

    </div>
  );
}

export default LandingPage;