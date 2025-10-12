import React, { useState, useEffect } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import {
  Typography,
  Button,
  Box,
  Rating,
  Chip,
  CircularProgress
} from '@mui/material'
import {
  Schedule as ScheduleIcon,
  Star as StarIcon,
  LocalHospital as MedicalIcon,
  Person as PersonIcon
} from '@mui/icons-material'
import toast from 'react-hot-toast'
import apiService from '../services/api'
import AppointmentModal from './AppointmentModal'

const Experts = ({ limit }) => {
  const [veterinarians, setVeterinarians] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedVet, setSelectedVet] = useState(null)
  const [appointmentModalOpen, setAppointmentModalOpen] = useState(false)

  const { scrollYProgress } = useScroll()
  const backgroundY = useTransform(scrollYProgress, [0, 1], ['0%', '20%'])

  useEffect(() => {
    fetchVeterinarians()
  }, [])

  const fetchVeterinarians = async () => {
    try {
      setLoading(true)
      const response = await apiService.veterinarians.getAvailable()
      setVeterinarians(response.data)
    } catch (error) {
      console.error('Error fetching veterinarians:', error)
      toast.error('Failed to load veterinarians')
    } finally {
      setLoading(false)
    }
  }

  const handleBookAppointment = (veterinarian) => {
    setSelectedVet(veterinarian)
    setAppointmentModalOpen(true)
  }

  const handleCloseModal = () => {
    setSelectedVet(null)
    setAppointmentModalOpen(false)
  }

  const fadeIn = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.6 } }
  }

    const fadeInUp = {
    hidden: { opacity: 0, y: 60 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
  }

  const ExpertCard = ({ veterinarian, index, isLeft }) => {
    return (
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={fadeIn}
        className="relative w-full mb-16"
      >
        {/* Content Container with Outline */}
        <div className={`relative ${isLeft ? 'ml-0 mr-8' : 'mr-0 ml-8'}`}>
          {/* Outline Border */}
          <div className={`absolute inset-0 ${
            isLeft 
              ? 'rounded-r-full border-r-4 border-t-4 border-b-4 border-l-0' 
              : 'rounded-l-full border-l-4 border-t-4 border-b-4 border-r-0'
          } border-[#edf2fd]`}></div>
          
          {/* Content Background */}
          <div className={`relative  ${
            isLeft 
              ? 'rounded-r-full pr-8 pl-4 mr-4' 
              : 'rounded-l-full pl-8 pr-4 ml-4'
          } py-8`}>
            
            <div className={`flex items-center gap-8 ${isLeft ? 'flex-row' : 'flex-row-reverse'}`}>
              {/* Expert Image Circle */}
              <div className="relative flex-shrink-0">
                <div className="w-48 h-48 overflow-hidden border-4 border-white rounded-full shadow-lg">
                  <img
                    src={veterinarian.imageUrl || 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=300&h=300&fit=crop&crop=face'}
                    alt={veterinarian.fullName}
                    className="object-cover w-full h-full"
                  />
                </div>
                
                {/* Rating badge */}
                <div className="absolute p-2 bg-white border-2 border-gray-100 rounded-full shadow-md -top-2 -right-2">
                  <div className="flex items-center gap-1">
                    <StarIcon className="text-sm text-yellow-500" />
                    <span className="text-xs font-semibold text-gray-700">
                      {parseFloat(veterinarian.rating || 0).toFixed(1)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Expert Details */}
              <div className={`flex-1 ${isLeft ? 'text-left' : 'text-right'}`}>
                {/* Name and Title */}
                <div className="mb-4">
                  <Typography
                    variant="h4"
                    className="mb-2 font-bold text-gray-800"
                    sx={{ fontSize: { xs: '1.5rem', md: '2rem' } }}
                  >
                    {veterinarian.fullName}
                  </Typography>
                  
                  <div className={`flex items-center gap-2 mb-3 ${!isLeft ? 'justify-end' : ''}`}>
                    <MedicalIcon className="text-lg text-green-600" />
                    <Typography
                      variant="h6"
                      className="font-medium text-green-600"
                      sx={{ fontSize: { xs: '1rem', md: '1.1rem' } }}
                    >
                      {veterinarian.specialization || 'General Practice'}
                    </Typography>
                  </div>
                </div>

                {/* Stats Row */}
                <div className={`flex flex-wrap gap-3 mb-4 ${!isLeft ? 'justify-end' : ''}`}>
                  {/* Experience */}
                  <div className="px-4 py-2 bg-white border border-gray-200 rounded-full shadow-sm">
                    <div className="flex items-center gap-2">
                      <ScheduleIcon className="text-sm text-gray-600" />
                      <span className="text-sm font-medium text-gray-700">
                        {veterinarian.yearsOfExperience || 0} Years
                      </span>
                    </div>
                  </div>

                  {/* Reviews */}
                  <div className="px-4 py-2 bg-white border border-gray-200 rounded-full shadow-sm">
                    <div className="flex items-center gap-2">
                      <PersonIcon className="text-sm text-gray-600" />
                      <span className="text-sm font-medium text-gray-700">
                        {veterinarian.totalReviews || 0} Reviews
                      </span>
                    </div>
                  </div>

                  {/* Fee */}
                  <div className="px-4 py-2 border border-green-200 rounded-full shadow-sm bg-green-50">
                    <span className="text-sm font-semibold text-green-700">
                      LKR {parseFloat(veterinarian.consultationFee || 0).toFixed(0)} / Visit
                    </span>
                  </div>
                </div>

                {/* Rating */}
                <div className={`flex items-center gap-3 mb-4 ${!isLeft ? 'justify-end' : ''}`}>
                  <Rating
                    value={parseFloat(veterinarian.rating) || 0}
                    precision={0.1}
                    readOnly
                    size="small"
                    sx={{
                      '& .MuiRating-iconFilled': {
                        color: '#F59E0B'
                      }
                    }}
                  />
                  <Typography variant="body2" className="font-medium text-gray-600">
                    ({veterinarian.totalReviews || 0} reviews)
                  </Typography>
                </div>

                {/* Description */}
                <Typography
                  variant="body1"
                  className="!mb-4 leading-relaxed text-gray-600 "
                  sx={{ fontSize: { xs: '0.9rem', md: '1rem' } }}
                >
                  {veterinarian.bio || 'general practice'}.
                </Typography>

                {/* Action Button */}
                <Button
                  variant="contained"
                  size="medium"
                  onClick={() => handleBookAppointment(veterinarian)}
                  sx={{
                    backgroundColor: '#2ECC71',
                    color: 'white',
                    borderRadius: '25px',
                    px: 4,
                    py: 1.5,
                    fontWeight: 600,
                    fontSize: { xs: '0.9rem', md: '1rem' },
                    '&:hover': {
                      backgroundColor: '#27AE60'
                    },
                    transition: 'background-color 0.3s ease',
                    boxShadow: 'none'
                  }}
                >
                  Book Appointment
                </Button>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    )
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <div className="text-center">
          <CircularProgress size={60} sx={{ color: '#2ECC71' }} />
          <Typography variant="h6" className="mt-4 text-gray-700">
            Loading our expert veterinarians...
          </Typography>
        </div>
      </div>
    )
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-white">
      {/* Subtle Background Elements */}
      <motion.div
        style={{ y: backgroundY }}
        className="absolute inset-0 opacity-5"
      >
        <div className="absolute w-32 h-32 bg-green-500 rounded-full top-20 left-10 blur-2xl"></div>
        <div className="absolute w-40 h-40 bg-blue-500 rounded-full bottom-20 right-20 blur-2xl"></div>
      </motion.div>

      <div className="relative z-10 py-16">
        {/* Header Section */}
             <motion.div variants={fadeInUp}>
                  <Box sx={{ textAlign: 'center', mb: 8 }}>
                    <Typography
                      variant="h2"
                      sx={{
                        fontSize: { xs: '1.8rem', md: '2.5rem', lg: '3rem' },
                        fontWeight: 700,
                        color: '#28283E',
                        mb: 2
                      }}
                    >
                      Meet Our Expert <span className="text-gradient">Veterinarians</span>
                    </Typography>
                    <Typography
                      variant="h6"
                      sx={{
                        color: '#144E8C',
                        maxWidth: 600,
                        mx: 'auto',
                        fontSize: { xs: '1rem', md: '1.1rem' }
                      }}
                    >
                      Our team of experienced veterinarians is dedicated to providing the best care for your pets
                    </Typography>
                  </Box>
                </motion.div>

        {/* Experts List */}
        <div className="max-w-6xl px-4 mx-auto">
          {veterinarians.length === 0 ? (
            <motion.div
              variants={fadeIn}
              className="py-16 text-center"
            >
              <MedicalIcon className="mb-4 text-6xl text-gray-400" />
              <Typography variant="h5" className="mb-2 text-gray-600">
                No veterinarians available
              </Typography>
              <Typography variant="body1" className="text-gray-500">
                Please check back later or contact us for more information.
              </Typography>
            </motion.div>
          ) : (
            <div>
              {veterinarians.slice(0, limit).map((veterinarian, index) => (
                <ExpertCard 
                  key={veterinarian.id} 
                  veterinarian={veterinarian} 
                  index={index}
                  isLeft={index % 2 === 0}
                />
              ))}
            </div>
          )}
        </div>

        {/* View All Button */}
        {veterinarians.length > 4 && (
          <motion.div
            initial="hidden"
            whileInView="visible"
            variants={fadeIn}
            className="mt-12 text-center"
          >
            <Button
              variant="outlined"
              size="large"
              onClick={() => navigate('/veterinarians')}
              sx={{
                color: '#2ECC71',
                borderColor: '#2ECC71',
                borderWidth: 2,
                px: 4,
                py: 1.5,
                borderRadius: '25px',
                fontWeight: 600,
                fontSize: '1rem',
                '&:hover': {
                  backgroundColor: '#2ECC71',
                  color: 'white'
                },
                transition: 'all 0.3s ease'
              }}
            >
              View All Veterinarians
            </Button>
          </motion.div>
        )}
      </div>

      {/* Appointment Modal */}
      <AppointmentModal
        open={appointmentModalOpen}
        onClose={handleCloseModal}
        veterinarian={selectedVet}
      />
    </div>
  )
}

export default Experts