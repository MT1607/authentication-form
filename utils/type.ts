export interface User {
    email: string;
}

export interface Profile {
    avatar: string | undefined;
    firstName: string | undefined;
    lastName: string | undefined;
    dateOfBirth: string | undefined;
}

export interface LoginData {
    email: string;
    password: string;
}
