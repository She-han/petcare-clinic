import React from 'react'
import Navbar from '../components/Navbar'
import Experts from '../components/Experts'
import Footer from '../components/Footer'

const Veterinarians = () => {
  return (
    <div>
      <Navbar />
      <div className='mt-10'>
         <Experts/>
      </div>
     
      <Footer/>
    </div>
  )
}

export default Veterinarians