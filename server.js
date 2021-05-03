// Express is a backend framework
const express = require('express');
// ORM to interact with MongoDB database
const mongoose = require('mongoose');
const path = require('path');
const config = require('config');

// Initialize Express
const app = express();
// Body Parser Middleware; take data from POST requests
app.use(express.json());

// DB Config: get the value of mongoURI var from keys.js
const db = config.get('mongoURI');

// Connect to Mongo: promise base???
mongoose
  .connect(db, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
  }) // Adding new Mongo URL parser
  .then(() => console.log('MongoDB connected ...'))
  .catch(err => console.log(err));

// Use Routes: anything that goes into /api/items should refer to items var
app.use('/api/items', require('./routes/api/items'));
app.use('/api/users', require('./routes/api/users'));
app.use('/api/auth', require('./routes/api/auth'));

// Serve static assets if in production and not hitting api/items
if (process.env.NODE_ENV === 'production') {
  // Set static folder
  app.use(express.static('client/build'));

  app.get('*', (req, res) => {
    // Use node.js path module to load index.html file
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
  });

}

// Set up potential connection to Heroku: PaaS platform
const port =  process.env.PORT || 5000;

app.listen(port, () => console.log(`Server started on port ${port}`));