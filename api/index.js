const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const multer = require("multer");
const fs = require("fs");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const User = require("./models/User");
const Post = require("./models/Post");
require("dotenv").config();

const app = express();

// Configure Multer to store files on disk
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadPath = "uploads/";
        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath);
        }
        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        const uniqueName = `${Date.now()}-${file.originalname}`;
        cb(null, uniqueName);
    },
});
const uploadMW = multer({ storage });

app.use(
    cors({
        origin: process.env.FRONT_END_URL,
        methods: ["GET", "POST", "PUT", "DELETE"],
        credentials: true,
    })
);
app.use(express.json());
app.use(cookieParser());
app.use("/uploads", express.static(__dirname + "/uploads"));

const salt = bcrypt.genSaltSync(10);
const secret = process.env.JWT_SECRET;

try {
    mongoose.connect(process.env.MONGO_URI, { tls: true });
} catch (e) {
    console.log(e);
}

// User Registration
app.post("/register", async (req, res) => {
    const { firstName, lastName, userName, password } = req.body;
    try {
        const userDoc = await User.create({
            firstName,
            lastName,
            userName,
            password: bcrypt.hashSync(password, salt),
        });
        res.json({ message: "User Registered", user: userDoc });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

// User Login
app.post("/login", async (req, res) => {
    const { userName, password } = req.body;
    try {
        const userDoc = await User.findOne({ userName: { $regex: new RegExp(`^${userName}$`, "i") } });

        if (!userDoc || !(await bcrypt.compare(password, userDoc.password))) {
            return res.status(401).json({ error: "Invalid credentials" });
        }

        jwt.sign({ userName, id: userDoc._id }, secret, { expiresIn: "1h" }, (err, token) => {
            if (err) return res.status(500).json({ error: "Token generation failed" });
            res.cookie("token", token, { httpOnly: true }).json({ id: userDoc._id, userName });
        });
    } catch (e) {
        res.status(500).json({ error: "Internal server error" });
    }
});

// User Logout
app.post("/logout", (req, res) => {
    res.cookie("token", "").json({ message: "Logged out" });
});

// Get Profile
app.get("/profile", (req, res) => {
    const { token } = req.cookies;
    if (!token) return res.status(401).json({ error: "No token found" });

    jwt.verify(token, secret, {}, (err, info) => {
        if (err) return res.status(401).json({ error: "Invalid or expired token" });
        res.json(info);
    });
});

// Create Post
app.post("/post", uploadMW.single("file"), async (req, res) => {
    try {
        const { title, summary, content } = req.body;
        const { token } = req.cookies;

        jwt.verify(token, secret, {}, async (err, info) => {
            if (err) return res.status(401).json({ error: "Invalid or expired token" });

            const cover = req.file ? `uploads/${req.file.filename}` : null;
            const postDoc = await Post.create({ title, summary, content, cover, author: info.id });

            res.json(postDoc);
        });
    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
});

// Update Post
app.put("/post/:id", uploadMW.single("file"), async (req, res) => {
    const { token } = req.cookies;
    jwt.verify(token, secret, {}, async (err, info) => {
        if (err) return res.status(401).json({ error: "Invalid or expired token" });

        try {
            const postDoc = await Post.findById(req.params.id);
            if (!postDoc) return res.status(404).json({ error: "Post not found" });

            if (String(postDoc.author) !== String(info.id)) {
                return res.status(403).json({ error: "You are not the author" });
            }

            const { title, summary, content } = req.body;
            if (req.file) {
                postDoc.cover = `uploads/${req.file.filename}`;
            }

            postDoc.set({ title, summary, content });
            await postDoc.save();

            res.json(postDoc);
        } catch (error) {
            res.status(500).json({ error: "Internal server error" });
        }
    });
});

// Get Posts
app.get("/post", async (req, res) => {
    const posts = await Post.find().populate("author", ["userName"]).sort({ createdAt: -1 }).limit(20);
    res.json(posts);
});

// Get Post by ID
app.get("/post/:id", async (req, res) => {
    const postDoc = await Post.findById(req.params.id).populate("author", ["userName"]);
    if (!postDoc) return res.status(404).json({ error: "Post not found" });
    res.json(postDoc);
});

// Root Route
app.get("/", (req, res) => {
    res.send("Hello!");
});

// Start Server
app.listen(4000, () => {
    console.log("Server is running on Port 4000");
});
