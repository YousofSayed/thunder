import { createContext, useReducer } from "react";
const initState = {
   posts:[],
}

const storeCtx = createContext(initState);
const { Provider } = storeCtx;
const reducer = (state, action) => {
    const { type, key, value } = action;
    switch (type) {
        case 'put':
            return { ...state, [key]: value }
        case 'get':
            return state;
        default:
            throw new Error();
    }
};

const StoreProvider = ({ children }) => {
    const [state, dispatch] = useReducer(reducer, initState)

    return (
        <Provider value={{ state, dispatch }}>
            {children}
        </Provider>
    )
}

export { storeCtx, StoreProvider }