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
  useMediaQuery,
  Avatar,
  Menu,
  MenuItem,
  Divider
} from '@mui/material'
import {
  Menu as MenuIcon,
  Close as CloseIcon,
  Pets as PetsIcon,
  Person as PersonIcon,
  Dashboard as DashboardIcon,
  ExitToApp as LogoutIcon
} from '@mui/icons-material'
import { useAuth } from '../contexts/AuthContext'
import AuthModal from './AuthModal'

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [authModalOpen, setAuthModalOpen] = useState(false)
  const [userMenuAnchor, setUserMenuAnchor] = useState(null)
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  const { user, isAuthenticated, logout } = useAuth()

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen)
  }

  const handleUserMenuOpen = (event) => {
    setUserMenuAnchor(event.currentTarget)
  }

  const handleUserMenuClose = () => {
    setUserMenuAnchor(null)
  }

  const handleLogout = () => {
    logout()
    handleUserMenuClose()
  }

  const handleProfile = () => {
    window.location.href = '/profile'
    handleUserMenuClose()
  }

  const handleAdminDashboard = () => {
    window.location.href = '/admin/dashboard'
    handleUserMenuClose()
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
        <ListItem>
          {!isAuthenticated ? (
            <Button
              variant="outlined"
              fullWidth
              onClick={() => setAuthModalOpen(true)}
              sx={{
                mt: 1,
                borderColor: '#2ECC71',
                color: '#2ECC71',
                '&:hover': { borderColor: '#144E8C', color: '#144E8C' }
              }}
            >
              Login / Sign Up
            </Button>
          ) : (
            <Box sx={{ width: '100%', textAlign: 'center', mt: 2 }}>
              <Typography variant="body2" color="#28283E" fontWeight={600}>
                Welcome, {user.firstName}!
              </Typography>
              <Button
                variant="outlined"
                fullWidth
                onClick={handleLogout}
                sx={{
                  mt: 1,
                  borderColor: '#2ECC71',
                  color: '#2ECC71'
                }}
              >
                Logout
              </Button>
            </Box>
          )}
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
                  <>
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
                    
                    {!isAuthenticated ? (
                      <Button
                        variant="outlined"
                        onClick={() => setAuthModalOpen(true)}
                        sx={{
                          borderColor: '#2ECC71',
                          color: '#2ECC71',
                          px: 3,
                          py: 1,
                          borderRadius: 3,
                          fontWeight: 600,
                          '&:hover': {
                            borderColor: '#144E8C',
                            backgroundColor: 'rgba(46, 204, 113, 0.04)',
                            color: '#144E8C'
                          },
                          transition: 'all 0.3s ease'
                        }}
                      >
                        Login / Sign Up
                      </Button>
                    ) : (
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <IconButton
                          onClick={handleUserMenuOpen}
                          sx={{
                            p: 0,
                            '&:hover': {
                              transform: 'scale(1.05)'
                            },
                            transition: 'all 0.2s ease'
                          }}
                        >
                          <Avatar
                            sx={{
                              width: 40,
                              height: 40,
                              bgcolor: '#2ECC71',
                              border: '2px solid white',
                              boxShadow: '0 2px 8px rgba(46, 204, 113, 0.3)'
                            }}
                            src={user.profileImageUrl}
                          >
                            <PersonIcon />
                          </Avatar>
                        </IconButton>
                        <Typography
                          variant="body2"
                          sx={{
                            color: '#28283E',
                            fontWeight: 600,
                            ml: 1
                          }}
                        >
                          {user.firstName}
                        </Typography>
                      </Box>
                    )}
                  </>
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

      {/* User Menu */}
      <Menu
        anchorEl={userMenuAnchor}
        open={Boolean(userMenuAnchor)}
        onClose={handleUserMenuClose}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        PaperProps={{
          sx: {
            mt: 1,
            borderRadius: 2,
            minWidth: 200,
            boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
            border: '1px solid rgba(46, 204, 113, 0.1)'
          }
        }}
      >
        <Box sx={{ px: 2, py: 1 }}>
          <Typography variant="subtitle2" color="#28283E" fontWeight={600}>
            {user?.firstName} {user?.lastName}
          </Typography>
          <Typography variant="caption" color="#144E8C">
            {user?.email}
          </Typography>
        </Box>
        <Divider />
        <MenuItem onClick={handleProfile} sx={{ py: 1.5 }}>
          <PersonIcon sx={{ mr: 2, color: '#2ECC71' }} />
          My Profile
        </MenuItem>
        {user?.role === 'ADMIN' && (
          <MenuItem onClick={handleAdminDashboard} sx={{ py: 1.5 }}>
            <DashboardIcon sx={{ mr: 2, color: '#2ECC71' }} />
            Admin Dashboard
          </MenuItem>
        )}
        <Divider />
        <MenuItem onClick={handleLogout} sx={{ py: 1.5, color: '#e74c3c' }}>
          <LogoutIcon sx={{ mr: 2 }} />
          Logout
        </MenuItem>
      </Menu>

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

      {/* Auth Modal */}
      <AuthModal
        open={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
      />
    </>
  )
}

export default Navbar