const express = require('express');
const bodyParser = require('body-parser');
const { MongoClient } = require('mongodb');
const validator = require('validator'); // for email validation
const bcrypt = require('bcrypt');

const app = express();
const port = 3000;

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Serve static files
app.use(express.static('static'));

// MongoDB connection string
const dbURI = 'mongodb+srv://Student:webdev2024student@cluster0.uqyflra.mongodb.net/webdev2024';
const dbName = 'webdev2024';
const collectionName = 'mitzinet_leon'; //Need to  update to Shani also

// Connect to MongoDB
let db;
MongoClient.connect(dbURI)
  .then(client => {
    console.log('Connected to MongoDB');
    db = client.db(dbName);
    // Create unique index on email field
    db.collection(collectionName).createIndex({ email: 1 }, { unique: true })
      .then(() => console.log('Unique index on email field created'))
      .catch(err => console.error('Error creating unique index on email field:', err));
  })
  .catch(err => {
    console.log('Error connecting to MongoDB:', err);
  });

// Handle form submission
app.post('/submit', async (req, res) => {
  const { firstName, lastName, email, phoneNumber, password_1 } = req.body;

  // Validate password
  if (password_1.length < 8) {
    console.log('Password validation failed: Password too short');
    return res.status(400).json({ message: 'Password must be at least 8 characters long' });
  }

  // Validate email
  if (!validator.isEmail(email)) {
    console.log('Email validation failed: Invalid email');
    return res.status(400).json({ message: 'Invalid email' });
  }

  try {
    const collection = db.collection(collectionName);

    // Check if email already exists
    const existingUser = await collection.findOne({ email });
    if (existingUser) {
      console.log('Email already exists:', email);
      return res.status(400).json({ message: 'Email already exists' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password_1, 10);

    const user = {
      firstName,
      lastName,
      email,
      phoneNumber,
      password: hashedPassword,
    };

    const result = await collection.insertOne(user);
    console.log('User saved successfully:', result.ops[0]);
    res.json({ message: 'User signed-in successfully!' });
  } catch (err) {
    if (err.code === 11000) {
      console.log('Duplicate key error:', err);
      res.status(400).json({ message: 'Email already exists' });
    } else {
      console.log('Error saving user:', err);
      res.status(500).json({ message: 'Error signing in user', error: err });
    }
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});
