
import { Blogs } from '@subhrat/blog-common';
import { Blog } from '@subhrat/blog-common';
import { BlogCreate } from '@subhrat/blog-common';

// import { BlogUpdate } from '@subhrat/blog-common';

export const getAllBlogs = async (): Promise<Blogs> => {
  console.log("API URL:", import.meta.env.VITE_API_URL);
  const response = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/blog/bulk`,
    { method: 'GET' ,headers: { 'Content-Type': 'application/json' } }
  );
  if (!response.ok) {
    throw new Error('Failed to fetch blogs');
  }
  return response.json();
};

export const getBlog = async (id: number): Promise<Blog> => {
  const response = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/blog/${id}`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  });
  if (!response.ok) {
    throw new Error('Failed to fetch blog');
  }
  return response.json();
};

export const createBlog = async (title: string, content: string): Promise<BlogCreate> => {
    const token = localStorage.getItem('token');
  const response = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/blog/b1`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `${token}` },
    body: JSON.stringify({ title, content }),
  });
  if (!response.ok) {
    throw new Error('Failed to create blog');
  }
  return response.json();
};

export const updateBlog = async (id: number, title: string, content: string, published?: boolean): Promise<BlogCreate> => {
    const token = localStorage.getItem('token');
  const response = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/blog/b1/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', 'Authorization': `${token}`},
    body: JSON.stringify({ title, content, published }),
  });
  if (!response.ok) {
    throw new Error('Failed to update blog');
  }
  return response.json();
};



export const getUserBlogs = async ():Promise<Blogs>=>{
    const token = localStorage.getItem('token');
  const response = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/user/me/blogs`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json', 'Authorization': `${token}` },
  });
  if (!response.ok) {
    throw new Error('Failed to fetch user blogs');
  }
  return response.json();
}
""