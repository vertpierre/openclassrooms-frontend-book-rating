import React, { useState } from 'react';
import axios from 'axios';
import * as PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import { API_ROUTES, APP_ROUTES } from '../../utils/constants';
import { useUser } from '../../lib/customHooks';
import { storeInLocalStorage } from '../../lib/common';
import { ReactComponent as Logo } from '../../images/Logo.svg';
import styles from './SignIn.module.css';
import Notification from '../../components/Notification/Notification';

function SignIn({ setUser }) {
  const navigate = useNavigate();
  const { user, authenticated } = useUser();
  if (user || authenticated) {
    navigate(APP_ROUTES.DASHBOARD);
  }

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [notifications, setNotifications] = useState([]);

  const addNotification = (type, message) => {
    const notificationId = Date.now();
    setNotifications((prev) => [...prev, { notificationId, type, message }]);

    setTimeout(() => {
      setNotifications((prev) => prev.filter((notif) => notif.notificationId !== notificationId));
    }, 3000);
  };

  const signIn = async () => {
    try {
      setIsLoading(true);
      const response = await axios({
        method: 'post',
        url: API_ROUTES.SIGN_IN,
        data: {
          email,
          password,
        },
      });
      if (!response?.data?.token) {
        addNotification('error', 'Une erreur est survenue');
      } else {
        storeInLocalStorage(response.data.token, response.data.userId);
        setUser(response.data);
        navigate('/');
      }
    } catch (err) {
      addNotification('error', err.response?.data?.error || 'Une erreur est survenue');
    } finally {
      setIsLoading(false);
    }
  };

  const signUp = async () => {
    try {
      setIsLoading(true);
      const response = await axios({
        method: 'POST',
        url: API_ROUTES.SIGN_UP,
        data: {
          email,
          password,
        },
      });
      if (!response?.data) {
        addNotification('error', 'Une erreur est survenue');
        return;
      }
      addNotification('success', 'Votre compte a bien été créé, vous pouvez vous connecter');
    } catch (err) {
      addNotification('error', err.response?.data?.error === 'Invalid email format' ? 'Format de mail invalide' : 'Une erreur est survenue');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`${styles.SignIn} container`}>
      <Logo />
      {notifications.map(({ notificationId, type, message }) => (
        <Notification
          key={notificationId}
          type={type}
          message={message}
          location="floating"
        />
      ))}
      <div className={styles.Form}>
        <label htmlFor="email">
          <p>Adresse email</p>
          <input
            className={styles.Input}
            type="text"
            name="email"
            id="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
            }}
          />
        </label>
        <label htmlFor="password">
          <p>Mot de passe</p>
          <input
            className="border-2 outline-none p-2 rounded-md"
            type="password"
            name="password"
            id="password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
            }}
          />
        </label>
        <div className={styles.Submit}>
          <button
            type="submit"
            className="
            flex justify-center
            p-2 rounded-md w-1/2 self-center
            bg-gray-800  text-white hover:bg-gray-800"
            onClick={signIn}
          >
            {isLoading ? <div className="" /> : null}
            <span>Se connecter</span>
          </button>
          <span>ou</span>
          <button
            type="submit"
            className="
            flex justify-center
            p-2 rounded-md w-1/2 self-center
            bg-gray-800  text-white hover:bg-gray-800"
            onClick={signUp}
          >
            {isLoading ? (
              <div className="mr-2 w-5 h-5 border-l-2 rounded-full animate-spin" />
            ) : null}
            <span>S&apos;inscrire</span>
          </button>
        </div>
      </div>
    </div>
  );
}

SignIn.propTypes = {
  setUser: PropTypes.func.isRequired,
};

export default SignIn;
