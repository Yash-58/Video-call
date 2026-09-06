import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button, AppBar, Toolbar, Typography, Box, Container, Grid } from '@mui/material';
import VideoCallIcon from '@mui/icons-material/VideoCall';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';

export default function LandingPage() {
    const router = useNavigate();

    return (
        <Box 
            sx={{
                width: '100vw',
                minHeight: '100vh',
                background: 'radial-gradient(circle at 10% 20%, rgba(26,26,26,0.98) 0%, rgba(13,13,13,0.98) 90.1%)',
                color: 'white',
                display: 'flex',
                flexDirection: 'column',
                position: 'relative',
                overflowX: 'hidden',
                '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: '20%',
                    right: '-10%',
                    width: '45%',
                    height: '45%',
                    borderRadius: '50%',
                    background: 'radial-gradient(circle, rgba(255,152,57,0.15) 0%, rgba(0,0,0,0) 70%)',
                    filter: 'blur(60px)',
                    zIndex: 0
                }
            }}
        >
            {/* Navigation Bar */}
            <AppBar 
                position="static" 
                elevation={0} 
                sx={{ 
                    background: 'transparent',
                    borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
                    py: 1
                }}
            >
                <Container maxWidth="xl">
                    <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', px: '0 !important' }}>
                        {/* Brand Logo */}
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                            <VideoCallIcon sx={{ color: '#FF9839', fontSize: 36 }} />
                            <Typography 
                                variant="h5" 
                                fontWeight="800" 
                                sx={{ 
                                    letterSpacing: '-0.5px',
                                    background: 'linear-gradient(45deg, #ffffff 30%, #FF9839 90%)',
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent'
                                }}
                            >
                                Apna Video Call
                            </Typography>
                        </Box>

                        {/* Nav Action Links */}
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1.5, sm: 3 } }}>
                            <Button 
                                onClick={() => router("/aljk23")}
                                sx={{ 
                                    color: 'rgba(255,255,255,0.7)', 
                                    textTransform: 'none', 
                                    fontSize: '1rem',
                                    fontWeight: '500',
                                    '&:hover': { color: '#FF9839', bgcolor: 'transparent' }
                                }}
                            >
                                Join as Guest
                            </Button>
                            
                            <Button 
                                variant="outlined"
                                onClick={() => router("/auth", { state: { formState: 1 } })}
                                sx={{ 
                                    color: '#FF9839', 
                                    borderColor: 'rgba(255, 152, 57, 0.4)',
                                    borderRadius: '24px',
                                    textTransform: 'none',
                                    px: 2.5,
                                    fontSize: '0.95rem',
                                    fontWeight: '600',
                                    '&:hover': { 
                                        borderColor: '#FF9839', 
                                        bgcolor: 'rgba(255, 152, 57, 0.04)' 
                                    }
                                }}
                            >
                                Register
                            </Button>

                            <Button 
                                variant="contained"
                                onClick={() => router("/auth", { state: { formState: 0 } })}
                                sx={{ 
                                    bgcolor: '#FF9839', 
                                    color: '#white',
                                    borderRadius: '24px',
                                    textTransform: 'none',
                                    px: 3,
                                    fontSize: '0.95rem',
                                    fontWeight: '600',
                                    boxShadow: '0 4px 12px rgba(255, 152, 57, 0.25)',
                                    '&:hover': { 
                                        bgcolor: '#D97500',
                                        boxShadow: '0 6px 16px rgba(255, 152, 57, 0.35)'
                                    }
                                }}
                            >
                                Login
                            </Button>
                        </Box>
                    </Toolbar>
                </Container>
            </AppBar>

            {/* Main Hero Container */}
            <Container maxWidth="xl" sx={{ flexGrow: 1, display: 'flex', alignItems: 'center', zIndex: 1, py: { xs: 6, md: 0 } }}>
                <Grid container spacing={4} alignItems="center">
                    {/* Left Column: Heading and Info */}
                    <Grid item xs={12} md={6}>
                        <Box sx={{ pr: { md: 4 } }}>
                            <Typography 
                                variant="h2" 
                                component="h2" 
                                fontWeight="900" 
                                sx={{ 
                                    fontSize: { xs: '2.5rem', sm: '3.5rem', md: '4rem' },
                                    lineHeight: 1.15,
                                    letterSpacing: '-1.5px',
                                    mb: 3
                                }}
                            >
                                <span style={{ 
                                    background: 'linear-gradient(45deg, #FF9839 30%, #FFB066 90%)',
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent'
                                }}>Connect</span> with your loved ones instantly
                            </Typography>
                            
                            <Typography 
                                variant="h6" 
                                sx={{ 
                                    color: 'rgba(255,255,255,0.6)', 
                                    fontWeight: '400', 
                                    lineHeight: 1.6,
                                    mb: 5,
                                    maxWidth: '500px'
                                }}
                            >
                                Cover any distance with Apna Video Call. Host high-quality secure meetings for free, with zero downloads required.
                            </Typography>

                            <Button 
                                component={Link}
                                to="/auth"
                                state={{ formState: 1 }}
                                variant="contained"
                                endIcon={<KeyboardArrowRightIcon />}
                                sx={{ 
                                    bgcolor: '#FF9839', 
                                    color: 'white',
                                    borderRadius: '30px',
                                    textTransform: 'none',
                                    px: 4.5,
                                    py: 1.8,
                                    fontSize: '1.1rem',
                                    fontWeight: '700',
                                    boxShadow: '0 8px 24px rgba(255, 152, 57, 0.3)',
                                    transition: 'all 0.2s ease-in-out',
                                    '&:hover': { 
                                        bgcolor: '#D97500',
                                        boxShadow: '0 12px 30px rgba(255, 152, 57, 0.45)',
                                        transform: 'translateY(-2px)'
                                    }
                                }}
                            >
                                Get Started
                            </Button>
                        </Box>
                    </Grid>

                    {/* Right Column: Hero Mockup */}
                    <Grid item xs={12} md={6} sx={{ display: 'flex', justifyContent: { xs: 'center', md: 'flex-end' }, mt: { xs: 4, md: 0 } }}>
                        <Box 
                            sx={{
                                position: 'relative',
                                display: 'inline-block',
                                '&::before': {
                                    content: '""',
                                    position: 'absolute',
                                    top: '5%',
                                    left: '5%',
                                    width: '90%',
                                    height: '90%',
                                    borderRadius: '24px',
                                    background: 'rgba(255,152,57,0.1)',
                                    filter: 'blur(30px)',
                                    zIndex: 0
                                }
                            }}
                        >
                            <Box 
                                component="img"
                                src="/mobile.png"
                                alt="Video Call Preview"
                                sx={{
                                    height: { xs: '300px', sm: '420px', md: '500px' },
                                    width: 'auto',
                                    borderRadius: '24px',
                                    position: 'relative',
                                    zIndex: 1,
                                    transition: 'transform 0.4s ease-in-out',
                                    '&:hover': {
                                        transform: 'scale(1.02) rotate(1deg)'
                                    }
                                }}
                            />
                        </Box>
                    </Grid>
                </Grid>
            </Container>
        </Box>
    );
}