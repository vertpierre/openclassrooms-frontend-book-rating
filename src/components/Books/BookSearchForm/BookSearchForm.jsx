import React, { useState } from 'react';
import PropTypes from 'prop-types';
import styles from './BookSearchForm.module.css';

function BookSearchForm({ onSearch }) {
  const [searchParams, setSearchParams] = useState({
    title: '',
    author: '',
    year: '',
    rating: '',
    genre: '',
  });

  const handleInputChange = (e) => {
    setSearchParams({ ...searchParams, [e.target.name]: e.target.value });
  };

  const handleSearch = (e) => {
    e.preventDefault();
    onSearch(searchParams);
  };

  return (
    <div className={styles.searchContainer}>
      <p className={styles.searchDescription}>
        Utilisez un ou plusieurs champs pour affiner votre recherche
      </p>
      <form onSubmit={handleSearch} className={styles.searchForm}>
        <div className={styles.formGroup}>
          <input
            type="number"
            name="rating"
            placeholder="Note min."
            min="0"
            max="5"
            step="0.1"
            value={searchParams.rating}
            onChange={handleInputChange}
          />
          <input
            type="text"
            name="title"
            placeholder="Titre"
            value={searchParams.title}
            onChange={handleInputChange}
          />
          <input
            type="text"
            name="author"
            placeholder="Auteur"
            value={searchParams.author}
            onChange={handleInputChange}
          />
        </div>
        <div className={styles.formGroup}>
          <input
            type="number"
            name="year"
            placeholder="Année"
            value={searchParams.year}
            onChange={handleInputChange}
          />
          <input
            type="text"
            name="genre"
            placeholder="Genre"
            value={searchParams.genre}
            onChange={handleInputChange}
          />
        </div>
        <button type="submit" className={styles.searchButton}>Rechercher</button>
      </form>
    </div>
  );
}

BookSearchForm.propTypes = {
  onSearch: PropTypes.func.isRequired,
};

export default BookSearchForm;
