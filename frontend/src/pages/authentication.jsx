import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { AuthContext } from '../contexts/AuthContext';
import { Snackbar } from '@mui/material';
import Alert from '@mui/material/Alert';
import CircularProgress from '@mui/material/CircularProgress';
import InputAdornment from '@mui/material/InputAdornment';
import { useLocation, useNavigate } from 'react-router-dom';

// Icons
import {
    LockOutlined as LockOutlinedIcon,
    PersonOutlined as PersonOutlineIcon,
    AccountCircleOutlined as AccountCircleOutlinedIcon,
    VisibilityOutlined as VisibilityOutlinedIcon,
    VisibilityOffOutlined as VisibilityOffOutlinedIcon,
    VideoCameraFront as VideoCameraFrontIcon,
    Security as SecurityIcon,
    Groups as GroupsIcon
} from '@mui/icons-material';

const customTheme = createTheme({
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
        fontFamily: [
            '-apple-system',
            'BlinkMacSystemFont',
            '"Segoe UI"',
            'Roboto',
            '"Helvetica Neue"',
            'Arial',
            'sans-serif',
        ].join(','),
    },
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    borderRadius: '8px',
                    textTransform: 'none',
                    fontWeight: 600,
                }
            }
        },
        MuiOutlinedInput: {
            styleOverrides: {
                root: {
                    borderRadius: '12px',
                }
            }
        }
    }
});

