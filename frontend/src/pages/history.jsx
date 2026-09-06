import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Button, Box, Typography, Container, Grid, Paper, Card, CardContent, CardActions, IconButton, Tooltip, Divider, AppBar, Toolbar, Avatar } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import HistoryIcon from '@mui/icons-material/History';
import VideoCallIcon from '@mui/icons-material/VideoCall';
import EventIcon from '@mui/icons-material/Event';
import CodeIcon from '@mui/icons-material/Code';
import { createTheme, ThemeProvider } from '@mui/material/styles';

const historyTheme = createTheme({
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

export default function History() {
    const { getHistoryOfUser } = useContext(AuthContext);
    const [meetings, setMeetings] = useState([]);
    const [copiedIndex, setCopiedIndex] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const history = await getHistoryOfUser();
                setMeetings(history);
            } catch (err) {
                console.log("Error fetching history:", err);
            }
        };

        fetchHistory();
    }, [getHistoryOfUser]);

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const day = date.getDate().toString().padStart(2, "0");
        const month = (date.getMonth() + 1).toString().padStart(2, "0");
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    };

    const handleCopyCode = (code, index) => {
        navigator.clipboard.writeText(code);
        setCopiedIndex(index);
        setTimeout(() => setCopiedIndex(null), 2000);
    };

    return (
        <ThemeProvider theme={historyTheme}>
            <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', display: 'flex', flexDirection: 'column' }}>
                {/* Navbar */}
                <AppBar position="static" color="inherit" elevation={0} sx={{ borderBottom: '1px solid rgba(0,0,0,0.06)', py: 0.5 }}>
                    <Container maxWidth="lg">
                        <Toolbar sx={{ display: 'flex', gap: 2, px: '0 !important' }}>
                            <IconButton onClick={() => navigate("/home")} sx={{ color: 'text.primary' }}>
                                <ArrowBackIcon />
                            </IconButton>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <HistoryIcon sx={{ color: 'primary.main', fontSize: 28 }} />
                                <Typography variant="h6" fontWeight="800" color="#1A1A1A">
                                    Meeting History
                                </Typography>
                            </Box>
                        </Toolbar>
                    </Container>
                </AppBar>

                {/* Dashboard Area */}
                <Container maxWidth="lg" sx={{ flexGrow: 1, py: 6 }}>
                    {meetings.length === 0 ? (
                        /* Empty State */
                        <Paper 
                            elevation={0} 
                            sx={{ 
                                p: 8, 
                                borderRadius: '16px', 
                                border: '1px solid rgba(0,0,0,0.06)', 
                                bgcolor: 'white',
                                textAlign: 'center',
                                maxWidth: '500px',
                                mx: 'auto',
                                mt: 4
                            }}
                        >
                            <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
                                <Avatar sx={{ bgcolor: 'rgba(255,152,57,0.1)', color: 'primary.main', width: 80, height: 80 }}>
                                    <VideoCallIcon sx={{ fontSize: 44 }} />
                                </Avatar>
                            </Box>
                            <Typography variant="h5" fontWeight="800" color="#1A1A1A" sx={{ mb: 1.5 }}>
                                No meeting history found
                            </Typography>
                            <Typography variant="body2" color="textSecondary" sx={{ mb: 4, px: 2 }}>
                                You haven't hosted or joined any meeting rooms yet. Start a new video call now!
                            </Typography>
                            <Button 
                                variant="contained" 
                                onClick={() => navigate("/home")}
                                sx={{ 
                                    borderRadius: '12px', 
                                    px: 4, 
                                    py: 1.5,
                                    textTransform: 'none',
                                    fontWeight: '700'
                                }}
                            >
                                Host a Call
                            </Button>
                        </Paper>
                    ) : (
                        /* Meeting List */
                        <Box>
                            <Typography variant="subtitle1" fontWeight="700" color="textSecondary" sx={{ mb: 3 }}>
                                Showing past {meetings.length} meeting room {meetings.length === 1 ? 'activity' : 'activities'}
                            </Typography>
                            <Grid container spacing={3}>
                                {meetings.map((item, index) => (
                                    <Grid item xs={12} sm={6} md={4} key={index}>
                                        <Card 
                                            elevation={0} 
                                            sx={{ 
                                                borderRadius: '16px', 
                                                border: '1px solid rgba(0,0,0,0.06)', 
                                                bgcolor: 'white',
                                                transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                                                '&:hover': {
                                                    transform: 'translateY(-2px)',
                                                    boxShadow: '0 8px 24px rgba(0,0,0,0.04)'
                                                }
                                            }}
                                        >
                                            <CardContent sx={{ pb: 1.5 }}>
                                                {/* Header Details */}
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                                                    <CodeIcon fontSize="small" sx={{ color: 'primary.main' }} />
                                                    <Typography variant="body2" fontWeight="700" color="#1A1A1A">
                                                        Code: {item.meetingCode}
                                                    </Typography>
                                                </Box>
                                                
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'text.secondary' }}>
                                                    <EventIcon fontSize="small" sx={{ fontSize: 18 }} />
                                                    <Typography variant="caption">
                                                        Joined on: {formatDate(item.date)}
                                                    </Typography>
                                                </Box>
                                            </CardContent>

                                            <Divider sx={{ borderStyle: 'dashed' }} />

                                            <CardActions sx={{ justifyContent: 'space-between', px: 2, py: 1.5 }}>
                                                <Tooltip title={copiedIndex === index ? "Copied!" : "Copy Code"}>
                                                    <Button 
                                                        size="small" 
                                                        color="inherit" 
                                                        startIcon={<ContentCopyIcon sx={{ fontSize: 16 }} />}
                                                        onClick={() => handleCopyCode(item.meetingCode, index)}
                                                        sx={{ 
                                                            fontSize: '0.8rem', 
                                                            textTransform: 'none',
                                                            color: 'text.secondary',
                                                            '&:hover': { color: 'primary.main' }
                                                        }}
                                                    >
                                                        Copy
                                                    </Button>
                                                </Tooltip>

                                                <Button 
                                                    size="small" 
                                                    variant="contained"
                                                    startIcon={<PlayArrowIcon />}
                                                    onClick={() => navigate(`/${item.meetingCode}`)}
                                                    sx={{ 
                                                        fontSize: '0.8rem', 
                                                        borderRadius: '8px',
                                                        textTransform: 'none',
                                                        fontWeight: '600',
                                                        px: 2
                                                    }}
                                                >
                                                    Rejoin
                                                </Button>
                                            </CardActions>
                                        </Card>
                                    </Grid>
                                ))}
                            </Grid>
                        </Box>
                    )}
                </Container>
            </Box>
        </ThemeProvider>
    );
}