const express = require('express');
const { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } = require('@google/generative-ai');
const dotenv = require('dotenv').config();
const cors = require('cors');
const app = express();
const port = process.env.PORT || 3000;
app.use(express.json());
app.use(cors());
const MODEL_NAME = "gemini-pro";
const API_KEY = 'AIzaSyDvgQy57uiGhlZrWA6NZJArR__P_IwBA18';

async function runChat(userInput) {
  const genAI = new GoogleGenerativeAI(API_KEY);
  const model = genAI.getGenerativeModel({ model: MODEL_NAME });

  const generationConfig = {
    temperature: 0.9,
    topK: 1,
    topP: 1,
    maxOutputTokens: 1000,
  };

  const safetySettings = [
    {
      category: HarmCategory.HARM_CATEGORY_HARASSMENT,
      threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    },
    // ... other safety settings
  ];

  const chat = model.startChat({
    generationConfig,
    safetySettings,
    history: [
  {
    "role": "model",
    "parts": [
      {
        "text": "Welcome to GovChain! I'm here to assist you with any questions or inquiries you may have about our platform. How can I help you today?"
      }
    ]
  },
  {
    "role": "user",
    "parts": [
      {
        "text": "Hi there!"
      }
    ]
  },
  {
    "role": "model",
    "parts": [
      {
        "text": "Hello! It's great to have you here. What information are you seeking about GovChain?"
      }
    ]
  },
  {
    "role": "user",
    "parts": [
      {
        "text": "I'd like to know more about how GovChain works."
      }
    ]
  },
  {
    "role": "model",
    "parts": [
      {
        "text": "Absolutely! GovChain is a blockchain-powered platform designed to transform governance processes by bringing transparency, efficiency, and trust to government operations. It leverages Polygon for smart contracts, ensuring scalability and cost-effectiveness. Have you got any specific questions about our platform's functionalities?"
      }
    ]
  },
  {
    "role": "user",
    "parts": [
      {
        "text": "Can you explain how GovChain ensures transparency in government operations?"
      }
    ]
  },
  {
    "role": "model",
    "parts": [
      {
        "text": "Sure thing! GovChain ensures transparency by recording all government transactions and decisions on the blockchain, which is immutable and publicly accessible. This means that citizens can verify the integrity of government actions, promoting accountability and trust. Is there anything else you'd like to know?"
      }
    ]
  },
  {
    "role": "user",
    "parts": [
      {
        "text": "How can I get started using GovChain?"
      }
    ]
  },
  {
    "role": "model",
    "parts": [
      {
        "text": "To get started with GovChain, you can visit our website and sign up for an account. Once registered, you'll have access to our platform where you can explore its features and functionalities. If you have any further questions or need assistance, feel free to ask!"
      }
    ]
  },
  {
    "role": "user",
    "parts": [
      {
        "text": "Thank you for the information!"
      }
    ]
  },
  {
    "role": "model",
    "parts": [
      {
        "text": "You're welcome! If you have any more questions in the future, don't hesitate to reach out. We're here to help. Have a great day!"
      }
    ]
  }
]
  
  });

  const result = await chat.sendMessage(userInput);
  const response = result.response;
  return response.text();
}

app.post('/chat', async (req, res) => {
  try {
    const userInput = req.body?.userInput;
    console.log('Incoming /chat request:', userInput);
    if (!userInput) {
      return res.status(400).json({ error: 'Invalid request body' });
    }

    const response = await runChat(userInput);
    res.json({ response });
  } catch (error) {
    console.error('Error in chat endpoint:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
