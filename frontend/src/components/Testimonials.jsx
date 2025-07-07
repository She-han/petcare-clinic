import React from 'react'
import { motion } from 'framer-motion'
import { Rating } from '@mui/material'

const Testimonials = () => {
  const testimonials = [
    {
      name: 'Jessica Smith',
      text: 'Amazing service! The doctors are so caring and professional. My dog recovered perfectly after surgery.',
      rating: 5,
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b3fd?w=100&h=100&fit=crop&crop=face'
    },
    {
      name: 'Robert Johnson',
      text: 'Best pet care clinic in the city. Online booking is so convenient and the staff is incredibly helpful.',
      rating: 5,
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face'
    },
    {
      name: 'Maria Garcia',
      text: 'They saved my cats life during an emergency. Forever grateful to this amazing team of professionals.',
      rating: 5,
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face'
    }
  ]

  const fadeInUp = {
    hidden: { opacity: 0, y: 60 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
  }

  const stagger = {
    visible: {
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  return (
    <div className="w-4/5 py-16 mx-auto md:py-24">
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={stagger}
      >
        <motion.div variants={fadeInUp}>
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-3xl font-bold md:text-4xl lg:text-5xl text-primary-900">
              What Our <span className="text-gradient">Clients Say</span>
            </h2>
            <p className="max-w-2xl mx-auto text-base text-primary-600 md:text-lg">
              Read testimonials from pet owners who trust us with their beloved companions
            </p>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              variants={fadeInUp}
              whileHover={{ 
                y: -10,
                transition: { duration: 0.3 }
              }}
              className="group"
            >
              <div className="h-full p-6 transition-all duration-300 bg-white border shadow-lg rounded-2xl md:p-8 shadow-primary-500/10 hover:shadow-xl hover:shadow-primary-500/20 border-primary-500/10">
                <div className="mb-6">
                  <Rating
                    value={testimonial.rating}
                    readOnly
                    sx={{
                      '& .MuiRating-iconFilled': {
                        color: '#2ECC71'
                      }
                    }}
                  />
                </div>

                <blockquote className="mb-6 text-sm italic leading-relaxed text-primary-600 md:text-base">
                  "{testimonial.text}"
                </blockquote>

                <div className="flex items-center gap-4">
                  <img
                    src={testimonial.avatar}
                    alt={testimonial.name}
                    className="object-cover w-12 h-12 border-2 rounded-full md:w-14 md:h-14 border-primary-500"
                  />
                  <h4 className="text-base font-semibold text-primary-900 md:text-lg">
                    {testimonial.name}
                  </h4>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  )
}

export default Testimonials