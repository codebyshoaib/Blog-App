const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const multer = require("multer");
const fs = require("fs").promises;
const jwt = require("jsonwebtoken");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const dotenv = require("dotenv");
const User = require("./models/User");
const Post = require("./models/Post");

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(cors({
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
}));
app.use(express.json());
app.use(cookieParser());
app.use("/uploads", express.static(__dirname + "/uploads"));

// Multer for file uploads
const upload = multer({ dest: "uploads/" });

// Security constants
const SALT_ROUNDS = 10;
const JWT_SECRET = process.env.JWT_SECRET || "your_super_secret_key";

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    tls: true
}).then(() => console.log("MongoDB Connected"))
  .catch(err => console.error("MongoDB Connection Error:", err));

// Routes
app.get("/", (req, res) => {
    res.send("Hello, Server is Running!");
});

app.post("/register", async (req, res) => {
    const { firstName, lastName, userName, password } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
        const userDoc = await User.create({
            firstName,
            lastName,
            userName,
            password: hashedPassword
        });
        res.json({ message: "User Registered", user: userDoc });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Registration failed" });
    }
});

app.post("/login", async (req, res) => {
    const { userName, password } = req.body;
    try {
        const userDoc = await User.findOne({ userName: new RegExp(`^${userName}$`, "i") });

        if (!userDoc || !(await bcrypt.compare(password, userDoc.password))) {
            return res.status(401).json({ error: "Invalid credentials" });
        }

        const token = jwt.sign({ id: userDoc._id, userName }, JWT_SECRET, { expiresIn: "1h" });

        res.cookie("token", token, { httpOnly: true }).json({ id: userDoc._id, userName });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Login failed" });
    }
});

app.post("/logout", (req, res) => {
    res.cookie("token", "").json({ message: "Logged out" });
});

app.get("/profile", (req, res) => {
    const { token } = req.cookies;
    if (!token) return res.status(401).json({ error: "No token found" });

    jwt.verify(token, JWT_SECRET, (err, info) => {
        if (err) return res.status(401).json({ error: "Invalid token" });
        res.json(info);
    });
});

app.post("/post", upload.single("file"), async (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ error: "No file uploaded" });

        const { originalname, path } = req.file;
        const newFilename = `${Date.now()}-${originalname}`;
        const newPath = `uploads/${newFilename}`;

        await fs.rename(path, newPath);

        const { title, summary, content } = req.body;
        const { token } = req.cookies;

        jwt.verify(token, JWT_SECRET, async (err, info) => {
            if (err) return res.status(401).json({ error: "Invalid token" });

            const postDoc = await Post.create({
                title,
                summary,
                content,
                cover: newPath,
                author: info.id
            });

            res.json(postDoc);
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to create post" });
    }
});

app.put("/post/:id", upload.single("file"), async (req, res) => {
    try {
        let newPath = null;
        if (req.file) {
            const { originalname, path } = req.file;
            const newFilename = `${Date.now()}-${originalname}`;
            newPath = `uploads/${newFilename}`;
            await fs.rename(path, newPath);
        }

        const { token } = req.cookies;
        jwt.verify(token, JWT_SECRET, async (err, info) => {
            if (err) return res.status(401).json({ error: "Invalid token" });

            const { title, summary, content } = req.body;
            const { id } = req.params;

            const postDoc = await Post.findById(id);
            if (!postDoc) return res.status(404).json({ error: "Post not found" });

            if (String(postDoc.author) !== String(info.id)) {
                return res.status(403).json({ error: "Unauthorized" });
            }

            postDoc.set({ title, summary, content, cover: newPath || postDoc.cover });
            await postDoc.save();

            res.json(postDoc);
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to update post" });
    }
});

app.get("/post", async (req, res) => {
    try {
        const posts = await Post.find()
            .populate("author", ["userName"])
            .sort({ createdAt: -1 })
            .limit(20);

        res.json(posts);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to fetch posts" });
    }
});

app.get("/post/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const postDoc = await Post.findById(id).populate("author", ["userName"]);

        if (!postDoc) return res.status(404).json({ error: "Post not found" });

        res.json(postDoc);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to fetch post" });
    }
});

// Export for Vercel
module.exports = app;
