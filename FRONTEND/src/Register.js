import React, { useState } from 'react';
import axios from 'axios';

const registerUrl = 'https://20892zxe0d.execute-api.us-east-1.amazonaws.com/prod/register';

const Register = () => {
  const [name, setName]         = useState('');
  const [email, setEmail]       = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage]   = useState(null);
  const [showPassword, setShowPassword] = useState(false); // Toggle state for eye icon

  const submitHandler = (event) => {
    event.preventDefault();
    if (
      username.trim() === '' ||
      email.trim() === '' ||
      name.trim() === '' ||
      password.trim() === ''
    ) {
      setMessage('All fields are required');
      return;
    }
    
    const requestConfig = {
      headers: {
        'x-api-key': 'zTgexkZQhD7ZoH3yQOn639Ar46BWx3Fs56c1cb8B'
      }
    };
    
    const requestBody = { username, email, name, password };
    
    axios.post(registerUrl, requestBody, requestConfig)
      .then(response => setMessage('Registration Successful'))
      .catch(error => {
        if (error.response && error.response.status === 401) {
          setMessage(error.response.data.message);
        } else {
          setMessage('Sorry, the backend server is down! Please try again later.');
        }
      });
  };

  return (
    <div>
      <form onSubmit={submitHandler}>
        <h5>Register</h5>
        Name: <input type="text" value={name} onChange={e => setName(e.target.value)} /> <br/>
        Email: <input type="text" value={email} onChange={e => setEmail(e.target.value)} /> <br/>
        Username: <input type="text" value={username} onChange={e => setUsername(e.target.value)} /> <br/>
        
        {/* Password field with eye icon for toggling visibility */}
        <div className="password-container" style={{ position: 'relative', display: 'inline-block' }}>
          Password: 
          <input 
            type={showPassword ? 'text' : 'password'}  
            value={password} 
            onChange={e => setPassword(e.target.value)}
            style={{ paddingRight: '30px' }} // leave space for the eye icon
          />
          <span 
            className="eye-icon" 
            onClick={() => setShowPassword(!showPassword)}
            style={{
              position: 'absolute',
              right: '5px',
              top: '50%',
              transform: 'translateY(-50%)',
              cursor: 'pointer'
            }}
          >
            {showPassword ? '👁️' : '👁️‍🗨️'}
          </span>
        </div>
        <br/>
        <input type="submit" value="Register" />
      </form>
      {message && <p className="message">{message}</p>}
    </div>
  );
};

export default Register;
