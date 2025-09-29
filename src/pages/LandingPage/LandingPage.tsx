import Header from '../../components/header';
import Hero from './hero';
import WriteUp from './WriteUp';
import NewsSection from './NewsFeed';
import SecondaryHero from './heroSec';
import Footer from '../../components/footer';

function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        <Hero />
        <WriteUp />
        <NewsSection title="News Updates" />
        <SecondaryHero />
        <NewsSection title="More News" />
      </main>
      <Footer />
    </div>
  );
}

export default LandingPage;