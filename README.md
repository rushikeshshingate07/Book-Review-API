## Setup
1. Clone repo
2. `npm install`
3. Create `.env` with:
```env
MONGO_URI=<your_mongo_uri>
JWT_SECRET=<your_secret>
PORT=5000
```
4. `npm start`

## API Endpoints
- **POST /api/signup**: register
- **POST /api/login**: authenticate
- **POST /api/books**: add book (auth)
- **GET /api/books**: list books (pagination, filter)
- **GET /api/books/:id**: book details + avg rating + reviews
- **POST /api/books/:id/reviews**: add review (auth)
- **PUT /api/reviews/:id**: update review (auth)
- **DELETE /api/reviews/:id**: delete review (auth)
- **GET /api/search?query=...**: implement search in books route

## Database Schema
- **User**: (name, email, password)
- **Book**: (title, author, genre)
- **Review**: (book ref, user ref, rating, comment, timestamps)
