import * as PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import styles from './BookRatingForm.module.css';
import { generateStarsInputs, displayStars } from '../../../lib/functions';
import { APP_ROUTES } from '../../../lib/api';
import { useUser } from '../../../lib/customHooks';
import { rateBook } from '../../../lib/common';
import Notification from '../../Notification/Notification';

function BookRatingForm({
  rating, setRating, userId, setBook, id, userRated,
}) {
  const { connectedUser, auth } = useUser();
  const navigate = useNavigate();
  const { register, formState, handleSubmit } = useForm({
    mode: 'onChange',
    defaultValues: {
      rating: 0,
    },
  });

  const [notifications, setNotifications] = useState([]);

  const addNotification = (type, message) => {
    const notificationId = Date.now();
    setNotifications((prev) => [...prev, { notificationId, type, message }]);

    setTimeout(() => {
      setNotifications((prev) => prev.filter((notif) => notif.notificationId !== notificationId));
    }, 5000);
  };

  useEffect(() => {
    if (formState.dirtyFields.rating) {
      const rate = document.querySelector('input[name="rating"]:checked').value;
      setRating(Number.parseInt(rate, 10));
      formState.dirtyFields.rating = false;
    }
  }, [formState, setRating]);

  const onSubmit = async () => {
    if (!connectedUser || !auth) {
      navigate(APP_ROUTES.SIGN_IN);
      return;
    }

    if (rating === 0) {
      addNotification('error', 'Veuillez sélectionner une note avant de soumettre');
      return;
    }

    try {
      const update = await rateBook(id, userId, rating);
      if (update) {
        // eslint-disable-next-line no-underscore-dangle
        setBook({ ...update, id: update._id });
        addNotification('success', 'Votre note a été enregistrée');
      } else {
        addNotification('error', 'Une erreur est survenue');
      }
    } catch (error) {
      console.error('Rating error:', error);
      addNotification('error', 'Une erreur est survenue lors de la notation');
    }
  };

  return (
    <div className={styles.BookRatingForm}>
      {notifications.map(({ notificationId, type, message }) => (
        <Notification
          key={notificationId}
          type={type}
          message={message}
          location="floating"
        />
      ))}
      <form onSubmit={handleSubmit(onSubmit)}>
        <p>{rating > 0 ? 'Votre Note' : 'Notez cet ouvrage'}</p>
        <div className={styles.Stars}>
          {!userRated
            ? generateStarsInputs(rating, register)
            : displayStars(rating)}
        </div>
        {!userRated ? <button className="button" type="submit">Valider</button> : null}
      </form>
    </div>
  );
}

BookRatingForm.propTypes = {
  rating: PropTypes.number.isRequired,
  setRating: PropTypes.func.isRequired,
  userId: PropTypes.string.isRequired,
  setBook: PropTypes.func.isRequired,
  id: PropTypes.string.isRequired,
  userRated: PropTypes.bool.isRequired,
};

export default BookRatingForm;
