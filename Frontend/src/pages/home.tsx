import Bubbles from "../components/Bubbles";
import Footer from "../components/Footer";
import About from "../components/Home/About";
import Contact from "../components/Home/Contact";
import Hero from "../components/Home/Hero";
import Products from "../components/Home/Products";
import Navbar from "../components/Layout/Navbar";

export const HomePage: React.FC = () => {
  return (
    <>
      <Bubbles />
      <Navbar />
      <Hero />
      <Products />
      <About />
      <Contact />
      <Footer />
    </>
  );
};
