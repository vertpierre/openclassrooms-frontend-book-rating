/* eslint-disable react/jsx-props-no-spreading */

import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useUser } from "../../lib/customHooks";
import styles from "./Book.module.css";
import { getBook, deleteBook } from "../../lib/common";
import BookInfo from "../../components/Books/BookInfo/BookInfo";
import BookRatingForm from "../../components/Books/BookRatingForm/BookRatingForm";
import BookDeleteImage from "../../images/book_delete.webp";
import BestRatedBooks from "../../components/Books/BestRatedBooks/BestRatedBooks";
import BackArrow from "../../components/BackArrow/BackArrow";
import Notification from "../../components/Notification/Notification";

function Book() {
	const { connectedUser, userLoading } = useUser();
	const [book, setBook] = useState(null);
	const [rating, setRating] = useState(0);
	const [userRated, setUserRated] = useState(false);
	const [loading, setLoading] = useState(true);

	const params = useParams();

	useEffect(() => {
		async function getItem() {
			const data = await getBook(params.id);
			if (data) {
				setBook({
					...data,
					id: data._id,
				});
			}
		}
		getItem();
	}, [params.id]);

	useEffect(() => {
		if (!userLoading && connectedUser && book?.title) {
			if (book.userRating) {
				setUserRated(true);
				setRating(book.userRating);
				setLoading(false);
			} else {
				setUserRated(false);
				setRating(0);
				setLoading(false);
			}
		} else if (!userLoading && !connectedUser && book) {
			setLoading(false);
		}
	}, [book, userLoading, connectedUser]);

	const onDelete = async (e) => {
		if (e.key && e.key !== "Enter") {
			return;
		}
		// eslint-disable-next-line no-restricted-globals
		const check = confirm("Etes vous sûr de vouloir supprimer ce livre ?");
		if (check) {
			const del = await deleteBook(book.id);
			if (del) {
				setBook((oldValue) => ({ ...oldValue, delete: true }));
			}
		}
	};

	const bookContent =
		!loading && !book.delete ? (
			<div>
				<div className={styles.Book}>
					<div className={styles.BookImage}>
						<img src={book.imageUrl} alt={book.title} />
					</div>
					<div className={styles.BookContent}>
						{book?.userId === connectedUser?.userId ? (
							<div className={styles.Owner}>
								<p>Vous avez publié cet ouvrage, vous pouvez le :</p>
								<p>
									<Link to={`/livre/modifier/${book.id}`}>modifier</Link>{" "}
									<button type="button" onKeyUp={onDelete} onClick={onDelete}>
										supprimer
									</button>{" "}
								</p>
							</div>
						) : null}
						<BookInfo book={book} />
						<BookRatingForm
							userRated={userRated}
							userId={connectedUser?.userId}
							rating={rating}
							setRating={setRating}
							setBook={setBook}
							id={book.id}
						/>
					</div>
				</div>
				<hr />
				<BestRatedBooks />
			</div>
		) : null;
	const deletedContent = book?.delete ? (
		<div className={styles.Deleted}>
			<h1>{book.title}</h1>
			<p>a bien été supprimé</p>
			<img
				src={BookDeleteImage}
				alt={`Le livre ${book.title} a bien été supprimé`}
			/>
			<Link to="/">
				<button className="button" type="button">
					Retour à l&apos;accueil
				</button>
			</Link>
		</div>
	) : null;

	return (
		<div className="content-container">
			{book?.delete ? (
				deletedContent
			) : (
				<div className={styles.BookContainer}>
					<BackArrow />
					{loading ? (
						<Notification type="loading" location="inner" />
					) : (
						bookContent
					)}
				</div>
			)}
		</div>
	);
}
export default Book;
