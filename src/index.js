import express from "express";
import bcryptjs from "bcryptjs";
import 'dotenv/config';
import { dbConnection } from "./config.js";
import { LoginModel } from "../models/login_model.js";

// create express app
const app = express();

// middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// call database
dbConnection();


// middleware to view ejs
app.set('view engine', 'ejs');

// routes
app.get("/", (req, res) => {
    res.render("login");
});

app.get("/Signup", (req, res) => {
    res.render("signup");
});

app.get("/home", (req, res) => {
    res.render("home"); 
});


// signup new user
app.post("/Signup", async (req, res) => {
    const { username, password } = req.body;
    
    try {
        const existingUser = await LoginModel.findOne({ name: username });
        if (existingUser) {
            return res.status(400).send("User already exists");
        }

        const hashedPassword = await bcryptjs.hash(password, 10);

        const newUser = new LoginModel({
            name: username,
            password: hashedPassword
        });

        await newUser.save();
        res.send("User registered successfully!");
    } catch (error) {
        res.status(500).send("Error registering user: " + error.message);
    }
});

// login user
app.post("/login", async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await LoginModel.findOne({ name: username });
        if (!user) {
            return res.status(404).send("User not found");
        }

        const isPasswordValid = await bcryptjs.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).send("Invalid password");
        }

        // Redirect to home page upon successful login
        res.redirect('/home'); 

    } catch (error) {
        res.status(500).send("Error logging in: " + error.message);
    }
});

// listen to port
const port = 5050;
app.listen(port, () => {
    console.log(`App listening on ${port}`);
});
