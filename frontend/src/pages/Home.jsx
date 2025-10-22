import React from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import Hero from '../components/Hero'
import Services from '../components/Services'
import Products from '../components/Products'
import Experts from '../components/Experts'
import Testimonials from '../components/Testimonials'
import BackToTop from '../components/BackToTop'


const Home = () => {
  return (
    <>
      <Navbar />
     
      <Services/>
      <Experts limit={3}/>
      <Products/>
      <Testimonials/>
      <BackToTop/>
      <Footer />
    </>
  )
}

export default Home