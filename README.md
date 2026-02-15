# Local Food Lovers Network - Server

Backend API for the Local Food Lovers Network application.

## Live Server URL
🔗 [Add after Vercel deployment]

## Technologies Used
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **CORS** - Cross-origin resource sharing

## Features
✅ User authentication with Firebase
✅ CRUD operations for food reviews
✅ Search functionality with MongoDB regex
✅ Favorites system (Challenge requirement)
✅ RESTful API endpoints
✅ Error handling and validation

## API Endpoints

### Reviews
- `GET /reviews` - Get all reviews (sorted by newest)
- `GET /reviews/featured` - Get top 6 highest-rated reviews
- `GET /reviews/user/:email` - Get reviews by specific user
- `GET /reviews/:id` - Get single review details
- `POST /reviews` - Add new review
- `PUT /reviews/:id` - Update existing review
- `DELETE /reviews/:id` - Delete review
- `GET /reviews/search/:query` - Search reviews by food name

### Favorites
- `GET /favorites/:email` - Get user's favorite reviews
- `POST /favorites` - Add review to favorites
- `DELETE /favorites/:id` - Remove from favorites
- `GET /favorites/check/:email/:reviewId` - Check if review is favorited

## Environment Variables
```
PORT=5000
MONGODB_URI=your_mongodb_connection_string
```

## Installation

1. Clone the repository
```bash
git clone https://github.com/Sha-r-mili/B12-A10-Local-Food-Lovers-Network-Server.git
```

2. Install dependencies
```bash
npm install
```

3. Create `.env` file with MongoDB URI

4. Run development server
```bash
npm run dev
```

## Deployment
Deployed on Vercel: [Add URL after deployment]

## Author
Sha-r-mili