import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import OpenAI from 'openai';
import axios from 'axios';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

app.post('/api/generate-story', async (req, res) => {
  console.log('Function invoked');
  
  try {
    console.log('Parsing request body');
    const { age, theme, duration, characterName } = req.body;

    if (!age || !theme || !duration || !characterName) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    console.log('Creating story prompt');
    const prompt = `Create a ${duration} bedtime story for a ${age} year old child. 
    The story should have a ${theme} theme and the main character's name is ${characterName}. 
    The story should be divided into 3 parts, each part ending with a period.`;

    console.log('Calling OpenAI API');
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
    });

    console.log('Story generated');
    const story = completion.choices[0].message.content;

    console.log('Generating image prompts');
    const imagePrompts = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "user", content: "Based on the following story, generate 3 short image prompts, one for each part of the story. Each prompt should be a brief description of a scene from that part of the story." },
        { role: "assistant", content: story },
        { role: "user", content: "Generate the image prompts" },
      ],
    });

    const imageDescriptions = imagePrompts.choices[0].message.content.split('\n');

    console.log('Fetching images');
    const images = await Promise.all(
      imageDescriptions.map(async (description) => {
        try {
          const response = await axios.get(`https://source.unsplash.com/featured/?${encodeURIComponent(description)}`);
          return response.request.res.responseUrl;
        } catch (error) {
          console.error('Error fetching image:', error);
          return 'https://via.placeholder.com/400x300?text=Image+Not+Available';
        }
      })
    );

    console.log('Returning successful response');
    res.json({ text: story, images });
  } catch (error) {
    console.error('Error:', error);
    let errorMessage = 'An error occurred while generating the story.';
    if (error.response) {
      errorMessage += ` Status: ${error.response.status}. ${error.response.data.error || ''}`;
    } else if (error.request) {
      errorMessage += ' The request was made but no response was received.';
    } else {
      errorMessage += ` Message: ${error.message}`;
    }
    res.status(500).json({ error: errorMessage });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});