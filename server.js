const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config()
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const port = process.env.PORT || 8000;
const connectDB = require('./config/dbConfig')
const userrouter = require('./routes/userRoute')
const adminrouter = require('./routes/adminRoute')


const staticOrigins = process.env.CLIENT_URL
  ? process.env.CLIENT_URL.split(",")
  : ["http://localhost:5173"];

const vercelPreviewPattern = /^https:\/\/cozway-[a-z0-9]+-suhailsubair007s-projects\.vercel\.app$/;

app.use(
  cors({
    origin(origin, callback) {
      const allowed = !origin || staticOrigins.includes(origin) || vercelPreviewPattern.test(origin);
      callback(null, allowed);
    },
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    credentials: true,
  })
);

app.use(express.static("public"))
app.use(express.urlencoded({ extended: true }))
app.use(express.json());
app.use(cookieParser());


app.get('/api/health', (req, res) => {
  const dbStates = ['disconnected', 'connected', 'connecting', 'disconnecting'];
  res.status(200).json({
    status: 'ok',
    db: dbStates[mongoose.connection.readyState],
    uptime: process.uptime(),
  });
});

app.use('/api/users', userrouter);
app.use('/api/admin', adminrouter);

app.listen(port, async () => {
  await connectDB();
  console.log(`Server connected at PORT ==> ${port}`)
})