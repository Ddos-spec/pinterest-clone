import { useState } from 'react';
import axios from 'axios';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Plus } from 'lucide-react';

const AddImageModal = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    url: '',
    title: '',
    description: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.url.trim() || !formData.title.trim()) {
      setError('URL and title are required');
      return;
    }

    try {
      setLoading(true);
      setError('');
      
      const response = await axios.post('/images', {
        url: formData.url.trim(),
        title: formData.title.trim(),
        description: formData.description.trim()
      });

      // Reset form
      setFormData({
        url: '',
        title: '',
        description: ''
      });
      
      // Close modal
      onClose();
      
      // Refresh the page to show the new image
      window.location.reload();
    } catch (error) {
      console.error('Error adding image:', error);
      if (error.response?.data?.errors) {
        setError(error.response.data.errors.map(err => err.msg).join(', '));
      } else {
        setError(error.response?.data?.error || 'Failed to add image');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      setFormData({
        url: '',
        title: '',
        description: ''
      });
      setError('');
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Plus className="w-5 h-5" />
            <span>Add New Image</span>
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="url">Image URL *</Label>
            <Input
              id="url"
              name="url"
              type="url"
              placeholder="https://example.com/image.jpg"
              value={formData.url}
              onChange={handleInputChange}
              disabled={loading}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              name="title"
              placeholder="Enter image title"
              value={formData.title}
              onChange={handleInputChange}
              disabled={loading}
              maxLength={100}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              placeholder="Enter image description (optional)"
              value={formData.description}
              onChange={handleInputChange}
              disabled={loading}
              maxLength={500}
              rows={3}
            />
          </div>
          
          {error && (
            <div className="text-sm text-red-500 bg-red-50 p-3 rounded-md">
              {error}
            </div>
          )}
          
          <div className="flex justify-end space-x-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading || !formData.url.trim() || !formData.title.trim()}
            >
              {loading ? 'Adding...' : 'Add Image'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddImageModal;

