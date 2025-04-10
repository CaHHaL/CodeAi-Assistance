import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import bcrypt from 'bcryptjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const USERS_FILE = path.join(__dirname, '../../data/users.json');

// Ensure the data directory exists with proper permissions
const dataDir = path.join(__dirname, '../../data');
try {
    if (!fs.existsSync(dataDir)) {
        fs.mkdirSync(dataDir, { recursive: true, mode: 0o755 });
    }
    
    // Initialize users file if it doesn't exist
    if (!fs.existsSync(USERS_FILE)) {
        fs.writeFileSync(USERS_FILE, JSON.stringify([], null, 2), { mode: 0o644 });
    }
} catch (error) {
    console.error('Error setting up data directory:', error);
    // Create a fallback in-memory storage if file system operations fail
    global.inMemoryUsers = [];
}

const getUsers = () => {
    try {
        if (fs.existsSync(USERS_FILE)) {
            return JSON.parse(fs.readFileSync(USERS_FILE, 'utf8'));
        }
        return global.inMemoryUsers || [];
    } catch (error) {
        console.error('Error reading users:', error);
        return global.inMemoryUsers || [];
    }
};

const saveUsers = (users) => {
    try {
        if (fs.existsSync(USERS_FILE)) {
            fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
        } else {
            global.inMemoryUsers = users;
        }
    } catch (error) {
        console.error('Error saving users:', error);
        global.inMemoryUsers = users;
    }
};

export const registerUser = async (username, password) => {
    try {
        const users = getUsers();
        
        // Check if user already exists
        if (users.some(user => user.username === username)) {
            throw new Error('Username already exists');
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);
        
        // Add new user
        const newUser = {
            id: Date.now().toString(),
            username,
            password: hashedPassword,
            createdAt: new Date().toISOString()
        };

        users.push(newUser);
        saveUsers(users);

        return { id: newUser.id, username: newUser.username };
    } catch (error) {
        throw error;
    }
};

export const loginUser = async (username, password) => {
    try {
        const users = getUsers();
        const user = users.find(u => u.username === username);

        if (!user) {
            throw new Error('User not found');
        }

        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
            throw new Error('Invalid password');
        }

        return { id: user.id, username: user.username };
    } catch (error) {
        throw error;
    }
}; 