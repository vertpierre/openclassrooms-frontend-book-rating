describe("Mon Vieux Grimoire App", () => {
	beforeEach(() => {
		cy.visit("http://localhost:3000");
	});

	describe("Component existence checks", () => {
		it("should load the home page with correct components", () => {
			cy.get("h1").should("contain", "Nos Livres");
			cy.get('[class*="bookList"]').should("exist");
			cy.get("a").contains("Connexion").should("exist");
		});

		it("should have correct components on sign in page", () => {
			cy.get("a").contains("Connexion").click();
			cy.url().should("include", "/connexion");
			cy.get("p").should("contain", "Adresse email");
			cy.get("#email").should("exist");
			cy.get("#password").should("exist");
			cy.get("a").contains("Connexion").should("exist");
		});
	});

	describe("Unauthenticated user actions", () => {
		it("should not allow adding a new book", () => {
			cy.get("a").contains("Ajouter un livre").click();
			cy.url().should("include", "/connexion");
		});

		it("should not show edit or delete options for books", () => {
			cy.get('[class*="bookList"] a').first().click();
			cy.get("a").contains("modifier").should("not.exist");
			cy.get("button").contains("supprimer").should("not.exist");
		});

		it("should allow viewing book details", () => {
			cy.get('[class*="bookList"] a').first().click();
			cy.url().should("include", "/livre/");
			cy.get('[class*="BookInfo"] h1').should("exist");
			cy.get('[class*="BookInfo"] [class*="Author"]').should("exist");
			cy.get('[class*="BookInfo"] [class*="Genre"]').should("exist");
		});
	});

	describe("Authenticated user actions", () => {
		const login = (email, password) => {
			cy.get("a").contains("Connexion").click();
			cy.get("#email").type(email);
			cy.get("#password").type(password);
			cy.get("button").contains("Se connecter").click();
			cy.url().should("eq", "http://localhost:3000/");
			cy.get("button").contains("Déconnexion").should("exist");
		};

		const fillBookForm = () => {
			cy.get('input[name="title"]').type("__TEST__");
			cy.get('input[name="author"]').type("Test Author");
			cy.get('input[name="year"]').type("2023");
			cy.get('input[name="genre"]').type("Test Genre");
			cy.get('label[for="rating3"]').click();
		};

		describe("Create a book", () => {
			beforeEach(() => {
				login("test@example.com", "password123");
				cy.get("a").contains("Ajouter un livre").click();
				cy.url().should("include", "/livre/ajouter");
			});

			it("should show error when submitting without image", () => {
				fillBookForm();
				cy.get('button[type="submit"]').click();
				cy.get('[class*="Error"]').should("exist");
			});

			it("should show error when year is invalid", () => {
				fillBookForm();
				cy.get('input[name="year"]').clear().type("5248");
				cy.get('input[type="file"]').selectFile(
					"cypress/fixtures/test-book-cover.webp",
					{ force: true },
				);
				cy.get('button[type="submit"]').click();
				cy.get('[class*="Error"]').should("exist");
			});

			it("should show error when author is missing", () => {
				fillBookForm();
				cy.get('input[name="author"]').clear();
				cy.get('button[type="submit"]').click();
				cy.get('[class*="Error"]').should("exist");
			});

			it("should add a new book", () => {
				fillBookForm();
				cy.get('input[type="file"]').selectFile(
					"cypress/fixtures/test-book-cover.webp",
					{ force: true },
				);
				cy.get('button[type="submit"]').click();
				cy.get("h1").should("contain", "Merci!");
			});
		});

		describe("Book operations", () => {
			beforeEach(() => {
				login("test@example.com", "password123");
			});

			it("should view a book details", () => {
				cy.get('[class*="bookList"] a').first().click();
				cy.url().should("include", "/livre");
				cy.get('[class*="BookInfo"] h1').should("exist");
				cy.get('[class*="BookInfo"] [class*="Author"]').should("exist");
				cy.get('[class*="BookInfo"] [class*="Genre"]').should("exist");
			});

			it("should update a book", () => {
				cy.get("button").contains("voir plus").click();
				cy.get("h2").contains("__TEST__").click();
				cy.get("a").contains("modifier").click();
				cy.url().should("include", "/livre/modifier");
				cy.get('input[name="title"]')
					.clear()
					.type("__TEST__ Updated Book Title");
				cy.get('button[type="submit"]').click();
				cy.get('[class*="Notification"]').should(
					"contain",
					"Le livre a été mis à jour",
				);
			});
		});

		describe("Search book then disconnect", () => {
			beforeEach(() => {
				login("test@example.com", "password123");
				cy.get("button").contains("Rechercher un livre").click();
				cy.get('[class*="searchContainer"]').should("be.visible");
			});

			it("should search for a book by title", () => {
				cy.get('input[name="title"]').type("__TEST__ Updated Book Title");
				cy.get("button").contains("Rechercher").click();
				cy.get('[class*="bookList"]').should(
					"contain",
					"__TEST__ Updated Book Title",
				);
			});

			it("should search for a book by year", () => {
				cy.get('input[name="year"]').type("2023");
				cy.get("button").contains("Rechercher").click();
				cy.get('[class*="bookList"]').should("contain", "2023");
			});

			it("should search for a book with multiple criteria", () => {
				cy.get('input[name="title"]').type("__TEST__");
				cy.get('input[name="author"]').type("Test Author");
				cy.get('input[name="year"]').type("2023");
				cy.get('input[name="genre"]').type("Test Genre");
				cy.get('input[name="rating"]').type("3");
				cy.get("button").contains("Rechercher").click();
				cy.get('[class*="bookList"]').should(
					"contain",
					"__TEST__ Updated Book Title",
				);
				cy.get("button").contains("Déconnexion").click();
				cy.get("a").contains("Connexion").should("exist");
			});
		});

		describe("Rate a book as Sophie then disconnect", () => {
			it("should rate the newly created book", () => {
				login("sophie.bluel@test.tld", "S0phie");
				cy.get("button").contains("voir plus").click();
				cy.get("h2").contains("__TEST__ Updated Book Title").click();
				cy.get('label[for="rating4"]').click();
				cy.get('label[for="rating5"]').click();
				cy.get("button").contains("Valider").click();
				cy.get("button").contains("Valider").should("not.exist");
				cy.get("button").contains("Déconnexion").click();
				cy.get("a").contains("Connexion").should("exist");
			});
		});

		describe("Delete book then disconnect", () => {
			it("should delete a book", () => {
				login("test@example.com", "password123");
				cy.get("button").contains("voir plus").click();
				cy.get("h2").contains("__TEST__ Updated Book Title").click();
				cy.get("button").contains("supprimer").click();
				cy.on("window:confirm", () => true);
				cy.get("p").should("contain", "a bien été supprimé");
			});

			it("should sign out", () => {
				cy.url().should("eq", "http://localhost:3000/");
				cy.get("a").contains("Connexion").should("exist");
			});
		});
	});
});
