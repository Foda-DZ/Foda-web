import { useOutletContext } from "react-router-dom";
import Hero from "../components/Hero";
import MarqueeBanner from "../components/MarqueeBanner";
import Categories from "../components/Categories";
import Products from "../components/Products";
import SellWithUs from "../components/SellWithUs";
import BrandStory from "../components/BrandStory";
import Newsletter from "../components/Newsletter";
import Footer from "../components/Footer";
import type { LayoutOutletContext } from "../components/Layout";

export default function HomePage() {
  const { openProduct } = useOutletContext<LayoutOutletContext>();

  return (
    <>
      <main>
        <Hero />
        <MarqueeBanner />
        <Categories />
        <Products onViewDetail={openProduct} />
        <SellWithUs />
        <BrandStory />
        <Newsletter />
      </main>
      <Footer />
    </>
  );
}
