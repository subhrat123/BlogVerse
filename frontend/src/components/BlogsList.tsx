
import { Blogs } from '@subhrat/blog-common';
import { User, Eye, Plus, Calendar } from 'lucide-react';


const BlogList = ({blogs,loading , onNavigate, onViewBlog }: {  blogs: Blogs;loading:boolean; onNavigate: (page: "blogs" | "view" | "edit" | "create") => void; onViewBlog: (id: number) => void }) => {



  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };
  
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading blogs...</p>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">All Blogs</h1>
        </div>
        
        <div className="space-y-6">
          {blogs.map((blog) => (
            <article key={blog.id} className="bg-white rounded-lg shadow-sm border p-6 hover:shadow-md transition-shadow">
              <h2 className="text-xl font-semibold text-gray-900 mb-2">{blog.title}</h2>
              <p className="text-gray-600 mb-4 line-clamp-3">{blog.content?.substring(0, 200)}...</p>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4 text-sm text-gray-500">
                  <div className="flex items-center space-x-1">
                    <User className="h-4 w-4" />
                    <span>{blog.author?.id}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Calendar className="h-4 w-4" />
                    <span>{formatDate(blog.publishedDate?.toString())}</span>
                  </div>
                </div>
                
                <button
                  onClick={() => onViewBlog(blog.id)}
                  className="flex items-center space-x-1 text-blue-600 hover:text-blue-700 text-sm font-medium"
                >
                  <Eye className="h-4 w-4" />
                  <span>Read more</span>
                </button>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
};
export default BlogList;