import React from 'react'
import { motion } from 'framer-motion'
import {
  Pets as PetsIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  LocationOn as LocationIcon,
  Security as SecurityIcon,
  Support as SupportIcon
} from '@mui/icons-material'

const Footer = () => {
  const quickLinks = ['Home', 'Services', 'Doctors', 'About', 'Contact']
  const services = ['Emergency Care', 'Vaccinations', 'Surgery', 'Grooming', 'Dental Care']
  const contactInfo = [
    { icon: <PhoneIcon className="text-lg text-primary-500" />, text: '+1 (555) 123-4567' },
    { icon: <EmailIcon className="text-lg text-primary-500" />, text: 'info@petcarepro.com' },
    { icon: <LocationIcon className="text-lg text-primary-500" />, text: '123 Pet Care St, City, State 12345' }
  ]

  const badges = [
    { icon: <SecurityIcon className="text-sm md:text-base text-primary-500" />, text: 'Licensed & Certified' },
    { icon: <SupportIcon className="text-sm md:text-base text-primary-500" />, text: '24/7 Support' }
  ]

  return (
    <footer className="py-12 text-white bg-primary-900 md:py-16">
      <div className="w-4/5 mx-auto">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          {/* Company Info */}
          <div className="md:col-span-1">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="flex items-center gap-2 mb-6">
                <PetsIcon className="text-3xl text-primary-500" />
                <h3 className="text-xl font-extrabold text-white md:text-2xl">
                  PetCare<span className="text-primary-500">Pro</span>
                </h3>
              </div>
              <p className="mb-6 text-sm leading-relaxed text-white/80 md:text-base">
                Professional veterinary care with modern technology and compassionate service. 
                Your pet's health and happiness is our top priority.
              </p>
              <div className="flex flex-wrap gap-4">
                {badges.map((badge, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg bg-primary-500/10"
                  >
                    {badge.icon}
                    <span className="text-xs font-medium text-primary-500 md:text-sm">
                      {badge.text}
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Quick Links */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <h4 className="mb-6 text-lg font-semibold md:text-xl text-primary-500">
                Quick Links
              </h4>
              <div className="flex flex-col gap-3">
                {quickLinks.map((link) => (
                  <a
                    key={link}
                    href="#"
                    className="text-sm transition-colors duration-300 text-white/80 hover:text-primary-500 md:text-base"
                  >
                    {link}
                  </a>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Services */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <h4 className="mb-6 text-lg font-semibold md:text-xl text-primary-500">
                Services
              </h4>
              <div className="flex flex-col gap-3">
                {services.map((service) => (
                  <a
                    key={service}
                    href="#"
                    className="text-sm transition-colors duration-300 text-white/80 hover:text-primary-500 md:text-base"
                  >
                    {service}
                  </a>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Contact Info */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <h4 className="mb-6 text-lg font-semibold md:text-xl text-primary-500">
                Contact Info
              </h4>
              <div className="flex flex-col gap-4">
                {contactInfo.map((info, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3"
                  >
                    {info.icon}
                    <span className="text-sm text-white/80 md:text-base">
                      {info.text}
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="pt-8 mt-12 text-center border-t border-white/10">
          <p className="text-sm text-white/60 md:text-base">
            © 2024 PetCarePro. All rights reserved. | Privacy Policy | Terms of Service
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer