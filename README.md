# Pinterest Clone

A full-stack Pinterest clone built with Node.js, Express, MongoDB, and React. This application allows users to browse images, authenticate with GitHub, and manage their own image collections.

## Features

### For All Users (Unauthenticated)
- Browse all users' image galleries
- View images in a Pinterest-style masonry grid layout
- Responsive design for desktop and mobile

### For Authenticated Users
- Login with GitHub OAuth
- Add new images by URL
- Delete their own images
- Like/unlike images
- View user profiles and individual galleries
- Automatic placeholder for broken image URLs

## Tech Stack

### Backend
- **Node.js** with Express.js
- **MongoDB** with Mongoose ODM
- **Passport.js** for GitHub OAuth authentication
- **Express Session** for session management
- **CORS** enabled for cross-origin requests

### Frontend
- **React** with modern hooks
- **React Router** for client-side routing
- **Tailwind CSS** for styling
- **shadcn/ui** components for polished UI
- **Masonry.js** for Pinterest-style grid layout
- **Axios** for API communication
- **Lucide React** for icons

### Database
- **MongoDB Atlas** (cloud-hosted)
- User profiles with GitHub OAuth data
- Image metadata with ownership and likes

## Quick Start

### Prerequisites
- Node.js (v16 or higher)
- npm or pnpm
- GitHub OAuth App (for authentication)

### Installation

1. **Clone and install dependencies:**
   ```bash
   npm install
   ```

2. **Set up GitHub OAuth:**
   - Go to GitHub Settings > Developer settings > OAuth Apps
   - Create a new OAuth App with:
     - Application name: Pinterest Clone
     - Homepage URL: http://localhost:3000
     - Authorization callback URL: http://localhost:5000/api/auth/github/callback
   - Copy the Client ID and Client Secret

3. **Configure environment variables:**
   - Edit `server/.env` and update:
     ```env
     GITHUB_CLIENT_ID=your-github-client-id
     GITHUB_CLIENT_SECRET=your-github-client-secret
     SESSION_SECRET=your-super-secret-session-key
     ```

4. **Start the application:**
   ```bash
   npm run dev
   ```

   This will start both the backend server (port 5000) and frontend development server (port 3000).

5. **Open your browser:**
   - Navigate to http://localhost:3000
   - Click "Login with GitHub" to authenticate
   - Start adding and browsing images!

## Project Structure

```
pinterest-clone/
├── package.json                 # Root package with scripts
├── README.md                   # This file
├── server/                     # Backend Express application
│   ├── package.json           # Server dependencies
│   ├── index.js               # Main server file
│   ├── .env                   # Environment variables
│   ├── config/
│   │   └── passport.js        # Passport GitHub OAuth config
│   ├── models/
│   │   ├── User.js            # User model
│   │   └── Image.js           # Image model
│   └── routes/
│       ├── auth.js            # Authentication routes
│       ├── images.js          # Image CRUD routes
│       └── users.js           # User profile routes
└── client/                    # Frontend React application
    ├── package.json           # Client dependencies
    ├── index.html             # HTML entry point
    ├── src/
    │   ├── App.jsx            # Main App component
    │   ├── App.css            # Global styles
    │   └── components/
    │       ├── Header.jsx     # Navigation header
    │       ├── ImageGrid.jsx  # Masonry grid layout
    │       ├── ImageCard.jsx  # Individual image cards
    │       ├── AddImageModal.jsx # Add image form
    │       ├── LoginPage.jsx  # Login page
    │       └── UserProfile.jsx # User profile page
    └── public/                # Static assets
```

## API Endpoints

### Authentication
- `GET /api/auth/github` - Initiate GitHub OAuth
- `GET /api/auth/github/callback` - GitHub OAuth callback
- `POST /api/auth/logout` - Logout user
- `GET /api/auth/status` - Check authentication status

### Images
- `GET /api/images` - Get all images (public)
- `GET /api/images/user/:userId` - Get user's images
- `POST /api/images` - Create new image (authenticated)
- `DELETE /api/images/:id` - Delete image (owner only)
- `POST /api/images/:id/like` - Toggle like (authenticated)

