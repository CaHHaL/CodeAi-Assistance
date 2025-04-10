import React, { useState, useEffect } from 'react';
import { Box, Paper, Typography, Button, Select, MenuItem, FormControl, InputLabel, SelectChangeEvent, Alert, Link, CircularProgress } from '@mui/material';
import CodeMirror from '@uiw/react-codemirror';
import { langs } from '@uiw/codemirror-extensions-langs';
import axios from 'axios';
import { PlayArrow, ContentCopy, Delete, BugReport, Code, Logout } from '@mui/icons-material';
import { IconButton, Tooltip } from '@mui/material';

const languages = [
  'javascript',
  'python',
  'java',
  'cpp',
  'csharp',
  'php',
  'ruby',
  'go',
  'rust',
  'typescript'
];

// Language-specific setup instructions
const languageSetupInstructions = {
  javascript: 'JavaScript runs in Node.js. Make sure Node.js is installed.',
  python: 'Python interpreter is required. Install Python from python.org.',
  java: 'Java Development Kit (JDK) is required. Install JDK from oracle.com or openjdk.org.',
  cpp: 'C++ compiler (g++) is required. Install MinGW or GCC.',
  csharp: 'C# requires .NET SDK. Install from dotnet.microsoft.com.',
  php: 'PHP interpreter is required. Install from php.net.',
  ruby: 'Ruby interpreter is required. Install from ruby-lang.org.',
  go: 'Go compiler is required. Install from golang.org.',
  rust: 'Rust compiler is required. Install from rust-lang.org.',
  typescript: 'TypeScript requires Node.js and TypeScript compiler. Install with: npm install -g typescript'
};

// Map language to CodeMirror language mode
const getLanguageMode = (language: string) => {
  switch (language) {
    case 'javascript':
      return langs.javascript();
    case 'python':
      return langs.python();
    case 'java':
      return langs.java();
    case 'cpp':
      return langs.cpp();
    case 'csharp':
      return langs.csharp();
    case 'php':
      return langs.php();
    case 'ruby':
      return langs.ruby();
    case 'go':
      return langs.go();
    case 'rust':
      return langs.rust();
    case 'typescript':
      return langs.typescript();
    default:
      return langs.javascript();
  }
};

interface CodeEditorProps {
  code: string;
  onCodeChange: (newCode: string) => void;
  onRun: () => void;
  onCopy: () => void;
  onDelete: () => void;
  onLogout: () => void;
}

const CodeEditor: React.FC<CodeEditorProps> = ({
  code,
  onCodeChange,
  onRun,
  onCopy,
  onDelete,
  onLogout,
}) => {
  const [language, setLanguage] = useState<string>('javascript');
  const [result, setResult] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [showSetupInstructions, setShowSetupInstructions] = useState<boolean>(false);

  const handleDebug = async (): Promise<void> => {
    try {
      setLoading(true);
      setError('');
      const response = await axios.post('http://localhost:5000/api/debug', {
        code,
        language
      });
      setResult(response.data.result);
    } catch (err) {
      setError('Failed to debug code. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerate = async (): Promise<void> => {
    try {
      setLoading(true);
      setError('');
      const response = await axios.post('http://localhost:5000/api/generate', {
        description: code,
        language
      });
      setResult(response.data.result);
    } catch (err) {
      setError('Failed to generate code. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleRunCode = async (): Promise<void> => {
    try {
      setLoading(true);
      setError('');

      const response = await axios.post('http://localhost:5000/api/execute', {
        code,
        language
      });

      if (response.data.error) {
        setError(response.data.error);
        setResult(response.data.output || '');
      } else {
        setResult(response.data.output || 'No output');
        setError('');
      }
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to execute code. Please try again.');
      setResult(err.response?.data?.output || '');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleLanguageChange = (event: SelectChangeEvent): void => {
    setLanguage(event.target.value);
    setShowSetupInstructions(false);
  };

  return (
    <Box sx={{ p: 3, height: '100vh', display: 'flex', flexDirection: 'column', gap: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h4" component="h1">
          CodeAI
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <FormControl sx={{ minWidth: 120 }}>
            <InputLabel>Language</InputLabel>
            <Select
              value={language}
              label="Language"
              onChange={handleLanguageChange}
            >
              {languages.map((lang) => (
                <MenuItem key={lang} value={lang}>
                  {lang}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Tooltip title="Logout">
            <IconButton onClick={onLogout} color="inherit">
              <Logout />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      <Box sx={{ display: 'flex', gap: 2, flex: 1 }}>
        <Paper sx={{ flex: 1, p: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6">Code Editor</Typography>
            <Box>
              <Tooltip title="Run Code">
                <IconButton onClick={handleRunCode} color="primary" disabled={loading}>
                  <PlayArrow />
                </IconButton>
              </Tooltip>
              <Tooltip title="Debug Code">
                <IconButton onClick={handleDebug} color="primary" disabled={loading}>
                  <BugReport />
                </IconButton>
              </Tooltip>
              <Tooltip title="Generate Code">
                <IconButton onClick={handleGenerate} color="primary" disabled={loading}>
                  <Code />
                </IconButton>
              </Tooltip>
              <Tooltip title="Copy Code">
                <IconButton onClick={onCopy} color="primary">
                  <ContentCopy />
                </IconButton>
              </Tooltip>
              <Tooltip title="Clear Code">
                <IconButton onClick={onDelete} color="error">
                  <Delete />
                </IconButton>
              </Tooltip>
            </Box>
          </Box>
          <Box sx={{ flexGrow: 1, overflow: 'hidden' }}>
            <CodeMirror
              value={code}
              height="100%"
              theme="dark"
              extensions={[getLanguageMode(language)]}
              onChange={(value) => onCodeChange(value)}
            />
          </Box>
        </Paper>

        <Paper sx={{ flex: 1, p: 2, overflow: 'auto' }}>
          <Typography variant="h6" gutterBottom>
            Output
          </Typography>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          {showSetupInstructions && (
            <Alert severity="info" sx={{ mb: 2 }}>
              <Typography variant="body2">
                {languageSetupInstructions[language as keyof typeof languageSetupInstructions]}
              </Typography>
              <Link href="https://nodejs.org/" target="_blank" rel="noopener noreferrer">
                Learn more about installing development tools
              </Link>
            </Alert>
          )}
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
              <CircularProgress />
            </Box>
          ) : (
            <Typography component="pre" sx={{ whiteSpace: 'pre-wrap', fontFamily: 'monospace' }}>
              {result}
            </Typography>
          )}
        </Paper>
      </Box>
    </Box>
  );
};

export default CodeEditor; 