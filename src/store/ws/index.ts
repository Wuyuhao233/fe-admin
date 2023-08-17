import { SocketMessageDto } from '@/config/socket.config';
import { RootState } from '@/store';
import { createSlice } from '@reduxjs/toolkit';
interface SocketStore {
  latestMessage: SocketMessageDto;
}

const initialState: SocketStore = {
  latestMessage: {} as SocketMessageDto,
};
const socketStore = createSlice({
  name: 'socketStore',
  initialState,
  reducers: {
    setLatestMessage(state, { payload }) {
      state.latestMessage = payload;
    },
  },
});
export const { setLatestMessage } = socketStore.actions;
export const socketSelector = (state: RootState) => state.socket;
export const socketReducer = socketStore.reducer;
