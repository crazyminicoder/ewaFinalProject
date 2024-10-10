const express = require('express');
const db = require('./models'); 
const cors = require('cors');
const carRoutes = require('./routes/carRoutes');
const authRoutes = require('./routes/authRoutes');

const app = express();
app.use(cors());

const corsOptions = {
  origin: 'http://localhost:5173', // Update this to your frontend's URL
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true, // Allow cookies to be sent
  optionsSuccessStatus: 204, // For legacy browser support
};

app.use(express.json()); // For parsing application/json
app.use('/api', carRoutes); // Use your routes with a base path
app.use('/auth', authRoutes);

db.sequelize.sync({ force: true }) 
  .then(() => {
    console.log('Database synced');
  })
  .catch(err => {
    console.error('Unable to sync database:', err);
  });

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
