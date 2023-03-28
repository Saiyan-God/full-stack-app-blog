import { Link } from 'react-router-dom';
import { getAuth, signOut } from 'firebase/auth';
import useUser from './hooks/useUser';

const NavBar = () => {
    const { user } = useUser();
    return (
        <nav>
            <ul>
                <li>
                    <Link to="/">Home</Link>
                </li>
                <li>
                    <Link to="/about">About</Link>
                </li>
                <li>
                    <Link to="/articles">Articles</Link>
                </li>
            </ul>
            <div className="nav-right">
                {user ? (
                    <button onClick={() => {
                        signOut(getAuth());
                    }}>Logout</button>
                ) : (
                    <>
                        <Link to='/login'>
                            <button>Login</button>
                        </Link>
                        {/* <Link to='/create-account'>
                            <button>CreateAccountPage</button>
                        </Link> */}
                    </>
                )}
            </div>
        </nav>
    )
};

export default NavBar;