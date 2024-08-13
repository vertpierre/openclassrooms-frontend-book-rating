import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import BookItem from '../../components/Books/BookItem/BookItem';
import Banner from '../../images/home_banner.jpg';
import HomeDashLine from '../../images/home_dash_line.png';
import styles from './Home.module.css';
import Notification from '../../components/Notification/Notification';
import { getBooks } from '../../lib/common';

function Home() {
  const [books, setBooks] = useState(null);
  const [loading, setLoading] = useState(true);
  // eslint-disable-next-line max-len
  const displayBooks = () => (books ? (
    books.map((book) => <BookItem size={2} book={book} key={book.id} />)
  ) : (
    <h1>Vide</h1>
  ));

  useEffect(() => {
    async function getBooksList() {
      const data = await getBooks();
      if (data) {
        setBooks(data);
        setLoading(false);
      }
    }
    getBooksList();
  }, []);
  const backgroundImageStyle = { backgroundImage: `url(${Banner})` };
  return (
    <div className={styles.Home}>
      <div className={styles.banner} style={backgroundImageStyle} />
      <main className={styles.main}>
        <div className={styles.dashLineContainer}>
          <img src={HomeDashLine} alt="ligne" className={styles.dashLine} aria-hidden />
        </div>
        <header className={styles.head}>
          <h1>Nos Livres</h1>
          <p>à lire et à relire</p>
          <Link to="/Ajouter" className="button">
            + Ajouter un livre
          </Link>
        </header>
        <section className={styles.bookList}>
          {loading ? <Notification type="loading" location="inner" /> : displayBooks()}
        </section>
      </main>
    </div>
  );
}

export default Home;
