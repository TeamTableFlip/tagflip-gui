import {applyMiddleware, createStore} from 'redux';
import thunk from 'redux-thunk'
import {createLogger} from 'redux-logger'
import reducers from "./reducers/Reducers";

// Create Redux store, intercepted by the thunk and logger middleware
const logger = createLogger({});
const initialState = undefined;
const store = createStore(reducers, initialState, applyMiddleware(thunk, logger));

export default store;