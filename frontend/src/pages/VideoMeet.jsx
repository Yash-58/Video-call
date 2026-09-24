import React, { useEffect, useRef, useState } from 'react';
import io from "socket.io-client";
import { Badge, IconButton, TextField, Button, Box, Typography, Grid, Paper, Tooltip, CssBaseline } from '@mui/material';
import VideocamIcon from '@mui/icons-material/Videocam';
import VideocamOffIcon from '@mui/icons-material/VideocamOff';
import styles from "../styles/videoComponent.module.css";
import CallEndIcon from '@mui/icons-material/CallEnd';
import MicIcon from '@mui/icons-material/Mic';
import MicOffIcon from '@mui/icons-material/MicOff';
import ScreenShareIcon from '@mui/icons-material/ScreenShare';
import StopScreenShareIcon from '@mui/icons-material/StopScreenShare';
import ChatIcon from '@mui/icons-material/Chat';
import CloseIcon from '@mui/icons-material/Close';
import SendIcon from '@mui/icons-material/Send';
import server from '../environment';
import { createTheme, ThemeProvider } from '@mui/material/styles';

const server_url = server;

var connections = {};

const peerConfigConnections = {
    "iceServers": [
        { "urls": "stun:stun.l.google.com:19302" },
        { "urls": "stun:stun1.l.google.com:19302" },
        { "urls": "stun:stun2.l.google.com:19302" },
        { "urls": "stun:stun3.l.google.com:19302" },
        { "urls": "stun:stun4.l.google.com:19302" }
    ]
};

const darkTheme = createTheme({
    palette: {
        mode: 'dark',
        primary: {
            main: '#FF9839',
            dark: '#D97500',
            contrastText: '#ffffff',
        },
        background: {
            default: '#121212',
            paper: '#1A1A1A',
        }
    },
    typography: {
        fontFamily: '"Poppins", "Roboto", "Helvetica Neue", sans-serif',
    }
});

