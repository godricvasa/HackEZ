require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');
const port = process.env.PORT || 3000;

const app = express();
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

// Connect to MongoDB Atlas
// godricvasa
// GJFkAxud3iVuFBRa
//

const uri = process.env.DB;

mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

// Mongoose Schema for Questions and Answers
const qaSchema = new mongoose.Schema({
    question: String,
    answers: [{ type: String }]
});
 
const QAColl = mongoose.model("QAColl", qaSchema);

// Route to display list of questions (homepage)
app.get("/", async function (req, res) {
    const questions = await QAColl.find();
    res.render("questions", { questions: questions });
});

// Route to display individual question page
app.get("/questions/:id", async function (req, res) {
    const questionId = req.params.id;
    const question = await QAColl.findById(questionId);
    res.render("answers", { question: question });
});


// Route to render form for posting new question
app.get("/ask", function (req, res) {
    res.render("ask");
});

// Route to handle posting new question
app.post("/ask", async function (req, res) {
    const newQuestion = new QAColl({
        question: req.body.question,
        answers: []
    });
    await newQuestion.save();
    res.redirect("/"); // Redirect to the home page
});

// Route to handle posting new answer to a question
app.post("/questions/:id/answer", async function (req, res) {
    const questionId = req.params.id;
    const answer = req.body.answer;
    await QAColl.findByIdAndUpdate(questionId, { $push: { answers: answer } });
    res.redirect("/questions/" + questionId);
    
});

app.listen(port, function () {
    console.log(`Server started on port ${port}`);
});
