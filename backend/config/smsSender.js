const axios = require('axios');
require('dotenv').config();

// Function to send an SMS
async function sendSMS(message_text, mobileNo) {
  const notifyUrl = 'https://app.notify.lk/api/v1/send';
  const USER_ID = process.env.UserId;
  const API_KEY = process.env.ApiKey;
  const SENDER_ID = process.env.SenderId;
  const formattedMobileNo = `94${mobileNo.substring(1)}`;

  const notifyData = {
    user_id: USER_ID,
    api_key: API_KEY,
    sender_id: SENDER_ID,
    to: formattedMobileNo,
    message: message_text,
  };

  try {
    // const response = await axios.post(notifyUrl, notifyData, {
    //   headers: {
    //     'Content-Type': 'application/json',
    //   },
    // });
    console.log('SMS sent:', response.data);
  } catch (error) {
    console.error('Error sending SMS:', error.response ? error.response.data : error.message);
  }
}

// Export the sendSMS function
module.exports = sendSMS;
