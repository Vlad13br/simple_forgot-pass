const express = require('express');
const jwt = require('jsonwebtoken');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.set('view engine', 'ejs');

let user = {
  id: 'sd12xsa2',
  email: 'sam@gmail.com',
  password: 'samio',
};

const JWT_SECRET = 'some secret';

app.get('/', (req, res) => {
  res.send('Hellow');
});

app.get('/forgot-password', (req, res, next) => {
  res.render('forgot-password');
});

app.post('/forgot-password', (req, res, next) => {
  const { email } = req.body;

  if (email !== user.email) {
    res.send('User not registered');
    return;
  }

  const secret = JWT_SECRET + user.password;
  const payload = {
    email: user.email,
    id: user.id,
  };
  const token = jwt.sign(payload, secret, { expiresIn: '15m' });
  const link = `http://localhost:3001/reset-password/${user.id}/${token}`;
  console.log(link);
  res.send('Password reset link sent to your email');
});

app.get('/reset-password/:id/:token', (req, res, next) => {
  const { id, token } = req.params;
  if (id !== user.id) {
    res.send('Invalid id');
    return;
  }
  const secret = JWT_SECRET + user.password;
  try {
    const payload = jwt.verify(token, secret);
    res.render('reset-password', { email: user.email });
  } catch (error) {
    console.log(error.message);
    res.send(error.message);
  }
});

// Use POST to update password
app.post('/reset-password/:id/:token', (req, res, next) => {
  const { id, token } = req.params;
  const { password, password2 } = req.body;

  if (id !== user.id) {
    res.send('Invalid id');
    return;
  }

  if (password !== password2) {
    res.send('Passwords do not match');
    return;
  }

  const secret = JWT_SECRET + user.password;
  try {
    const payload = jwt.verify(token, secret);
    user.password = password;
    res.send('Password successfully changed');
  } catch (error) {
    console.log(error.message);
    res.send(error.message);
  }
});

app.listen(3001, console.log(`Server run on port 3001`));
