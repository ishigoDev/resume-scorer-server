import express from 'express';
import fs from 'fs';
import path from 'path';
import * as archiver from 'archiver';

const router = express.Router();

// GET /logs?file=number|all
router.get('/', async (req, res) => {
  const { file } = req.query;

  // Logs directory is two levels up from this file: /routes/logs.js -> /logs
  const logDir = path.join(__dirname, '..', 'logs');

  try {
    // Read all files in the logs directory
    const files = await fs.promises.readdir(logDir);

    // Filter for our log files
    const logFiles = files.filter(f =>
      f.startsWith('check-resume-score-') &&
      (f.endsWith('.log') || f.endsWith('.log.gz'))
    );

    if (logFiles.length === 0) {
      return res.status(404).json({ error: 'No log files found' });
    }

    // Extract date from filename and sort by date descending (newest first)
    const getDateFromFilename = (filename) => {
      // Example: check-resume-score-2026-07-13.log -> 2026-07-13
      // Example: check-resume-score-2026-07-12.log.gz -> 2026-07-12
      const match = filename.match(/check-resume-score-(\d{4}-\d{2}-\d{2})/);
      return match ? match[1] : null;
    };

    const filesWithDate = logFiles.map(file => ({
      filename: file,
      date: getDateFromFilename(file),
      isCompressed: file.endsWith('.gz')
    })).filter(f => f.date !== null); // Filter out any that didn't match

    // Sort by date descending
    filesWithDate.sort((a, b) => b.date.localeCompare(a.date));

    if (file === 'all') {
      // Set headers for zip file
      res.setHeader('Content-Type', 'application/zip');
      res.setHeader('Content-Disposition', 'attachment; filename="resume-scorer-logs.zip"');

      const archiveInstance = archiver.default('zip', {
        zlib: { level: 9 } // Maximum compression
      });

      // Pipe archive to response
      archiveInstance.pipe(res);

      // Add each log file to the archive
      for (const fileObj of filesWithDate) {
        const filePath = path.join(logDir, fileObj.filename);
        archiveInstance.file(filePath, { name: fileObj.filename });
      }

      // Finalize the archive
      await archiveInstance.finalize();
    } else {
      // Try to parse file as a number (1-indexed)
      const index = parseInt(file, 10);
      if (isNaN(index) || index < 1) {
        return res.status(400).json({ error: 'File parameter must be a positive integer or "all"' });
      }

      // Get the file at the given index (1-based)
      const fileIndex = index - 1;
      if (fileIndex >= filesWithDate.length) {
        return res.status(404).json({ error: `Log file #${index} not found. Only ${filesWithDate.length} log file(s) available.` });
      }

      const selectedFile = filesWithDate[fileIndex];
      const filePath = path.join(logDir, selectedFile.filename);

      // Check if file exists
      try {
        await fs.promises.access(filePath, fs.constants.F_OK);
      } catch (err) {
        return res.status(404).json({ error: 'Log file not found on disk' });
      }

      // Set appropriate headers
      res.setHeader('Content-Disposition', `attachment; filename="${selectedFile.filename}"`);
      if (selectedFile.isCompressed) {
        res.setHeader('Content-Type', 'application/gzip');
      } else {
        res.setHeader('Content-Type', 'text/plain');
      }

      // Send the file
      const fileStream = fs.createReadStream(filePath);
      fileStream.pipe(res);
    }
  } catch (err) {
    console.error('Error in logs route:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;