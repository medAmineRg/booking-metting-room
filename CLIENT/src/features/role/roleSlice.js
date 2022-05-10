import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import roleService from "./roleService";

const initialState = {
  role: [],
  isError: false,
  isSuccess: false,
  isLoading: false,
  isPending: false,
  message: "",
};

// get role
export const getRoles = createAsyncThunk(
  "role/getAllRoles",
  async (_, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await roleService.getAllRoles(token);
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
export const postRole = createAsyncThunk(
  "role/post",
  async (data, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await roleService.postRole(data, token);
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
export const updateRole = createAsyncThunk(
  "role/update",
  async (data, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await roleService.updateRole(data, token);
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
export const deleteRole = createAsyncThunk(
  "role/delete",
  async (id, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await roleService.deleteRole(id, token);
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

const roleSlice = createSlice({
  name: "role",
  initialState,
  reducers: {
    reset: (state) => {
      return initialState;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getRoles.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getRoles.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.role = action.payload;
      })
      .addCase(getRoles.rejected, (state) => {
        state.isLoading = false;
        state.isError = true;
      })
      .addCase(postRole.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(postRole.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.role.push(action.payload.response);
      })
      .addCase(postRole.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
      })
      .addCase(updateRole.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateRole.fulfilled, (state) => {
        state.isLoading = false;
        state.isSuccess = true;
      })
      .addCase(updateRole.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
      })
      .addCase(deleteRole.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteRole.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.role = state.role.filter(
          (rol) => rol.idRole !== +action.payload.id
        );
      })
      .addCase(deleteRole.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
      });
  },
});

export const { reset } = roleSlice.actions;
export default roleSlice.reducer;
