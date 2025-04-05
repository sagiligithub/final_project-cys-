import React, { useState } from 'react';
import { getUser, resetUserSession } from './service/AuthService';

const PremiumContent = (props) => {
  const user = getUser();
  const name = user !== 'undefined' && user ? user.name : '';

  const [activeSection, setActiveSection] = useState('home');
  const [quizAnswers, setQuizAnswers] = useState({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [score, setScore] = useState(null);

  const logoutHandler = () => {
    resetUserSession();
    props.history.push('login');
  };

  const quizQuestions = [
    {
      question: "What is Phishing?",
      options: [
        "A type of malware",
        "A cyber attack using fake emails",
        "A firewall security feature"
      ],
      correct: "A cyber attack using fake emails"
    },
    {
      question: "What does HTTPS stand for?",
      options: [
        "HyperText Transfer Protocol Secure",
        "High Technology Protection System",
        "Hybrid Transfer Protection Service"
      ],
      correct: "HyperText Transfer Protocol Secure"
    },
    {
      question: "What is a Firewall?",
      options: [
        "A security device that filters traffic",
        "A virus protection program",
        "A type of hacking method"
      ],
      correct: "A security device that filters traffic"
    },
    {
      question: "How can you create a strong password?",
      options: [
        "Using simple words",
        "Combining letters, numbers & symbols",
        "Using only your birth date"
      ],
      correct: "Combining letters, numbers & symbols"
    },
    {
      question: "What is Two-Factor Authentication (2FA)?",
      options: [
        "A type of password manager",
        "A security process requiring two forms of verification",
        "A type of firewall"
      ],
      correct: "A security process requiring two forms of verification"
    }
  ];

  const handleQuizChange = (index, option) => {
    setQuizAnswers(prev => ({ ...prev, [index]: option }));
  };

  const handleQuizSubmit = () => {
    let calculatedScore = 0;
    quizQuestions.forEach((q, index) => {
      if (quizAnswers[index] === q.correct) calculatedScore += 1;
    });
    setScore(calculatedScore);
    setQuizSubmitted(true);
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>Welcome, {name}! 🎉</h1>
      <p>You have access to premium cybersecurity content.</p>
      <button style={styles.logoutButton} onClick={logoutHandler}>Logout</button>

      <div style={styles.navbar}>
        <button onClick={() => setActiveSection('quiz')}>Cybersecurity Quiz</button>
        <button onClick={() => setActiveSection('certification')}>Certifications</button>
        <button onClick={() => setActiveSection('attacks')}>Common Cyber Attacks</button>
        <button onClick={() => setActiveSection('professions')}>Cybersecurity Professions</button>
        <button onClick={() => setActiveSection('companies')}>Top Cybersecurity Companies</button>
      </div>

      <div style={styles.contentBox}>
        {activeSection === 'quiz' && (
          <div>
            <h2>🛡️ Cybersecurity Quiz</h2>
            {quizQuestions.map((q, index) => (
              <fieldset key={index} style={styles.quizBox}>
                <legend><strong>{q.question}</strong></legend>
                <div style={styles.optionsContainer}>
                  {q.options.map((option) => (
                    <label key={option} style={styles.optionLabel}>
                      <input 
                        type="radio" 
                        name={`question-${index}`} 
                        value={option} 
                        onChange={() => handleQuizChange(index, option)}
                      />
                      {option}
                    </label>
                  ))}
                </div>
              </fieldset>
            ))}
            <button style={styles.submitButton} onClick={handleQuizSubmit}>Submit Quiz</button>
            {quizSubmitted && <p style={styles.scoreText}>Your Score: {score} / {quizQuestions.length}</p>}
          </div>
        )}

        {activeSection === 'certification' && (
          <div>
            <h2>📜 Cybersecurity Certifications</h2>
<ul>
  <li>
    <strong>CISSP (Certified Information Systems Security Professional)</strong><br />
    A globally recognized cybersecurity certification that demonstrates expertise in designing, implementing, and managing a cybersecurity program.<br />
    <a href="https://www.isc2.org/certifications/cissp" target="_blank" rel="noopener noreferrer">Learn more</a>
  </li>
  
  <li>
    <strong>CompTIA Security+</strong><br />
    A foundational certification ideal for beginners in cybersecurity. It covers a wide range of security concepts across offensive, defensive, and management roles.<br />
    <a href="https://www.comptia.org/certifications/security" target="_blank" rel="noopener noreferrer">Learn more</a>
  </li>
  
  <li>
    <strong>CEH (Certified Ethical Hacker)</strong><br />
    Offered by EC-Council, CEH certifies knowledge and skills in ethical hacking and penetration testing, helping professionals understand vulnerabilities and protect systems.<br />
    <a href="https://www.eccouncil.org/programs/certified-ethical-hacker-ceh/" target="_blank" rel="noopener noreferrer">Learn more</a>
  </li>
  
  <li>
    <strong>GIAC Penetration Tester (GPEN)</strong><br />
    Validates the ability to conduct penetration testing using best-practice methodologies. GPEN-certified professionals are skilled in exploiting vulnerabilities, conducting reconnaissance, and executing penetration tests.<br />
    <a href="https://www.giac.org/certifications/pen-testing/gpen/" target="_blank" rel="noopener noreferrer">Learn more</a>
  </li>
</ul>

          </div>
        )}

        {activeSection === 'attacks' && (
          <div>
            <h2>⚠️ Common Cyber Attacks</h2>
            <ul>
              <li><strong>Phishing:</strong> Fake emails tricking users into sharing sensitive information.</li>
              <li><strong>SQL Injection:</strong> Attackers manipulate web database queries.</li>
              <li><strong>DDoS Attack:</strong> Overwhelming a system with excessive traffic.</li>
              <li><strong>Ransomware:</strong> Encrypts files and demands a ransom.</li>
              <li><strong>Man-in-the-Middle:</strong> Intercepts communication between parties.</li>
            </ul>
          </div>
        )}

        {activeSection === 'professions' && (
          <div>
            <h2>👨‍💻 Cybersecurity Professions</h2>
            <ul>
              <li><strong>Security Analyst:</strong> Monitors threats and investigates breaches.</li>
              <li><strong>Penetration Tester:</strong> Simulates attacks to test security.</li>
              <li><strong>Incident Responder:</strong> Handles and mitigates cyber incidents.</li>
              <li><strong>Security Architect:</strong> Designs secure network systems.</li>
              <li><strong>Cryptographer:</strong> Develops encryption methods.</li>
            </ul>
          </div>
        )}

        {activeSection === 'companies' && (
          <div>
            <h2>🏢 Top Cybersecurity Companies</h2>
            <p>Explore job opportunities at leading cybersecurity companies:</p>
            <ul>
              <li><strong>Palo Alto Networks</strong> - <a href="https://www.paloaltonetworks.com/careers" target="_blank" rel="noopener noreferrer">Open Roles</a></li>
              <li><strong>McAfee</strong> - <a href="https://careers.mcafee.com/" target="_blank" rel="noopener noreferrer">Open Roles</a></li>
              <li><strong>FireEye</strong> - <a href="https://www.fireeye.com/company/jobs.html" target="_blank" rel="noopener noreferrer">Open Roles</a></li>
              <li><strong>Check Point Software</strong> - <a href="https://careers.checkpoint.com/" target="_blank" rel="noopener noreferrer">Open Roles</a></li>
              <li><strong>IBM Security</strong> - <a href="https://www.ibm.com/security/careers" target="_blank" rel="noopener noreferrer">Open Roles</a></li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

const styles = {
  container: {
    textAlign: 'center',
    fontFamily: 'Arial, sans-serif',
    padding: '20px',
    backgroundColor: '#87CEEB',
    minHeight: '100vh',
  },
  heading: { color: '#333' },
  logoutButton: {
    backgroundColor: '#ff4d4d',
    color: 'white',
    padding: '10px 20px',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    marginBottom: '20px',
  },
  navbar: {
    display: 'flex',
    justifyContent: 'center',
    gap: '15px',
    marginBottom: '20px',
  },
  contentBox: {
    backgroundColor: '#004764',
    padding: '20px',
    borderRadius: '10px',
    boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.1)',
    textAlign: 'left',
    width: '50%',
    margin: 'auto',
    color: 'white',
  },
  quizBox: {
    backgroundColor: 'black',
    padding: '10px',
    borderRadius: '6px',
    marginBottom: '17px',
    border: '1px solid #ccc',
  },
  optionsContainer: {
    display: 'flex',
    flexDirection: 'column',
  },
  optionLabel: {
    display: 'block',
    marginBottom: '6px',
  },
  submitButton: {
    backgroundColor: '#28a745',
    color: 'white',
    padding: '10px 15px',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    marginTop: '10px',
  },
  scoreText: {
    fontSize: '18px',
    fontWeight: 'bold',
    color: 'yellow',
    marginTop: '10px',
  }
};

export default PremiumContent;
