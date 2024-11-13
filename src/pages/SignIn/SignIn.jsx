import React, { useState } from "react";
import * as PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import { api, API_ROUTES, APP_ROUTES } from "../../lib/api";
import { useUser } from "../../lib/customHooks";
import { storeInLocalStorage } from "../../lib/common";
import Logo from "../../images/Logo.webp";
import styles from "./SignIn.module.css";
import Notification from "../../components/Notification/Notification";

function SignIn({ setUser }) {
	const navigate = useNavigate();
	const { user, authenticated } = useUser();
	if (user || authenticated) {
		navigate(APP_ROUTES.DASHBOARD);
	}

	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const [notifications, setNotifications] = useState([]);

	const addNotification = (type, message) => {
		const notificationId = Date.now();
		setNotifications((prev) => [...prev, { notificationId, type, message }]);

		setTimeout(() => {
			setNotifications((prev) =>
				prev.filter((notif) => notif.notificationId !== notificationId),
			);
		}, 3000);
	};

	const signIn = async () => {
		try {
			setIsLoading(true);
			const response = await api.post(API_ROUTES.SIGN_IN, {
				email,
				password,
			});
			if (!response?.data?.token) {
				addNotification("error", "Une erreur est survenue");
			} else {
				storeInLocalStorage(response.data.token, response.data.userId);
				setUser(response.data);
				navigate("/");
			}
		} catch (err) {
			addNotification(
				"error",
				err.response?.data?.error || "Une erreur est survenue",
			);
		} finally {
			setIsLoading(false);
		}
	};

	const signUp = async () => {
		try {
			setIsLoading(true);
			const response = await api.post(API_ROUTES.SIGN_UP, {
				email,
				password,
			});
			if (!response?.data) {
				addNotification("error", "Une erreur est survenue");
				return;
			}
			addNotification(
				"success",
				"Votre compte a bien été créé, vous pouvez vous connecter",
			);
		} catch (err) {
			addNotification(
				"error",
				err.response?.data?.error === "Invalid email format"
					? "Format de mail invalide"
					: "Une erreur est survenue",
			);
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className={`${styles.SignIn} content-container`}>
			<img src={Logo} alt="Logo" />
			{notifications.map(({ notificationId, type, message }) => (
				<Notification
					key={notificationId}
					type={type}
					message={message}
					location="floating"
				/>
			))}
			<form
				className={styles.Form}
				onSubmit={(e) => {
					e.preventDefault();
					signIn();
				}}
			>
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
						className={styles.Input}
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
					<button type="submit" className="button">
						{isLoading && <div className={styles.Loader} />}
						Se connecter
					</button>
					<span>ou</span>
					<button type="button" onClick={signUp} className="button">
						{isLoading && <div className={styles.Loader} />}
						S&apos;inscrire
					</button>
				</div>
			</form>
		</div>
	);
}

SignIn.propTypes = {
	setUser: PropTypes.func.isRequired,
};

export default SignIn;
