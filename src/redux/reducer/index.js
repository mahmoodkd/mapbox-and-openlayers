import { combineReducers } from "redux";
import { mapStateReducer } from "./mapStateReducer";

const reducers = combineReducers({
  mapState: mapStateReducer,
});

export default reducers;
