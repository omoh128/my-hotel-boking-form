import React, { useState } from 'react';
import CryptoJS from 'crypto-js';
import styles from './HotelBookingForm.css';

const HotelBookingForm = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [checkInDate, setCheckInDate] = useState('');
  const [checkOutDate, setCheckOutDate] = useState('');
  const [numberOfGuests, setNumberOfGuests] = useState('');
  const [cryptoAddress, setCryptoAddress] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();

    // Calculate the total cost of the booking
    const pricePerNight = 100; // Change this to the actual price per night
    const startDate = new Date(checkInDate);
    const endDate = new Date(checkOutDate);
    const numberOfNights = Math.round((endDate - startDate) / (24 * 60 * 60 * 1000));
    const totalCost = numberOfNights * pricePerNight * numberOfGuests;

    // Generate a random order ID
    const orderId = Math.random().toString(36).substr(2, 9);

    // Generate a payment link using the crypto payment gateway
    const apiKey = 'api-key'; // Replace with your actual API key
    const apiSecret = 'api-secret'; // Replace with your actual API secret
    const nonce = Date.now().toString();
    const message = `orderId=${orderId}&totalCost=${totalCost}&nonce=${nonce}`;
    const signature = CryptoJS.HmacSHA256(message, apiSecret).toString(CryptoJS.enc.Hex);
    const paymentLink = `https://payment-gateway.com/api/v1/payments?apiKey=${apiKey}&orderId=${orderId}&totalCost=${totalCost}&nonce=${nonce}&signature=${signature}&cryptoAddress=${cryptoAddress}`;

    // Redirect the user to the payment page
    window.location.href = paymentLink;
  };

  return (
    <div className='container'>
        <div className='header1'>
            <h1>Hotel Booking</h1>
        </div>
    <form className={styles.form} onSubmit={handleSubmit}>
      <label className={styles.label}>
        Name:
        <input className={styles.input} type="text" value={name} onChange={(event) => setName(event.target.value)} />
      </label>
      <label className={styles.label}>
        Email:
        <input className={styles.input} type="email" value={email} onChange={(event) => setEmail(event.target.value)} />
      </label>
      <label className={styles.label}>
        Check-in date:
        <input className={styles.input} type="date" value={checkInDate} onChange={(event) => setCheckInDate(event.target.value)} />
      </label>
      <label className={styles.label}>
        Check-out date:
        <input className={styles.input} type="date" value={checkOutDate} onChange={(event) => setCheckOutDate(event.target.value)} />
      </label>
      <label className={styles.label}>
        Number of guests:
        <input className={styles.input} type="number" value={numberOfGuests} onChange={(event) => setNumberOfGuests(event.target.value)} />
      </label>
      <label className={styles.label}>
        Crypto address:
        <input className={styles.input} type="text" value={cryptoAddress} onChange={(event) => setCryptoAddress(event.target.value)} />
      </label>
      <button className={styles.button} type="submit">Book now</button>
    </form>
    </div>
  );
};

export default HotelBookingForm
