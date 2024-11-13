import React from 'react';
import { useBestRatedBooks } from '../../../lib/customHooks';
import BookItem from '../BookItem/BookItem';
import styles from './BestRatedBooks.module.css';
import Notification from '../../Notification/Notification';

function BestRatedBooks() {
  const { bestRatedBooks } = useBestRatedBooks();

  const bestRatedBooksContent = bestRatedBooks.length > 0 ? (
    bestRatedBooks.map((elt) => (
      <BookItem key={`book-${elt.id}`} book={elt} size={3} />
    ))
  ) : (
    <Notification type="loading" message="des livres" location="inner" />
  );

  return (
    <section className={styles.BestRatedBooks}>
      <h2>Les mieux notés</h2>
      <div className={styles.List}>{bestRatedBooksContent}</div>
    </section>
  );
}

export default BestRatedBooks;
