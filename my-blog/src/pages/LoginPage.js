import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";


const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const navigate = useNavigate();

    const login = async () => {
        try {
            await signInWithEmailAndPassword(getAuth(), email, password);
            navigate('/articles');
        } catch (e) {
            console.log(e);
            setError(e.message);
        }
    }

    return (
        <>
            <h1>Login</h1>
            {error && <p className={error}>{error}</p>}
            <input 
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="Your email address"/>
            <input 
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Your password"
                type="password" />
            <button onClick={login}>Log In</button>
            <Link to="/create-account">Don't have an account? Create one here</Link>
        </>
    )
};

export default LoginPage;