import { useState, useEffect } from 'react';
import { getAuthenticatedUser, getBestRatedBooks } from './common';

export function useUser() {
  const [connectedUser, setConnectedUser] = useState(null);
  const [auth, setAuth] = useState(false);
  const [userLoading, setUserLoading] = useState(true);

  useEffect(() => {
    async function getUserDetails() {
      const { authenticated, user } = await getAuthenticatedUser();
      setConnectedUser(user);
      setAuth(authenticated);
      setUserLoading(false);
    }
    getUserDetails();
  }, []);

  return { connectedUser, auth, userLoading };
}

export function useBestRatedBooks() {
  const [bestRatedBooks, setBestRatedBooks] = useState({});

  useEffect(() => {
    async function getRatedBooks() {
      const books = await getBestRatedBooks();
      setBestRatedBooks(books);
    }
    getRatedBooks();
  }, []);

  return { bestRatedBooks };
}

export function useFilePreview(file) {
  const [imgSrc, setImgSrc] = useState(null);

  useEffect(() => {
    if (file && file[0]?.length > 0) {
      const newUrl = URL.createObjectURL(file[0][0]);

      if (newUrl !== imgSrc) {
        setImgSrc(newUrl);
      }

      // Cleanup function to revoke the URL when component unmounts
      return () => {
        URL.revokeObjectURL(newUrl);
      };
    }
  }, [file, imgSrc]); // Added all required dependencies

  return [imgSrc, setImgSrc];
}
