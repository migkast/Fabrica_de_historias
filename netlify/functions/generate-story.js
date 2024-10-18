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
    let completion;
    try {
      completion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: prompt }],
        max_tokens: 1000,
        timeout: 15000, // 15 seconds timeout
      });
    } catch (openaiError) {
      console.error('OpenAI API Error:', openaiError);
      throw new Error(`OpenAI API Error: ${openaiError.message}`);
    }

    console.log('Story generated');
    const story = completion.choices[0].message.content;
    console.log('Generated story:', story);

    console.log('Generating image prompts');
    let imagePrompts;
    try {
      imagePrompts = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          { role: "user", content: "Based on the following story, generate 5 short image prompts, one for each part of the story. Each prompt should be a brief description of a scene from that part of the story." },
          { role: "assistant", content: story },
          { role: "user", content: "Generate the image prompts" },
        ],
        max_tokens: 200,
        timeout: 15000, // 15 seconds timeout
      });
    } catch (openaiError) {
      console.error('OpenAI API Error (Image Prompts):', openaiError);
      throw new Error(`OpenAI API Error (Image Prompts): ${openaiError.message}`);
    }

    const imageDescriptions = imagePrompts.choices[0].message.content.split('\n');

    console.log('Fetching images');
    const images = await Promise.all(
      imageDescriptions.map(async (description, index) => {
        try {
          const response = await axios.get(`https://source.unsplash.com/featured/?${encodeURIComponent(description)}`, { timeout: 10000 });
          return response.request.res.responseUrl;
        } catch (error) {
          console.error(`Error fetching image ${index + 1}:`, error);
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
      body: JSON.stringify({ error: `An error occurred while generating the story: ${error.message}` }),
    };
  }
};
