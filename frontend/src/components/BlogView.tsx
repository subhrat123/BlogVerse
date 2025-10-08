import { getBlog } from '../api';
import { User, Calendar, Edit3 } from 'lucide-react';
import { useEffect, useState, useContext } from 'react';
import { Blog } from '@subhrat/blog-common';
import { StoreContext } from '../store';

const BlogView = ({ blogId, onNavigate, onEditBlog }: { blogId: number; onNavigate: (page: "blogs" | "view" | "edit") => void; onEditBlog: (id: number) => void }) => {


  const [blog, setBlog] = useState<Blog | null>(null);
  const [loading, setLoading] = useState(true);
  const storeContext = useContext(StoreContext);
  const user = storeContext?.user;
  
  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const blogData = await getBlog(blogId);
        setBlog(blogData);
      } catch (error) {
        console.error('Failed to fetch blog:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchBlog();
  }, [blogId]);

  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
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
        
        <article className="bg-white rounded-lg shadow-sm border p-8">
          <header className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">{blog.title}</h1>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4 text-gray-600">
                <div className="flex items-center space-x-1">
                  <User className="h-4 w-4" />
                  <span>{blog.author?.name}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Calendar className="h-4 w-4" />
                  <span>{formatDate(blog.publishedDate?.toString())}</span>
                </div>
              </div>
              
              {user && user.id === blog.author?.id && (
                <button
                  onClick={() => onEditBlog(blog.id)}
                  className="flex items-center space-x-1 bg-blue-600 text-white px-3 py-2 rounded-md hover:bg-blue-700 text-sm"
                >
                  <Edit3 className="h-4 w-4" />
                  <span>Edit</span>
                </button>
              )}
            </div>
          </header>
          
          <div className="prose max-w-none">
            <div className="text-gray-700 leading-relaxed whitespace-pre-wrap">
              {blog.content}
            </div>
          </div>
        </article>
      </div>
    </div>
  );
};
export default BlogView;