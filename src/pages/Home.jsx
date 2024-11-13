const getBooksList = async () => {
    try {
        const books = await getBooks();
        if (Array.isArray(books)) {
            setBooks(books);
        } else {
            setBooks([]);
            console.error('Invalid books data received');
        }
    } catch (error) {
        setBooks([]);
        console.error('Error fetching books:', error);
    }
}; 