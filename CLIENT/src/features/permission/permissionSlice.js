import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import permissionService from "./permissionService";

const initialState = {
  permission: [],
  isError: false,
  isSuccess: false,
  isLoading: false,
  isPending: false,
  message: null,
};

// get permission
export const getPermissions = createAsyncThunk(
  "per/getAllPermissions",
  async (_, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await permissionService.getAllPermissions(token);
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

// create permission
export const createPermission = createAsyncThunk(
  "per/create",
  async (data, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await permissionService.createPermission(data, token);
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

// delete permission
export const deletePermission = createAsyncThunk(
  "per/delete",
  async (data, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await permissionService.deletePermission(data, token);
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

// update permission
export const updatePermission = createAsyncThunk(
  "per/update",
  async (data, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await permissionService.updatePermission(data, token);
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

const permissionSlice = createSlice({
  name: "per",
  initialState,
  reducers: {
    reset: (state) => {
      return initialState;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getPermissions.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getPermissions.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.permission = action.payload;
      })
      .addCase(getPermissions.rejected, (state) => {
        state.isLoading = false;
        state.Error = true;
      })
      .addCase(createPermission.pending, (state) => {
        state.isLoading = true;
        state.isSuccess = false;
      })
      .addCase(createPermission.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.permission.push(action.payload.response);
      })
      .addCase(createPermission.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
      })
      .addCase(updatePermission.pending, (state) => {
        state.isLoading = true;
        state.isSuccess = false;
      })
      .addCase(updatePermission.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
      })
      .addCase(updatePermission.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
      })
      .addCase(deletePermission.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deletePermission.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.permission = state.permission.filter((per) => {
          return per.idPer !== +action.payload.id;
        });
      })
      .addCase(deletePermission.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
      });
  },
});

export const { reset } = permissionSlice.actions;
export default permissionSlice.reducer;
