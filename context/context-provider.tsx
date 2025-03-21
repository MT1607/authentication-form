"use client"
import {createContext, useContext, useEffect, useState} from "react";
import {Profile, User} from "@/utils/type";

type ContextFile = {
    profileContext: Profile | null;
    userContext: User | null;
    updateProfileContext: (newProfile: Profile) => void;
    updateUserContext: (newUser: User) => void;
}

const Context = createContext<ContextFile | null>(null);

export const ContextProvider = ({children}: { children: React.ReactNode }) => {
    const storedProfile = typeof window !== "undefined" ? localStorage.getItem("profile") : null;
    const storedUser = typeof window !== "undefined" ? localStorage.getItem("user") : null;

    const initialProfile = storedProfile ? JSON.parse(storedProfile) : null;
    const initialUserContext = storedUser ? JSON.parse(storedUser) : null;

    const [profileContext, setProfileContext] = useState<Profile | null>(initialProfile);
    const [userContext, setUserContext] = useState<User | null>(initialUserContext);


    const updateProfileContext = (newProfile: Profile) => {
        setProfileContext(newProfile);
        localStorage.setItem("profile", JSON.stringify(newProfile));
        window.dispatchEvent(new Event("storage"));
    };

    const updateUserContext = (newUser: User) => {
        setUserContext(newUser);
        localStorage.setItem("user", JSON.stringify(newUser));
        window.dispatchEvent(new Event("storage"));
    }

    useEffect(() => {
        const handleStorageChange = () => {
            const updateProfileContext = localStorage.getItem("profile");
            const updateUserContext = localStorage.getItem("user");

            if (updateProfileContext) {
                setProfileContext(JSON.parse(updateProfileContext));
            }

            if (updateUserContext) {
                setUserContext(JSON.parse(updateUserContext));
            }
        }

        window.addEventListener("storage", handleStorageChange);
        return () => window.removeEventListener("storage", handleStorageChange);
    }, []);

    return (
        <Context.Provider
            value={{profileContext, userContext, updateProfileContext, updateUserContext}}>
            {children}
        </Context.Provider>
    );

}


export const useLocalContext = () => {
    const context = useContext(Context);
    if (!context) {
        throw new Error("useProfileContext must be used within a ProfileContextProvider");
    }
    return context;
}