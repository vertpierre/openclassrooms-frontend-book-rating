import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import * as PropTypes from "prop-types";
import styles from "./Header.module.css";
import Logo from "../../images/Logo.webp";
import Notification from "../Notification/Notification";
import { APP_ROUTES } from "../../lib/api";

function Header({ user, setUser }) {
	const navigate = useNavigate();
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

	const disconnect = () => {
		localStorage.clear();
		setUser(null);
		navigate("/");
		addNotification("info", "Vous avez été déconnecté avec succès");
	};

	return (
		<header className={styles.Header}>
			<div className="container">
				<NavLink to="/">
					<img src={Logo} alt="logo mpm vieu grimoire" />
				</NavLink>
				{!user ? (
					<NavLink to={APP_ROUTES.SIGN_IN} className={styles.link}>
						Connexion
					</NavLink>
				) : (
					<button
						className={styles.link}
						type="button"
						onKeyUp={disconnect}
						onClick={disconnect}
					>
						Déconnexion
					</button>
				)}
			</div>
			{notifications.map(({ notificationId, type, message }) => (
				<Notification
					key={notificationId}
					type={type}
					message={message}
					location="floating"
				/>
			))}
		</header>
	);
}

Header.propTypes = {
	user: PropTypes.shape({
		userId: PropTypes.string,
		token: PropTypes.string,
	}),
	setUser: PropTypes.func.isRequired,
};

Header.defaultProps = {
	user: null,
};
export default Header;
