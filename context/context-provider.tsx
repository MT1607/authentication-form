"use client"
import {createContext, useContext, useEffect, useState} from "react";
import {Profile} from "@/utils/type";

type ProfileContextFile = {
    profileContext: Profile | null;
    updateProfileContext: (newProfile: Profile) => void;
}

const Context = createContext<ProfileContextFile | null>(null);

export const ContextProvider = ({children}: { children: React.ReactNode }) => {
    const storedProfile = typeof window !== "undefined" ? localStorage.getItem("profile") : null;
    const initialProfile = storedProfile ? JSON.parse(storedProfile) : null;
    const [profileContext, setProfileContext] = useState<Profile | null>(initialProfile);

    const updateProfileContext = (newProfile: Profile) => {
        console.log("call to hear.");
        setProfileContext(newProfile);
        localStorage.setItem("profile", JSON.stringify(newProfile));
        window.dispatchEvent(new Event("storage"));
    };

    useEffect(() => {
        const handleStorageChange = () => {
            const updateProfileContext = localStorage.getItem("profile");
            console.log("it is update: ", updateProfileContext);
            if (updateProfileContext) {
                setProfileContext(JSON.parse(updateProfileContext));
                console.log("update to hear: ", profileContext);
            }
        }

        window.addEventListener("storage", handleStorageChange);
        return () => window.removeEventListener("storage", handleStorageChange);
    }, []);

    return (
        <Context.Provider value={{profileContext, updateProfileContext}}>
            {children}
        </Context.Provider>
    );

}


export const useProfileContext = () => {
    const context = useContext(Context);
    if (!context) {
        throw new Error("useProfileContext must be used within a ProfileContextProvider");
    }
    return context;
}