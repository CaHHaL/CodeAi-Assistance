import express from 'express';
import geminiService from '../services/geminiService.js';
import { exec } from 'child_process';
import { promisify } from 'util';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const execAsync = promisify(exec);
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

// Create a temporary directory for code execution
const tempDir = path.join(__dirname, '../../temp');
await fs.mkdir(tempDir, { recursive: true });

// Check if a command is available
async function isCommandAvailable(command) {
  try {
    await execAsync(`${command} --version`);
    return true;
  } catch (error) {
    return false;
  }
}

// Execute code endpoint
router.post('/execute', async (req, res) => {
  try {
    const { code, language } = req.body;
    if (!code || !language) {
      return res.status(400).json({ error: 'Code and language are required' });
    }

    // Use Gemini to execute the code
    const output = await geminiService.executeCode(code, language);
    
    res.json({ output });
  } catch (error) {
    console.error('Error executing code:', error);
    res.status(500).json({ 
      error: 'Failed to execute code',
      output: error.message 
    });
  }
});

// Debug code endpoint
router.post('/debug', async (req, res) => {
  try {
    const { code, language } = req.body;
    if (!code || !language) {
      return res.status(400).json({ error: 'Code and language are required' });
    }

    const result = await geminiService.debugCode(code, language);
    res.json({ result });
  } catch (error) {
    console.error('Error debugging code:', error);
    res.status(500).json({ error: 'Failed to debug code' });
  }
});

// Generate code endpoint
router.post('/generate', async (req, res) => {
  try {
    const { description, language } = req.body;
    if (!description || !language) {
      return res.status(400).json({ error: 'Description and language are required' });
    }

    const result = await geminiService.generateCode(description, language);
    res.json({ result });
  } catch (error) {
    console.error('Error generating code:', error);
    res.status(500).json({ error: 'Failed to generate code' });
  }
});

// Explain code endpoint
router.post('/explain', async (req, res) => {
  try {
    const { code, language } = req.body;
    if (!code || !language) {
      return res.status(400).json({ error: 'Code and language are required' });
    }
    const result = await geminiService.explainCode(code, language);
    res.json({ result });
  } catch (error) {
    console.error('Explain route error:', error);
    res.status(500).json({ error: error.message || 'Failed to explain code' });
  }
});

// Optimize code endpoint
router.post('/optimize', async (req, res) => {
  try {
    const { code, language } = req.body;
    if (!code || !language) {
      return res.status(400).json({ error: 'Code and language are required' });
    }
    const result = await geminiService.optimizeCode(code, language);
    res.json({ result });
  } catch (error) {
    console.error('Optimize route error:', error);
    res.status(500).json({ error: error.message || 'Failed to optimize code' });
  }
});

export default router; 