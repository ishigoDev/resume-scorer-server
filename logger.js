const winston = require('winston');
require('winston-daily-rotate-file');
const fs = require('fs');
const path = require('path');

// Ensure log directory exists
const logDir = path.join(__dirname, 'logs');
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir);
}

// Create Winston logger with daily rotate file
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.DailyRotateFile({
      filename: path.join(logDir, 'check-resume-score-%DATE%.log'),
      datePattern: 'YYYY-MM-DD',
      zippedArchive: true,
      maxSize: '20m',        // Rotate when file reaches 20 MB
      maxFiles: '14d'        // Keep logs for 14 days
    })
  ]
});

module.exports = logger;