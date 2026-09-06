import React, { useContext, useState } from 'react';
import withAuth from '../utils/withAuth';
import { useNavigate } from 'react-router-dom';
import { Button, IconButton, TextField, Box, Typography, Container, Grid, Paper, Divider, Tooltip, InputAdornment, AppBar, Toolbar } from '@mui/material';
import RestoreIcon from '@mui/icons-material/Restore';
import LogoutIcon from '@mui/icons-material/Logout';
import VideoCallIcon from '@mui/icons-material/VideoCall';
import KeyboardIcon from '@mui/icons-material/Keyboard';
import AddBoxIcon from '@mui/icons-material/AddBox';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import { AuthContext } from '../contexts/AuthContext';
import { createTheme, ThemeProvider } from '@mui/material/styles';

const homeTheme = createTheme({
    palette: {
        primary: {
            main: '#FF9839',
            dark: '#D97500',
            contrastText: '#ffffff',
        },
        background: {
            default: '#FAF9F6',
        }
    },
    typography: {
        fontFamily: '"Poppins", "Roboto", "Helvetica Neue", sans-serif',
    }
});

function HomeComponent() {
    let navigate = useNavigate();
    const [meetingCode, setMeetingCode] = useState("");
    const [copySuccess, setCopySuccess] = useState(false);

    const { addToUserHistory } = useContext(AuthContext);

    let handleJoinVideoCall = async () => {
        if (!meetingCode.trim()) return;
        await addToUserHistory(meetingCode);
        navigate(`/${meetingCode}`);
    };

    const generateMeetingCode = () => {
        const chars = "abcdefghijklmnopqrstuvwxyz";
        let code = "";
        for (let i = 0; i < 9; i++) {
            if (i === 3 || i === 6) code += "-";
            code += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        setMeetingCode(code);
    };

    const handleCopyCode = () => {
        navigator.clipboard.writeText(meetingCode);
        setCopySuccess(true);
        setTimeout(() => setCopySuccess(false), 2000);
    };

    return (
        <ThemeProvider theme={homeTheme}>
            <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', display: 'flex', flexDirection: 'column' }}>
                {/* Header Navbar */}
                <AppBar position="static" color="inherit" elevation={0} sx={{ borderBottom: '1px solid rgba(0,0,0,0.06)', py: 0.5 }}>
                    <Container maxWidth="lg">
                        <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', px: '0 !important' }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <VideoCallIcon sx={{ color: 'primary.main', fontSize: 32 }} />
                                <Typography variant="h6" fontWeight="800" color="#1A1A1A">
                                    Apna Video Call
                                </Typography>
                            </Box>

                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                <Button 
                                    startIcon={<RestoreIcon />}
                                    onClick={() => navigate("/history")}
                                    sx={{ 
                                        color: 'text.secondary', 
                                        textTransform: 'none',
                                        fontSize: '0.95rem',
                                        '&:hover': { color: 'primary.main', bgcolor: 'rgba(255,152,57,0.04)' }
                                    }}
                                >
                                    History
                                </Button>
                                
                                <Divider orientation="vertical" flexItem sx={{ my: 1.5 }} />

                                <Button 
                                    variant="outlined"
                                    color="error"
                                    startIcon={<LogoutIcon />}
                                    onClick={() => {
                                        localStorage.removeItem("token");
                                        navigate("/auth");
                                    }}
                                    sx={{ 
                                        borderRadius: '20px',
                                        textTransform: 'none',
                                        fontSize: '0.9rem',
                                        px: 2.5
                                    }}
                                >
                                    Logout
                                </Button>
                            </Box>
                        </Toolbar>
                    </Container>
                </AppBar>

                {/* Main Content Dashboard */}
                <Container maxWidth="lg" sx={{ flexGrow: 1, display: 'flex', alignItems: 'center', py: 6 }}>
                    <Grid container spacing={5} alignItems="center">
                        {/* Left Side Panel - Meeting Controls */}
                        <Grid item xs={12} md={7}>
                            <Box sx={{ mb: 4 }}>
                                <Typography variant="h3" fontWeight="800" sx={{ color: '#1A1A1A', mb: 2, fontSize: { xs: '2rem', md: '2.8rem' } }}>
                                    Quality video meetings. <br/>
                                    Now free for everyone.
                                </Typography>
                                <Typography variant="h6" fontWeight="400" sx={{ color: 'text.secondary', fontSize: '1.05rem', lineHeight: 1.6 }}>
                                    We engineered Apna Video Call to deliver fast, secure, and encrypted connections, keeping you close to the ones who matter.
                                </Typography>
                            </Box>

                            <Paper elevation={0} sx={{ p: 4, borderRadius: '16px', border: '1px solid rgba(0,0,0,0.06)', bgcolor: 'white' }}>
                                <Grid container spacing={3}>
                                    {/* Create a Room Section */}
                                    <Grid item xs={12} sm={6}>
                                        <Typography variant="subtitle1" fontWeight="700" sx={{ mb: 1, color: '#1A1A1A' }}>
                                            Host a Meeting
                                        </Typography>
                                        <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2.5, height: '40px' }}>
                                            Generate a brand-new meeting room code instantly.
                                        </Typography>
                                        <Button
                                            fullWidth
                                            variant="outlined"
                                            startIcon={<AddBoxIcon />}
                                            onClick={generateMeetingCode}
                                            sx={{
                                                py: 1.5,
                                                borderRadius: '12px',
                                                borderWidth: '2px',
                                                textTransform: 'none',
                                                fontWeight: '600',
                                                '&:hover': { borderWidth: '2px' }
                                            }}
                                        >
                                            Generate Code
                                        </Button>
                                    </Grid>

                                    <Grid item xs={12} sm={6}>
                                        <Typography variant="subtitle1" fontWeight="700" sx={{ mb: 1, color: '#1A1A1A' }}>
                                            Join a Meeting
                                        </Typography>
                                        <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2.5, height: '40px' }}>
                                            Enter an existing code to join a call.
                                        </Typography>
                                        <TextField 
                                            fullWidth
                                            size="small"
                                            placeholder="Enter room code"
                                            value={meetingCode}
                                            onChange={e => setMeetingCode(e.target.value)}
                                            InputProps={{
                                                startAdornment: (
                                                    <InputAdornment position="start">
                                                        <KeyboardIcon sx={{ color: 'text.secondary', fontSize: 20 }} />
                                                    </InputAdornment>
                                                ),
                                                endAdornment: meetingCode ? (
                                                    <InputAdornment position="end">
                                                        <Tooltip title={copySuccess ? "Copied!" : "Copy Code"}>
                                                            <IconButton size="small" onClick={handleCopyCode}>
                                                                <ContentCopyIcon fontSize="small" />
                                                            </IconButton>
                                                        </Tooltip>
                                                    </InputAdornment>
                                                ) : null
                                            }}
                                            sx={{
                                                mb: 2,
                                                '& .MuiOutlinedInput-root': { borderRadius: '12px' }
                                            }}
                                        />
                                    </Grid>
                                </Grid>

                                <Divider sx={{ my: 3 }} />

                                <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                                    <Button
                                        variant="contained"
                                        disabled={!meetingCode.trim()}
                                        startIcon={<PlayArrowIcon />}
                                        onClick={handleJoinVideoCall}
                                        sx={{
                                            px: 4,
                                            py: 1.5,
                                            borderRadius: '12px',
                                            textTransform: 'none',
                                            fontWeight: '700',
                                            fontSize: '1rem',
                                            boxShadow: '0 4px 12px rgba(255,152,57,0.2)'
                                        }}
                                    >
                                        Start Call
                                    </Button>
                                </Box>
                            </Paper>
                        </Grid>

                        {/* Right Side Panel - Visual Banner */}
                        <Grid item xs={12} md={5} sx={{ display: 'flex', justifyContent: 'center' }}>
                            <Box 
                                sx={{ 
                                    position: 'relative', 
                                    p: 2, 
                                    borderRadius: '24px', 
                                    bgcolor: 'rgba(255,152,57,0.03)',
                                    border: '1px solid rgba(255,152,57,0.06)' 
                                }}
                            >
                                <Box 
                                    component="img"
                                    src="/logo3.png"
                                    alt="Apna Video Call Hero"
                                    sx={{
                                        maxWidth: '100%',
                                        height: { xs: '200px', sm: '280px', md: '340px' },
                                        width: 'auto',
                                        borderRadius: '20px',
                                        boxShadow: '0 12px 32px rgba(0,0,0,0.08)',
                                        transition: 'transform 0.3s ease',
                                        '&:hover': { transform: 'translateY(-4px)' }
                                    }}
                                />
                            </Box>
                        </Grid>
                    </Grid>
                </Container>
            </Box>
        </ThemeProvider>
    );
}

export default withAuth(HomeComponent);