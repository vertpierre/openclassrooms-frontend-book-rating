import { api, API_ROUTES } from './api';

export function formatBooks(bookArray) {
  if (!bookArray || !Array.isArray(bookArray)) {
    return [];
  }
  return bookArray.map((book) => ({
    ...book,
    id: book._id,
    imageUrl: book.imageUrl
  }));
}

export function storeInLocalStorage(token, userId) {
  localStorage.setItem('token', token);
  localStorage.setItem('userId', userId);
}

export function getFromLocalStorage(item) {
  return localStorage.getItem(item);
}

export async function getAuthenticatedUser() {
  const defaultReturnObject = { authenticated: false, user: null };
  try {
    const token = getFromLocalStorage('token');
    const userId = getFromLocalStorage('userId');
    if (!token) {
      return defaultReturnObject;
    }
    return { authenticated: true, user: { userId, token } };
  } catch (err) {
    console.error('getAuthenticatedUser, Something Went Wrong', err);
    return defaultReturnObject;
  }
}

export async function getBooks(searchParams = {}, page = 1, limit = 12) {
  try {
    const filteredParams = Object.fromEntries(
      Object.entries(searchParams).filter(([_, value]) => value !== ''),
    );

    const queryParams = new URLSearchParams({ ...filteredParams, page, limit });
    const url = filteredParams.length > 0 ? `${API_ROUTES.BOOKS}/filtered` : API_ROUTES.BOOKS;

    const response = await api.get(`${url}?${queryParams}`);

    if (!response.data || (!Array.isArray(response.data) && !Array.isArray(response.data.books))) {
      console.error('Invalid response format:', response.data);
      return { books: [], hasMore: false };
    }

    const books = Array.isArray(response.data) ? response.data : response.data.books;
    const hasMore = response.data.hasMore || false;

    return { 
      books: formatBooks(books), 
      hasMore 
    };
  } catch (err) {
    console.error('Error fetching books:', err);
    return { books: [], hasMore: false };
  }
}

export async function getBook(id) {
  if (!id) {
    console.error('Book ID is required');
    return null;
  }

  try {
    const userId = getFromLocalStorage('userId');
    const response = await api.get(`${API_ROUTES.BOOKS}/${id}`, {
      params: { userId }
    });
    const book = response.data;
    return {
      ...book,
      id: book._id,
      imageUrl: book.imageUrl,
      ratings: book.ratings || []
    };
  } catch (err) {
    console.error('Error fetching book:', err);
    return null;
  }
}

export async function getBestRatedBooks() {
  try {
    const response = await api.get(API_ROUTES.BEST_RATED);
    return formatBooks(response.data);
  } catch (e) {
    console.error(e);
    return [];
  }
}

export async function deleteBook(id) {
  try {
    await api.delete(`${API_ROUTES.BOOKS}/${id}`);
    return true;
  } catch (err) {
    console.error(err);
    return false;
  }
}

export async function rateBook(id, userId, rating) {
  const data = {
    userId,
    rating: Number.parseInt(rating, 10),
  };

  try {
    const response = await api.post(`${API_ROUTES.BOOKS}/${id}/rating`, data);
    const book = response.data;
    return book;
  } catch (e) {
    console.error(e);
    return e.message;
  }
}

export async function addBook(data) {
  try {
    if (!data.file || !data.file[0]) {
      return { error: true, message: "Image file is required" };
    }

    const userId = localStorage.getItem('userId');
    const book = {
      userId,
      title: data.title,
      author: data.author,
      year: data.year,
      genre: data.genre,
      ratings: [
        {
          userId,
          grade: data.rating ? Number.parseInt(data.rating, 10) : 0,
        },
      ],
      averageRating: Number.parseInt(data.rating, 10),
    };

    const bodyFormData = new FormData();
    bodyFormData.append('book', JSON.stringify(book));
    bodyFormData.append('image', data.file[0]);

    const response = await api.post(API_ROUTES.BOOKS, bodyFormData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    return response.data;
  } catch (err) {
    console.error('Error adding book:', err);
    return { 
      error: true, 
      message: err.response?.data?.error || err.message 
    };
  }
}

export async function updateBook(data, id) {
  const userId = localStorage.getItem('userId');
  const book = {
    userId,
    title: data.title,
    author: data.author,
    year: Number(data.year),
    genre: data.genre,
  };

  try {
    if (data.file[0]) {
      const newData = new FormData();
      newData.append('book', JSON.stringify(book));
      newData.append('image', data.file[0]);
      
      const response = await api.put(`${API_ROUTES.BOOKS}/${id}`, newData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    }
    const response = await api.put(`${API_ROUTES.BOOKS}/${id}`, book);
    return response.data;
  } catch (err) {
    console.error('Error updating book:', err);
    return { 
      error: true, 
      message: err.response?.data?.error || err.message 
    };
  }
}
