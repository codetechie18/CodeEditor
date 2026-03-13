const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const axios = require('axios');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

// Models (Ensure your models/User.js exists)
const User = require('./models/User');

const app = express();
app.use(cors());
app.use(express.json());

// 1. Database Connection
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/collab-code";
mongoose
    .connect(MONGODB_URI)
    .then(() => console.log("✅ Connected to MongoDB!"))
    .catch((err) => console.error("❌ Failed to connect to MongoDB:", err));

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*", // Production mein yahan apne frontend ka URL daalein
    }
});

// 2. Auth Routes
const JWT_SECRET = process.env.JWT_SECRET || 'supersecretkey123';

app.post('/api/auth/register', async (req, res) => {
    try {
        const { username, email, password } = req.body;
        if (!username || !email || !password) {
            return res.status(400).json({ error: 'All fields are required' });
        }
        const existingUser = await User.findOne({ $or: [{ username }, { email }] });
        if (existingUser) {
            return res.status(400).json({ error: 'Username or email already exists' });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ username, email, password: hashedPassword });
        await newUser.save();

        const token = jwt.sign({ userId: newUser._id, username }, JWT_SECRET, { expiresIn: '1d' });
        res.status(201).json({ message: 'User registered', token, username });
    } catch (err) {
        res.status(500).json({ error: 'Registration failed' });
    }
});

app.post('/api/auth/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(400).json({ error: 'Invalid credentials' });
        }
        const token = jwt.sign({ userId: user._id, username: user.username }, JWT_SECRET, { expiresIn: '1d' });
        res.json({ token, username: user.username });
    } catch (err) {
        res.status(500).json({ error: 'Login failed' });
    }
});

// 3. Code Execution API (Piston Integration)
const pistonLanguageMap = {
    'javascript': { language: 'javascript', version: '18.15.0' },
    'python': { language: 'python', version: '3.10.0' },
    'cpp': { language: 'c++', version: '10.2.0' }
};

// server.js update
// server.js update
app.post('/api/execute', async (req, res) => {
    const { language, code } = req.body;

    // JavaScript ke liye hum simple 'eval' ya backend execution de sakte hain
    // Lekin Piston band hai, isliye hum ek message return karenge ya Judge0 integrate karenge.
    
    if (language === 'javascript') {
        try {
            // Server-side simple JS execution (Warning: Security risk for production)
            // For learning/local project only:
            let output = "";
            const originalLog = console.log;
            console.log = (...args) => { output += args.join(" ") + "\n"; };
            
            eval(code); 
            
            console.log = originalLog;
            res.json({ output: output || "Executed successfully (no output)" });
        } catch (err) {
            res.status(400).json({ error: err.message });
        }
    } else {
        res.status(503).json({ 
            error: "Public Piston API is down/restricted. Please host your own Piston instance using Docker to run Python/C++." 
        });
    }
});
// 4. AI Explanation (Mock)
app.post('/api/explain', (req, res) => {
    const { code } = req.body;
    const explanations = [
        "This code defines logic to process data and output results.",
        "Your code uses standard syntax and is structured correctly.",
        "This snippet demonstrates functional programming in the selected language."
    ];
    const randomExp = explanations[Math.floor(Math.random() * explanations.length)];
    setTimeout(() => res.json({ explanation: randomExp }), 1000);
});

// 5. Socket.io Logic
const userSocketMap = {};

function getAllConnectedClients(roomId) {
    return Array.from(io.sockets.adapter.rooms.get(roomId) || []).map((socketId) => {
        return { socketId, username: userSocketMap[socketId] };
    });
}

io.on('connection', (socket) => {
    socket.on('join-room', ({ roomId, username }) => {
        userSocketMap[socket.id] = username || 'Anonymous';
        socket.join(roomId);

        const clients = getAllConnectedClients(roomId);
        io.to(roomId).emit('room-users', clients);

        socket.to(roomId).emit('user-joined', {
            socketId: socket.id,
            username: userSocketMap[socket.id]
        });
    });

    socket.on('code-change', ({ roomId, code }) => {
        socket.to(roomId).emit('receive-code', code);
    });

    socket.on('language-change', ({ roomId, language }) => {
        socket.to(roomId).emit('receive-language', language);
    });

    socket.on('disconnecting', () => {
        const rooms = [...socket.rooms];
        rooms.forEach((roomId) => {
            if (roomId !== socket.id) {
                socket.to(roomId).emit('user-left', {
                    socketId: socket.id,
                    username: userSocketMap[socket.id]
                });
            }
        });
        delete userSocketMap[socket.id];
    });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));