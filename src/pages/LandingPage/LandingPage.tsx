import { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import Header from '../../components/header';
import Content from './content';
import WriteUp from './WriteUp';
import DemoSection from './demoSection';
import Footer from '../../components/footer';
import PreferencePreloader from '../../components/Preloader';
import Feature from './feature';
import Hero from './hero';

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
        <WriteUp />
        <Content />
        <Feature />
        <Content />
        <DemoSection />
      </main>
      <Footer />
    </div>
  );
}

export default LandingPage;