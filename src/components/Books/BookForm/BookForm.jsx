/* eslint-disable react/jsx-props-no-spreading */
import React, { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import * as PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import { generateStarsInputs } from '../../../lib/functions';
import { useFilePreview } from '../../../lib/customHooks';
import addFileIMG from '../../../images/add_file.webp';
import styles from './BookForm.module.css';
import { updateBook, addBook } from '../../../lib/common';
import Notification from '../../Notification/Notification';

function BookForm({ book, validate }) {
  const userRating = book?.ratings 
    ? book.ratings.find((elt) => elt.userId === localStorage.getItem('userId'))?.grade
    : 0;

  const [rating, setRating] = useState(0);

  const navigate = useNavigate();
  const {
    register, watch, formState, handleSubmit, reset,
  } = useForm({
    defaultValues: useMemo(
      () => ({
        title: book?.title,
        author: book?.author,
        year: book?.year,
        genre: book?.genre,
      }),
      [book],
    ),
  });
  useEffect(() => {
    reset(book);
  }, [book]);
  const file = watch(['file']);
  const [filePreview] = useFilePreview(file);

  useEffect(() => {
    setRating(userRating);
  }, [userRating]);

  useEffect(() => {
    if (!book && formState.dirtyFields.rating) {
      const rate = document.querySelector('input[name="rating"]:checked').value;
      setRating(Number.parseInt(rate, 10));
      formState.dirtyFields.rating = false;
    }
  }, [formState]);

  const [notifications, setNotifications] = useState([]);

  const addNotification = (type, message) => {
    const notificationId = Date.now(); // Use timestamp as a simple unique id
    setNotifications((prev) => [...prev, { notificationId, type, message }]);

    // Automatically remove the notification after 3 seconds
    setTimeout(() => {
      setNotifications((prev) => prev.filter((notif) => notif.notificationId !== notificationId));
    }, 3000);
  };

  const onSubmit = async (data) => {
    // Check for missing required fields
    const requiredFields = ['title', 'author', 'year', 'genre'];
    const missingFields = requiredFields.filter((field) => !data[field]);

    if (missingFields.length > 0) {
      addNotification('error', 'Veuillez remplir tous les champs');
      return;
    }

    // Validate image file size (e.g., max 5MB)
    if (data.file[0] && data.file[0].size > 5 * 1024 * 1024) {
      addNotification('error', 'L\'image ne doit pas dépasser 5MB');
      return;
    }

    // When we create a new book
    if (!book) {
      if (!data.file[0]) {
        addNotification('error', 'Vous devez ajouter une image');
        return;
      }
      if (!data.rating) {
        data.rating = 0;
      }
      const newBook = await addBook(data);
      if (newBook && !newBook.error) {
        addNotification('success', 'Le livre a été créé avec succès');
        validate(true);
      } else {
        addNotification('error', newBook.message || 'Une erreur est survenue lors de l\'ajout du livre');
      }
    } else {
      const updatedBook = await updateBook(data, book.id);
      if (updatedBook && !updatedBook.error) {
        addNotification('success', 'Le livre a été mis à jour, vous allez être redirigé vers la page d\'accueil.');
        setTimeout(() => {
          navigate('/');
        }, 1000);
      } else {
        addNotification('error', updatedBook.message || 'Une erreur est survenue lors de la mise à jour du livre');
      }
    }
  };

  const readOnlyStars = !!book;
  return (
    <form onSubmit={handleSubmit(onSubmit)} className={styles.Form}>
      {notifications.map(({ notificationId, type, message }) => (
        <Notification
          key={notificationId}
          type={type}
          message={message}
          location="floating"
        />
      ))}
      <input type="hidden" id="id" {...register('id')} />
      <label htmlFor="title">
        <p>Titre du livre</p>
        <input type="text" id="title" {...register('title')} />
      </label>
      <label htmlFor="author">
        <p>Auteur</p>
        <input type="text" id="author" {...register('author')} />
      </label>
      <label htmlFor="year">
        <p>Année de publication</p>
        <input type="text" id="year" {...register('year')} />
      </label>
      <label htmlFor="genre">
        <p>Genre</p>
        <input type="text" id="genre" {...register('genre')} />
      </label>
      <label htmlFor="rate">
        <p>Note</p>
        <div className={styles.Stars}>
          {generateStarsInputs(rating, register, readOnlyStars)}
        </div>
      </label>
      <label htmlFor="file">
        <p>Visuel</p>
        <div className={styles.AddImage}>
          {filePreview || book?.imageUrl ? (
            <>
              <img src={filePreview ?? book?.imageUrl} alt="preview" />
              <p>Modifier</p>
            </>
          ) : (
            <>
              <img src={addFileIMG} alt="Add file" />
              <p>Ajouter une image</p>
            </>
          )}
        </div>
        <input {...register('file')} type="file" id="file" />
      </label>
      <button className="button" type="submit">
        Publier
      </button>
    </form>
  );
}

BookForm.propTypes = {
  book: PropTypes.shape({
    id: PropTypes.string,
    _id: PropTypes.string,
    userId: PropTypes.string,
    title: PropTypes.string,
    author: PropTypes.string,
    year: PropTypes.number,
    imageUrl: PropTypes.string,
    genre: PropTypes.string,
    ratings: PropTypes.arrayOf(
      PropTypes.shape({
        userId: PropTypes.string,
        grade: PropTypes.number,
      }),
    ),
    averageRating: PropTypes.number,
  }),
  validate: PropTypes.func,
};

BookForm.defaultProps = {
  book: null,
  validate: null,
};
export default BookForm;
