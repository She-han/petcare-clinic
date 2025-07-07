import React from 'react'
import { motion } from 'framer-motion'
import {
  Schedule as ScheduleIcon,
  Phone as PhoneIcon
} from '@mui/icons-material'

const ContactSoon = () => {
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
    <div className="relative py-16 overflow-hidden bg-gradient-to-br from-primary-500 to-primary-600 md:py-24">
      {/* Background Pattern */}
      <div 
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }}
      />

      <div className="relative z-10 w-4/5 mx-auto">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={stagger}
        >
          <motion.div variants={fadeInUp}>
            <div className="text-center">
              <h2 className="mb-4 text-3xl font-bold text-white md:text-4xl lg:text-5xl">
                Ready to Give Your Pet the Best Care?
              </h2>
              <p className="max-w-2xl mx-auto mb-8 text-base leading-relaxed text-white/90 md:text-xl">
                Join thousands of pet owners who trust us with their furry family members. 
                Book your appointment today and experience the difference.
              </p>

              <div className="flex flex-wrap justify-center gap-4 md:gap-6">
                <motion.button
                  whileHover={{ y: -3, scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex items-center gap-2 px-6 py-3 text-sm font-semibold transition-all duration-300 bg-white text-primary-500 md:px-8 md:py-4 rounded-xl md:text-lg hover:bg-white/90 hover:shadow-lg hover:shadow-white/30"
                >
                  <ScheduleIcon className="text-lg md:text-xl" />
                  Book Now
                </motion.button>
                <motion.button
                  whileHover={{ y: -3, scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex items-center gap-2 px-6 py-3 text-sm font-semibold text-white transition-all duration-300 border-2 border-white md:px-8 md:py-4 rounded-xl md:text-lg hover:bg-white/10"
                >
                  <PhoneIcon className="text-lg md:text-xl" />
                  Call Us
                </motion.button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}

export default ContactSoon