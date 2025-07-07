import React from 'react'
import Hero from '../components/Hero'
import Services from '../components/Services'
import Products from '../components/Products'
import Experts from '../components/Experts'
import Testimonials from '../components/Testimonials'
import BackToTop from '../components/BackToTop'


const Home = () => {
  return (
    <>
      <Hero/>
      <Services/>
      <Experts/>
      <Products/>
      <Testimonials/>
      <BackToTop/>
      
    </>
  )
}

export default Home