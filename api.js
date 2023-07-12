const express = require("express");
const cors = require("cors");
const fs = require("fs");
const app = express();

app.use(cors());

app.use(express.json());

app.post("/save-feedback", (req, res) => {
  const feedback = req.body.feedback;
  feedback.timestamp = new Date().toISOString();
  const feedbackStr = JSON.stringify(feedback) + "\n";
  fs.appendFile("feedback.json", feedbackStr, (err) => {
    if (err) {
      console.error(err);
      res.status(500).send({ res: "Error saving feedback." });
    } else {
      res.send({ res: "Feedback saved successfully." });
    }
  });
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
