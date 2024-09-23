// require('dotenv').config();
// const nodemailer = require('nodemailer');
// // const nodemailer = require('nodemailer');
// require('dotenv').config();
// console.log('Using email user:', process.env.EMAIL_USER);
// console.log('Using client ID:', process.env.CLIENT_ID);
// const transporter = nodemailer.createTransport({
//   service: 'Outlook365',
//   auth: {
//     type: 'OAuth2',
//     user: process.env.EMAIL_USER,           // Your Outlook email
//     clientId: process.env.CLIENT_ID,        // Client ID from Entra ID
//     clientSecret: process.env.CLIENT_SECRET, // Client Secret from Entra ID
//     refreshToken: process.env.REFRESH_TOKEN, // Refresh Token from OAuth2 flow
//     redirectUri: process.env.REDIRECT_URI,
//   },
// });

// const sendEmail = async (to, subject, text) => {
//   const mailOptions = {
//     from: process.env.EMAIL_USER,
//     to,
//     subject,
//     text,
//   };

//   try {
//     const info = await transporter.sendMail(mailOptions);
//     console.log('Email sent:', info.response);
//     return info;
//   } catch (error) {
//     console.error('Error sending email:', error);
//     throw error;
//   }
// };

// module.exports = { sendEmail };


// module.exports = { sendEmail };
// require('dotenv').config();
// const nodemailer = require('nodemailer');
// const { google } = require('googleapis');
// const OAuth2 = google.auth.OAuth2;

// // Create OAuth2 client with your credentials
// const oAuth2Client = new OAuth2(
//   process.env.CLIENT_ID,      // Client ID from Azure
//   process.env.CLIENT_SECRET,  // Client Secret from Azure
//   'https://login.microsoftonline.com/common/oauth2/nativeclient' // Redirect URL for Microsoft Outlook
// );

// // Set the refresh token for your OAuth2 client
// oAuth2Client.setCredentials({
//   refresh_token: process.env.REFRESH_TOKEN
// });

// // Function to send email using OAuth2 authentication
// const sendEmail = async (to, subject, text) => {
//   try {
//     const accessToken = await oAuth2Client.getAccessToken(); // Get access token

//     const transporter = nodemailer.createTransport({
//       service: 'hotmail',
//       auth: {
//         type: 'OAuth2',
//         user: process.env.EMAIL_USER,      // Your Outlook email
//         clientId: process.env.CLIENT_ID,   // From Azure
//         clientSecret: process.env.CLIENT_SECRET, // From Azure
//         refreshToken: process.env.REFRESH_TOKEN, // From Azure
//         accessToken: accessToken.token,    // Access token from OAuth2 client
//       },
//       tls: {
//         rejectUnauthorized: false,        // Prevent TLS issues
//       },
//     });

//     const mailOptions = {
//       from: process.env.EMAIL_USER,
//       to: to,
//       subject: subject,
//       text: text,
//     };

//     const info = await transporter.sendMail(mailOptions);
//     console.log('Email sent: ', info.response);
//     return info;
//   } catch (error) {
//     console.error('Error sending email:', error);
//     throw error;
//   }
// };

// module.exports = { sendEmail };
require('dotenv').config();
const nodemailer = require('nodemailer');

console.log('EMAIL_USER:', process.env.EMAIL_USER);
console.log('EMAIL_PASS:', process.env.EMAIL_KEY);


const transporter = nodemailer.createTransport({
    service: 'gmail',  // Correct SMTP host for Outlook
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_KEY,
    },
});

const sendEmail = async (to, subject, text) => {
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to,
        subject,
        text,
    };

    try {
       const info = await transporter.sendMail(mailOptions);
       console.log('Email sent: ', info.response);
       return info;
    } catch (err) {
        console.error("Error sending email:", err);
        throw err;
    }
};

module.exports = { sendEmail };