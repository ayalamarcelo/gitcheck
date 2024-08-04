require('dotenv').config();
const axios = require('axios');
const path = require('path');
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');

const app = express();
const port = 3000;

// Env Config
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const USERNAME = process.env.USERNAME;

const headers = {
  Authorization: `token ${GITHUB_TOKEN}`,
  'User-Agent': 'GitHub-Follow-Checker'
};

// Function to fetch data from GitHub API
const getGithubUserData = async (endpoint) => {
  try {
    const url = `https://api.github.com${endpoint}`;
    console.log('Request received at', url);

    const response = await axios.get(url, { headers: { ...headers, 'User-Agent': 'GitHub-Follow-Checker' } });
    console.log('Rate Limit:', response.headers['x-ratelimit-remaining']);

    // Log response data
    console.log('Response Data:', response.data);

    return response.data;
  } catch (error) {
    console.error(`Error fetching data from ${endpoint}:`, error.response ? error.response.data : error.message);
    return [];
  }
};

// Function to get the list of users the specified user is following
const getFollowing = async (username) => {
  return await getGithubUserData(`/users/${username}/following`);
};

// Function to get the list of users following the specified user
const getFollowers = async (username) => {
  return await getGithubUserData(`/users/${username}/followers`);
};

// API endpoint to get users who are not following back
app.get('/api/not-following-back', async (req, res) => {
  try {
    console.log('Request received at /api/not-following-back');

    const following = await getFollowing(USERNAME);
    console.log('Following:', following);

    const followers = await getFollowers(USERNAME);
    console.log('Followers:', followers);

    // Identify users who are not following back
    const notFollowingBack = following.filter(followingUser => {
      return !followers.some(follower => follower.login === followingUser.login);
    });
    console.log('Not Following Back:', notFollowingBack);

    res.json(notFollowingBack);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

// Middleware for security
app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "https://kit.fontawesome.com"],
      styleSrc: ["'self'", "https://fonts.googleapis.com", "https://kit.fontawesome.com", "'unsafe-inline'"], 
      imgSrc: ["'self'", "data:"],
      connectSrc: ["'self'", "https://kit.fontawesome.com", "https://ka-f.fontawesome.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com", "https://ka-f.fontawesome.com"],
    },
  })
);

// Middleware for serving static files
app.use(express.static('public'));
app.use('/assets', express.static(path.join(__dirname, 'assets')));
app.use('/js', express.static(path.join(__dirname, 'js')));
app.use('/styles', express.static(path.join(__dirname, 'styles')));

// Route to serve index.html
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Start the server on the specified port
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
