const express = require('express');
const fetch = require('node-fetch');

const app = express();

app.use(express.json());

// sending index page
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

app.post('/subscribe', async (req, res) => {
  const { captcha } = req.body;
  console.log('captcha :>> ', req.body);
  if (!captcha) {
    return res.status(400).json({
      success: false,
      msg: 'captcha is missing',
    });
  }
  const secretKey = '6LdpvDEUAAAAAHszsgB_nnal29BIKDsxwAqEbZzU';
  const googleVerifyURL = 'https://www.google.com/recaptcha/api/siteverify';

  const captchaPostData = {
    secret: secretKey,
    response: captcha,
    remoteip: req.connection.remoteAddress,
  };

  const response = await fetch(googleVerifyURL, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(captchaPostData),
  });

  const data = await response.json();
  if (!data.success) {
    return res.status(400).json({
      success: false,
      msg: 'Invalid captcha',
    });
  } else {
    return res.status(200).json({
      success: true,
      msg: 'Captcha verified',
    });
  }
});
const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Recaptcha service is running on ${PORT}`);
});
