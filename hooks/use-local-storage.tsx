import {useEffect, useState} from "react";

export const useLocalStorage = (key: string) => {
    const [value, setValue] = useState<string | null>(null);

    useEffect(() => {
        if (typeof window !== "undefined") {
            setValue(localStorage.getItem(key));
        }
    }, [key]);

    return value;
}