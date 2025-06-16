
# Pinterest Clone

A fully functional Pinterest clone built from scratch with modern web technologies, featuring user authentication, image linking and storage, a Pinterest-style masonry grid, and comprehensive testing.

## Features

- **GitHub OAuth Authentication**: Secure login with GitHub accounts
- **Image Linking & Storage**: Pin images from any URL with MongoDB storage
- **User-Specific Deletion**: Users can only delete their own pins
- **Pinterest-Style Masonry Grid**: Responsive grid layout that adapts to all screen sizes
- **Public User Walls**: Browse other users' pins at `/users/:username`
- **Broken Image Detection**: Automatic client-side detection with placeholder fallback
- **Comprehensive Testing**: Full test suite covering authentication, pin management, and frontend functionality
- **Modern Responsive Design**: Clean, mobile-friendly interface

## Tech Stack

- **Backend**: Node.js, Express.js, MongoDB with Mongoose
- **Frontend**: React (via CDN), vanilla JavaScript
- **Authentication**: Passport.js with GitHub OAuth2
- **Testing**: Jest, Supertest, MongoDB Memory Server
- **Styling**: Modern CSS with responsive design

## Project Structure

```
pinterest-clone/
├── public/
│   └── index.html          # Main frontend application
├── src/
│   └── server/
│       └── server.js       # Express server with all routes
├── tests/
│   ├── api.test.js         # Backend API tests
│   ├── frontend.test.js    # Frontend functionality tests
│   └── setup.js           # Test configuration
├── .env.example           # Environment variables template
├── .gitignore
├── package.json
└── README.md
```

## Setup and Installation

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (local installation or MongoDB Atlas)
- GitHub OAuth App (for authentication)

### 1. Clone and Install

```bash
# Clone the repository
git clone <repository-url>
cd pinterest-clone

# Install dependencies
npm install
```

### 2. Environment Configuration

Create a `.env` file based on `.env.example`:

```bash
cp .env.example .env
```

Configure the following environment variables:

```env
# MongoDB connection string
MONGODB_URI=mongodb://localhost:27017/pinterest-clone

# GitHub OAuth credentials (create at https://github.com/settings/applications/new)
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret
GITHUB_CALLBACK_URL=http://localhost:3000/auth/github/callback

# Session secret (generate a random string)
SESSION_SECRET=your_random_session_secret

# Server port
PORT=3000
```

### 3. GitHub OAuth Setup

1. Go to [GitHub Developer Settings](https://github.com/settings/applications/new)
2. Create a new OAuth App with:
   - **Application name**: Pinterest Clone
   - **Homepage URL**: `http://localhost:3000`
   - **Authorization callback URL**: `http://localhost:3000/auth/github/callback`
3. Copy the Client ID and Client Secret to your `.env` file

### 4. Database Setup

**Option A: Local MongoDB**
```bash
# Install MongoDB locally and start the service
mongod
```

**Option B: MongoDB Atlas**
```bash
# Use MongoDB Atlas connection string in MONGODB_URI
# Example: mongodb+srv://username:password@cluster.mongodb.net/pinterest-clone
```

## Running the Application

### Development Mode

```bash
# Start the development server
npm run dev

# The application will be available at http://localhost:3000
```

### Production Mode

```bash
# Build the application
npm run build

# Start the production server
npm start
```

## Testing

Run the comprehensive test suite:

```bash
# Run all tests
npm test

# Tests cover:
# - GitHub OAuth authentication flow
# - Pin creation, listing, and deletion
# - Public user wall browsing
# - Broken image detection and replacement
# - Frontend user interactions
```

## API Endpoints

### Authentication
- `GET /auth/github` - Initiate GitHub OAuth
- `GET /auth/github/callback` - GitHub OAuth callback
- `GET /auth/logout` - Logout user
- `GET /api/user` - Get current user info

### Pin Management
- `POST /api/pins` - Create new pin (authenticated)
- `GET /api/pins` - Get user's pins (authenticated)
- `DELETE /api/pins/:id` - Delete pin (authenticated, owner only)

### Public Routes
- `GET /api/users/:username/pins` - Get public user pins
- `GET /` - Serve main application

## Usage

### For Authenticated Users

1. **Login**: Click "Login with GitHub" to authenticate
2. **Add Pins**: Use the form to add image URLs with optional descriptions
3. **View Your Pins**: See all your pins in a masonry grid layout
4. **Delete Pins**: Hover over your pins to see the delete button
5. **Logout**: Click the logout button in the header

### For Unauthenticated Users

1. **Browse Public Walls**: Visit `/users/:username` to see any user's public pins
2. **View Only**: Cannot add or delete pins without authentication

## Deployment

### Heroku Deployment

1. **Prepare for Heroku**:
```bash
# Create Procfile
echo "web: npm start" > Procfile

# Ensure environment variables are set in Heroku dashboard
```

2. **Deploy**:
```bash
# Create Heroku app
heroku create your-pinterest-clone

# Set environment variables
heroku config:set MONGODB_URI=your_mongodb_atlas_uri
heroku config:set GITHUB_CLIENT_ID=your_github_client_id
heroku config:set GITHUB_CLIENT_SECRET=your_github_client_secret
heroku config:set GITHUB_CALLBACK_URL=https://your-app.herokuapp.com/auth/github/callback
heroku config:set SESSION_SECRET=your_session_secret

# Deploy
git push heroku main
```

### Vercel Deployment

1. **Install Vercel CLI**:
```bash
npm i -g vercel
```

2. **Deploy**:
```bash
vercel --prod
```

3. **Configure Environment Variables** in Vercel dashboard

## Package for Distribution

Create a ZIP file for easy sharing:

```bash
npm run package
```

This creates `pinterest-clone.zip` with all source files (excluding node_modules).

## Features in Detail

### Broken Image Handling

The application automatically detects broken image links using JavaScript:

```javascript
const checkImageExists = (url) => {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve(true);
    img.onerror = () => resolve(false);
    img.src = url;
  });
};
```

Broken images are replaced with a placeholder showing "Image not available".

### Responsive Masonry Grid

The CSS-based masonry layout adapts to different screen sizes:

- **Desktop**: 4 columns
- **Tablet**: 3 columns  
- **Mobile**: 2 columns
- **Small Mobile**: 1 column

### Security Features

- **Session Management**: Secure session handling with express-session
- **CORS Protection**: Configured for cross-origin requests
- **Authentication Middleware**: Protected routes require authentication
- **Ownership Validation**: Users can only delete their own pins

## Troubleshooting

### Common Issues

1. **MongoDB Connection Error**:
   - Ensure MongoDB is running locally or Atlas connection string is correct
   - Check firewall settings for MongoDB Atlas

2. **GitHub OAuth Error**:
   - Verify GitHub OAuth app settings match your callback URL
   - Ensure Client ID and Secret are correctly set in environment variables

3. **Port Already in Use**:
   - Change the PORT environment variable
   - Kill existing processes: `lsof -ti:3000 | xargs kill -9`

4. **Images Not Loading**:
   - Check CORS settings on image hosts
   - Verify image URLs are publicly accessible

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests: `npm test`
5. Submit a pull request

## License

ISC License - feel free to use this project for learning and development purposes.


