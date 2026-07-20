import CleanHero from "../components/home/CleanHero";
import TrustStrip from "../components/home/TrustStrip";
import ProductRail from "../components/home/ProductRail";
import CollectionsRow from "../components/home/CollectionsRow";
import AppPromo from "../components/home/AppPromo";
import ScrollToTop from "../components/home/ScrollToTop";
import Footer from "../components/Footer";
import { productsService } from "../services/productsService";
import { useLang } from "../context/LangContext";

export default function HomePage() {
  const { tr } = useLang();

  return (
    <>
      <main className="bg-white">
        <CleanHero />
        <TrustStrip />

        {/* hero → New arrivals → collection → trending → collection → best offers */}
        <ProductRail
          title={tr.home.newArrivals}
          seeAllTo="/shop?sort=newest"
          fetcher={productsService.getNewArrivals}
        />

        <CollectionsRow index={0} />

        <ProductRail
          title={tr.home.trending}
          seeAllTo="/shop"
          fetcher={productsService.getTrending}
          trending
        />

        <AppPromo />

        <CollectionsRow index={1} />

        <ProductRail
          title={tr.home.bestOffers}
          seeAllTo="/shop"
          fetcher={productsService.getBestOffers}
        />
      </main>
      <Footer />
      <ScrollToTop />
    </>
  );
}
