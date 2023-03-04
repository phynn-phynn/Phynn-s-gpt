import express from 'express';
import * as dotenv from 'dotenv';
import cors from 'cors';
import { Configuration, OpenAIApi  } from 'openai';

dotenv.config();

const configuration = new Configuration( {
    apiKey: process.env.OPENAI_API_KEY, 
});

const openai = new OpenAIApi(configuration);
const app = express();
app.use(cors());
app.use(express.json());

let conversationHistory = [];

app.get('/', async (req, res) => {
    res.status(200).send({
        message: 'Hello from Phyncre',
    })
});

app.post('/', async (req, res) => {
    try {
        const prompt = `The following is a conversation with an AI assistant. The assistant is helpful, creative, clever, and very friendly.\n\n${conversationHistory.join('\n')}\n`;
        const message = req.body.message;
        conversationHistory.push(`Human: ${message}`);
        
        const response = await openai.createCompletion({
            model: "text-davinci-003",
            prompt,
            temperature: 0.9,
            max_tokens: 150,
            top_p: 1,
            frequency_penalty: 0,
            presence_penalty: 0.6,
            stop: [" Human:", " AI:"],
          });
          
        const botMessage = response.data.choices[0].text.trim();
        conversationHistory.push(`AI: ${botMessage}`);
           
        res.status(200).send({
            bot: botMessage
        })
    } catch (error) {
        console.log(error);
        res.status(500).send({ error })
    }
})

app.listen(5000, () => console.log('Server is running on port http://localhost:5000'));
