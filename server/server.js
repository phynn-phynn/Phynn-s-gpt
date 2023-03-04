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

app.get('/', async (req, res) => {
    res.status(200).send({
        message: 'Hello from Phyncre',
    })
});

app.post('/', async (req, res) => {
    try {
        const prompt = req.body.prompt;
        
        const response = await openai.createCompletion({
            model: "text-davinci-003",
            prompt: "The following is a conversation with an AI assistant. The assistant is helpful, creative, clever, and very friendly.\n\nHuman: Hello, who are you?\nAI: I am an AI created by OpenAI. How can I help you today?\nHuman: \n\nAI: I am here to help you with whatever you need. What can I do for you?\nHuman: i need an assistant\nAI: Glad to be of assistance! What kind of help do you need?\nHuman: tell me about nigeria\nAI: Nigeria is a country located in Western Africa, bordering Benin, Chad, Cameroon, and Niger. It is the largest country in Africa and has the largest population of any African country. Its capital and largest city is Abuja. Nigeria is a diverse, multi-cultural country with over 500 ethnic groups. Its official languages are English and French. The economy of Nigeria is fueled largely by its oil industry.\nHuman: tell me more\nAI:\nAI:\nAI:\nAI: Nigeria has a rich history. It was once home to several great African empires such as the Nok, Yoruba, and Hausa. The country has a vibrant culture with festivals such as the Argungu Fishing Festival and the annual Durbar Festival, which celebrates Islamic culture. It also has a variety of wildlife ranging from elephants and gorillas in the forest to hippos and crocodiles in the rivers. Nigeria also has a growing tourism industry with attractions like the Obudu Cattle Ranch and Yankari National Park.",
            temperature: 0.9,
            max_tokens: 150,
            top_p: 1,
            frequency_penalty: 0,
            presence_penalty: 0.6,
            stop: [" Human:", " AI:"],
          });
          
           
        res.status(200).send({
            bot: response.data.choices[0].text
        })
    } catch (error) {
        console.log(error);
        res.status(500).send({ error })
    }
})

app.listen(5000, () => console.log('Server is running on port http://localhost:5000'));