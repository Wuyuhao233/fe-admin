import { authReducer } from '@/store/auth';
import { combineReducers, configureStore } from '@reduxjs/toolkit';
// @ts-ignore
import { themeReducer } from '@/store/theme';
import { socketReducer } from '@/store/ws';
import { persistReducer, persistStore } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

// 自定义的reducer
const reducer = combineReducers({
  auth: authReducer,
  socket: socketReducer,
  theme: themeReducer,
});
// 持久化的reducer
const persistConfig = {
  key: 'root',
  storage,
};
const persistedReducer = persistReducer(persistConfig, reducer);
const store = configureStore({
  //持久化的reducer注入
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      //关闭redux序列化检测
      serializableCheck: false,
    }),
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
export default { store, persistor: persistStore(store) };
