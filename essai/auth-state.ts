import { User } from "../models/user.model";

// Auth State: 
export class AuthState {
    public user!: User;
    public constructor() {
        const user = JSON.parse(localStorage.getItem("user"));
        if (user) {
            this.user = user;
        }
    }
}

// Auth Action Types: 
export enum AuthActionType {
    UserRegistered = "UserRegistered",
    UserLoggedIn = "UserLoggedIn",
    UserLoggedOut = "UserLoggedOut"
}

// Auth Action: 
export interface AuthAction {
    type: AuthActionType;
    payload?: any;
}

// Auth Action Creators: 
export function userRegisteredAction(user: User): AuthAction {
    return { type: AuthActionType.UserRegistered, payload: user };
}
export function userLoggedInAction(user: User): AuthAction {
    return { type: AuthActionType.UserLoggedIn, payload: user };
}
export function userLoggedOutAction(): AuthAction {
    return { type: AuthActionType.UserLoggedOut };
}

// Auth Reducer: 
export function authReducer(currentState: AuthState = new AuthState(), action: AuthAction): AuthState {

    const newState = { ...currentState };

    switch (action.type) {
        case AuthActionType.UserRegistered:
        case AuthActionType.UserLoggedIn:
            newState.user = action.payload;

            // ----------------------------------------
            // DEMO - FOR TESTING ONLY! DON'T DO IT AT ANY OTHER PROJECT OR PRODUCTION:
            if (newState.user.username === "Moshiko") {
                newState.user.isAdmin = true;
            }
            // ----------------------------------------

            localStorage.setItem("user", JSON.stringify(newState.user));

            break;
        case AuthActionType.UserLoggedOut:
            newState.user = {
                 id: "",
                 firstName: "",
                 lastName: "",
                 username: "",
                 password: "",
                 token: "",
                 isAdmin: false
            };
            localStorage.removeItem("user");
            break;
    }

    return newState;
}