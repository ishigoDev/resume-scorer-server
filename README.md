# Resume Scorer Server

An Express.js server that integrates with the OpenAI ChatGPT API to score resumes based on a provided prompt.

## Features

- POST endpoint `/check-resume-score` that accepts a prompt in the request body
- GET endpoint `/health` for health checks
- Uses OpenAI's GPT-3.5-turbo model to generate a response
- Returns the AI response along with usage information
- Error handling for missing prompts and API errors
- Environment variable configuration for API key and port

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- OpenAI API key

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory and add your OpenAI API key:
   ```
   OPENAI_API_KEY=your_openai_api_key_here
   PORT=3000
   ```

### Usage

Start the server:
```bash
npm start
```

For development with auto-reload:
```bash
npm run dev
```

### API Endpoint

**POST /check-resume-score**

Request Body:
```json
{
  "prompt": "Your prompt here - e.g., 'Score this resume against the job description: ...'"
}
```

Response:
```json
{
  "success": true,
  "data": {
    "role": "assistant",
    "content": "The AI-generated response..."
  },
  "usage": {
    "prompt_tokens": 56,
    "completion_tokens": 138,
    "total_tokens": 194
  }
}
```

Error Response:
```json
{
  "success": false,
  "error": "Error message"
}
```

### Environment Variables

- `OPENAI_API_KEY`: Your OpenAI API key (required)
- `PORT`: The port to run the server on (default: 3000)

### Dependencies

- express: ^4.19.2
- openai: ^4.52.0
- dotenv: ^16.4.5

### Dev Dependencies

- nodemon: ^3.1.4 (for development)

### License

ISC