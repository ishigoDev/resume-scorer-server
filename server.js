const express = require('express');
const dotenv = require('dotenv');
const { OpenAI } = require('openai');

// Load environment variables
dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware to parse JSON bodies
app.use(express.json());

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// POST endpoint to check resume score
app.post('/check-resume-score', async (req, res) => {
  try {
    const { prompt } = req.body;

    // Validate input
    if (!prompt || typeof prompt !== 'string') {
      return res.status(400).json({ error: 'Prompt is required and must be a string' });
    }

    // Call OpenAI API
    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: prompt }],
      // You can adjust parameters like temperature, max_tokens, etc.
      temperature: 0.7,
      max_tokens: 1000,
    });

    // Return the response
    res.json({
      success: true,
      data: completion.choices[0].message,
      usage: completion.usage,
    });
  } catch (error) {
    console.error('Error calling OpenAI API:', error);
    // Handle OpenAI API errors
    let statusCode = 500;
    let message = 'Internal server error';

    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      statusCode = error.response.status || 500;
      message = error.response.data.error?.message || error.message;
    } else if (error.request) {
      // The request was made but no response was received
      message = 'Network error: No response from OpenAI API';
    } else {
      // Something happened in setting up the request
      message = error.message;
    }

    res.status(statusCode).json({
      success: false,
      error: message,
    });
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    service: 'resume-scorer-server'
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});