import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';

const CreateAccountPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');

    const navigate = useNavigate();

    const createAccount = async () => {
        try {
            if(password != confirmPassword) {
                setError('Passwords do not match');
                return;
            }
            await createUserWithEmailAndPassword(getAuth(), email, password);
            navigate('/articles');
        } catch(e) {
            setError(e.message);
        }
    };
    
    return (
        <>
            <h1>Create Account</h1>
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
            <input 
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                placeholder="Confirm password"
                type="password" />
            <button onClick={createAccount}>Create Account</button>
            <Link to="/login">Already have an account? Log in here</Link>
        </>
    )
};

export default CreateAccountPage;