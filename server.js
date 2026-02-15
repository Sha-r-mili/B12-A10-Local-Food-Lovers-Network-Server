// Import required packages
const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();

// Initialize Express app
const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection URI
const uri = process.env.MONGODB_URI;

// Create MongoClient
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

// Database connection promise
let dbConnection;

async function connectDB() {
  if (dbConnection) return dbConnection;
  
  try {
    await client.connect();
    console.log("✅ Connected to MongoDB!");
    dbConnection = client.db('localFoodLovers');
    return dbConnection;
  } catch (error) {
    console.error('❌ MongoDB Error:', error);
    throw error;
  }
}

// Initialize connection
connectDB();

// =====================
// ROUTES
// =====================

// Test route
app.get('/', (req, res) => {
  res.send('Local Food Lovers Network Server is Running! 🍕');
});

// =====================
// REVIEW ROUTES
// =====================

// 1. GET all reviews (sorted by newest)
app.get('/reviews', async (req, res) => {
  try {
    const db = await connectDB();
    const reviewsCollection = db.collection('reviews');
    
    const reviews = await reviewsCollection
      .find()
      .sort({ createdAt: -1 })
      .toArray();
    res.send(reviews);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).send({ message: 'Failed to fetch reviews' });
  }
});

// 2. GET top 6 featured reviews
app.get('/reviews/featured', async (req, res) => {
  try {
    const db = await connectDB();
    const reviewsCollection = db.collection('reviews');
    
    const reviews = await reviewsCollection
      .find()
      .sort({ rating: -1, createdAt: -1 })
      .limit(6)
      .toArray();
    res.send(reviews);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).send({ message: 'Failed to fetch featured reviews' });
  }
});

// 3. GET reviews by user email
app.get('/reviews/user/:email', async (req, res) => {
  try {
    const db = await connectDB();
    const reviewsCollection = db.collection('reviews');
    const email = req.params.email;
    
    const reviews = await reviewsCollection
      .find({ userEmail: email })
      .sort({ createdAt: -1 })
      .toArray();
    res.send(reviews);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).send({ message: 'Failed to fetch user reviews' });
  }
});

// 4. GET single review by ID
app.get('/reviews/:id', async (req, res) => {
  try {
    const db = await connectDB();
    const reviewsCollection = db.collection('reviews');
    const id = req.params.id;
    const query = { _id: new ObjectId(id) };
    
    const review = await reviewsCollection.findOne(query);
    
    if (!review) {
      return res.status(404).send({ message: 'Review not found' });
    }
    res.send(review);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).send({ message: 'Failed to fetch review' });
  }
});

// 5. POST - Add new review
app.post('/reviews', async (req, res) => {
  try {
    const db = await connectDB();
    const reviewsCollection = db.collection('reviews');
    
    const newReview = {
      ...req.body,
      createdAt: new Date()
    };
    const result = await reviewsCollection.insertOne(newReview);
    res.status(201).send(result);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).send({ message: 'Failed to add review' });
  }
});

// 6. PUT - Update review
app.put('/reviews/:id', async (req, res) => {
  try {
    const db = await connectDB();
    const reviewsCollection = db.collection('reviews');
    const id = req.params.id;
    const filter = { _id: new ObjectId(id) };
    
    const updatedReview = {
      $set: {
        foodName: req.body.foodName,
        foodImage: req.body.foodImage,
        restaurantName: req.body.restaurantName,
        location: req.body.location,
        rating: req.body.rating,
        reviewText: req.body.reviewText,
        updatedAt: new Date()
      }
    };
    const result = await reviewsCollection.updateOne(filter, updatedReview);
    
    if (result.matchedCount === 0) {
      return res.status(404).send({ message: 'Review not found' });
    }
    res.send(result);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).send({ message: 'Failed to update review' });
  }
});

// 7. DELETE - Delete review
app.delete('/reviews/:id', async (req, res) => {
  try {
    const db = await connectDB();
    const reviewsCollection = db.collection('reviews');
    const id = req.params.id;
    const query = { _id: new ObjectId(id) };
    
    const result = await reviewsCollection.deleteOne(query);
    
    if (result.deletedCount === 0) {
      return res.status(404).send({ message: 'Review not found' });
    }
    res.send(result);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).send({ message: 'Failed to delete review' });
  }
});

// 8. GET - Search reviews
app.get('/reviews/search/:query', async (req, res) => {
  try {
    const db = await connectDB();
    const reviewsCollection = db.collection('reviews');
    const searchQuery = req.params.query;
    
    const reviews = await reviewsCollection
      .find({
        foodName: { $regex: searchQuery, $options: 'i' }
      })
      .sort({ createdAt: -1 })
      .toArray();
    res.send(reviews);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).send({ message: 'Failed to search reviews' });
  }
});

// =====================
// FAVORITES ROUTES
// =====================

// 9. GET user's favorites
app.get('/favorites/:email', async (req, res) => {
  try {
    const db = await connectDB();
    const favoritesCollection = db.collection('favorites');
    const email = req.params.email;
    
    const favorites = await favoritesCollection
      .find({ userEmail: email })
      .toArray();
    res.send(favorites);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).send({ message: 'Failed to fetch favorites' });
  }
});

// 10. POST - Add to favorites
app.post('/favorites', async (req, res) => {
  try {
    const db = await connectDB();
    const favoritesCollection = db.collection('favorites');
    
    const existing = await favoritesCollection.findOne({
      userEmail: req.body.userEmail,
      reviewId: req.body.reviewId
    });

    if (existing) {
      return res.status(400).send({ message: 'Already in favorites' });
    }

    const favorite = {
      ...req.body,
      addedAt: new Date()
    };
    const result = await favoritesCollection.insertOne(favorite);
    res.status(201).send(result);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).send({ message: 'Failed to add favorite' });
  }
});

// 11. DELETE - Remove from favorites
app.delete('/favorites/:id', async (req, res) => {
  try {
    const db = await connectDB();
    const favoritesCollection = db.collection('favorites');
    const id = req.params.id;
    const query = { _id: new ObjectId(id) };
    
    const result = await favoritesCollection.deleteOne(query);
    
    if (result.deletedCount === 0) {
      return res.status(404).send({ message: 'Favorite not found' });
    }
    res.send(result);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).send({ message: 'Failed to remove favorite' });
  }
});

// 12. Check if favorited
app.get('/favorites/check/:email/:reviewId', async (req, res) => {
  try {
    const db = await connectDB();
    const favoritesCollection = db.collection('favorites');
    const { email, reviewId } = req.params;
    
    const favorite = await favoritesCollection.findOne({
      userEmail: email,
      reviewId: reviewId
    });
    res.send({ isFavorite: !!favorite });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).send({ message: 'Failed to check favorite status' });
  }
});

// For local development
if (process.env.NODE_ENV !== 'production') {
  app.listen(port, () => {
    console.log(`🚀 Server running on port ${port}`);
  });
}

// Export for Vercel
module.exports = app;