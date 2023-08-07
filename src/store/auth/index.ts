import { User } from '@/declare/User';
import { RootState } from '@/store';
import { createSlice } from '@reduxjs/toolkit';
interface AuthState {
  userInfo: User;
  accessToken: string;
  refreshToken: string;
}
const initialState: AuthState = {
  userInfo: {} as User,
  accessToken: '',
  refreshToken: '',
};
const auth = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUserInfo(state, { payload }) {
      state.userInfo = payload;
    },
    setAccessToken(state, { payload }) {
      state.accessToken = payload;
    },
    setRefreshToken(state, { payload }) {
      state.refreshToken = payload;
    },
  },
});
export const { setUserInfo, setRefreshToken, setAccessToken } = auth.actions;
export const authSelector = (state: RootState) => state.auth;
export const authReducer = auth.reducer;
