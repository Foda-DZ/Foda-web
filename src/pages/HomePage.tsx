import Hero from "../components/Hero";
import MarqueeBanner from "../components/MarqueeBanner";
import Categories from "../components/Categories";
import Products from "../components/Products";
import SellWithUs from "../components/SellWithUs";
import BrandStory from "../components/BrandStory";
import Newsletter from "../components/Newsletter";
import Footer from "../components/Footer";

export default function HomePage() {
  return (
    <>
      <main>
        <Hero />
        <MarqueeBanner />
        <Categories />
        <Products />
        <SellWithUs />
        <BrandStory />
        <Newsletter />
      </main>
      <Footer />
    </>
  );
}
