import React, { useState } from 'react'
import { motion } from 'framer-motion'
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemText,
  useTheme,
  useMediaQuery
} from '@mui/material'
import {
  Menu as MenuIcon,
  Close as CloseIcon,
  Pets as PetsIcon
} from '@mui/icons-material'

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false)
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen)
  }

  const navItems = ['Home', 'Services', 'Products', 'Doctors', 'About', 'Contact']

  const drawer = (
    <Box sx={{ width: 250, backgroundColor: '#EDFCFD', height: '100%' }}>
      <Box sx={{ p: 2, display: 'flex', justifyContent: 'flex-end' }}>
        <IconButton onClick={handleDrawerToggle}>
          <CloseIcon />
        </IconButton>
      </Box>
      <List>
        {navItems.map((item) => (
          <ListItem button key={item} onClick={handleDrawerToggle}>
            <ListItemText 
              primary={item} 
              sx={{ 
                '& .MuiTypography-root': { 
                  color: '#28283E',
                  fontWeight: 500
                }
              }} 
            />
          </ListItem>
        ))}
        <ListItem>
          <Button
            variant="contained"
            fullWidth
            sx={{
              mt: 2,
              backgroundColor: '#2ECC71',
              '&:hover': { backgroundColor: '#144E8C' }
            }}
          >
            Book Appointment
          </Button>
        </ListItem>
      </List>
    </Box>
  )

  return (
    <>
      <AppBar 
        position="fixed" 
        elevation={0}
        sx={{ 
          backgroundColor: 'rgba(237, 252, 253, 0.95)',
          backdropFilter: 'blur(20px)',
          borderBottom: '1px solid rgba(46, 204, 113, 0.1)',
          zIndex: 1300
        }}
      >
        <Box sx={{ width: '100%', mx: 'auto' }}>
          <Toolbar sx={{ justifyContent: 'space-between', py: 1 }}>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <PetsIcon sx={{ fontSize: 32, color: '#2ECC71' }} />
                <Typography
                  variant="h5"
                  component="div"
                  sx={{
                    fontWeight: 800,
                    color: '#28283E',
                    fontSize: { xs: '1.2rem', md: '1.5rem' }
                  }}
                >
                  PetCare<span style={{ color: '#2ECC71' }}>Pro</span>
                </Typography>
              </Box>
            </motion.div>

            {!isMobile && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <Box sx={{ display: 'flex', gap: 3, alignItems: 'center' }}>
                  {navItems.map((item, index) => (
                    <motion.div
                      key={item}
                      initial={{ opacity: 0, y: -20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.1 * index }}
                    >
                      <Button
                        sx={{
                          color: '#28283E',
                          fontWeight: 500,
                          fontSize: '0.95rem',
                          '&:hover': {
                            color: '#2ECC71',
                            backgroundColor: 'transparent'
                          }
                        }}
                      >
                        {item}
                      </Button>
                    </motion.div>
                  ))}
                </Box>
              </motion.div>
            )}

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                {!isMobile && (
                  <Button
                    variant="contained"
                    sx={{
                      backgroundColor: '#2ECC71',
                      color: 'white',
                      px: 3,
                      py: 1,
                      borderRadius: 3,
                      fontWeight: 600,
                      '&:hover': {
                        backgroundColor: '#144E8C',
                        transform: 'translateY(-2px)',
                        boxShadow: '0 8px 25px rgba(46, 204, 113, 0.3)'
                      },
                      transition: 'all 0.3s ease'
                    }}
                  >
                    Book Appointment
                  </Button>
                )}
                {isMobile && (
                  <IconButton
                    onClick={handleDrawerToggle}
                    sx={{ color: '#28283E' }}
                  >
                    <MenuIcon />
                  </IconButton>
                )}
              </Box>
            </motion.div>
          </Toolbar>
        </Box>
      </AppBar>

      <Drawer
        variant="temporary"
        anchor="right"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{ keepMounted: true }}
        sx={{ zIndex: 1400 }}
      >
        {drawer}
      </Drawer>
    </>
  )
}

export default Navbar