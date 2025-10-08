import React, { useState, useEffect } from 'react';
import { BlogUpdate } from '@subhrat/blog-common';
import {getBlog, updateBlog} from '../api';
import { Edit3, BookCheck } from 'lucide-react';

const EditBlog = ({ blogId, onNavigate }: { blogId: number; onNavigate: (page: "create" | "blogs" | "view" | "edit") => void }) => {
  const [blog, setBlog] = useState<BlogUpdate | null>(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isPublished, setIsPublished] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const blogData = await getBlog(blogId);
        setBlog(blogData);
        setTitle(blogData?.title || '');
        setContent(blogData?.content || '');
        setIsPublished(blogData?.publish || false);
      } catch (error) {
        console.error('Failed to fetch blog:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchBlog();
  }, [blogId]);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    
    try {
      await updateBlog(blogId, title, content);
      onNavigate('blogs');
    } catch (error) {
      console.error('Failed to update blog:', error);
    } finally {
      setSaving(false);
    }
  };

  const handlePublish = async () => {
    setSaving(true);
    try {
      await updateBlog(blogId, title, content, true);
      onNavigate('blogs');
    } catch (error) {
      console.error('Failed to publish blog:', error);
    } finally {
      setSaving(false);
    }
  };
  
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading blog...</p>
          </div>
        </div>
      </div>
    );
  }
  
  if (!blog) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Blog not found</h1>
            <button
              onClick={() => onNavigate('blogs')}
              className="text-blue-600 hover:text-blue-700"
            >
              Back to all blogs
            </button>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-6">
          <button
            onClick={() => onNavigate('blogs')}
            className="text-blue-600 hover:text-blue-700 text-sm font-medium"
          >
            ← Back to all blogs
          </button>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border p-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-8">Edit Blog</h1>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Content</label>
              <textarea
                required
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={15}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-vertical"
              />
            </div>
            
            <div className="flex space-x-4">
              <button
                type="submit"
                disabled={saving}
                className="flex items-center space-x-2 bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
              >
                <Edit3 className="h-4 w-4" />
                <span>{saving ? 'Saving...' : 'Save Changes'}</span>
              </button>

              {!isPublished && (
                <button
                  type="button"
                  onClick={handlePublish}
                  disabled={saving}
                  className="flex items-center space-x-2 bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
                >
                  <BookCheck className="h-4 w-4" />
                  <span>{saving ? 'Publishing...' : 'Publish'}</span>
                </button>
              )}
              
              <button
                type="button"
                onClick={() => onNavigate('blogs')}
                className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
export default EditBlog;