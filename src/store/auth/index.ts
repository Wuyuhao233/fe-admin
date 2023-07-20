import { RootState } from '@/store';
import { createSlice } from '@reduxjs/toolkit';
interface AuthState {
  accessToken: string;
  refreshToken: string;
  userInfo: object;
}
const initialState: AuthState = {
  accessToken: '',
  refreshToken: '',
  userInfo: {},
};
const auth = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAccessToken(state, { payload }) {
      state.accessToken = payload;
    },
    setRefreshToken(state, { payload }) {
      state.refreshToken = payload;
    },
    setUserInfo(state, { payload }) {
      state.userInfo = payload;
    },
  },
});
export const { setAccessToken, setRefreshToken, setUserInfo } = auth.actions;
export const authSelector = (state: RootState) => state.auth;
export const authReducer = auth.reducer;
