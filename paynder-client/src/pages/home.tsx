import Hero from "../components/hero";
import Products from "../components/products";
import About from "../components/about";
import Contact from "../components/contacts";

export const HomePage: React.FC = () => {
  return (
    <>
      <Hero />
      <Products />
      <About />
      <Contact />
    </>
  );
};
