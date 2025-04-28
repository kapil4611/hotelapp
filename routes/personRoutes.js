const express = require("express");
const router = express.Router();
const Person = require("../models/Person");
// const { error } = require("console");
const {jwtAuthMiddleware, generateToken} = require("../jwt");

const passport = require("../auth");
const localAuthMiddleware = passport.authenticate("local", {session: false});

router.post("/signup", async (req, res) => {
    try {
        const data = req.body;
        const newPerson = Person(data);
        const response = await newPerson.save();
        console.log("Data saved");

        const payload = {
            id: response.id,
            username: response.username,
        };
        console.log(payload);

        const token = generateToken(payload);
        console.log("Token is: ",token);

        res.status(200).json({response: response, token: token});
    } catch(e) {
        res.status(500).json({error: "Internal server error"});
    }
    
});

router.post("/login", async(req, res) => {
    try{
        // Extract username and password from request body
        const {username, password} = req.body;
        const user = await Person.findOne({username: username});
        if(!user || !(await user.comparePassword(password))) {
            return res.status(401).json({error: "Invalid usename or password"});
        } 
        // generate token
        const payload = {
            id: user.id,
            username: user.username,
        };
        const token = generateToken(payload);
        // return token as response
        res.json({token});
    } catch(err) {
        console.log(err);
        res.status(500).json({error: "Invalid server error"})
    }
});

// Profile route
router.get("/profile", jwtAuthMiddleware, async (req, res) => {
    try {
        const userData = req.user;
        const userId = userData.id;
        const user = await Person.findById(userId);
        res.status(200).json(user);
    } catch(err) {
        console.log(err);
        res.status(500).json({error: "Internal server error"});
    }
});

// use localAuthMiddleware middleware in below request to implement localauthentication
// use jwtAuthMiddleware middleware in below request to implement jwtauthentication
// jwtauthentication(we can access any protected route without any username and password)

// GET method to get all person
router.get("/", jwtAuthMiddleware, async(req, res) => {
    try {
        const data = await Person.find();
        console.log("Data fatched");
        res.status(200).json(data);
    } catch(e) {
        res.status(500).json({error: "Internal server error"});
    }
    
});

router.get("/:workType", localAuthMiddleware, async(req, res) => {
    try{
        const workType = req.params.workType;
        if(workType == "chef" || workType == "manager" || workType == "waiter") {
            const response = await Person.find({work: workType});
            console.log("Response fetched!");
            res.status(200).json(response);
        }
        else {
            res.status(404).json({error: "Invalid work type"});
        }
    } catch(e) {
        console.log(e);
        res.status(500).json({error: "Internal server error"});
    }
});

// update by passing id
router.put("/:id", async(req, res) => {
    try{
        const personId = req.params.id
        const updatedPersonData = req.body;
        const response = await Person.findByIdAndUpdate(personId, updatedPersonData, {
            new: true, 
            runValidators: true
        });

        if(!response) {
            return res.status(404).json({error: "Person not found", res: response});
        }
        console.log("Data updated!");
        res.status(200).json(response);
    } catch(e){
        console.log(e);
        res.status(500).json({error: "Internal server error"});
    }
});

router.delete("/:id", async(req, res) => {
    try {
        const personId = req.params.id;
        const response = await Person.findByIdAndDelete(personId);
        if(!response) {
            return res.status(404).json({error: "Person not found"});
        }
        console.log("Data deleted");
        res.status(200).json({message: "Person deleted successfully"});
    } catch(e) {
        console.log(e);
        res.status(500).json({error: "Internal server error"});
    }
});

module.exports = router;