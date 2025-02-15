const express = require("express");
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const multer = require('multer');
const uploadMW = multer({ dest: 'uploads/' });
const fs = require('fs');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const User = require('./models/User');
const Post = require('./models/Post')

const app = express();

app.use(cors({
    origin: 'http://localhost::4000',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
}));
app.use(express.json());
app.use(cookieParser());
app.use('/uploads', express.static(__dirname + '/uploads'));

const salt = bcrypt.genSaltSync(10);
const secret = 'cbd96872ac270e1fc837f2a22f218ab41876d32517d1cf72b7c6efe41dab636975f2238dda670a06816d3752fe3d9c3bb153d0e6926869b3326c7d0731415fb42f6d5eb73b5f93906b3d40afd9a9830c0ab64ceba1006625fd32473fb9fb3518a073aecdf8d579ec627bf3061ae8229701e461b0cb5d4847d3bf7e368d2d3ad930475dacbaa4cbaf7671a73e2f88f66c597c3df7c7af5e29e5af96cea727878cc31847427b8908c98922a548fd778f42b6bcef0a9ffbcbfad40159443ebcb1d1197b169fa542a618f942eca959cdc3c02dca6699bf7a30e9912c86df7adff43136de869dc6f46631d884319e1b2e7a71b7efab69a4af0a587142d50063f29920'; // Ensure this is the same everywhere

mongoose.connect('mongodb+srv://shoaib:1234@mainblogdb.7qivs.mongodb.net/?retryWrites=true&w=majority&appName=mainBlogDB', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    tls: true,
});
app.get('/',(req,res)=>{
    res.send("Hello");
})
app.post('/register', async (req, res) => {
    const { firstName, lastName, userName, password } = req.body;
    try {
        const userDoc = await User.create({
            firstName,
            lastName,
            userName,
            password: bcrypt.hashSync(password, salt)
        });
        res.json({ "User Registered": userDoc });
        console.log({ "User Registered": userDoc });
    } catch (e) {
        res.send(e);
        console.log({ error: e });
    }
});

app.post('/login', async (req, res) => {
    const { userName, password } = req.body;

    if (!userName || !password) {
        return res.status(400).json({ error: "Username and password are required" });
    }

    try {
        const userDoc = await User.findOne({
            userName: { $regex: new RegExp(`^${userName}$`, 'i') }
        });

        if (!userDoc) {
            return res.status(404).json({ error: "User not found" });
        }

        const isPasswordValid = await bcrypt.compare(password, userDoc.password);
        if (!isPasswordValid) {
            return res.status(401).json({ error: "Invalid credentials" });
        }

        // Sign JWT
        jwt.sign({ userName, id: userDoc._id }, secret, { expiresIn: '1h' }, (err, token) => {
            if (err) throw err;
            res.cookie('token', token, { httpOnly: true }).json({
                id: userDoc._id,
                userName,
            });
        });

    } catch (e) {
        console.error(e);
        res.status(500).json({ error: "Internal server error" });
    }
});
app.post('/logout', (req, res) => {
    res.cookie('token', '').json('ok');
})

app.get('/profile', (req, res) => {
    const { token } = req.cookies;
    console.log("Received Token: ", token); // Log to check if token is received

    if (!token) {
        return res.status(401).json({ error: "No token found" });
    }

    jwt.verify(token, secret, {}, (err, info) => {
        if (err) {
            console.error("JWT Verify Error: ", err);
            return res.status(401).json({ error: "Invalid or expired token" });
        }
        res.json(info);
    });
});

app.post('/post', uploadMW.single("files"), async (req, res) => {
    try {
        const { originalname, path } = req.file;


        const newFilename = `${Date.now()}-${originalname}`;
        const newPath = `uploads/${newFilename}`;
        fs.renameSync(path, newPath);

        const { title, summary, content } = req.body;

        const { token } = req.cookies;
        jwt.verify(token, secret, {}, async (err, info) => {
            if (err) {
                console.error("JWT Verify Error: ", err);
                return res.status(401).json({ error: "Invalid or expired token" });
            }
            const postDoc = await Post.create({
                title,
                summary,
                content,
                cover: newPath,
                author: info.id,
            });
            res.json(postDoc);
        });



    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
});

app.put('/post/:id', uploadMW.single("file"), async (req, res) => {
    let newPath = null;
    if (req.file) {
        const { originalname, path } = req.file;
        const newFilename = `${Date.now()}-${originalname}`;
        newPath = `uploads/${newFilename}`;
        fs.renameSync(path, newPath);
    }

    const { token } = req.cookies;
    jwt.verify(token, secret, {}, async (err, info) => {
        if (err) {
            console.error("JWT Verify Error: ", err);
            return res.status(401).json({ error: "Invalid or expired token" });
        }

        const { title, summary, content } = req.body;
        const { id } = req.params; // Get `id` from URL

        try {
            const postDoc = await Post.findById(id);
            if (!postDoc) {
                return res.status(404).json({ error: "Post not found" });
            }

            const isAuthor = JSON.stringify(postDoc.author) === JSON.stringify(info.id);
            if (!isAuthor) {
                return res.status(403).json({ error: "You are not the author" });
            }

            // Update fields
            postDoc.set({ 
                title, 
                summary, 
                content, 
                cover: newPath ? newPath : postDoc.cover 
            });

            await postDoc.save(); // Save changes

            res.json(postDoc);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "Internal server error" });
        }
    });
});


app.get('/post', async (req, res) => {

    res.json(await Post.find().populate('author', ['userName']).sort({ createdAt: -1 }).limit(20));

})
app.get('/post/:id', async (req, res) => {
    const { id } = req.params;
    const postDoc = await Post.findById(id).populate("author", ['userName']);
    res.json(postDoc)

})



app.listen(4000, () => {
    console.log("Server is running on Port 4000");
});
