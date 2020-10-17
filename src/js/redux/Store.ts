import {applyMiddleware, createStore} from 'redux';
import {persistReducer, persistStore} from 'redux-persist'
import storage from 'redux-persist/lib/storage/session' // defaults to localStorage for web
import autoMergeLevel2 from "redux-persist/lib/stateReconciler/autoMergeLevel2";
import thunk from 'redux-thunk'
import {createLogger} from 'redux-logger'
import reducers from "./reducers/Reducers";
import {createEpicMiddleware} from "redux-observable";
import rootEpic from "./actions/RootEpic";


const persistedReducer = persistReducer({
    key: 'TagFlip',
    storage,
    blacklist: ['activeCorpus'],
    stateReconciler: autoMergeLevel2
}, reducers)

// Create Redux store, intercepted by the thunk and logger middleware
const epicMiddleware = createEpicMiddleware();
const store = createStore(persistedReducer, undefined, applyMiddleware(thunk, createLogger({}), epicMiddleware));
const persistor = persistStore(store)

epicMiddleware.run(rootEpic);

export {store, persistor};
