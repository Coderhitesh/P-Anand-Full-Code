import React from 'react'
import Hero from '../../Components/Hero/Hero'
import Homepost from '../../Components/Homepost/Homepost'
import Featurecourse from '../../Components/Featurecourse/Featurecourse'
import Topcategory from '../../Components/Topcategory/Topcategory'
import Homeshop from '../../Components/Homeshop/Homeshop'
import Homeofferbanner from '../../Components/Homeofferbanner/Homeofferbanner'
import TopRatedBook from '../../Components/TopRatedBook/TopRatedBook'
import OurClient from '../../Components/OurClient/OurClient'
import Features from '../../Components/Features/Features'
import OurTeam from '../../Components/OurTeam/OurTeam'
import BundleHome from '../../Components/BundleHome/BundleHome'
import BookBundle from '../../Components/BookBundle/BookBundle'
import { useState } from 'react'
import { useEffect } from 'react'
import Loading from '../../Components/Loading/Loading'
import FounderHome from '../../Components/FounderHome/FounderHome'

function Home() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Scroll to the top when the component mounts
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });

    // Simulate loading time (2 seconds)
    const timer = setTimeout(() => {
      setLoading(false);
    }, 200);

    // Cleanup the timer when the component unmounts
    return () => clearTimeout(timer);
  }, []);
  return (
    <>
      {
        loading ? (
          <>
            <Loading />
          </>
        ) : (
          <>
          {/* <i class="ri-menu-2-line"></i> */}
            <Hero />
            <Homepost />
            <Featurecourse />
            <Topcategory />
            <Homeshop />
            {/* <BundleHome /> */}
            {/* <Homeofferbanner /> */}
            {/* <BookBundle /> */}
            <TopRatedBook />
            <OurClient />
            <FounderHome />
            <Features />
            {/* <OurTeam /> */}
          </>
        )
      }
    </>
  )
}

export default Home
