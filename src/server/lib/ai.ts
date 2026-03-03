import { GoogleGenerativeAI } from "@google/generative-ai";

interface StoryInput {
  childName: string;
  childAge: number;
  theme: string;
}

export async function generateStory({ childName, childAge, theme }: StoryInput): Promise<string> {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    // Return a sample story if no API key is configured
    return getSampleStory(childName, childAge, theme);
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `Write a delightful, age-appropriate children's story for a ${childAge}-year-old child named ${childName}.

Theme: ${theme}

Requirements:
- The story should star ${childName} as the main hero/heroine
- Length: 400-600 words
- Use simple, engaging language appropriate for age ${childAge}
- Include a positive moral lesson
- Make it exciting and fun with vivid descriptions
- End with a happy, satisfying conclusion
- Use paragraph breaks for readability

Write only the story text, no title needed.`;

    const result = await model.generateContent(prompt);
    return result.response.text();
  } catch (error) {
    console.error("Gemini API error:", error);
    return getSampleStory(childName, childAge, theme);
  }
}

function getSampleStory(childName: string, childAge: number, theme: string): string {
  const themeEmojis: Record<string, string> = {
    adventure: "🗺️", fantasy: "🧙", space: "🚀", ocean: "🌊",
    dinosaurs: "🦕", superheroes: "🦸", animals: "🐾", magic: "✨",
  };

  return `Once upon a time, there was a brave and curious ${childAge}-year-old named ${childName} who loved ${theme} more than anything in the world.

One sunny morning, ${childName} discovered something extraordinary — a glowing map that appeared right on their bedroom floor! The map showed a path to the most amazing ${theme} adventure anyone had ever seen.

Without hesitation, ${childName} packed a small backpack with snacks, a flashlight, and their favorite stuffed animal, then set off on the journey. ${themeEmojis[theme] || "⭐"}

Along the way, ${childName} met a friendly creature who needed help. A little bird had lost its nest in a big storm, and all its eggs were scattered across the path. ${childName} carefully gathered each egg and built a cozy new nest in a safe, warm tree.

"Thank you, ${childName}!" chirped the grateful bird. "You have the kindest heart I've ever seen. I'll help you on your adventure!"

Together, ${childName} and the bird faced every challenge with courage and creativity. When they came to a wide river with no bridge, ${childName} found stepping stones. When they got lost in a dark forest, the bird sang a guiding song that lit the way.

Finally, they reached the heart of the adventure — a magnificent place filled with wonder and magic. ${childName}'s eyes grew wide with amazement. It was even more beautiful than the map had shown!

At the center of it all was a treasure chest. But instead of gold, it was filled with something far more precious — photographs of every kind thing ${childName} had ever done, glowing like little stars.

"This is your real treasure," said the bird softly. "Your kindness and bravery make the world brighter for everyone."

${childName} smiled the biggest smile and hugged the bird tight. That evening, they returned home just in time for dinner, heart full of joy and a wonderful story to tell.

And from that day on, ${childName} knew that the greatest adventures always begin with a kind heart. The End. 🌟`;
}