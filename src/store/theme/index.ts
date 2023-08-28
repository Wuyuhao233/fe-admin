import { RootState } from '@/store';
import { darkImages, lightImages } from '@/theme';
import { createSlice } from '@reduxjs/toolkit';
interface ThemeState {
  themeType: 'dark' | 'light';
  themeImg: Record<string, string>;
  test: string;
}
const initialState: ThemeState = {
  themeType: 'light',
  test: 'test',
  themeImg: { ...lightImages },
};
const theme = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    setThemeType(state, { payload }) {
      state.themeType = payload;
    },
    changeThemeImg(state) {
      if (state.themeType === 'light') {
        state.themeImg = {
          ...darkImages,
        };
        state.themeType = 'dark';
        return;
      }
      if (state.themeType === 'dark') {
        state.themeImg = {
          ...lightImages,
        };
        state.themeType = 'light';
      }
    },
    reset() {
      return initialState;
    },
  },
});
export const { reset, changeThemeImg } = theme.actions;
export const themeSelector = (state: RootState) => state.theme;
export const themeReducer = theme.reducer;
