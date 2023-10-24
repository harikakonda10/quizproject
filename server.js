// Import required modules at the top
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware setup
app.use(cors());
app.use(bodyParser.json());

// Database setup (make sure MongoDB is running locally)
mongoose.connect('mongodb://localhost:27017/quizapp', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
});

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
    console.log('Connected to MongoDB');
});

// Schema definitions (as mentioned in the previous response)

// Routes
app.get('/questions', async (req, res) => {
    try {
        const questions = await Question.find();
        res.json(questions);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// New route for submitting quiz results
app.post('/submit-result', async (req, res) => {
    try {
        const { userId, quizId, score } = req.body;

        // Save the result to the database
        const result = new Result({
            userId,
            quizId,
            score,
        });

        await result.save();

        res.json({ success: true, message: 'Result submitted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

const resultSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  quizId: { type: mongoose.Schema.Types.ObjectId, ref: 'Quiz' },
  score: Number,
  timestamp: { type: Date, default: Date.now },
});

const Result = mongoose.model('Result', resultSchema);

app.get('/leaderboard', async (req, res) => {
  try {
      const leaderboard = await Result.find()
          .sort({ score: -1, timestamp: 1 }) // Sort by score descending and timestamp ascending
          .limit(10); // Fetch top 10 scores, adjust as needed

      res.json(leaderboard);
  } catch (error) {
      res.status(500).json({ error: 'Internal Server Error' });
  }
});



