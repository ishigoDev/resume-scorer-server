# Resume Scorer Server

## Overview
This is an Express.js server that provides an API endpoint to interact with the OpenAI ChatGPT API for scoring resumes. The server accepts a prompt via POST request to `/check-resume-score` and returns the AI-generated response.

## Project Structure
- `server.js`: Main server file
- `package.json`: npm dependencies and scripts
- `.env`: Environment variables (not committed)
- `.gitignore`: Git ignore rules
- `README.md`: This file
- `CLAUDE.md`: This file (Claude Code documentation)

## Setup Instructions for Claude Code

### 1. Environment Setup
Ensure you have Node.js installed (v14+ recommended).

### 2. Install Dependencies
Run the following command to install required packages:
```bash
npm install
```

### 3. Configure Environment Variables
Create a `.env` file in the project root with the following content:
```
OPENAI_API_KEY=your_openai_api_key_here
PORT=3000
```
Replace `your_openai_api_key_here` with your actual OpenAI API key.

### 4. Running the Server
To start the server in production mode:
```bash
npm start
```

For development with automatic restart on file changes:
```bash
npm run dev
```

### 5. API Usage
Send a POST request to `http://localhost:3000/check-resume-score` with a JSON body containing a `prompt` field:
```json
{
  "prompt": "Evaluate this resume for a software engineering position: [resume text]"
}
```

The server will return a JSON response with the AI's completion and token usage information.

### 6. Error Handling
The server includes error handling for:
- Missing or invalid prompt in request body
- OpenAI API errors (rate limits, invalid requests, etc.)
- Network errors

### 7. Customization
- To change the OpenAI model, modify the `model` parameter in `server.js`
- Adjust temperature, max_tokens, or other parameters as needed
- The server currently uses port 3000 or the value from the `PORT` environment variable

### 8. Notes for Development
- Keep your API key secure and never commit the `.env` file to version control
- Consider using a reverse proxy (like NGINX) for production deployments
- For high-traffic applications, implement rate limiting and caching

## Troubleshooting

### "API key not found" error
Ensure the `.env` file exists in the project root and contains a valid `OPENAI_API_KEY`.

### Server fails to start
Check that Node.js is installed and the port is not already in use.

### No response from OpenAI
Verify your API key has sufficient credits and permissions to use the requested model.

## Further Reading
- [Express.js Documentation](https://expressjs.com/)
- [OpenAI Node.js Library Documentation](https://github.com/openai/openai-node)
- [OpenAI API Reference](https://platform.openai.com/docs/api-reference)