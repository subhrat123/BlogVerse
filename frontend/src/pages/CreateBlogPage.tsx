import CreateBlog from '../components/CreateBlog';
import { useNavigate } from 'react-router-dom';

const CreateBlogPage = () => {
  const navigate = useNavigate();

  const handleNavigate = () => {
    navigate('/');
  };

  return (
    <div className="w-full bg-gray-50 min-h-screen">
      <CreateBlog onNavigate={handleNavigate} />
    </div>
  );
};

export default CreateBlogPage;