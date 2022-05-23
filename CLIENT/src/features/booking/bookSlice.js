import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import bookService from "./bookService";

// initial state
const initialState = {
  bookings: [],
  isError: false,
  isSuccess: false,
  isLoading: false,
  isPending: false,
  message: null,
};

// get all bookings
export const getBookings = createAsyncThunk(
  "bookings/get",
  async (_, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await bookService.getBooking(token);
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

// get all bookings by name
export const bookingsByName = createAsyncThunk(
  "bookings/title",
  async (title, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await bookService.getBookingByName(title, token);
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

// get all bookings by Room User
export const getBookingsByRoomUser = createAsyncThunk(
  "bookings/filter",
  async (data, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await bookService.filterBooking(data, token);
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

export const createBookings = createAsyncThunk(
  "bookings/add",
  async (data, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await bookService.createBooking(data, token);
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

// update booking
export const updateBooking = createAsyncThunk(
  "booking/update",
  async (data, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await bookService.updateBooking(data, token);
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

export const deleteBookings = createAsyncThunk(
  "bookings/delete",
  async (id, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await bookService.deleteBooking(id, token);
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

// slice
export const bookSlice = createSlice({
  name: "book",
  initialState,
  reducers: {
    reset: (state) => {
      return initialState;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getBookings.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getBookings.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.bookings = action.payload;
      })
      .addCase(getBookings.rejected, (state) => {
        state.isLoading = false;
        state.isError = true;
      })
      .addCase(bookingsByName.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(bookingsByName.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.bookings = action.payload.bookings;
      })
      .addCase(bookingsByName.rejected, (state) => {
        state.isLoading = false;
        state.isError = true;
      })
      .addCase(createBookings.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createBookings.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        action.payload && state.bookings.push(action.payload.booking);
      })
      .addCase(createBookings.rejected, (state) => {
        state.isLoading = false;
        state.isError = true;
      })
      .addCase(updateBooking.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateBooking.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
      })
      .addCase(updateBooking.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
      })
      .addCase(deleteBookings.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteBookings.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.bookings = state.bookings.filter(
          (book) => book.idBooking !== action.payload.idBooking
        );
      })
      .addCase(deleteBookings.rejected, (state) => {
        state.isLoading = false;
        state.isError = true;
      })
      .addCase(getBookingsByRoomUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getBookingsByRoomUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.bookings = action.payload;
      })
      .addCase(getBookingsByRoomUser.rejected, (state) => {
        state.isLoading = false;
        state.isError = true;
      });
  },
});
export const { reset } = bookSlice.actions;
export default bookSlice.reducer;
