import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import BookItem from "../../components/Books/BookItem/BookItem";
import BookSearchForm from "../../components/Books/BookSearchForm/BookSearchForm";
import Banner from "../../images/home_banner.webp";
import HomeDashLine from "../../images/home_dash_line.webp";
import styles from "./Home.module.css";
import Notification from "../../components/Notification/Notification";
import { getBooks } from "../../lib/common";
import { APP_ROUTES } from "../../lib/api";

function Home() {
	const [books, setBooks] = useState([]);
	const [loading, setLoading] = useState(true);
	const [page, setPage] = useState(1);
	const [hasMore, setHasMore] = useState(true);
	const [showSearch, setShowSearch] = useState(false);

	const displayBooks = () => (
		<>
			{books.map((book) => (
				<BookItem size={2} book={book} key={book.id} />
			))}
		</>
	);

	const handleLoadMore = async () => {
		setLoading(true);
		const nextPage = page + 1;
		const { books: newBooks, hasMore: newHasMore } = await getBooks(
			{},
			nextPage,
		);
		setBooks([...books, ...newBooks]);
		setHasMore(newHasMore);
		setPage(nextPage);
		setLoading(false);
	};

	const handleSearch = async (params) => {
		setLoading(true);
		const { books: filteredBooks, hasMore: newHasMore } = await getBooks(
			params,
			1,
		);
		setBooks(filteredBooks);
		setHasMore(newHasMore);
		setPage(1);
		setLoading(false);
	};

	const toggleSearch = () => {
		setShowSearch(!showSearch);
	};

	useEffect(() => {
		async function getBooksList() {
			const { books: newBooks, hasMore: newHasMore } = await getBooks();
			setBooks(newBooks);
			setHasMore(newHasMore);
			setLoading(false);
		}
		getBooksList();
	}, []);

	const backgroundImageStyle = { backgroundImage: `url(${Banner})` };
	return (
		<div className={styles.Home}>
			<div className={styles.banner} style={backgroundImageStyle} />
			<main className={styles.main}>
				<div className={styles.dashLineContainer}>
					<img
						src={HomeDashLine}
						alt="ligne"
						className={styles.dashLine}
						aria-hidden
					/>
				</div>
				<header className={styles.head}>
					<h1>Nos Livres</h1>
					<p>à lire et à relire</p>
					<div className={styles.actions}>
						<button type="button" className="button" onClick={toggleSearch}>
							{showSearch ? "Masquer les filtres" : "Rechercher un livre"}
						</button>
						<Link to={APP_ROUTES.ADD_BOOK} className="button">
							+ Ajouter un livre
						</Link>
					</div>
					{showSearch && <BookSearchForm onSearch={handleSearch} />}
				</header>
				<section className={styles.bookList}>{displayBooks()}</section>
				{hasMore && (
					<div className={styles.loadMoreContainer}>
						{loading && <Notification type="loading" location="inner" />}
						{!loading && (
							<button className="button" type="button" onClick={handleLoadMore}>
								voir plus
							</button>
						)}
					</div>
				)}
			</main>
		</div>
	);
}

export default Home;
