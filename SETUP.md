# Pinterest Clone - Quick Setup Guide

## Prerequisites
- Node.js (v16 or higher)
- npm or pnpm
- GitHub account for OAuth setup

## Quick Start (5 minutes)

### 1. Install Dependencies
```bash
npm install
```

### 2. Set up GitHub OAuth App
1. Go to GitHub Settings → Developer settings → OAuth Apps
2. Click "New OAuth App"
3. Fill in:
   - **Application name:** Pinterest Clone
   - **Homepage URL:** http://localhost:3000
   - **Authorization callback URL:** http://localhost:5000/api/auth/github/callback
4. Click "Register application"
5. Copy the **Client ID** and **Client Secret**

### 3. Configure Environment Variables
Edit `server/.env` and replace the placeholder values:
```env
GITHUB_CLIENT_ID=your-actual-github-client-id
GITHUB_CLIENT_SECRET=your-actual-github-client-secret
SESSION_SECRET=change-this-to-a-random-secret-key
```

### 4. Start the Application
```bash
npm run dev
```

This starts both the backend (port 5000) and frontend (port 3000) servers.

### 5. Open Your Browser
Navigate to http://localhost:3000 and start using the Pinterest clone!

## What You Can Do

### Without Login
- Browse all images in the gallery
- View user profiles
- See image details and likes

### After GitHub Login
- Add new images by URL
- Delete your own images
- Like/unlike images
- View your profile and image collection

## Troubleshooting

**MongoDB Connection Issues:**
- The app uses a pre-configured MongoDB Atlas database
- No additional setup required for the database

**GitHub OAuth Not Working:**
- Double-check your Client ID and Client Secret
- Ensure the callback URL is exactly: http://localhost:5000/api/auth/github/callback
- Make sure your OAuth app is not suspended

**Port Already in Use:**
- Stop any other applications using ports 3000 or 5000
- Or modify the ports in the configuration files

## Project Structure
```
pinterest-clone/
├── server/          # Backend (Node.js + Express)
├── client/          # Frontend (React)
├── package.json     # Root scripts
└── README.md        # Detailed documentation
```

## Need Help?
Check the detailed README.md file for comprehensive documentation, API endpoints, and advanced configuration options.

Happy coding! 🎨📌