### Users
- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get user profile
- `GET /api/users/username/:username` - Get user by username

## Environment Variables

### Server (.env)
```env
# MongoDB Connection
MONGODB_URI=mongodb+srv://seto:admin123@cluster0.uvphcu3.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0

# Session Secret
SESSION_SECRET=your-super-secret-session-key

# GitHub OAuth
GITHUB_CLIENT_ID=your-github-client-id
GITHUB_CLIENT_SECRET=your-github-client-secret
GITHUB_CALLBACK_URL=http://localhost:5000/api/auth/github/callback

# Server Configuration
PORT=5000
NODE_ENV=development
```

## Development

### Available Scripts

From the root directory:
- `npm install` - Install all dependencies (server + client)
- `npm run dev` - Start both server and client in development mode
- `npm run server` - Start only the backend server
- `npm run client` - Start only the frontend client
- `npm run build` - Build the client for production
- `npm start` - Start the production server

### Development Workflow

1. **Backend Development:**
   ```bash
   cd server
   npm run dev  # Uses nodemon for auto-restart
   ```

2. **Frontend Development:**
   ```bash
   cd client
   pnpm run dev  # Uses Vite for fast HMR
   ```

3. **Full Stack Development:**
   ```bash
   npm run dev  # Runs both concurrently
   ```

## Features Implementation

### Image Upload
- Users can add images by providing a URL
- Client-side validation for URL format
- Server-side validation with express-validator
- Automatic fallback to placeholder for broken images

### Masonry Grid Layout
- Uses Masonry.js for Pinterest-style layout
- Responsive columns based on screen size
- Lazy loading for better performance
- Smooth animations and hover effects

### Authentication Flow
1. User clicks "Login with GitHub"
2. Redirected to GitHub OAuth
3. GitHub redirects back with authorization code
4. Server exchanges code for user data
5. User session created and stored
6. Frontend receives authentication status

### User Experience
- Clean, minimal design inspired by Pinterest
- Responsive layout for all screen sizes
- Loading states and error handling
- Confirmation dialogs for destructive actions
- Toast notifications for user feedback

## Database Schema

### User Model
```javascript
{
  githubId: String (unique),
  username: String,
  displayName: String,
  profileUrl: String,
  avatarUrl: String,
  email: String,
  createdAt: Date,
  updatedAt: Date
}
```

### Image Model
```javascript
{
  url: String,
  title: String,
  description: String,
  owner: ObjectId (ref: User),
  ownerName: String,
  likes: [ObjectId] (ref: User),
  likesCount: Number,
  createdAt: Date,
  updatedAt: Date
}
```

## Security Features

- CORS configured for specific origins
- Session-based authentication
- CSRF protection through SameSite cookies
- Input validation and sanitization
- MongoDB injection protection via Mongoose
- Secure session configuration

## Performance Optimizations

- Image lazy loading
- Pagination for large image sets
- Efficient MongoDB queries with indexes
- Optimized bundle size with Vite
- CSS-in-JS with Tailwind for minimal CSS

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - feel free to use this project for learning or as a starting point for your own applications.

## Troubleshooting

### Common Issues

1. **MongoDB Connection Error:**
   - Verify the MONGODB_URI in server/.env
   - Check network connectivity
   - Ensure MongoDB Atlas allows connections from your IP

2. **GitHub OAuth Not Working:**
   - Verify GITHUB_CLIENT_ID and GITHUB_CLIENT_SECRET
   - Check OAuth app callback URL matches exactly
   - Ensure OAuth app is not suspended

3. **CORS Errors:**
   - Verify frontend is running on http://localhost:3000
   - Check CORS configuration in server/index.js
   - Clear browser cache and cookies

4. **Images Not Loading:**
   - Check if image URLs are accessible
   - Verify CORS headers from image sources
   - Test with different image URLs

### Development Tips

- Use browser developer tools to debug API calls
- Check server logs for backend errors
- Use React Developer Tools for component debugging
- Monitor network tab for failed requests

## Future Enhancements

- Image upload from local files
- Image categories and tags
- Search functionality
- User following system
- Email notifications
- Image compression and optimization
- Progressive Web App (PWA) features
- Dark mode support

