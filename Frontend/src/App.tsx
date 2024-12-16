import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ProductNavbar from "./components/Layout/ProductNavbar";
import InvoiceGenerator from "./components/createinvoice";
import Bubbles from "./components/Bubbles";
import SendPayments from "./components/Send";
import PaymentLinks from "./components/Links";
import OnRampOffRamp from "./components/OnRampOffRamp";
// import Dashboard from './components/Dashboard';
import Footer from "./components/Footer";
import { HomePage } from "./pages/home";

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Main landing page route */}
        <Route path="/" element={<HomePage />} />

        {/* Product interface routes */}
        <Route
          path="/invoice"
          element={
            <>
              <Bubbles />
              <ProductNavbar />
              <InvoiceGenerator />
              <Footer />
            </>
          }
        />
        <Route
          path="/send"
          element={
            <>
              <Bubbles />
              <ProductNavbar />
              <SendPayments />
              <Footer />
            </>
          }
        />
        <Route
          path="/links"
          element={
            <>
              <Bubbles />
              <ProductNavbar />
              <PaymentLinks />
              <Footer />
            </>
          }
        />
        <Route
          path="/onramp"
          element={
            <>
              <Bubbles />
              <ProductNavbar />
              <OnRampOffRamp />
              <Footer />
            </>
          }
        />
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
