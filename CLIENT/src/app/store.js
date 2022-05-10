import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";
import bookReducer from "../features/booking/bookSlice";
import permissionReducer from "../features/permission/permissionSlice";
import roleReducer from "../features/role/roleSlice";
import roomReducer from "../features/room/roomSlice";
import userReducer from "../features/user/userSlice";
import menuReducer from "../features/menu/menuSlice";
import rolePerMenuReducer from "../features/RolePerMenu/rolePerMenuSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    book: bookReducer,
    per: permissionReducer,
    menus: menuReducer,
    role: roleReducer,
    users: userReducer,
    rooms: roomReducer,
    rolePerMenu: rolePerMenuReducer,
  },
});
