import { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';
import { Heart, Trash2, User } from 'lucide-react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';

const ImageCard = ({ image, user, onDelete, onLike }) => {
  const [imageError, setImageError] = useState(false);
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(image.likesCount || 0);
  const [deleting, setDeleting] = useState(false);

  const handleImageError = () => {
    setImageError(true);
  };

  const handleDelete = async () => {
    try {
      setDeleting(true);
      await axios.delete(`/images/${image._id}`);
      onDelete(image._id);
    } catch (error) {
      console.error('Error deleting image:', error);
      setDeleting(false);
    }
  };

  const handleLike = async () => {
    if (!user) return;
    
    try {
      const response = await axios.post(`/images/${image._id}/like`);
      const newLiked = response.data.liked;
      const newLikesCount = response.data.likesCount;
      
      setLiked(newLiked);
      setLikesCount(newLikesCount);
      onLike(image._id, newLiked, newLikesCount);
    } catch (error) {
      console.error('Error toggling like:', error);
    }
  };

  const isOwner = user && user.id === image.owner._id;

  return (
    <Card className="image-card w-64 mb-4 overflow-hidden hover:shadow-lg transition-shadow">
      <CardContent className="p-0">
        <div className="relative group">
          {imageError ? (
            <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
              <div className="text-center text-gray-500">
                <div className="text-4xl mb-2">🖼️</div>
                <div className="text-sm">Image not available</div>
              </div>
            </div>
          ) : (
            <img
              src={image.url}
              alt={image.title}
              className="w-full h-auto object-cover"
              onError={handleImageError}
              loading="lazy"
            />
          )}
          
          {/* Overlay with actions */}
          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-200 flex items-end justify-between p-3 opacity-0 group-hover:opacity-100">
            <div className="flex items-center space-x-2">
              {user && (
                <Button
                  size="sm"
                  variant={liked ? "default" : "secondary"}
                  onClick={handleLike}
                  className="flex items-center space-x-1"
                >
                  <Heart className={`w-4 h-4 ${liked ? 'fill-current' : ''}`} />
                  <span>{likesCount}</span>
                </Button>
              )}
            </div>
            
            {isOwner && (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    size="sm"
                    variant="destructive"
                    disabled={deleting}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete Image</AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to delete this image? This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}
          </div>
        </div>
        
        {/* Image info */}
        <div className="p-4">
          <h3 className="font-semibold text-sm mb-2 line-clamp-2">{image.title}</h3>
          {image.description && (
            <p className="text-xs text-muted-foreground mb-3 line-clamp-3">{image.description}</p>
          )}
          
          {/* Owner info */}
          <Link 
            to={`/user/${image.owner._id}`}
            className="flex items-center space-x-2 hover:opacity-80 transition-opacity"
          >
            <Avatar className="h-6 w-6">
              <AvatarImage src={image.owner.avatarUrl} alt={image.owner.displayName} />
              <AvatarFallback className="text-xs">
                {image.owner.displayName?.charAt(0) || image.owner.username?.charAt(0) || <User className="w-3 h-3" />}
              </AvatarFallback>
            </Avatar>
            <span className="text-xs text-muted-foreground">
              {image.owner.displayName || image.owner.username}
            </span>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};

export default ImageCard;