export default function Authentication() {
    const [username, setUsername] = React.useState("");
    const [password, setPassword] = React.useState("");
    const [name, setName] = React.useState("");
    const [error, setError] = React.useState("");
    const [message, setMessage] = React.useState("");
    const [formState, setFormState] = React.useState(0); // 0 = login, 1 = register
    const [open, setOpen] = React.useState(false);
    const [loading, setLoading] = React.useState(false);
    const [showPassword, setShowPassword] = React.useState(false);

    const location = useLocation();
    const router = useNavigate();

    React.useEffect(() => {
        if (localStorage.getItem("token")) {
            router("/home");
        }
    }, [router]);

    React.useEffect(() => {
        if (location.state && typeof location.state.formState === 'number') {
            setFormState(location.state.formState);
        }
    }, [location]);

    const { handleRegister, handleLogin } = React.useContext(AuthContext);

    const handleSwitchForm = (state) => {
        setFormState(state);
        setUsername("");
        setPassword("");
        setName("");
        setError("");
    };

    let handleAuth = async () => {
        setLoading(true);
        setError("");
        try {
            if (formState === 0) {
                await handleLogin(username, password);
            }
            if (formState === 1) {
                await handleRegister(name, username, password);
            }
        } catch (err) {
            console.log(err);
            if (err.response && err.response.data && err.response.data.message) {
                setError(err.response.data.message);
            } else {
                setError("An error occurred. Please try again.");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <ThemeProvider theme={customTheme}>
            <Grid container component="main" sx={{ height: '100vh', overflow: 'hidden' }}>
                <CssBaseline />
                
                {/* Left Column - Glowing Gradient with Features (only on sm and larger screens) */}
                <Grid
                    item
                    xs={false}
                    sm={5}
                    md={7}
                    sx={{
                        background: 'linear-gradient(135deg, #1A1A1A 0%, #0d0d0d 100%)',
                        position: 'relative',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                        color: 'white',
                        padding: 6,
                        overflow: 'hidden',
                        // Light circles for depth
                        '&::before': {
                            content: '""',
                            position: 'absolute',
                            top: '-10%',
                            left: '-10%',
                            width: '50%',
                            height: '50%',
                            borderRadius: '50%',
                            background: 'radial-gradient(circle, rgba(255,152,57,0.12) 0%, rgba(0,0,0,0) 70%)',
                            filter: 'blur(40px)',
                        },
                        '&::after': {
                            content: '""',
                            position: 'absolute',
                            bottom: '-10%',
                            right: '-10%',
                            width: '50%',
                            height: '50%',
                            borderRadius: '50%',
                            background: 'radial-gradient(circle, rgba(217,117,0,0.08) 0%, rgba(0,0,0,0) 70%)',
                            filter: 'blur(40px)',
                        }
                    }}
                >
                    <Box sx={{ maxWidth: '460px', zIndex: 2 }}>
                        <Typography 
                            variant="h3" 
                            component="h1" 
                            fontWeight="800" 
                            gutterBottom 
                            className="glow-orange"
                            sx={{ 
                                letterSpacing: '-1px',
                                fontFamily: '"Poppins", "Roboto", "Helvetica Neue", sans-serif',
                            }}
                        >
                            Apna <span style={{ color: '#FF9839' }}>Video Call</span>
                        </Typography>
                        <Typography variant="h6" sx={{ color: 'rgba(255,255,255,0.7)', mb: 5, fontWeight: '400', lineHeight: 1.5 }}>
                            Connect with family, friends, and colleagues instantly, securely, and seamlessly.
                        </Typography>

                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                            <Box sx={{ display: 'flex', gap: 2.5, alignItems: 'flex-start' }}>
                                <Avatar sx={{ bgcolor: 'rgba(255,152,57,0.12)', color: '#FF9839', width: 48, height: 48 }}>
                                    <VideoCameraFrontIcon />
                                </Avatar>
                                <Box>
                                    <Typography variant="subtitle1" fontWeight="700" sx={{ mb: 0.5 }}>HD Video & Audio</Typography>
                                    <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.5)', lineHeight: 1.4 }}>
                                        Experience crisp video and crystal clear sound quality optimized for low-bandwidth connections.
                                    </Typography>
                                </Box>
                            </Box>

                            <Box sx={{ display: 'flex', gap: 2.5, alignItems: 'flex-start' }}>
                                <Avatar sx={{ bgcolor: 'rgba(255,152,57,0.12)', color: '#FF9839', width: 48, height: 48 }}>
                                    <SecurityIcon />
                                </Avatar>
                                <Box>
                                    <Typography variant="subtitle1" fontWeight="700" sx={{ mb: 0.5 }}>Encrypted Connection</Typography>
                                    <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.5)', lineHeight: 1.4 }}>
                                        Your privacy is our priority. Every room is secure, keeping your meetings completely confidential.
                                    </Typography>
                                </Box>
                            </Box>

                            <Box sx={{ display: 'flex', gap: 2.5, alignItems: 'flex-start' }}>
                                <Avatar sx={{ bgcolor: 'rgba(255,152,57,0.12)', color: '#FF9839', width: 48, height: 48 }}>
                                    <GroupsIcon />
                                </Avatar>
                                <Box>
                                    <Typography variant="subtitle1" fontWeight="700" sx={{ mb: 0.5 }}>Instant Join & Share</Typography>
                                    <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.5)', lineHeight: 1.4 }}>
                                        No registration required for guests. Create or join meetings with a simple code or custom URL.
                                    </Typography>
                                </Box>
                            </Box>
                        </Box>
                    </Box>
                </Grid>

                {/* Right Column - Authentication Card */}
                <Grid 
                    item 
                    xs={12} 
                    sm={7} 
                    md={5} 
                    component={Paper} 
                    elevation={0} 
                    square 
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                        bgcolor: 'background.default',
                        p: { xs: 4, sm: 6, md: 8 }
                    }}
                >
                    <Box 
                        className="auth-form-animate"
                        sx={{ 
                            maxWidth: '400px', 
                            width: '100%', 
                            display: 'flex', 
                            flexDirection: 'column',
                            alignItems: 'stretch'
                        }}
                    >
                        {/* Header info */}
                        <Box sx={{ mb: 4, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
                            <Avatar 
                                sx={{ 
                                    mb: 2, 
                                    bgcolor: 'primary.main', 
                                    width: 56, 
                                    height: 56, 
                                    boxShadow: '0 4px 16px rgba(255,152,57,0.25)' 
                                }}
                            >
                                <LockOutlinedIcon fontSize="medium" />
                            </Avatar>
                            <Typography component="h2" variant="h5" fontWeight="800" color="#1A1A1A">
                                {formState === 0 ? "Welcome Back" : "Create Account"}
                            </Typography>
                            <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
                                {formState === 0 ? "Sign in to access your dashboard" : "Register to start hosting high-quality calls"}
                            </Typography>
                        </Box>

                        {/* Custom Sliding Tab Selector */}
                        <Box 
                            sx={{
                                display: 'flex',
                                bgcolor: 'rgba(0, 0, 0, 0.04)',
                                borderRadius: '12px',
                                p: '4px',
                                mb: 4
                            }}
                        >
                            <Button
                                fullWidth
                                onClick={() => handleSwitchForm(0)}
                                sx={{
                                    borderRadius: '8px',
                                    py: 1,
                                    fontSize: '0.9rem',
                                    color: formState === 0 ? 'white' : 'text.secondary',
                                    bgcolor: formState === 0 ? 'primary.main' : 'transparent',
                                    boxShadow: formState === 0 ? '0 2px 8px rgba(255,152,57,0.3)' : 'none',
                                    '&:hover': {
                                        bgcolor: formState === 0 ? 'primary.dark' : 'rgba(0,0,0,0.02)',
                                    },
                                    transition: 'all 0.25s ease'
                                }}
                            >
                                Sign In
                            </Button>
                            <Button
                                fullWidth
                                onClick={() => handleSwitchForm(1)}
                                sx={{
                                    borderRadius: '8px',
                                    py: 1,
                                    fontSize: '0.9rem',
                                    color: formState === 1 ? 'white' : 'text.secondary',
                                    bgcolor: formState === 1 ? 'primary.main' : 'transparent',
                                    boxShadow: formState === 1 ? '0 2px 8px rgba(255,152,57,0.3)' : 'none',
                                    '&:hover': {
                                        bgcolor: formState === 1 ? 'primary.dark' : 'rgba(0,0,0,0.02)',
                                    },
                                    transition: 'all 0.25s ease'
                                }}
                            >
                                Sign Up
                            </Button>
                        </Box>

                        {/* Form Fields */}
                        <Box component="form" noValidate onSubmit={(e) => { e.preventDefault(); handleAuth(); }}>
                            {formState === 1 && (
                                <TextField
                                    margin="normal"
                                    required
                                    fullWidth
                                    id="name"
                                    label="Full Name"
                                    name="name"
                                    value={name}
                                    autoFocus
                                    onChange={(e) => setName(e.target.value)}
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <PersonOutlineIcon sx={{ color: 'text.secondary' }} />
                                            </InputAdornment>
                                        ),
                                    }}
                                />
                            )}

                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                id="username"
                                label="Username"
                                name="username"
                                value={username}
                                autoFocus={formState === 0}
                                onChange={(e) => setUsername(e.target.value)}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <AccountCircleOutlinedIcon sx={{ color: 'text.secondary' }} />
                                        </InputAdornment>
                                    ),
                                }}
                            />

                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                name="password"
                                label="Password"
                                value={password}
                                type={showPassword ? 'text' : 'password'}
                                onChange={(e) => setPassword(e.target.value)}
                                id="password"
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <LockOutlinedIcon sx={{ color: 'text.secondary' }} />
                                        </InputAdornment>
                                    ),
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton
                                                aria-label="toggle password visibility"
                                                onClick={() => setShowPassword(!showPassword)}
                                                edge="end"
                                            >
                                                {showPassword ? <VisibilityOffOutlinedIcon /> : <VisibilityOutlinedIcon />}
                                            </IconButton>
                                        </InputAdornment>
                                    )
                                }}
                            />

                            {error && (
                                <Alert severity="error" sx={{ mt: 3, borderRadius: '12px', border: '1px solid rgba(211, 47, 47, 0.1)' }}>
                                    {error}
                                </Alert>
                            )}

                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                disabled={loading}
                                sx={{
                                    mt: 4,
                                    mb: 2,
                                    py: 1.5,
                                    borderRadius: '12px',
                                    fontSize: '1rem',
                                    boxShadow: '0 4px 12px rgba(255,152,57,0.25)',
                                    transition: 'all 0.2s ease',
                                    '&:hover': {
                                        boxShadow: '0 6px 20px rgba(255,152,57,0.35)',
                                    }
                                }}
                            >
                                {loading ? (
                                    <CircularProgress size={24} sx={{ color: 'primary.contrastText' }} />
                                ) : (
                                    formState === 0 ? "Login" : "Register"
                                )}
                            </Button>
                        </Box>
                    </Box>
                </Grid>
            </Grid>

            <Snackbar
                open={open}
                autoHideDuration={4000}
                message={message}
                onClose={() => setOpen(false)}
            />
        </ThemeProvider>
    );
}