export default function VideoMeetComponent() {
    var socketRef = useRef();
    let socketIdRef = useRef();

    let localVideoref = useRef();

    let [videoAvailable, setVideoAvailable] = useState(true);
    let [audioAvailable, setAudioAvailable] = useState(true);
    let [video, setVideo] = useState(true);
    let [audio, setAudio] = useState(true);
    let [screen, setScreen] = useState(false);
    let [showModal, setModal] = useState(false);
    let [screenAvailable, setScreenAvailable] = useState(false);
    let [messages, setMessages] = useState([]);
    let [message, setMessage] = useState("");
    let [newMessages, setNewMessages] = useState(0);
    let [askForUsername, setAskForUsername] = useState(true);
    let [username, setUsername] = useState("");
    const videoRef = useRef([]);
    let [videos, setVideos] = useState([]);

    const getPermissions = async () => {
        try {
            if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
                console.warn("navigator.mediaDevices is not available. Please ensure the app is opened via HTTPS or localhost.");
                setVideoAvailable(false);
                setAudioAvailable(false);
                setVideo(false);
                setAudio(false);
                return;
            }
            const userMediaStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
            if (userMediaStream) {
                window.localStream = userMediaStream;
                if (localVideoref.current) {
                    localVideoref.current.srcObject = userMediaStream;
                    localVideoref.current.play().catch(() => {});
                }
                setVideoAvailable(true);
                setAudioAvailable(true);
                setVideo(true);
                setAudio(true);
            }
        } catch (error) {
            console.log("Error getting media with video+audio:", error);
            try {
                const videoStream = await navigator.mediaDevices.getUserMedia({ video: true });
                window.localStream = videoStream;
                if (localVideoref.current) {
                    localVideoref.current.srcObject = videoStream;
                    localVideoref.current.play().catch(() => {});
                }
                setVideoAvailable(true);
                setAudioAvailable(false);
                setVideo(true);
                setAudio(false);
            } catch (videoError) {
                try {
                    const audioStream = await navigator.mediaDevices.getUserMedia({ audio: true });
                    window.localStream = audioStream;
                    if (localVideoref.current) {
                        localVideoref.current.srcObject = audioStream;
                    }
                    setVideoAvailable(false);
                    setAudioAvailable(true);
                    setVideo(false);
                    setAudio(true);
                } catch (audioError) {
                    console.log("No media devices available:", audioError);
                    setVideoAvailable(false);
                    setAudioAvailable(false);
                    setVideo(false);
                    setAudio(false);
                }
            }
        }

        if (navigator.mediaDevices && navigator.mediaDevices.getDisplayMedia) {
            setScreenAvailable(true);
        } else {
            setScreenAvailable(false);
        }
    };

    useEffect(() => {
        getPermissions();
        return () => {
            if (window.localStream) {
                try {
                    window.localStream.getTracks().forEach(track => track.stop());
                } catch (e) {
                    console.log(e);
                }
            }
            if (socketRef.current) {
                socketRef.current.disconnect();
            }
        };
    }, []);

    useEffect(() => {
        if (localVideoref.current && window.localStream) {
            if (localVideoref.current.srcObject !== window.localStream) {
                localVideoref.current.srcObject = window.localStream;
            }
            localVideoref.current.play().catch(() => {});
        }
    }, [askForUsername, video]);

    let handleVideo = () => {
        setVideo((prevVideo) => {
            const nextVideo = !prevVideo;
            if (window.localStream) {
                const videoTracks = window.localStream.getVideoTracks();
                videoTracks.forEach(track => {
                    track.enabled = nextVideo;
                });
            }
            return nextVideo;
        });
    };

    let handleAudio = () => {
        setAudio((prevAudio) => {
            const nextAudio = !prevAudio;
            if (window.localStream) {
                const audioTracks = window.localStream.getAudioTracks();
                audioTracks.forEach(track => {
                    track.enabled = nextAudio;
                });
            }
            return nextAudio;
        });
    };

    let getDislayMedia = () => {
        if (screen) {
            if (navigator.mediaDevices && navigator.mediaDevices.getDisplayMedia) {
                navigator.mediaDevices.getDisplayMedia({ video: true, audio: true })
                    .then(getDislayMediaSuccess)
                    .then((stream) => { })
                    .catch((e) => {
                        console.log(e);
                        setScreen(false);
                    });
            }
        }
    };

    let getDislayMediaSuccess = (stream) => {
        try {
            window.localStream.getTracks().forEach(track => track.stop());
        } catch (e) { console.log(e); }

        window.localStream = stream;
        if (localVideoref.current) {
            localVideoref.current.srcObject = stream;
        }

        for (let id in connections) {
            if (id === socketIdRef.current) continue;

            connections[id].addStream(window.localStream);

            connections[id].createOffer().then((description) => {
                connections[id].setLocalDescription(description)
                    .then(() => {
                        socketRef.current.emit('signal', id, JSON.stringify({ 'sdp': connections[id].localDescription }));
                    })
                    .catch(e => console.log(e));
            });
        }

        stream.getTracks().forEach(track => track.onended = () => {
            setScreen(false);

            try {
                let tracks = localVideoref.current.srcObject.getTracks();
                tracks.forEach(track => track.stop());
            } catch (e) { console.log(e); }

            navigator.mediaDevices.getUserMedia({ video: true, audio: true })
                .then((userMediaStream) => {
                    window.localStream = userMediaStream;
                    if (localVideoref.current) {
                        localVideoref.current.srcObject = userMediaStream;
                    }
                    userMediaStream.getVideoTracks().forEach(t => t.enabled = video);
                    userMediaStream.getAudioTracks().forEach(t => t.enabled = audio);

                    for (let id in connections) {
                        if (id === socketIdRef.current) continue;
                        try {
                            connections[id].addStream(window.localStream);
                            connections[id].createOffer().then((description) => {
                                connections[id].setLocalDescription(description)
                                    .then(() => {
                                        socketRef.current.emit('signal', id, JSON.stringify({ 'sdp': connections[id].localDescription }));
                                    })
                                    .catch(e => console.log(e));
                            });
                        } catch (e) { console.log(e); }
                    }
                })
                .catch(e => console.log(e));
        });
    };

    useEffect(() => {
        if (screen) {
            getDislayMedia();
        }
    }, [screen]);

    let handleScreen = () => {
        setScreen(!screen);
    };

    let handleEndCall = () => {
        try {
            if (localVideoref.current && localVideoref.current.srcObject) {
                let tracks = localVideoref.current.srcObject.getTracks();
                tracks.forEach(track => track.stop());
            }
        } catch (e) { }
        if (window.localStream) {
            try {
                window.localStream.getTracks().forEach(track => track.stop());
            } catch (e) { }
        }
        window.location.href = "/";
    };

    let silence = () => {
        let ctx = new AudioContext();
        let oscillator = ctx.createOscillator();
        let dst = oscillator.connect(ctx.createMediaStreamDestination());
        oscillator.start();
        ctx.resume();
        return Object.assign(dst.stream.getAudioTracks()[0], { enabled: false });
    };

    let black = ({ width = 640, height = 480 } = {}) => {
        let canvas = Object.assign(document.createElement("canvas"), { width, height });
        canvas.getContext('2d').fillRect(0, 0, width, height);
        let stream = canvas.captureStream();
        return Object.assign(stream.getVideoTracks()[0], { enabled: false });
    };

    let gotMessageFromServer = (fromId, message) => {
        var signal = JSON.parse(message);

        if (fromId !== socketIdRef.current) {
            if (signal.sdp) {
                connections[fromId].setRemoteDescription(new RTCSessionDescription(signal.sdp)).then(() => {
                    if (signal.sdp.type === 'offer') {
                        connections[fromId].createAnswer().then((description) => {
                            connections[fromId].setLocalDescription(description).then(() => {
                                socketRef.current.emit('signal', fromId, JSON.stringify({ 'sdp': connections[fromId].localDescription }));
                            }).catch(e => console.log(e));
                        }).catch(e => console.log(e));
                    }
                }).catch(e => console.log(e));
            }

            if (signal.ice) {
                connections[fromId].addIceCandidate(new RTCIceCandidate(signal.ice)).catch(e => console.log(e));
            }
        }
    };

    let connectToSocketServer = () => {
        socketRef.current = io(server_url, {
            transports: ["websocket", "polling"],
            secure: typeof server_url === "string" && server_url.startsWith("https")
        });

        socketRef.current.on('signal', gotMessageFromServer);

        socketRef.current.on('connect', () => {
            const roomName = window.location.pathname.replace(/^\/+|\/+$/g, '') || "default";
            socketRef.current.emit('join-call', roomName);
            socketIdRef.current = socketRef.current.id;

            socketRef.current.on('chat-message', addMessage);

            socketRef.current.on('user-left', (id) => {
                setVideos((videos) => videos.filter((video) => video.socketId !== id));
            });

            socketRef.current.on('user-joined', (id, clients) => {
                clients.forEach((socketListId) => {
                    connections[socketListId] = new RTCPeerConnection(peerConfigConnections);
                    
                    connections[socketListId].onicecandidate = function (event) {
                        if (event.candidate != null) {
                            socketRef.current.emit('signal', socketListId, JSON.stringify({ 'ice': event.candidate }));
                        }
                    };

                    connections[socketListId].onaddstream = (event) => {
                        let videoExists = videoRef.current.find(video => video.socketId === socketListId);

                        if (videoExists) {
                            setVideos(videos => {
                                const updatedVideos = videos.map(video =>
                                    video.socketId === socketListId ? { ...video, stream: event.stream } : video
                                );
                                videoRef.current = updatedVideos;
                                return updatedVideos;
                            });
                        } else {
                            let newVideo = {
                                socketId: socketListId,
                                stream: event.stream,
                                autoplay: true,
                                playsinline: true
                            };

                            setVideos(videos => {
                                const updatedVideos = [...videos, newVideo];
                                videoRef.current = updatedVideos;
                                return updatedVideos;
                            });
                        }
                    };

                    if (window.localStream !== undefined && window.localStream !== null) {
                        connections[socketListId].addStream(window.localStream);
                    } else {
                        let blackSilence = (...args) => new MediaStream([black(...args), silence()]);
                        window.localStream = blackSilence();
                        connections[socketListId].addStream(window.localStream);
                    }
                });

                if (id === socketIdRef.current) {
                    for (let id2 in connections) {
                        if (id2 === socketIdRef.current) continue;

                        connections[id2].createOffer().then((description) => {
                            connections[id2].setLocalDescription(description)
                                .then(() => {
                                    socketRef.current.emit('signal', id2, JSON.stringify({ 'sdp': connections[id2].localDescription }));
                                })
                                .catch(e => console.log(e));
                        });
                    }
                }
            });
        });
    };

    let getMedia = () => {
        connectToSocketServer();
    };

    let connect = () => {
        setAskForUsername(false);
        getMedia();
    };

    const addMessage = (data, sender, socketIdSender) => {
        setMessages((prevMessages) => [
            ...prevMessages,
            { sender: sender, data: data }
        ]);
        if (socketIdSender !== socketIdRef.current) {
            setNewMessages((prevNewMessages) => prevNewMessages + 1);
        }
    };

    let sendMessage = () => {
        if (!message.trim()) return;
        socketRef.current.emit('chat-message', message, username);
        setMessage("");
    };

    return (
        <ThemeProvider theme={darkTheme}>
            <CssBaseline />
            {askForUsername === true ? (
                /* Pre-Join Lobby screen */
                <Box sx={{ 
                    minHeight: '100vh', 
                    bgcolor: 'background.default', 
                    color: 'white', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    p: 3
                }}>
                    <Paper 
                        elevation={12} 
                        sx={{ 
                            p: { xs: 4, md: 5 }, 
                            borderRadius: '24px', 
                            maxWidth: '900px', 
                            width: '100%', 
                            bgcolor: 'background.paper',
                            border: '1px solid rgba(255,255,255,0.06)'
                        }}
                    >
                        <Grid container spacing={4} alignItems="center">
                            {/* Left Side: Video Preview Card */}
                            <Grid item xs={12} md={6}>
                                <Typography variant="h6" fontWeight="700" sx={{ mb: 2, color: 'white', textAlign: { xs: 'center', md: 'left' } }}>
                                    Lobby Preview
                                </Typography>
                                
                                <Box sx={{ 
                                    position: 'relative', 
                                    width: '100%', 
                                    aspectRatio: '16/9', 
                                    borderRadius: '16px', 
                                    overflow: 'hidden', 
                                    bgcolor: '#000000',
                                    border: '1px solid rgba(255,255,255,0.1)',
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    boxShadow: '0 8px 32px rgba(0,0,0,0.3)'
                                }}>
                                    <video 
                                        ref={(node) => {
                                            localVideoref.current = node;
                                            if (node && window.localStream) {
                                                if (node.srcObject !== window.localStream) {
                                                    node.srcObject = window.localStream;
                                                }
                                                node.play().catch(() => {});
                                            }
                                        }} 
                                        autoPlay 
                                        muted 
                                        playsInline
                                        style={{ 
                                            width: '100%', 
                                            height: '100%', 
                                            objectFit: 'cover',
                                            transform: 'scaleX(-1)',
                                            display: video ? 'block' : 'none'
                                        }}
                                    />

                                    {!video && (
                                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', color: 'rgba(255,255,255,0.6)' }}>
                                            <VideocamOffIcon sx={{ fontSize: 56, mb: 1, color: 'rgba(255,255,255,0.4)' }} />
                                            <Typography variant="body2">Camera is Off</Typography>
                                        </Box>
                                    )}
                                    
                                    {/* Overlay Controls */}
                                    <Box sx={{ 
                                        position: 'absolute', 
                                        bottom: 12, 
                                        left: '50%', 
                                        transform: 'translateX(-50%)', 
                                        display: 'flex', 
                                        gap: 1.5,
                                        bgcolor: 'rgba(0,0,0,0.6)',
                                        borderRadius: '30px',
                                        p: 0.5,
                                        backdropFilter: 'blur(8px)',
                                        border: '1px solid rgba(255,255,255,0.15)'
                                    }}>
                                        <IconButton 
                                            onClick={handleAudio} 
                                            color={audio === true ? "primary" : "default"}
                                            sx={{ bgcolor: audio === true ? 'rgba(255,152,57,0.15)' : 'transparent' }}
                                        >
                                            {audio === true ? <MicIcon /> : <MicOffIcon color="error" />}
                                        </IconButton>
                                        <IconButton 
                                            onClick={handleVideo} 
                                            color={video === true ? "primary" : "default"}
                                            sx={{ bgcolor: video === true ? 'rgba(255,152,57,0.15)' : 'transparent' }}
                                        >
                                            {video === true ? <VideocamIcon /> : <VideocamOffIcon color="error" />}
                                        </IconButton>
                                    </Box>
                                </Box>
                            </Grid>

                            {/* Right Side: Action Lobby Form */}
                            <Grid item xs={12} md={6}>
                                <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'center' }}>
                                    <Typography variant="h4" fontWeight="800" sx={{ mb: 1, letterSpacing: '-0.5px' }}>
                                        Join Meeting Room
                                    </Typography>
                                    <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.6)', mb: 4 }}>
                                        Enter your name to represent yourself to other participants.
                                    </Typography>

                                    <TextField 
                                        fullWidth
                                        label="Display Name" 
                                        variant="outlined" 
                                        value={username} 
                                        onChange={e => setUsername(e.target.value)}
                                        placeholder="Enter your display name"
                                        sx={{ 
                                            mb: 4,
                                            '& .MuiOutlinedInput-root': {
                                                borderRadius: '12px',
                                                bgcolor: 'rgba(255,255,255,0.03)'
                                            }
                                        }}
                                    />

                                    <Button 
                                        fullWidth
                                        variant="contained" 
                                        disabled={!username.trim()}
                                        onClick={connect}
                                        sx={{ 
                                            py: 1.8, 
                                            borderRadius: '12px', 
                                            fontWeight: '700', 
                                            fontSize: '1rem',
                                            textTransform: 'none',
                                            boxShadow: '0 4px 16px rgba(255,152,57,0.3)'
                                        }}
                                    >
                                        Enter Room
                                    </Button>
                                </Box>
                            </Grid>
                        </Grid>
                    </Paper>
                </Box>
            ) : (
                /* In-call conference grid layout */
                <div className={styles.meetVideoContainer}>
                    {/* Main Call Video/Control Area */}
                    <div className={styles.mainCallArea}>
                        {/* Video Grid */}
                        <div className={styles.videoGridContainer}>
                            <div className={styles.videoGrid}>
                                {/* Local User Video */}
                                <div className={styles.videoWrapper}>
                                    <video 
                                        ref={(node) => {
                                            localVideoref.current = node;
                                            if (node && window.localStream) {
                                                if (node.srcObject !== window.localStream) {
                                                    node.srcObject = window.localStream;
                                                }
                                                node.play().catch(() => {});
                                            }
                                        }} 
                                        autoPlay 
                                        muted
                                        playsInline
                                        style={{ display: video ? 'block' : 'none' }}
                                    ></video>
                                    {!video && (
                                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'rgba(255,255,255,0.6)', height: '100%' }}>
                                            <VideocamOffIcon sx={{ fontSize: 56, mb: 1, color: 'rgba(255,255,255,0.4)' }} />
                                            <Typography variant="body2">Camera is Off</Typography>
                                        </div>
                                    )}
                                    <div className={styles.nameTag}>
                                        You {(!video) && "(Camera Off)"}
                                    </div>
                                </div>
                                
                                {/* Peer Videos */}
                                {videos.map((vid) => (
                                    <div className={styles.videoWrapper} key={vid.socketId}>
                                        <video
                                            data-socket={vid.socketId}
                                            ref={ref => {
                                                if (ref && vid.stream) {
                                                    ref.srcObject = vid.stream;
                                                }
                                            }}
                                            autoPlay
                                            playsInline={vid.playsinline}
                                        />
                                        <div className={styles.nameTag}>
                                            Participant ({vid.socketId.substring(0, 4)})
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Glassmorphic Toolbar Controls */}
                        <div className={styles.buttonContainers}>
                            <Tooltip title={video === true ? "Turn Camera Off" : "Turn Camera On"}>
                                <IconButton 
                                    onClick={handleVideo} 
                                    sx={{ 
                                        color: 'white', 
                                        bgcolor: video === true ? 'rgba(255, 255, 255, 0.1)' : 'rgba(211, 47, 47, 0.2)',
                                        p: 1.5,
                                        '&:hover': {
                                            bgcolor: video === true ? 'rgba(255, 255, 255, 0.2)' : 'rgba(211, 47, 47, 0.3)'
                                        }
                                    }}
                                >
                                    {video === true ? <VideocamIcon /> : <VideocamOffIcon color="error" />}
                                </IconButton>
                            </Tooltip>
                            
                            <Tooltip title={audio === true ? "Mute Microphone" : "Unmute Microphone"}>
                                <IconButton 
                                    onClick={handleAudio} 
                                    sx={{ 
                                        color: 'white', 
                                        bgcolor: audio === true ? 'rgba(255, 255, 255, 0.1)' : 'rgba(211, 47, 47, 0.2)',
                                        p: 1.5,
                                        '&:hover': {
                                            bgcolor: audio === true ? 'rgba(255, 255, 255, 0.2)' : 'rgba(211, 47, 47, 0.3)'
                                        }
                                    }}
                                >
                                    {audio === true ? <MicIcon /> : <MicOffIcon color="error" />}
                                </IconButton>
                            </Tooltip>

                            {screenAvailable === true && (
                                <Tooltip title={screen === true ? "Stop Sharing Screen" : "Share Screen"}>
                                    <IconButton 
                                        onClick={handleScreen} 
                                        sx={{ 
                                            color: 'white', 
                                            bgcolor: screen === true ? 'rgba(255, 152, 57, 0.2)' : 'rgba(255, 255, 255, 0.1)',
                                            p: 1.5,
                                            '&:hover': {
                                                bgcolor: screen === true ? 'rgba(255, 152, 57, 0.3)' : 'rgba(255, 255, 255, 0.2)'
                                            }
                                        }}
                                    >
                                        {screen === true ? <ScreenShareIcon /> : <StopScreenShareIcon />}
                                    </IconButton>
                                </Tooltip>
                            )}

                            <Tooltip title="Toggle Chat">
                                <Badge badgeContent={newMessages} max={99} color="primary">
                                    <IconButton 
                                        onClick={() => {
                                            setModal(!showModal);
                                            if (!showModal) {
                                                setNewMessages(0);
                                            }
                                        }} 
                                        sx={{ 
                                            color: 'white', 
                                            bgcolor: showModal ? 'rgba(255, 152, 57, 0.2)' : 'rgba(255, 255, 255, 0.1)',
                                            p: 1.5,
                                            '&:hover': {
                                                bgcolor: showModal ? 'rgba(255, 152, 57, 0.3)' : 'rgba(255, 255, 255, 0.2)'
                                            }
                                        }}
                                    >
                                        <ChatIcon />
                                    </IconButton>
                                </Badge>
                            </Tooltip>

                            <Tooltip title="End Video Call">
                                <IconButton 
                                    onClick={handleEndCall} 
                                    sx={{ 
                                        color: 'white', 
                                        bgcolor: 'error.main',
                                        p: 1.5,
                                        '&:hover': {
                                            bgcolor: 'error.dark',
                                            transform: 'scale(1.05)'
                                        }
                                    }}
                                >
                                    <CallEndIcon />
                                </IconButton>
                            </Tooltip>
                        </div>
                    </div>

                    {/* Sidebar Chat Drawer Panel */}
                    {showModal && (
                        <div className={styles.chatRoom}>
                            <div className={styles.chatContainer}>
                                <div className={styles.chatHeader}>
                                    <h3>Meeting Chat</h3>
                                    <IconButton size="small" onClick={() => setModal(false)} sx={{ color: 'rgba(255,255,255,0.6)' }}>
                                        <CloseIcon fontSize="small" />
                                    </IconButton>
                                </div>

                                <div className={styles.chattingDisplay}>
                                    {messages.length !== 0 ? (
                                        messages.map((item, index) => {
                                            const isSelf = item.sender === username;
                                            return (
                                                <div 
                                                    className={`${styles.messageBubble} ${isSelf ? styles.self : styles.other}`}
                                                    key={index}
                                                >
                                                    {!isSelf && <div className={styles.messageSender}>{item.sender}</div>}
                                                    <p className={styles.messageText}>{item.data}</p>
                                                </div>
                                            );
                                        })
                                    ) : (
                                        <div className={styles.noMessages}>No messages in this chat room yet.</div>
                                    )}
                                </div>

                                <div className={styles.chattingArea}>
                                    <TextField 
                                        fullWidth
                                        size="small"
                                        placeholder="Type message..." 
                                        value={message} 
                                        onChange={(e) => setMessage(e.target.value)}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter' && !e.shiftKey) {
                                                e.preventDefault();
                                                sendMessage();
                                            }
                                        }}
                                        sx={{
                                            '& .MuiOutlinedInput-root': {
                                                borderRadius: '20px',
                                                bgcolor: 'rgba(255,255,255,0.03)',
                                                fontSize: '0.9rem'
                                            }
                                        }}
                                    />
                                    <IconButton 
                                        onClick={sendMessage} 
                                        disabled={!message.trim()}
                                        color="primary"
                                        sx={{ 
                                            bgcolor: message.trim() ? 'rgba(255,152,57,0.15)' : 'transparent',
                                            '&:hover': {
                                                bgcolor: 'rgba(255,152,57,0.25)'
                                            }
                                        }}
                                    >
                                        <SendIcon fontSize="small" />
                                    </IconButton>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </ThemeProvider>
    );
}