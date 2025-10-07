import { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import Header from '../../components/header';
import ContentShowcase from './landing';
import WriteUp from './WriteUp';
import NewsSection from './NewsFeed';
import DemoSection from './demoSection';
import Footer from '../../components/footer';
import PreferencePreloader from '../../components/Preloader';
import FeaturedItem from './content';
import Hero from './hero';
import Featured from './featured';

function LandingPage() {
    // 2. State to control the preloader's visibility
  const [showPreloader, setShowPreloader] = useState(false);
  useEffect(() => {
    const preloaderCompleted = sessionStorage.getItem('preloaderCompleted');
    if (!preloaderCompleted) {
      setShowPreloader(true); 
    }
  }, []);

  // 4. Function to handle completion of the preloader
  const handlePreloaderComplete = (selectedTopics: string[]) => {
    console.log("User's interests:", selectedTopics); // You can use this data to customize the page later
    sessionStorage.setItem('preloaderCompleted', 'true'); 
    setShowPreloader(false); 
  };
  return (
    <div className="flex flex-col min-h-screen">
      <AnimatePresence>
        {showPreloader && <PreferencePreloader onComplete={handlePreloaderComplete} />}
      </AnimatePresence>
      <Header />
      <main className="flex-grow">
        <Hero />
        <ContentShowcase />
        <FeaturedItem />
        <WriteUp />
        <Featured />
        <ContentShowcase />
        <DemoSection />
        <NewsSection title="More News" />
      </main>
      <Footer />
    </div>
  );
}

export default LandingPage;