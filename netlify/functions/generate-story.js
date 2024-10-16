import { OpenAI } from 'openai';
import axios from 'axios';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const handler = async (event) => {
  console.log('Function invoked');
  
  try {
    console.log('Parsing request body');
    const { age, theme, duration, characterName } = JSON.parse(event.body);

    if (!age || !theme || !duration || !characterName) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Missing required fields' }),
      };
    }

    console.log('Creating story prompt');
    const prompt = `Create a ${duration} bedtime story for a ${age} year old child. 
    The story should have a ${theme} theme and the main character's name is ${characterName}. 
    The story should be divided into 5 parts, each part starting with "Part X:" where X is the part number.`;

    console.log('Calling OpenAI API');
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 1000,
      timeout: 8000, // 8 seconds timeout
    });

    console.log('Story generated');
    const story = completion.choices[0].message.content;
    console.log('Generated story:', story);

    console.log('Generating image prompts');
    const imagePrompts = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "user", content: "Based on the following story, generate 5 short image prompts, one for each part of the story. Each prompt should be a brief description of a scene from that part of the story." },
        { role: "assistant", content: story },
        { role: "user", content: "Generate the image prompts" },
      ],
      max_tokens: 200,
      timeout: 8000, // 8 seconds timeout
    });

    const imageDescriptions = imagePrompts.choices[0].message.content.split('\n');

    console.log('Fetching images');
    const images = await Promise.all(
      imageDescriptions.map(async (description) => {
        try {
          const response = await axios.get(`https://source.unsplash.com/featured/?${encodeURIComponent(description)}`, { timeout: 5000 });
          return response.request.res.responseUrl;
        } catch (error) {
          console.error('Error fetching image:', error);
          return 'https://via.placeholder.com/400x300?text=Image+Not+Available';
        }
      })
    );

    console.log('Returning successful response');
    return {
      statusCode: 200,
      body: JSON.stringify({ text: story, images }),
    };
  } catch (error) {
    console.error('Error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'An error occurred while generating the story.' }),
    };
  }
};
