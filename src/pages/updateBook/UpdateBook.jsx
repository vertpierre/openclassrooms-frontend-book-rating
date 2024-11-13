import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import styles from './UpdateBook.module.css';
import BookForm from '../../components/Books/BookForm/BookForm';
import BackArrow from '../../components/BackArrow/BackArrow';
import { getBook } from '../../lib/common';
import { APP_ROUTES } from '../../lib/api';
import { useUser } from '../../lib/customHooks';
import bookAdd from '../../images/book_add.webp';
import Notification from '../../components/Notification/Notification';

function UpdateBook() {
  const [book, setBook] = useState(null);
  const [error, setError] = useState(null);
  const { id } = useParams();
  const navigate = useNavigate();
  const { connectedUser, auth, userLoading } = useUser();
  const [created, setCreated] = useState(false);

  useEffect(() => {
    if (!userLoading) {
      if (!connectedUser || !auth) {
        navigate(APP_ROUTES.SIGN_IN);
      }
    }
  }, [userLoading, connectedUser, auth, navigate]);

  useEffect(() => {
    async function getItem() {
      if (!id || id === 'undefined') {
        console.error('Invalid book ID:', id);
        setError("ID du livre manquant ou invalide");
        navigate('/');
        return;
      }

      try {
        const data = await getBook(id);
        
        if (data) {
          setBook(data);
        } else {
          setError("Livre non trouvé");
          navigate('/');
        }
      } catch (err) {
        console.error("Error fetching book:", err);
        setError(`Erreur lors du chargement du livre: ${err.message}`);
        navigate('/');
      }
    }
    getItem();
  }, [id, navigate]);

  if (error) {
    return (
      <div className="content-container">
        <Notification type="error" message={error} />
      </div>
    );
  }

  return (
    <div className="content-container">
      <div className={styles.Container}>
        <BackArrow />
        {!created ? (
          <>
            <div className={styles.Title}>
              <h1>Modifier votre livre</h1>
              <p>Vous pouvez modifier tous les champs sauf la note donnée</p>
            </div>
            {book ? (
              <BookForm book={book} validate={setCreated} />
            ) : (
              <div className={styles.Loading}>Chargement...</div>
            )}
          </>
        ) : (
          <div className={styles.Created}>
            <h1>Merci!</h1>
            <p>votre livre a bien été mis à jour</p>
            <img src={bookAdd} alt="Livre mis à jour" />
            <Link to="/" className="button">
              Retour à l&apos;accueil
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

export default UpdateBook;
