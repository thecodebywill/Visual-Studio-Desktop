import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Layout/Navbar';
import ProductNavbar from './components/Layout/ProductNavbar';
import Hero from './components/Home/Hero';
import Products from './components/Home/Products';
import About from './components/Home/About';
import InvoiceGenerator from './components/createinvoice';
import Contact from './components/Home/Contact';
import Bubbles from './components/Bubbles';
import SendPayments from './components/Send';
import PaymentLinks from './components/Links';
import OnRampOffRamp from './components/OnRampOffRamp';
// import Dashboard from './components/Dashboard';
import Footer from './components/Footer';

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
            <Footer />
          </>
        } />

        {/* Product interface routes */}
        <Route path="/invoice" element={
          <>
            <Bubbles />
            <ProductNavbar />
            <InvoiceGenerator />
            <Footer />
          </>
        } />
        <Route path="/send" element={
          <>
            <Bubbles />
            <ProductNavbar />
            <SendPayments />
            <Footer />
          </>
        } />
        <Route path="/links" element={
          <>
            <Bubbles />
            <ProductNavbar />
            <PaymentLinks />
            <Footer />
          </>
        } />
        <Route path="/onramp" element={
          <>
            <Bubbles />
            <ProductNavbar />
            <OnRampOffRamp />
            <Footer />
          </>
        } />
        {/* <Route path="/dashboard" element={
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
