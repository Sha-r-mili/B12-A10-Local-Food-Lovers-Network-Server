# Local Food Lovers Network - Server

Backend API for the Local Food Lovers Network application.

## Live Server URL
[Add your Vercel URL after deployment]

## Technologies Used
- Node.js
- Express.js
- MongoDB
- CORS

## Features
- User authentication with Firebase
- CRUD operations for food reviews
- Search functionality
- Favorites system
- RESTful API endpoints

## API Endpoints

### Reviews
- GET `/reviews` - Get all reviews
- GET `/reviews/featured` - Get top 6 reviews
- GET `/reviews/user/:email` - Get user's reviews
- GET `/reviews/:id` - Get single review
- POST `/reviews` - Add new review
- PUT `/reviews/:id` - Update review
- DELETE `/reviews/:id` - Delete review
- GET `/reviews/search/:query` - Search reviews

### Favorites
- GET `/favorites/:email` - Get user's favorites
- POST `/favorites` - Add to favorites
- DELETE `/favorites/:id` - Remove from favorites
- GET `/favorites/check/:email/:reviewId` - Check favorite status

## Local Development

1. Clone the repository
2. Install dependencies: `npm install`
3. Create `.env` file with MongoDB URI
4. Run development server: `npm run dev`
5. Server runs on `http://localhost:5000`