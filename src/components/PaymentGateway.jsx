import React, { useState } from "react";
import { Elements, CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

const stripePromise = loadStripe("your_stripe_public_key");

const PaymentGateway = ({ paymentInfo, onPaymentSuccess, onPaymentError }) => {
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [paymentError, setPaymentError] = useState(null);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const stripe = useStripe();
  const elements = useElements();

  const handlePaymentMethodChange = (e) => {
    setPaymentMethod(e.target.value);
  };

  const handlePaymentInfoChange = (e) => {
    const { name, value } = e.target;
    setPaymentError(null);
    paymentInfo[name] = value;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setPaymentError(null);

    let paymentResult;
    if (paymentMethod === "card") {
      paymentResult = await stripe.createPaymentMethod({
        type: "card",
        card: elements.getElement(CardElement),
        billing_details: {
          name: paymentInfo.name,
          address: {
            line1: paymentInfo.billingAddress
          }
        }
      });
    } else if (paymentMethod === "crypto") {
      paymentResult = await fetch("/charge", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          paymentMethod: "crypto",
          amount: paymentInfo.amount,
          cryptoCurrency: paymentInfo.cryptoCurrency,
          cryptoAddress: paymentInfo.cryptoAddress
        })
      }).then((res) => res.json());
    }

    if (paymentResult.error) {
      setPaymentError(paymentResult.error.message);
      onPaymentError();
    } else {
      setPaymentSuccess(true);
      onPaymentSuccess();
    }
  };

  return (
    <div className="payment-gateway">
      <h2>Payment Gateway</h2>

      <form onSubmit={handleSubmit}>
        <label>
          Payment Method:
          <select
            name="paymentMethod"
            value={paymentMethod}
            onChange={handlePaymentMethodChange}
          >
            <option value="card">Credit Card</option>
            <option value="crypto">Cryptocurrency</option>
          </select>
        </label>

        {paymentMethod === "card" && (
          <label>
            Name on Card:
            <input
              type="text"
              name="name"
              value={paymentInfo.name}
              onChange={handlePaymentInfoChange}
            />
          </label>
        )}

        {paymentMethod === "card" && (
          <label>
            Billing Address:
            <input
              type="text"
              name="billingAddress"
              value={paymentInfo.billingAddress}
              onChange={handlePaymentInfoChange}
            />
          </label>
        )}

        <label>
          Amount:
          <input
            type="number"
            name="amount"
            value={paymentInfo.amount}
            onChange={handlePaymentInfoChange}
          />
        </label>

        {paymentMethod === "crypto" && (
          <div className="crypto-info">
            <label>
              Cryptocurrency:
              <select
                name="cryptoCurrency"
                value={paymentInfo.cryptoCurrency}
                onChange={handlePaymentInfoChange}
              >
                <option value="btc">Bitcoin</option>
                <option value="eth">Ethereum</option>
            <option value="ltc">Litecoin</option>
          </select>
        </label>

        <label>
          Crypto Address:
          <input
            type="text"
            name="cryptoAddress"
            value={paymentInfo.cryptoAddress}
            onChange={handlePaymentInfoChange}
          />
        </label>
      </div>
    )}

    <div className="card-element-container">
      {paymentMethod === "card" && (
        <CardElement options={{ hidePostalCode: true }} />
      )}
    </div>

    {paymentError && (
      <div className="payment-error">
        {paymentError}
      </div>
    )}

    {paymentSuccess && (
      <div className="payment-success">
        Payment Successful!
      </div>
    )}

    <button type="submit">Pay Now</button>
  </form>

  <Elements stripe={stripePromise}>
    <CardElement />
  </Elements>
</div>
);
};

export default PaymentGateway;