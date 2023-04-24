import { configureStore } from "@reduxjs/toolkit";
import counterReducer from './counter'
import labelReducer from './labels'

export default configureStore({
    reducer: {
        counter: counterReducer,
        label: labelReducer
    }
})