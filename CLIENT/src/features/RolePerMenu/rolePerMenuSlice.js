import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import rolePerMenuService from "./rolePerMenuService";

const initialState = {
  rolePerMenu: [],
  isError: false,
  isSuccess: false,
  isLoading: false,
  isPending: false,
  message: "",
};

// get role
export const getRolePerMenu = createAsyncThunk(
  "rolePerMenu/get",
  async (_, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await rolePerMenuService.getRolePerMenu(token);
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

// post role
export const postRolePerMenu = createAsyncThunk(
  "rolePerMenu/post",
  async (data, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await rolePerMenuService.postRolePerMenu(data, token);
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

// update role
export const updateRolePerMenu = createAsyncThunk(
  "rolePerMenu/update",
  async (data, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await rolePerMenuService.updateRolePerMenu(data, token);
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

// delete role
export const deleteRolePerMenu = createAsyncThunk(
  "rolePerMenu/delete",
  async (id, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await rolePerMenuService.deleteRolePerMenu(id, token);
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

const menuSlice = createSlice({
  name: "rolePerMenu",
  initialState,
  reducers: {
    reset: (state) => {
      return initialState;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getRolePerMenu.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getRolePerMenu.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.rolePerMenu = action.payload;
      })
      .addCase(getRolePerMenu.rejected, (state) => {
        state.isLoading = false;
        state.isError = true;
      })
      .addCase(postRolePerMenu.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(postRolePerMenu.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        if (action.payload) state.rolePerMenu.push(action.payload.response);
      })
      .addCase(postRolePerMenu.rejected, (state) => {
        state.isLoading = false;
        state.isError = true;
      })
      .addCase(deleteRolePerMenu.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteRolePerMenu.fulfilled, (state) => {
        state.isLoading = false;
        state.isSuccess = true;
      })
      .addCase(deleteRolePerMenu.rejected, (state) => {
        state.isLoading = false;
        state.Error = true;
      });
  },
});

export const { reset } = menuSlice.actions;
export default menuSlice.reducer;
