import Hero from "../components/Hero";
import Categories from "../components/Categories";
import Products from "../components/Products";
import SellWithUs from "../components/SellWithUs";
import Footer from "../components/Footer";

export default function HomePage() {
  return (
    <>
      <main>
        <Hero />
        <Categories />
        <Products />
        <SellWithUs />
      </main>
      <Footer />
    </>
  );
}
