import axios from "axios"
import { Fragment, useEffect, useState, useCallback } from "react"
import { FaExchangeAlt, FaBolt, FaArrowRight, FaSpinner, FaRocket } from 'react-icons/fa'; // Updated icons

function CurrencyConverterUI() {
  const [rates, setRates] = useState({})
  const [cur1, setCur1] = useState("USD");
  const [cur2, setCur2] = useState("PKR");
  const [amount, setAmount] = useState("1.00");
  const [converted, setConverted] = useState("0.00");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // --- Fetch Data Effect ---
  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      setError(null);
      try {
        const response = await axios.get("https://open.er-api.com/v6/latest/USD")
        
        if (response.data && response.data.rates) {
          setRates(response.data.rates);
        } else {
           throw new Error("Invalid data structure from API");
        }
      } catch (err) {
        console.error("Error fetching currency rates:", err);
        setError("Failed to fetch current rates. Please check your network.");
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, [])

  // --- Conversion Logic ---
  // The core function remains the same, calculating the conversion
  const convertCurrency = useCallback((inputAmount) => {
    const amountFloat = parseFloat(inputAmount);

    if (isNaN(amountFloat) || amountFloat <= 0 || !rates[cur1] || !rates[cur2]) {
      setConverted("0.00");
      return;
    }
    
    const rateCur1 = rates[cur1];
    const rateCur2 = rates[cur2];

    if (rateCur1 && rateCur2) {
      const conversionResult = (amountFloat / rateCur1) * rateCur2
      setConverted(conversionResult.toFixed(2)); 
    } else {
      setConverted("N/A");
    }
  }, [rates, cur1, cur2]);

  // --- Auto-Convert on dependency change (100% Automatic) ---
  useEffect(() => {
    // This hook ensures conversion happens automatically whenever cur1, cur2, or amount changes
    if (Object.keys(rates).length > 0 && parseFloat(amount) > 0) {
      convertCurrency(amount);
    }
  }, [cur1, cur2, amount, rates, convertCurrency]);

  // --- Swap Currencies Function ---
  const swapCurrencies = () => {
    setCur1(cur2);
    setCur2(cur1);
    // Auto-conversion will trigger after state update
  };

  // --- Handle Input Change ---
  const handleAmountChange = (e) => {
    const value = e.target.value;
    if (value === "" || /^\d*\.?\d*$/.test(value)) {
      setAmount(value);
      // Auto-conversion will trigger after state update
    }
  };

  // --- Loading/Error State UI ---
  if (isLoading) {
    return (
      <div className="h-screen flex justify-center items-center bg-gray-900">
        <FaSpinner className="animate-spin text-5xl text-lime-400 mr-3" />
        <p className="text-2xl text-gray-200 font-semibold">Initiating Conversion...</p>
      </div>
    );
  }

  if (error) {
     return (
      <div className="h-screen flex justify-center items-center bg-gray-900 p-4">
        <div className="bg-gray-800 p-8 rounded-xl shadow-lg border border-red-600">
          <p className="text-xl text-red-500 font-medium">🚨 Connection Error</p>
          <p className="text-md text-gray-400 mt-2">{error}</p>
        </div>
      </div>
    );
  }
  
  const currencyOptions = Object.keys(rates).sort();

  return (
    <Fragment>
      {/* Deep Space Theme Background - Fixed height */}
      <div className="h-screen bg-gradient-to-br from-gray-900 to-indigo-900 flex justify-center items-center p-4 overflow-hidden">
        {/* Main Card - Futuristic / Dark Sleek Design */}
        <div className="bg-gray-900/90 p-8 rounded-3xl shadow-2xl shadow-indigo-500/50 w-full max-w-md transition-all duration-300 border border-indigo-700">
          
          {/* Header */}
          <header className="mb-8 text-center border-b pb-4 border-indigo-800">
            <FaRocket className="w-10 h-10 text-lime-400 mx-auto mb-2 animate-bounce" />
            <h1 className="text-4xl font-extrabold text-white">
              Instant FX
            </h1>
            <p className="text-md text-indigo-400 mt-1">
              Live Rates, Zero Clicks
            </p>
          </header>

          {/* Conversion Area */}
          <div className="space-y-6">
            
            {/* --- Input Field --- */}
            <div>
              <label htmlFor="amount" className="block text-sm font-medium text-indigo-300 mb-2">
                Amount ({cur1})
              </label>
              <div className="relative">
                 <FaBolt className="absolute left-3 top-1/2 transform -translate-y-1/2 text-lime-400 w-5 h-5" />
                 <input 
                    id="amount"
                    type="text" 
                    placeholder="0.00"
                    className="w-full pl-10 pr-4 py-3 border-2 border-indigo-500 rounded-xl text-3xl font-bold text-lime-400 bg-gray-800 focus:ring-4 focus:ring-lime-500/50 focus:border-lime-400 transition"
                    value={amount}
                    onChange={handleAmountChange}
                 />
              </div>
            </div>

            {/* --- Currency Selection Row --- */}
            <div className="flex items-center justify-between space-x-3">
              
              {/* FROM Currency Select */}
              <div className="flex-1">
                <label htmlFor="fromCurrency" className="block text-sm font-medium text-indigo-300 mb-1">
                  From
                </label>
                <select 
                  id="fromCurrency"
                  className="w-full p-3 border-2 border-indigo-600 rounded-lg bg-gray-800 text-white text-lg font-semibold focus:ring-2 focus:ring-lime-400 transition cursor-pointer"
                  value={cur1}
                  onChange={(e) => setCur1(e.target.value)}
                >
                  {
                    currencyOptions.map((item) => (
                      <option key={item} value={item} className="bg-gray-800">{item}</option>
                    ))
                  }
                </select>
              </div>

              {/* Swap Button */}
              <button 
                onClick={swapCurrencies}
                className="mt-6 p-3 bg-indigo-600 text-lime-400 rounded-full shadow-lg hover:bg-indigo-500 focus:outline-none focus:ring-4 focus:ring-lime-400 transition duration-200 transform hover:rotate-12 active:scale-90"
                aria-label="Swap Currencies"
              >
                <FaExchangeAlt className="w-6 h-6" />
              </button>

              {/* TO Currency Select */}
              <div className="flex-1">
                <label htmlFor="toCurrency" className="block text-sm font-medium text-indigo-300 mb-1">
                  To
                </label>
                <select 
                  id="toCurrency"
                  className="w-full p-3 border-2 border-indigo-600 rounded-lg bg-gray-800 text-white text-lg font-semibold focus:ring-2 focus:ring-lime-400 transition cursor-pointer"
                  value={cur2}
                  onChange={(e) => setCur2(e.target.value)}
                >
                  {
                    currencyOptions.map((item) => (
                      <option key={item} value={item} className="bg-gray-800">{item}</option>
                    ))
                  }
                </select>
              </div>
            </div>
            
            {/* --- Output Result --- */}
            <div className="bg-gray-800 p-5 rounded-xl border-2 border-lime-500 shadow-xl shadow-lime-500/30">
              <label htmlFor="convertedAmount" className="flex items-center text-md font-semibold text-lime-400 mb-2">
                <FaArrowRight className="mr-2" /> Converted Result
              </label>
              <p 
                id="convertedAmount"
                className="text-4xl font-extrabold text-lime-300 truncate"
              >
                {converted} <span className="text-2xl text-indigo-400 ml-1">{cur2}</span>
              </p>
            </div>
            
          </div>
        </div>
      </div>
    </Fragment>
  )
}

export default CurrencyConverterUI