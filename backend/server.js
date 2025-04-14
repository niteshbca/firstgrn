require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect("mongodb://localhost:27017/dummy", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const entrySchema = new mongoose.Schema({}, { strict: false });
const Entry = mongoose.model("entries", entrySchema);

// API to Fetch All Entries
app.get("/api/entries", async (req, res) => {
    try {
        const entries = await Entry.find();
        res.json(entries);
    } catch (error) {
        res.status(500).json({ message: "Error fetching data" });
    }
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
