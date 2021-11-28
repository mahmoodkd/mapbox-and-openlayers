import actionTypes from "../action/actionTypes";

const initialState = {
  center: {
    lat: 36.306704592443,
    lng: 59.5785961574492,
  },
  zoom: 5,
  firstLatLng: {
    lat: 0,
    lng: 0,
  },
  points: [],
  createLineMb: false,
  createLineOl: false,
};

export const mapStateReducer = (state = initialState, { type, payload }) => {
  switch (type) {
    case actionTypes.CENTER:
      return { ...state, center: { ...payload } };
    case actionTypes.ZOOM_CHANGE:
      return { ...state, zoom: payload };
    case actionTypes.FIRST_LATLNG:
      return { ...state, firstLatLng: payload };
    case actionTypes.CREATE_LINE_MAPBOX:
      return { ...state, createLineMb: payload };
    case actionTypes.CREATE_LINE_OPENLAYER:
      return { ...state, createLineOl: payload };
    case actionTypes.SECOND_LATLNG:
      const line = [state.firstLatLng, payload];
      const points = [...state.points, line];
      return { ...state, points, firstLatLng: { ...initialState.firstLatLng } };
    case actionTypes.RESET:
      return initialState;
    default:
      return state;
  }
};
