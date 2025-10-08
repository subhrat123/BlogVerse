// import React, { useState } from 'react';
import { useEffect, useState } from 'react';
import BlogView from '../components/BlogView'; 
import BlogList from '../components/BlogsList'; 
import CreateBlog from '../components/CreateBlog'; 
import EditBlog from '../components/EditBlog'; 
import { getUserBlogs } from '../api';
import { Blogs } from '@subhrat/blog-common';


const MyBlogs = () => {
 
  const [currentPage, setCurrentPage] = useState<'blogs' | 'view' | 'edit' | 'create'>('blogs');
  
  const [selectedBlogId, setSelectedBlogId] = useState<number | null>(null);

  const [blogs, setBlogs] = useState<Blogs>([]);

    const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const blogData = await getUserBlogs();
        setBlogs(blogData);
      } catch (error) {
        console.error('Failed to fetch blogs:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchBlogs();
  }, []);

  const handleViewBlog = (id: number) => {
    setSelectedBlogId(id);
    setCurrentPage('view');
  };

  const handleEditBlog = (id: number) => {
    setSelectedBlogId(id);
    console.log("Editing blog with ID:", id);
    setCurrentPage('edit');
  };
  
  const handleNavigate = (page: "blogs" | "view" | "edit" | "create") => {
    if (page === 'blogs') {
      setSelectedBlogId(null);
    }
    setCurrentPage(page);
  };
  
  const renderContent = () => {
    switch (currentPage) {
      case 'view':
        return (
          <BlogView 
            blogId={selectedBlogId!} 
            onNavigate={handleNavigate}
            onEditBlog={handleEditBlog}
          />
        );
      case 'edit':
        return <EditBlog blogId={selectedBlogId!} onNavigate={handleNavigate} />;
      case 'create':
        return <CreateBlog onNavigate={handleNavigate} />;
      case 'blogs':
      default:
        return <BlogList blogs={blogs} loading={loading} onViewBlog={handleViewBlog} onNavigate={handleNavigate} />;
    }
  };

  return (
    <div className="w-full bg-gray-50 min-h-screen">
      {renderContent()}
    </div>
  );
};

export default MyBlogs;