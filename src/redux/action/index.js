import actionTypes from "./actionTypes";

export const changeZoomAction = (payload) => {
  return (dispatch) => {
    dispatch({
      type: actionTypes.ZOOM_CHANGE,
      payload,
    });
  };
};

export const firstLatLngAction = (payload) => {
  return (dispatch) => {
    dispatch({
      type: actionTypes.FIRST_LATLNG,
      payload,
    });
  };
};

export const createLineAction = (payload) => {
  return (dispatch) => {
    dispatch({
      type: actionTypes.SECOND_LATLNG,
      payload,
    });
  };
};

export const resetAction = (payload) => {
  return (dispatch) => {
    dispatch({
      type: actionTypes.RESET,
      payload,
    });
  };
};

export const centerAction = (payload) => {
  return (dispatch) => {
    dispatch({
      type: actionTypes.CENTER,
      payload,
    });
  };
};

export const zoomAction = (payload) => {
  return (dispatch) => {
    dispatch({
      type: actionTypes.ZOOM_CHANGE,
      payload,
    });
  };
};
export const createLineMbAction = (payload) => {
  return (dispatch) => {
    dispatch({
      type: actionTypes.CREATE_LINE_MAPBOX,
      payload,
    });
  };
};
export const createLineOlAction = (payload) => {
  return (dispatch) => {
    dispatch({
      type: actionTypes.CREATE_LINE_OPENLAYER,
      payload,
    });
  };
};
