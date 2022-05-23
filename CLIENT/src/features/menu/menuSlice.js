import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import menuService from "./menuService";

const whereAt = JSON.parse(localStorage.getItem("whereAt"));

const initialState = {
  menus: [],
  isError: false,
  isSuccess: false,
  isLoading: false,
  isPending: false,
  message: "",
  currentMenu: whereAt ? whereAt : null,
};

// get menus
export const getMenus = createAsyncThunk(
  "menu/getAllMenus",
  async (_, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await menuService.getAllMenus(token);
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

// post Menu
export const postMenu = createAsyncThunk(
  "menu/post",
  async (data, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await menuService.postMenu(data, token);
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

// update menu
export const updateMenu = createAsyncThunk(
  "menu/update",
  async (data, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await menuService.updateMenu(data, token);
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

// delete menu
export const deleteMenu = createAsyncThunk(
  "menu/delete",
  async (id, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await menuService.deleteMenu(id, token);
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
  name: "menu",
  initialState,
  reducers: {
    reset: (state) => {
      return initialState;
    },
    currentMenu: (state, action) => {
      state.currentMenu = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getMenus.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getMenus.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.menus = action.payload;
      })
      .addCase(getMenus.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
      })
      .addCase(postMenu.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(postMenu.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.menus.push(action.payload.response);
      })
      .addCase(postMenu.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
      })
      .addCase(updateMenu.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateMenu.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
      })
      .addCase(updateMenu.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
      })
      .addCase(deleteMenu.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteMenu.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        console.log(action.payload);
        state.menus = state.menus.filter(
          (menu) => menu.idMenu !== +action.payload.id
        );
      })
      .addCase(deleteMenu.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
      });
  },
});

export const { reset, currentMenu } = menuSlice.actions;
export default menuSlice.reducer;
