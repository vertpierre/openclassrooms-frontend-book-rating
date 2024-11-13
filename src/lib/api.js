import axios from 'axios';

// In Create React App, environment variables are automatically injected
// if they start with REACT_APP_
export const API_URL = process.env.REACT_APP_API_URL;

// Create axios instance with default config
export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to inject auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// API Routes
export const API_ROUTES = {
  SIGN_IN: '/api/auth/login',
  SIGN_UP: '/api/auth/signup',
  BOOKS: '/api/books',
  BEST_RATED: '/api/books/bestrating',
};

// APP Routes
export const APP_ROUTES = {
  SIGN_IN: '/connexion',
  SIGN_UP: '/inscription',
  ADD_BOOK: '/livre/ajouter',
  BOOK: '/livre/:id',
  UPDATE_BOOK: '/livre/modifier/:id',
};

// Utility functions
export const getBooks = async () => {
  try {
    const response = await api.get(API_ROUTES.BOOKS);
    return response.data;
  } catch (error) {
    console.error('Error fetching books:', error);
    return [];
  }
}; 