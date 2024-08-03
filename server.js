require('dotenv').config();
const axios = require('axios');
const path = require('path');
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');

const app = express();
const port = 3000;

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const USERNAME = process.env.USERNAME;

const headers = {
  Authorization: `token ${GITHUB_TOKEN}`
};

const getGithubUserData = async (endpoint) => {
  try {
    const url = `https://api.github.com${endpoint}`;
    const response = await axios.get(url, { headers });
    return response.data;
  } catch (error) {
    console.error(`Error fetching data from ${endpoint}:`, error.response ? error.response.data : error.message);
    return [];
  }
};

const getFollowing = async (username) => {
  return await getGithubUserData(`/users/${username}/following`);
};

const getFollowers = async (username) => {
  return await getGithubUserData(`/users/${username}/followers`);
};

const main = async () => {
  const following = await getFollowing(USERNAME);
  const followers = await getFollowers(USERNAME);

  const followingUsernames = new Set(following.map(user => user.login));
  const followerUsernames = new Set(followers.map(user => user.login));

  const notFollowingBack = [...followingUsernames].filter(username => !followerUsernames.has(username));

  return notFollowingBack;
};

// Middleware
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

app.use(express.static('public'));

// Enable CORS for all routes
app.use(cors());

// Serve static files
app.use('/assets', express.static(path.join(__dirname, 'assets')));
app.use('/js', express.static(path.join(__dirname, 'js')));
app.use('/styles', express.static(path.join(__dirname, 'styles')));

// Serve index.html
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Route to trigger the main function and return results

app.get('/api/not-following-back', async (req, res) => {
  try {
    const notFollowingBack = await main();
    res.json(notFollowingBack);
  } catch (error) {
    res.status(500).send('An error occurred while checking follows.');
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
