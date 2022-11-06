import { configureStore } from '@reduxjs/toolkit';
import localReducer from './reducer';
import thunk from "redux-thunk";

const store = configureStore({
    middleware: [thunk],
    reducer: localReducer
})

export default store;