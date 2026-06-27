const express = require("express");
const cors = require("cors");
const path = require("path");

const { processHierarchy } = require("./processor");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "../frontend")));

const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
    res.json({
        success: true,
        message: "BFHL API Running"
    });
});

app.post("/bfhl", (req, res) => {

    try {

        const { data } = req.body;

        if (!Array.isArray(data)) {
            return res.status(400).json({
                success: false,
                message: "data must be an array"
            });
        }

        const result = processHierarchy(data);

        res.json(result);

    } catch (err) {

        console.log(err);

        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });

    }

});

app.listen(PORT, () => {
    console.log(`Server Running on Port ${PORT}`);
});