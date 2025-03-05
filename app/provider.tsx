"use client"
import {Provider} from "react-redux";
import store from "@/store";

export const ProviderComponent = ({children}: { children: React.ReactNode }) => {
    return (
        <Provider store={store}>
            {children}
        </Provider>
    )
}