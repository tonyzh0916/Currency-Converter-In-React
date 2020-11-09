import React, {useEffect, useState} from 'react';
import './App.css';
import CurrencyRow from './CurrencyRow';

const BASE_URL = 'https://api.exchangeratesapi.io/latest';

function App() {

  const [currencyOptions, setCurremcyOptions]= useState([]);
  const [fromCurrency, setFromCurrency] = useState();
  const [toCurrency, setToCurrency] = useState();
  const [exchangeRate, setExchangeRate]= useState();
  const [amount, setAmount] = useState(1);
  const [amountInFromCurrency, setAmountInFromCurrency] = useState(true);
  console.log(currencyOptions);
  console.log(exchangeRate);

  let toAmount, fromAmount

  if(amountInFromCurrency){
    fromAmount = amount;
    toAmount = amount * exchangeRate;
  }else{
    toAmount = amount;
    fromAmount = amount / exchangeRate;
  }

  useEffect(()=>{
    fetch(BASE_URL)
      .then(res=>res.json())
      .then(data => {
        const firstCurrency = Object.keys(data.rates)[0];
        setCurremcyOptions([data.base, ...Object.keys(data.rates)]) //need more time to understand around 12:14 min
        setFromCurrency(data.base);
        setToCurrency(firstCurrency);
        setExchangeRate(data.rates[firstCurrency]);
      })
  },[])

  useEffect(()=>{
    if(fromCurrency!=null && toCurrency != null){
      fetch(`${BASE_URL}?base=${fromCurrency}&symbols=${toCurrency}`)
        .then(res => res.json())
        .then(data=>setExchangeRate(data.rates[toCurrency]))
    }

  }, [fromCurrency, toCurrency])

  function handleFromAmountChange(e){
    setAmount(e.target.value);
    setAmountInFromCurrency(true);
  }

  function handleToAmountChange(e){
    setAmount(e.target.value);
    setAmountInFromCurrency(false);
  }

  return (
    <div>
      <h1>Convert</h1>
      <CurrencyRow 
        currencyOptions={currencyOptions}
        selectCurrency={fromCurrency}
        onChangeCurrency={e=>setFromCurrency(e.target.value)}
        amount = {fromAmount}
        onChangeAmount={handleFromAmountChange}
        />
      <div className='equals'>=</div>
      <CurrencyRow 
        currencyOptions={currencyOptions}
        selectCurrency={toCurrency}
        onChangeCurrency={e=>setToCurrency(e.target.value)}
        amount = {toAmount}
        onChangeAmount={handleToAmountChange}
        />
    </div>

  );
}

export default App;
