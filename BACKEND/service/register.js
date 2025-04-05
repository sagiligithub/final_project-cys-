const AWS = require('aws-sdk');
AWS.config.update({ region: 'us-east-1' });

const util = require('../utils/util');
const bcrypt = require('bcryptjs');

const dynamodb = new AWS.DynamoDB.DocumentClient();
const userTable = 'users';

// Password validation function
function isValidPassword(password) {
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  return passwordRegex.test(password);
}

async function register(userInfo) {
  const name = userInfo.name;
  const email = userInfo.email;
  const username = userInfo.username;
  const password = userInfo.password;

  if (!username || !name || !email || !password) {
    return util.buildResponse(401, { message: 'All fields are required' });
  }

  // Check if password meets security requirements
  if (!isValidPassword(password)) {
    return util.buildResponse(401, { 
      message: 'Password must be at least 8 characters long, include one uppercase letter, one lowercase letter, one number, and one special character (@$!%*?&).' 
    });
  }

  const dynamoUser = await getUser(username.toLowerCase().trim());
  if (dynamoUser && dynamoUser.username) {
    return util.buildResponse(401, { message: 'Username already exists. Please choose a different one.' });
  }

  const encryptedPW = bcrypt.hashSync(password.trim(), 10);
  const user = {
    name: name,
    email: email,
    username: username.toLowerCase().trim(),
    password: encryptedPW
  };

  const saveUserResponse = await saveUser(user);
  if (!saveUserResponse) {
    return util.buildResponse(503, { message: 'Server Error. Please try again later.' });
  }

  return util.buildResponse(200, { username: username });
}

async function getUser(username) {
  const params = {
    TableName: userTable,
    Key: { username: username }
  };

  return await dynamodb.get(params).promise().then(response => {
    return response.Item;
  }).catch(error => {
    console.error('Error getting user: ', error);
  });
}

async function saveUser(user) {
  const params = {
    TableName: userTable,
    Item: user
  };

  return await dynamodb.put(params).promise().then(() => {
    return true;
  }).catch(error => {
    console.error('Error saving user: ', error);
  });
}

module.exports.register = register;
