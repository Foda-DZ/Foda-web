import Hero from "../components/Hero";
import Categories from "../components/Categories";
import FeaturedCollections from "../components/FeaturedCollections";
import Products from "../components/Products";
import SellWithUs from "../components/SellWithUs";
import Footer from "../components/Footer";

export default function HomePage() {
  return (
    <>
      <main>
        <Hero />
        <Categories />
        <FeaturedCollections />
        <Products />
        <SellWithUs />
      </main>
      <Footer />
    </>
  );
}
