import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Layout/Navbar';
import ProductNavbar from './components/Layout/ProductNavbar';
import Hero from './components/Home/Hero';
import Products from './components/Home/Products';
import About from './components/Home/About';
import InvoiceGenerator from './components/createinvoice';
import Contact from 'components/Home/Contact';
import Bubbles from 'components/Bubbles';
// import SendPayment from './components/Send';
// import PaymentLinks from './components/PaymentLinks';
// import OnRampOffRamp from './components/OnRampOffRamp';
// import Dashboard from './components/Dashboard';

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Main landing page route */}
        <Route path="/" element={
          <>
            <Bubbles />
            <Navbar />
            <Hero />
            <Products />
            <About />
            <Contact />
          </>
        } />

        {/* Product interface routes */}
        <Route path="/invoice" element={
          <>
            <ProductNavbar />
            <InvoiceGenerator />
          </>
        } />
        {/* <Route path="/send" element={
          <>
            <ProductNavbar />
            <SendPayment />
          </>
        } />
        <Route path="/links" element={
          <>
            <ProductNavbar />
            <PaymentLinks />
          </>
        } />
        <Route path="/onramp" element={
          <>
            <ProductNavbar />
            <OnRampOffRamp />
          </>
        } />
        <Route path="/dashboard" element={
          <>
            <ProductNavbar />
            <Dashboard />
          </>
        } /> */}
      </Routes>
    </Router>
  );
};

export default App;
