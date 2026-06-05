import Hero from "../components/Hero";
import TrustBar from "../components/TrustBar";
import Categories from "../components/Categories";
import FeaturedCollections from "../components/FeaturedCollections";
import Products from "../components/Products";
import MarketplaceHighlight from "../components/MarketplaceHighlight";
import HowItWorks from "../components/HowItWorks";
import Newsletter from "../components/Newsletter";
import Footer from "../components/Footer";

export default function HomePage() {
  return (
    <>
      <main>
        <Hero />
        <TrustBar />
        <Categories />
        <FeaturedCollections />
        <Products />
        <MarketplaceHighlight />
        <HowItWorks />
        <Newsletter />
      </main>
      <Footer />
    </>
  );
}
