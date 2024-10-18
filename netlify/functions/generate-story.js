const { OpenAI } = require('openai');
const axios = require('axios');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

exports.handler = async (event, context) => {
  console.log('Function invoked with event:', JSON.stringify(event));
  
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    console.log('Parsing request body');
    const { age, theme, characterName } = JSON.parse(event.body);

    if (!age || !theme || !characterName) {
      console.log('Missing required fields:', { age, theme, characterName });
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

    // Instead of generating images here, we'll return placeholder URLs
    const placeholderImages = Array(5).fill('https://via.placeholder.com/1024x1024?text=Image+Loading');

    console.log('Returning response with story and placeholder images');
    return {
      statusCode: 200,
      body: JSON.stringify({ text: story, images: placeholderImages }),
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    };
  } catch (error) {
    console.error('Error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'An error occurred while generating the story.', details: error.message }),
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    };
  }
};
