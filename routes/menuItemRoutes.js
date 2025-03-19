const express = require("express");
const router = express.Router();
const MenuItem = require("../models/MenuItem");

router.post("/", async(req, res) => {
    try{
        const data = req.body;
        const newMenu = new MenuItem(data);
        const response = await newMenu.save();
        console.log("Data saved!");
        res.status(200).json(response);
    } catch(e) {
        console.log(e);
        res.status(500).json({error: "Internal server error"});
    }
});

router.get("/", async(req, res) => {
    try{
        const data = await MenuItem.find();
        console.log("Data fetched");
        res.status(200).json(data);
    } catch(e) {
        console.log(e);
        res.status(500).json({error: "Internal server error"});
    }
});

router.get("/:tasteType", async(req, res) => {
    try{
        const tasteType = req.params.tasteType;
        if(tasteType == "sweet" || tasteType == "spicy" || tasteType == "sour") {
            const response = await MenuItem.find({taste: tasteType});
            console.log("Response fetched!");
            res.status(200).json(response);
        }
        else {
            res.status(404).json({error: "Invalid taste type"});
        }
    } catch(e) {
        res.status(500).json({error: "Internal server error"});
    }
});

module.exports = router;