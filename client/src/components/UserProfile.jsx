import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { User, Calendar, Image as ImageIcon } from 'lucide-react';
import ImageGrid from './ImageGrid';

const UserProfile = ({ user: currentUser }) => {
  const { userId } = useParams();
  const [profileUser, setProfileUser] = useState(null);
  const [userImages, setUserImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (userId) {
      fetchUserProfile();
      fetchUserImages();
    }
  }, [userId]);

  const fetchUserProfile = async () => {
    try {
      const response = await axios.get(`/users/${userId}`);
      setProfileUser(response.data);
    } catch (error) {
      console.error('Error fetching user profile:', error);
      setError('Failed to load user profile');
    }
  };

  const fetchUserImages = async () => {
    try {
      const response = await axios.get(`/images/user/${userId}`);
      setUserImages(response.data.images || []);
    } catch (error) {
      console.error('Error fetching user images:', error);
      setError('Failed to load user images');
    } finally {
      setLoading(false);
    }
  };

  const handleImageDeleted = (imageId) => {
    setUserImages(prev => prev.filter(img => img._id !== imageId));
  };

  const handleImageLiked = (imageId, liked, likesCount) => {
    setUserImages(prev => prev.map(img => 
      img._id === imageId 
        ? { ...img, liked, likesCount }
        : img
    ));
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <div className="text-lg">Loading profile...</div>
      </div>
    );
  }

  if (error || !profileUser) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <div className="text-red-500">{error || 'User not found'}</div>
      </div>
    );
  }

  const isOwnProfile = currentUser && currentUser.id === userId;

  return (
    <div className="space-y-8">
      {/* Profile Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center space-x-6">
            <Avatar className="h-20 w-20">
              <AvatarImage src={profileUser.avatarUrl} alt={profileUser.displayName} />
              <AvatarFallback className="text-2xl">
                {profileUser.displayName?.charAt(0) || profileUser.username?.charAt(0) || <User className="w-8 h-8" />}
              </AvatarFallback>
            </Avatar>
            
            <div className="flex-1">
              <h1 className="text-3xl font-bold">{profileUser.displayName || profileUser.username}</h1>
              {profileUser.username && profileUser.displayName !== profileUser.username && (
                <p className="text-muted-foreground">@{profileUser.username}</p>
              )}
              
              <div className="flex items-center space-x-4 mt-4 text-sm text-muted-foreground">
                <div className="flex items-center space-x-1">
                  <ImageIcon className="w-4 h-4" />
                  <span>{profileUser.imageCount || 0} images</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Calendar className="w-4 h-4" />
                  <span>Joined {new Date(profileUser.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* User's Images */}
      <div>
        <h2 className="text-2xl font-semibold mb-6">
          {isOwnProfile ? 'Your Images' : `${profileUser.displayName || profileUser.username}'s Images`}
        </h2>
        
        {userImages.length === 0 ? (
          <div className="text-center py-12">
            <ImageIcon className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">No images yet</h3>
            <p className="text-muted-foreground">
              {isOwnProfile ? 'Start adding images to build your gallery!' : 'This user hasn\'t added any images yet.'}
            </p>
          </div>
        ) : (
          <UserImageGrid 
            images={userImages}
            user={currentUser}
            onDelete={handleImageDeleted}
            onLike={handleImageLiked}
          />
        )}
      </div>
    </div>
  );
};

// Custom component for user's image grid
const UserImageGrid = ({ images, user, onDelete, onLike }) => {
  return (
    <div className="w-full">
      <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 xl:columns-5 gap-4">
        {images.map((image) => (
          <div key={image._id} className="break-inside-avoid mb-4">
            <ImageCard
              image={image}
              user={user}
              onDelete={onDelete}
              onLike={onLike}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

// Import ImageCard component
import ImageCard from './ImageCard';

export default UserProfile;

