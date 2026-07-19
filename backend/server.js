import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import { analyzeConversation } from './services/geminiService.js';

// Trigger watch reload
// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

// Middlewares
app.use(cors());
app.use(express.json({ limit: '10mb' })); // Support large conversation transcripts

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Analyze endpoint
app.post('/analyze', async (req, res) => {
  const { conversation } = req.body;

  if (!conversation || typeof conversation !== 'string' || conversation.trim() === '') {
    return res.status(400).json({
      error: 'Invalid request. Please provide non-empty "conversation" in the request body.'
    });
  }

  console.log(`Received conversation for analysis (Length: ${conversation.length} chars)`);

  try {
    const result = await analyzeConversation(conversation);
    res.json(result);
  } catch (error) {
    console.error('Failed to analyze conversation:', error);
    res.status(500).json({
      error: error.message || 'Failed to generate client intelligence from conversation.'
    });
  }
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`POST /analyze endpoint is active.`);
});
