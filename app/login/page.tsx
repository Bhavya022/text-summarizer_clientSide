"use client";
import { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import Link from 'next/link'; // Import Link from next/link
import styles from './Login.module.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post('https://ai-summarization-backend1.onrender.com/api/login', {
        email,
        password
      });
      console.log(response)
      const  token  = response.data.accessToken;
      const username = response.data.user.username;
      
     
      console.log('Token:', token);
      console.log('Username:', username);

      localStorage.setItem('authToken', token);
      localStorage.setItem('username', username);  
      router.push('/summarizer');  
    } catch (err) {
      console.error('Login error:', err);
      setError('Invalid email or password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.formContainer}>
        <h1 className={styles.title}>Login</h1>
        <form onSubmit={handleSubmit}>
          <label className={styles.label}>
            Email:
            <input
              type="email"
              className={styles.input}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </label>
          <label className={styles.label}>
            Password:
            <input
              type="password"
              className={styles.input}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </label>
          <button type="submit" className={styles.button} disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
          {error && <p className={styles.error}>{error}</p>}
        </form>
        <p className={styles.signupLink}>
          Not Registered Yet? <Link href="/signup">Signup</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
