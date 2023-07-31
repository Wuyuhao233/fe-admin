import { RootState } from '@/store';
import { createSlice } from '@reduxjs/toolkit';
interface AuthState {
  userInfo: object;
}
const initialState: AuthState = {
  userInfo: {},
};
const auth = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUserInfo(state, { payload }) {
      state.userInfo = payload;
    },
  },
});
export const { setUserInfo } = auth.actions;
export const authSelector = (state: RootState) => state.auth;
export const authReducer = auth.reducer;
