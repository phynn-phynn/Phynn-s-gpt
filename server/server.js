import express from 'express';
import * as dotenv from 'dotenv';
import cors from 'cors';
import { Configuration, OpenAIApi } from 'openai';
import Redis from 'ioredis';

dotenv.config();

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);
const app = express();
app.use(cors());
app.use(express.json());

const redisClient = new Redis(process.env.REDIS_URL);

app.get('/', async (req, res) => {
  res.status(200).send({
    message: 'Hello from Phyncre',
  });
});

app.post('/', async (req, res) => {
  try {
    const message = req.body.message;
    const conversationId = req.body.conversationId || '';

    let conversationHistory = await redisClient.get(`conversation:${conversationId}`);
    conversationHistory = conversationHistory ? JSON.parse(conversationHistory) : [];

    const prompt = `The following is a conversation with an AI assistant. The assistant is helpful, creative, clever, and very friendly.

${conversationHistory.join('\n')}\n`;

    conversationHistory.push(`Human: ${message}`);

    const response = await openai.createCompletion({
      model: 'text-davinci-003',
      prompt,
      temperature: 0.9,
      max_tokens: 150,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0.6,
      stop: [' Human:', ' AI:'],
    });

    const botMessage = response.data.choices[0].text.trim();
    conversationHistory.push(`AI: ${botMessage}`);

    // Store the last 3000 completions in Redis
    const conversationHistoryJSON = JSON.stringify(conversationHistory.slice(-3000));
    await redisClient.set(`conversation:${conversationId}`, conversationHistoryJSON);

    res.status(200).send({
      bot: botMessage,
      conversationId,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({ error });
  }
});

app.listen(5000, () => console.log('Server is running on port http://localhost:5000'));
