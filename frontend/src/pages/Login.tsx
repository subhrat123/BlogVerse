import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, User, Lock, LogIn, AlertCircle, CheckCircle } from 'lucide-react';
import { StoreContext } from '../store';


interface FormData {
    username: string; 
    password: string;
}

interface FormErrors {
    username?: string;
    password?: string;
}

interface Message {
    type: 'success' | 'error' | '';
    text: string;
}

interface ApiError {
    message?: string;
    errors?: {
        field: string;
        message: string;
    }[];
}

interface ApiSuccess {
    message: string;
    token: string;
    user: {
        id: number;
        name: string;
        username: string;
        email: string;
    };
}

const Login: React.FC = () => {
    const [formData, setFormData] = useState<FormData>({
        username: '',
        password: ''
    });

    const navigator = useNavigate();
    const [errors, setErrors] = useState<FormErrors>({});
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [message, setMessage] = useState<Message>({ type: '', text: '' });
    const storeContext = useContext(StoreContext);

    const validateForm = (): FormErrors => {
        const newErrors: FormErrors = {};

        // username validation (username or email)
        if (!formData.username.trim()) {
            newErrors.username = 'Email or Username is required';
        }

        // Password validation
        if (!formData.password) {
            newErrors.password = 'Password is required';
        }

        return newErrors;
    };

    const handleChange = (e: any): void => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        if (errors[name as keyof FormErrors]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const handleSubmit = async (): Promise<void> => {
        const newErrors = validateForm();
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        setIsLoading(true);
        setMessage({ type: '', text: '' });

        try {
        
            const response = await fetch('https://blogverse.subhrat.workers.dev/api/v1/user/signin', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });
            console.log(response);
            const data: ApiError | ApiSuccess = await response.json();

            if (response.ok) {
                setMessage({
                    type: 'success',
                    text: 'Login successful! Redirecting...'
                });
                console.log(data);
                const { token, user } = data as ApiSuccess;
                localStorage.setItem('token', token);
                localStorage.setItem('user', JSON.stringify(user));
                storeContext?.setToken(token);
                storeContext?.setUser(user);
                setTimeout(() => {
                    navigator('/'); // Redirect to a protected route
                }, 1500);
            } else {
                const errorData = data as ApiError;
                if (errorData.errors) {
                    const newErrors: FormErrors = {};
                    errorData.errors.forEach(err => {
                        newErrors[err.field as keyof FormErrors] = err.message;
                    });
                    setErrors(newErrors);
                } else {
                    setMessage({
                        type: 'error',
                        text: errorData.message || 'Invalid credentials. Please try again.'
                    });
                }
            }
        } catch (error) {
            setMessage({
                type: 'error',
                text: 'Network error. Please check your connection and try again.'
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mb-4">
                            <LogIn className="w-8 h-8 text-white" />
                        </div>
                        <h1 className="text-2xl font-bold text-gray-900 mb-2">Sign In</h1>
                        <p className="text-gray-600">Welcome back! Please sign in to your account.</p>
                    </div>

                    {/* Message Display */}
                    {message.text && (
                        <div className={`mb-6 p-4 rounded-lg flex items-center gap-3 ${message.type === 'success'
                                ? 'bg-green-50 border border-green-200 text-green-800'
                                : 'bg-red-50 border border-red-200 text-red-800'
                            }`}>
                            {message.type === 'success' ? (
                                <CheckCircle className="w-5 h-5 flex-shrink-0" />
                            ) : (
                                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                            )}
                            <span className="text-sm">{message.text}</span>
                        </div>
                    )}

                    {/* Form */}
                    <div className="space-y-6">
                        {/* username Field (Email or Username) */}
                        <div>
                            <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
                                Email or Username
                            </label>
                            <div className="relative">
                                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                <input
                                    type="text"
                                    id="username"
                                    name="username"
                                    value={formData.username}
                                    onChange={handleChange}
                                    className={`w-full pl-11 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${errors.username ? 'border-red-300 bg-red-50' : 'border-gray-300'
                                        }`}
                                    placeholder="Enter your email or username"
                                />
                            </div>
                            {errors.username && (
                                <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                                    <AlertCircle className="w-4 h-4" />
                                    {errors.username}
                                </p>
                            )}
                        </div>

                        {/* Password Field */}
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                                Password
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    id="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    className={`w-full pl-11 pr-11 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${errors.password ? 'border-red-300 bg-red-50' : 'border-gray-300'
                                        }`}
                                    placeholder="Enter your password"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                                >
                                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>
                            {errors.password && (
                                <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                                    <AlertCircle className="w-4 h-4" />
                                    {errors.password}
                                </p>
                            )}
                        </div>

                        {/* Submit Button */}
                        <button
                            type="button"
                            onClick={handleSubmit}
                            disabled={isLoading}
                            className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 px-4 rounded-lg hover:from-blue-600 hover:to-purple-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {isLoading ? (
                                <>
                                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                    Signing In...
                                </>
                            ) : (
                                <>
                                    <LogIn className="w-5 h-5" />
                                    Sign In
                                </>
                            )}
                        </button>
                    </div>

                    {/* Footer */}
                    <div className="mt-6 text-center">
                        <p className="text-sm text-gray-600">
                            Don't have an account?{' '}
                            <button onClick={(e) => { e.preventDefault(); navigator('/signup'); }} className="text-blue-600 hover:text-blue-700 font-medium transition-colors">
                                Sign up
                            </button>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;