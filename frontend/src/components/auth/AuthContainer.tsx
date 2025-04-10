import React from 'react';
import { Box, Paper } from '@mui/material';
import { styled } from '@mui/material/styles';
import CodeEditor from '../CodeEditor';

const BlurredBackground = styled(Box)(({ theme }) => ({
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backdropFilter: 'blur(8px)',
  backgroundColor: 'rgba(0, 0, 0, 0.85)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 1000,
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: -1,
  },
}));

const AuthPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  width: '100%',
  maxWidth: 400,
  backgroundColor: 'rgba(18, 18, 18, 0.95)',
  backdropFilter: 'blur(10px)',
  boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
  borderRadius: '12px',
  border: '1px solid rgba(255, 255, 255, 0.1)',
  '& .MuiTextField-root': {
    '& .MuiOutlinedInput-root': {
      '& fieldset': {
        borderColor: 'rgba(255, 255, 255, 0.23)',
      },
      '&:hover fieldset': {
        borderColor: 'rgba(255, 255, 255, 0.5)',
      },
      '&.Mui-focused fieldset': {
        borderColor: 'rgba(255, 255, 255, 0.7)',
      },
    },
    '& .MuiInputLabel-root': {
      color: 'rgba(255, 255, 255, 0.7)',
    },
    '& .MuiInputBase-input': {
      color: 'rgba(255, 255, 255, 0.87)',
    },
  },
  '& .MuiButton-root': {
    borderRadius: '8px',
    textTransform: 'none',
    fontWeight: 600,
    padding: '10px 16px',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    color: 'rgba(255, 255, 255, 0.87)',
    '&:hover': {
      backgroundColor: 'rgba(255, 255, 255, 0.2)',
    },
  },
  '& .MuiTypography-root': {
    color: 'rgba(255, 255, 255, 0.87)',
  },
  '& .MuiLink-root': {
    color: 'rgba(255, 255, 255, 0.7)',
    '&:hover': {
      color: 'rgba(255, 255, 255, 0.9)',
    },
  },
}));

interface AuthContainerProps {
  children: React.ReactNode;
}

const AuthContainer: React.FC<AuthContainerProps> = ({ children }) => {
  const [code, setCode] = React.useState(`// Welcome to CodeAI by Cahal Agarwalla(12309960)
// Your intelligent coding companion

function example() {
  console.log('Hello, World!');
}`);

  return (
    <BlurredBackground>
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: -1,
          opacity: 0.3,
        }}
      >
        <CodeEditor
          code={code}
          onCodeChange={setCode}
          onRun={() => {}}
          onCopy={() => {}}
          onDelete={() => {}}
          onLogout={() => {}}
        />
      </Box>
      <AuthPaper elevation={3}>
        {children}
      </AuthPaper>
    </BlurredBackground>
  );
};

export default AuthContainer; 