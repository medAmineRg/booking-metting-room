import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import videoService from "./videoService";

const initialState = {
  virtualRooms: [],
  isError: false,
  isSuccess: false,
  isLoading: false,
  isPending: false,
  message: "",
};

// get virtual room
export const getVirtualRooms = createAsyncThunk(
  "users/getAllVirtualRooms",
  async (_, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await videoService.getAllVirtualRooms();
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

const virtualRoomSlice = createSlice({
  name: "virtualRoom",
  initialState,
  reducers: {
    reset: state => {
      return initialState;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(getVirtualRooms.pending, state => {
        state.isLoading = true;
      })
      .addCase(getVirtualRooms.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        console.log(action.payload);
        state.virtualRooms = action.payload.data;
      })
      .addCase(getVirtualRooms.rejected, state => {
        state.isLoading = false;
        state.isError = true;
      });
  },
});

export const { reset } = virtualRoomSlice.actions;
export default virtualRoomSlice.reducer;
