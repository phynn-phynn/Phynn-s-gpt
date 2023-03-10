import express from 'express';
import * as dotenv from 'dotenv';
import cors from 'cors';
import { Configuration, OpenAIApi } from 'openai';

dotenv.config();

const openai = new OpenAIApi(process.env.OPENAI_API_KEY);
const app = express();
app.use(cors());
app.use(express.json());

let conversationHistory = [];

app.get('/', async (req, res) => {
  res.status(200).send({
    message: 'Hello from Phyncre',
  });
});

app.post('/', async (req, res) => {
  try {
    const messages = [
      { role: 'system', content: 'You are a helpful assistant from phineas.' },
      { role: 'user', content: req.body.message },
      { role: 'assistant', content: 'Sure, I can help with that!' },
    ];
    const prompt = messages.map(m => `${m.role}: ${m.content}`).join('\n');

    const response = await openai.Completion.create({
      model: 'text-davinci-003',
      prompt,
      temperature: 0.7,
      max_tokens: 3000,
      top_p: 1,
      frequency_penalty: 0.5,
      presence_penalty: 0,
    });

    const botMessage = response.choices[0].text.trim();
    conversationHistory.push(`AI: ${botMessage}`);

    res.status(200).send({
      bot: botMessage,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({ error });
  }
});

app.listen(5000, () => console.log('Server is running on port http://localhost:5000'));
