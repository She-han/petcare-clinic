import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Fab, Tooltip } from '@mui/material'
import { KeyboardArrowUp as ArrowUpIcon } from '@mui/icons-material'

const BackToTop = () => {
  const [showButton, setShowButton] = useState(false)
  const [scrollProgress, setScrollProgress] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.pageYOffset
      const docHeight = document.documentElement.scrollHeight - window.innerHeight
      const scrollPercent = (scrollTop / docHeight) * 100
      
      setScrollProgress(scrollPercent)
      setShowButton(scrollTop > 400)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    })
  }

  return (
    <AnimatePresence>
      {showButton && (
        <motion.div
          initial={{ opacity: 0, scale: 0, rotate: -180 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          exit={{ opacity: 0, scale: 0, rotate: 180 }}
          transition={{ 
            type: "spring", 
            stiffness: 200, 
            damping: 20,
            duration: 0.6
          }}
          style={{
            position: 'fixed',
            bottom: 30,
            right: 30,
            zIndex: 1000
          }}
        >
          <Tooltip 
            title="Back to Top" 
            placement="left"
            arrow
          >
            <motion.div
              whileHover={{ 
                scale: 1.1,
                rotate: 5
              }}
              whileTap={{ 
                scale: 0.9,
                rotate: -5
              }}
              transition={{ duration: 0.2 }}
            >
              <Fab
                onClick={scrollToTop}
                sx={{
                  background: 'linear-gradient(135deg, #2ECC71 0%, #144E8C 100%)',
                  color: 'white',
                  width: 60,
                  height: 60,
                  position: 'relative',
                  overflow: 'hidden',
                  '&:hover': {
                    boxShadow: '0 8px 25px rgba(46, 204, 113, 0.4)'
                  },
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: `conic-gradient(#2ECC71 ${scrollProgress * 3.6}deg, transparent ${scrollProgress * 3.6}deg)`,
                    borderRadius: '50%',
                    padding: '3px',
                    mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                    maskComposite: 'subtract'
                  }
                }}
              >
                <motion.div
                  animate={{ y: [0, -3, 0] }}
                  transition={{ 
                    duration: 2, 
                    repeat: Infinity, 
                    ease: "easeInOut" 
                  }}
                >
                  <ArrowUpIcon sx={{ fontSize: 28 }} />
                </motion.div>
              </Fab>
            </motion.div>
          </Tooltip>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default BackToTop