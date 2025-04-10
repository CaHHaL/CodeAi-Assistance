import { GoogleGenerativeAI } from '@google/generative-ai';

class GeminiService {
  constructor() {
    if (!process.env.GEMINI_API_KEY) {
      throw new Error('GEMINI_API_KEY is not set in environment variables');
    }
    this.genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    this.model = this.genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
  }

  async generateContent(prompt) {
    try {
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error('Error in generateContent:', error);
      throw new Error('Failed to generate content: ' + error.message);
    }
  }

  async debugCode(code, language) {
    const prompt = `Debug the following ${language} code and provide detailed explanations for any issues found:

\`\`\`${language}
${code}
\`\`\`

Please provide:
1. A list of any bugs or issues found
2. Suggestions for improvements
3. Best practices that could be applied
4. Any security concerns
5. Performance optimization tips`;
    
    return this.generateContent(prompt);
  }

  async executeCode(code, language) {
    const prompt = `Execute the following ${language} code and return only the output. If there are any errors, return them as well. Do not include any explanations, just the raw output or error message:

\`\`\`${language}
${code}
\`\`\`

Remember to:
1. Only return the actual output or error message
2. Do not include any markdown formatting
3. Do not include any explanations or additional text
4. If the code prints nothing, return "No output"
5. If there's an error, return the complete error message`;
    
    return this.generateContent(prompt);
  }

  async generateCode(description, language) {
    const prompt = `Generate ${language} code for the following description. Include comments explaining the code:

Description: ${description}

Requirements:
1. Use proper ${language} syntax and best practices
2. Include helpful comments
3. Handle edge cases and errors
4. Make the code efficient and readable
5. Return only the code with comments, no explanations`;
    
    return this.generateContent(prompt);
  }

  async explainCode(code, language) {
    const prompt = `Explain the following ${language} code in detail:\n\n${code}`;
    return this.generateContent(prompt);
  }

  async optimizeCode(code, language) {
    const prompt = `Optimize the following ${language} code and explain the improvements:\n\n${code}`;
    return this.generateContent(prompt);
  }
}

export default new GeminiService(); 