import { useState, useEffect } from "react";
import { getAuth, onAuthStateChanged } from 'firebase/auth';

const useUser = () => {
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // prevents memory leaks by allowing us to cancel subscription
        const unsubscribe = onAuthStateChanged(getAuth(), userObj => {
            setUser(userObj);
            setIsLoading(false);
        })

        return unsubscribe;
    }, []);

    return { user, isLoading };
}

export default useUser;