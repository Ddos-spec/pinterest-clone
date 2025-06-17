import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import Masonry from 'masonry-layout';
import ImageCard from './ImageCard';

const ImageGrid = ({ user }) => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const gridRef = useRef(null);
  const masonryRef = useRef(null);

  useEffect(() => {
    fetchImages();
  }, []);

  useEffect(() => {
    if (images.length > 0 && gridRef.current) {
      // Initialize or reload masonry
      if (masonryRef.current) {
        masonryRef.current.destroy();
      }
      
      setTimeout(() => {
        masonryRef.current = new Masonry(gridRef.current, {
          itemSelector: '.image-card',
          columnWidth: '.image-card',
          gutter: 16,
          fitWidth: true
        });
      }, 100);
    }

    return () => {
      if (masonryRef.current) {
        masonryRef.current.destroy();
      }
    };
  }, [images]);

  const fetchImages = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/images');
      setImages(response.data.images || []);
    } catch (error) {
      console.error('Error fetching images:', error);
      setError('Failed to load images');
    } finally {
      setLoading(false);
    }
  };

  const handleImageAdded = (newImage) => {
    setImages(prev => [newImage, ...prev]);
  };

  const handleImageDeleted = (imageId) => {
    setImages(prev => prev.filter(img => img._id !== imageId));
  };

  const handleImageLiked = (imageId, liked, likesCount) => {
    setImages(prev => prev.map(img => 
      img._id === imageId 
        ? { ...img, liked, likesCount }
        : img
    ));
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <div className="text-lg">Loading images...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  if (images.length === 0) {
    return (
      <div className="flex flex-col justify-center items-center min-h-64 text-center">
        <h2 className="text-2xl font-semibold mb-4">No images yet</h2>
        <p className="text-muted-foreground mb-6">
          {user ? 'Be the first to add an image!' : 'Login to start adding images to the gallery.'}
        </p>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div 
        ref={gridRef}
        className="mx-auto"
        style={{ maxWidth: 'fit-content' }}
      >
        {images.map((image) => (
          <ImageCard
            key={image._id}
            image={image}
            user={user}
            onDelete={handleImageDeleted}
            onLike={handleImageLiked}
          />
        ))}
      </div>
    </div>
  );
};

export default ImageGrid;

