const express = require('express');
const dotenv = require('dotenv');
const { OpenAI } = require('openai');
const morgan = require('morgan');
const fs = require('fs');
const path = require('path');
const archiver = require('archiver');
const logger = require('./logger');

// Load environment variables
dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware to parse JSON bodies
app.use(express.json());
// Morgan middleware for logging requests to /check-resume-score only
app.use('/check-resume-score', morgan('combined', { stream: logger.stream }));
// Custom middleware to log request body for /check-resume-score
app.use('/check-resume-score', (req, res, next) => {
  if (req.method === 'POST') {
    const logEntry = {
      timestamp: new Date().toISOString(),
      method: req.method,
      url: req.originalUrl,
      ip: req.ip || req.connection.remoteAddress,
      body: req.body
    };
    // Optionally truncate body if too large
    const bodyStr = JSON.stringify(logEntry.body);
    if (bodyStr.length > 1000) {
      logEntry.body = bodyStr.substring(0, 1000) + '... [truncated]';
    }
    logger.info('Request body', logEntry);
  }
  next();
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

// Logs router
const logsRouter = require('./routes/logs');
app.use('/logs', logsRouter);

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});