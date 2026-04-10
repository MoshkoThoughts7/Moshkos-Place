# 🔒 Secure Moshko-AI Setup

## What Changed?
Your AI chat is now **SECURE**! The OpenAI API key is hidden on the server and cannot be stolen by visitors.

## How to Run Your Website Securely

### Step 1: Install Dependencies (First Time Only)
Open a terminal in this folder and run:
```bash
npm install
```

### Step 2: Start the Server
```bash
npm start
```

### Step 3: Open Your Website
Open your browser and go to:
```
http://localhost:3000
```

That's it! Your website will now serve all pages and the AI chat will work securely.

## How It Works

### Before (Insecure):
- ❌ API key was in `MoshkoAI_logic.js` (visible to anyone in browser)
- ❌ Anyone could steal your key and use it
- ❌ You'd pay for their usage

### After (Fully Secure):
- ✅ API key is in `.env` file (never committed to Git)
- ✅ `.gitignore` prevents accidentally sharing the key
- ✅ `server.js` loads key from environment variables
- ✅ Frontend calls your server at `/api/chat`
- ✅ Your server calls OpenAI with the hidden key
- ✅ Visitors **never** see the API key - even if they view your code!

## Files Changed
- **server.js** (NEW) - Backend server that protects your API key
- **package.json** (NEW) - Manages dependencies (express, cors, dotenv)
- **MoshkoAI_logic.js** (UPDATED) - Now calls your secure backend
- **.env** (NEW) - Stores your API key securely (NEVER share this!)
- **.env.example** (NEW) - Template for others (without real key)
- **.gitignore** (NEW) - Prevents committing sensitive files

## Important Notes
- Always run `npm start` before opening your website
- The server must be running for the AI chat to work
- Your API key is now safe! 🎉

## Deploying to Production
When you're ready to deploy online, you can use:
- **Vercel** (easiest - free tier available)
- **Netlify** (also easy - free tier available)
- **Heroku** (free tier available)
- **Railway** (modern alternative)

Let me know if you need help deploying!
