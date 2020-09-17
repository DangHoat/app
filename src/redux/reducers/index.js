import { combineReducers } from "redux";

import sidebar from "./sidebarReducers";
import layout from "./layoutReducer";
import theme from "./themeReducer";

import user from "./userReducer";

import { reducer as toastr } from "react-redux-toastr";
export default combineReducers({
  sidebar,
  layout,
  theme,
  toastr,
  user
});
