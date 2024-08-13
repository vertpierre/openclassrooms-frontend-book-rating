import React from 'react';
import * as PropTypes from 'prop-types';
import styles from './Notification.module.css';

function Notification({ type, message, location }) {
  const getNotificationClass = () => {
    if (type === 'loading' || type === 'info') return `${styles.Notification}`;
    if (type === 'success') return `${styles.Notification} ${styles.notificationSuccess}`;
    if (type === 'error') return `${styles.Notification} ${styles.notificationError}`;
    return styles.Notification;
  };

  return (
    <div className={`${getNotificationClass()} ${location === 'floating' ? styles.floating : styles.inner}`}>
      {type === 'loading' ? (
        <h5 className={styles.loading}>
          Chargement
          <span>.</span>
          <span>.</span>
          <span>.</span>
        </h5>
      ) : (
        <h5 className={styles.status}>
          {{ success: 'Succès', error: 'Erreur', info: 'Information' }[type] || 'Erreur'}
        </h5>
      )}
      {message && <p className={styles.message}>{message}</p>}
    </div>
  );
}

Notification.propTypes = {
  type: PropTypes.oneOf(['loading', 'info', 'success', 'error']).isRequired,
  message: PropTypes.string,
  location: PropTypes.oneOf(['floating', 'inner']),
};

Notification.defaultProps = {
  message: '',
  location: 'floating',
};

export default Notification;
