
import { useEffect, useState } from 'react';

function useLocalStorageListener(key) {
    const [value, setValue] = useState(() => {
        const jsonValue = localStorage.getItem(key);
        if (jsonValue != null) return JSON.parse(jsonValue);
        return null;
    });

    useEffect(() => {
        const handleStorageChange = (event) => {
            if (event.key === key) {
                setValue(JSON.parse(event.newValue));
            }
        };

        window.addEventListener('storage', handleStorageChange);
        return () => {
            window.removeEventListener('storage', handleStorageChange);
        };
    }, [key]);

    return value;
}

export default useLocalStorageListener;
