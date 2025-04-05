import { useState, useEffect } from "react";
import CurrencySelect from "./ConverterSelect";

const ConverterForm = () => {
    const [amount, setAmount] = useState(0);
    const [fromCurrency, setFromCurrency] = useState("USD");
    const [toCurrency, setToCurrency] = useState("BRL");
    const [result, setResult] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleSwapCurrencies = () => {
        setFromCurrency(toCurrency);
        setToCurrency(fromCurrency);
    }

    const getExchangeRate = async () => {
        const API_KEY = "e0aa154f0bee4f48b283232c5e19557f";
        const API_URL = `https://openexchangerates.org/api/latest.json?app_id=${API_KEY}`;
    
        if (isLoading) return;
        setIsLoading(true);
    
        try {
            const response = await fetch(API_URL);
            if (!response.ok) throw Error("Algo deu errado");
    
            const data = await response.json();
    
            // Taxas de câmbio em relação ao USD
            const rates = data.rates;
    
            let rate;
            if (fromCurrency === "USD") {
                // Se a moeda de origem for USD, podemos pegar a taxa diretamente
                rate = rates[toCurrency];
            } else {
                // Caso contrário, precisamos converter via USD
                const fromRate = rates[fromCurrency];
                const toRate = rates[toCurrency];
    
                if (!fromRate || !toRate) {
                    throw Error("Moeda não suportada");
                }
    
                rate = toRate / fromRate; // Conversão indireta via USD
            }
    
            const convertedAmount = (rate * amount).toFixed(2);
            setResult(`${amount} ${fromCurrency} = ${convertedAmount} ${toCurrency}`);
        } catch (error) {
            setResult("Erro ao obter a taxa de câmbio");
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleFormSubmit = (e) => {
        e.preventDefault();
        getExchangeRate();
    }

    useEffect(() => {
        console.log("Buscando taxa de câmbio...");
        getExchangeRate();
    }, []);
    
    

    return (
        <form className="converter-form" onSubmit={handleFormSubmit}>
            <div className="form-group">
                <label className="form-label">Insira o Valor</label>
                <input
                    type="number"
                    className="form-input"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    required
                />
            </div>

            <div className="form-group form-currenct-group">
                <div className="form-section">
                    <label className="form-label">De:</label>
                    <CurrencySelect
                        selectedCurrency={fromCurrency}
                        handleCurrency={(e) => setFromCurrency(e.target.value)}
                    />
                </div>

                <div className="swap-icon" onClick={handleSwapCurrencies}>
                    <svg width="16" viewBox="0 0 20 19" xmlns="http://www.w3.org/2000/svg">
                        <path d="M19.13 11.66H.22a.22.22 0 0 0-.22.22v1.62a.22.22 0 0 0 .22.22h16.45l-3.92 4.94a.22.22 0 0 0 .17.35h1.97c.13 0 .25-.06.33-.16l4.59-5.78a.9.9 0 0 0-.7-1.43zM19.78 5.29H3.34L7.26.35A.22.22 0 0 0 7.09 0H5.12a.22.22 0 0 0-.34.16L.19 5.94a.9.9 0 0 0 .68 1.4H19.78a.22.22 0 0 0 .22-.22V5.51a.22.22 0 0 0-.22-.22z"
                            fill="#fff" />
                    </svg>
                </div>

                <div className="form-section">
                    <label className="form-label">Para:</label>
                    <CurrencySelect
                        selectedCurrency={toCurrency}
                        handleCurrency={(e) => setToCurrency(e.target.value)}
                    />
                </div>
            </div>

            <button type="submit" className={`${isLoading ? "loading" : ""} submit-button`}>Obter taxa de câmbio</button>
            <p className="exchange-rate-result">
                {isLoading ? "..." : result}
            </p>
        </form>
    )
}

export default ConverterForm;
