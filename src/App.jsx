import axios from "axios"
import { Fragment, useEffect, useState, useCallback } from "react"
import { FaExchangeAlt } from 'react-icons/fa'; // Importing an icon for the swap button

function App() {
  const [rates, setRates] = useState({})
  const [cur1, setCur1] = useState("USD"); // Changed default to USD for cur1
  const [cur2, setCur2] = useState("PKR"); // Changed default to PKR for cur2
  const [SelectCurrency, setSelectCurrency] = useState(""); // Changed to string for input
  const [converted, setConverted] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  // --- Fetch Data Effect ---
  useEffect(() => {
    async function fetchData() {
      try {
        const response = await axios.get("https://open.er-api.com/v6/latest/USD")
        setRates(response.data.rates);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching currency rates:", error);
        setIsLoading(false);
      }
    }
    fetchData();
  }, [])

  // --- Conversion Logic ---
  const ConvertCurrency = useCallback(() => {
    const amount = parseFloat(SelectCurrency);
    if (isNaN(amount) || amount <= 0 || !rates[cur1] || !rates[cur2]) {
      setConverted(0);
      return;
    }
    // Formula: (Amount / Rate_of_Cur1) * Rate_of_Cur2
    let convert = (amount / rates[cur1]) * rates[cur2]
    setConverted(convert.toFixed(4)); // Displaying up to 4 decimal places
  }, [SelectCurrency, rates, cur1, cur2]);

  // --- Auto-Convert on dependency change ---
  useEffect(() => {
    // Only auto-convert if there's a valid amount entered
    if (parseFloat(SelectCurrency) > 0) {
      ConvertCurrency();
    }
  }, [cur1, cur2, SelectCurrency, ConvertCurrency]);

  // --- Swap Currencies Function ---
  const swapCurrencies = () => {
    setCur1(cur2);
    setCur2(cur1);
    // The useEffect above will handle re-conversion automatically
  };

  // --- Handle Input Change ---
  const handleInputChange = (e) => {
    // Only allow numbers and an optional single decimal point
    const value = e.target.value;
    if (value === "" || /^\d*\.?\d*$/.test(value)) {
      setSelectCurrency(value);
    }
  };

  if (isLoading) {
    return (
      <div className="w-screen h-screen flex justify-center items-center bg-gray-50">
        <p className="text-xl text-gray-700">Loading currency rates...</p>
      </div>
    );
  }
  
  // Create an array of currency codes for mapping
  const currencyOptions = Object.keys(rates);

  return (
    <Fragment>
      <div className="min-h-screen bg-gray-100 flex justify-center items-center p-4">
        <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-lg transition-all duration-300 hover:shadow-3xl">
          <header className="mb-8 text-center">
            <h1 className="text-4xl font-extrabold text-indigo-700">Currency Converter</h1>
            <p className="text-md text-gray-500 mt-2">Get up-to-date foreign exchange rates.</p>
          </header>

          {/* --- Conversion Area --- */}
          <div className="space-y-6">
            
            {/* --- Currency Selection Row --- */}
            <div className="flex items-center justify-between space-x-3">
              <div className="flex-1">
                <label htmlFor="fromCurrency" className="block text-sm font-medium text-gray-700 mb-1">From</label>
                <select 
                  id="fromCurrency"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 ease-in-out bg-white appearance-none text-lg font-semibold"
                  value={cur1}
                  onChange={(e) => setCur1(e.target.value)}
                >
                  {
                    currencyOptions.map((item, i) => (
                      <option key={i} value={item}>{item}</option>
                    ))
                  }
                </select>
              </div>

              {/* --- Swap Button --- */}
              <button 
                onClick={swapCurrencies}
                className="mt-6 p-3 bg-indigo-500 text-white rounded-full shadow-lg hover:bg-indigo-600 focus:outline-none focus:ring-4 focus:ring-indigo-300 transition duration-150 ease-in-out transform hover:scale-105"
                aria-label="Swap Currencies"
              >
                <FaExchangeAlt className="w-5 h-5" />
              </button>

              <div className="flex-1">
                <label htmlFor="toCurrency" className="block text-sm font-medium text-gray-700 mb-1">To</label>
                <select 
                  id="toCurrency"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 ease-in-out bg-white appearance-none text-lg font-semibold"
                  value={cur2}
                  onChange={(e) => setCur2(e.target.value)}
                >
                  {
                    currencyOptions.map((item, i) => (
                      <option key={i} value={item}>{item}</option>
                    ))
                  }
                </select>
              </div>
            </div>

            {/* --- Input/Output Row --- */}
            <div className="flex justify-between items-center space-x-4 pt-4">
              <div className="flex-1">
                <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-1">Amount ({cur1})</label>
                <input 
                  id="amount"
                  type="text" 
                  placeholder="Enter amount"
                  className="w-full p-3 border border-gray-300 rounded-lg text-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 ease-in-out"
                  value={SelectCurrency}
                  onChange={handleInputChange}
                />
              </div>
              <div className="flex-1">
                <label htmlFor="convertedAmount" className="block text-sm font-medium text-gray-700 mb-1">Converted Amount ({cur2})</label>
                <input 
                  id="convertedAmount"
                  type="text" 
                  value={converted} 
                  className="w-full p-3 border border-gray-300 rounded-lg text-lg font-bold text-green-700 bg-green-50/50 cursor-not-allowed" 
                  disabled 
                  readOnly 
                />
              </div>
            </div>
            
            {/* --- Conversion Button --- */}
            <button 
              className="w-full px-6 py-3 mt-4 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-300 transition duration-150 ease-in-out text-lg"
              onClick={ConvertCurrency}
            >
              Convert Now
            </button>
          </div>
        </div>
      </div>
    </Fragment>
  )
}

export default App