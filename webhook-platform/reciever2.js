
const express = require("express");

const app = express();
app.use(express.json());

app.post("/webhook", (req, res) => {
    console.log("Webhook received!");
    console.log("Payload:", req.body);

    res.status(200).json({
        received: true,
        message: "Event received successfully"
    });
});

app.listen(4002, () => {
    console.log("Receiver running at http://localhost:4002");
});
