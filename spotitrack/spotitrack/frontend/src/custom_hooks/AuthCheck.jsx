import { useEffect, useState } from 'react';

const useAuthCheck = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const response = await fetch('/api/auth/check');
                if (response.ok) {
                    const data = await response.json();
                    setIsAuthenticated(data.isAuthenticated);
                } else {
                    throw new Error('Failed to fetch auth status');
                }
            } catch (error) {
                console.error('Failed to check authentication status', error);
                setIsAuthenticated(false); // Ensure authentication state is set to false on error
            }
        };

        checkAuth();
    }, []);

    return isAuthenticated;
};

export default useAuthCheck;
