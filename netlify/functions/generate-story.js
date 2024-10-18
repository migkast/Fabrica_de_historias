const { OpenAI } = require('openai');
const axios = require('axios');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

exports.handler = async (event, context) => {
  console.log('Function invoked with event:', JSON.stringify(event));
  console.log('Context:', JSON.stringify(context));
  
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    console.log('Parsing request body');
    const { age, theme, duration, characterName } = JSON.parse(event.body);

    if (!age || !theme || !duration || !characterName) {
      console.log('Missing required fields:', { age, theme, duration, characterName });
      return { statusCode: 400, body: JSON.stringify({ error: 'Missing required fields' }) };
    }

    console.log('Creating story prompt');
    const prompt = `Create a bedtime story for a ${age} year old child. 
    The story should have a ${theme} theme and the main character's name is ${characterName}. 
     The story should be divided into 5 parts, each part with 2 paragraphs. The story should be engaging and have a moral to it! Make the story either having a twist, very exciting or more sentimental.`;

    console.log('Calling OpenAI API for story generation');
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
        { role: "user", content: "Based on the following story, generate 5 short image prompts, one for each part of the story. Each prompt should be a brief description of a scene from that part of the story, suitable for image generation." },
        { role: "assistant", content: story },
        { role: "user", content: "Generate the image prompts" },
      ],
    });

    const imageDescriptions = imagePrompts.choices[0].message.content.split('\n');

    console.log('Generating images with DALL·E 3');
    const images = await Promise.all(
      imageDescriptions.map(async (description) => {
        try {
          const response = await openai.images.generate({
            model: "dall-e-3",
            prompt: description,
            n: 1,
            size: "1024x1024",
          });
          return response.data[0].url;
        } catch (error) {
          console.error('Error generating image:', error);
          return 'https://via.placeholder.com/1024x1024?text=Image+Generation+Failed';
        }
      })
    );

    console.log('Returning successful response');
    return {
      statusCode: 200,
      body: JSON.stringify({ text: story, images }),
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    };
  } catch (error) {
    console.error('Error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'An error occurred while generating the story and images.', details: error.message }),
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Access': '*',
      },
    };
  }
};
