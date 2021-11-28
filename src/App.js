import React, { useState } from "react";
import { Provider } from "react-redux";
import MapComp from "./components/mapbox";
import PublicMap from "./components/ol";
import {
  centerAction,
  firstLatLngAction,
  zoomAction,
  createLineAction,
  createLineMbAction,
  createLineOlAction,
} from "./redux/action";
import { store } from "./redux/store";

const App = () => {
  const [center, setCenter] = useState({
    lat: 36.306704592443,
    lng: 59.5785961574492,
  });
  const [changeState, setChangeState] = useState(false);
  const [zoom, setZoom] = useState(10);
  const handleSetCenter = (val) => {
    store.dispatch(centerAction({ lat: center.lat, lng: center.lng }));
    if (center.lat !== val.lat || center.lng !== val.lng) {
      setCenter(val);
    }
  };
  const { mapState } = store.getState();
  const handleSetZoom = (val) => {
    if (zoom !== val) {
      store.dispatch(zoomAction(zoom));
      setZoom(val);
    }
  };
  const handleCreateLine = () => {
    setChangeState(!changeState);
    store.dispatch(createLineAction(center));
    store.dispatch(createLineMbAction(true));
    store.dispatch(createLineOlAction(true));
  };
  const handleSelectFirstPoint = () => {
    setChangeState(!changeState);
    store.dispatch(firstLatLngAction(center));
  };
  return (
    <Provider store={store}>
      <div className="container">
        <PublicMap
          center={center}
          zoom={zoom}
          setZoom={handleSetZoom}
          setCenter={handleSetCenter}
        />
        <MapComp
          center={center}
          zoom={zoom}
          setZoom={handleSetZoom}
          setCenter={handleSetCenter}
        />
      </div>
      <div className="btn-container">
        <button
          onClick={
            !parseInt(mapState.firstLatLng.lat)
              ? () => handleSelectFirstPoint()
              : () => handleCreateLine()
          }
          className="btn-custom"
        >
          {!parseInt(mapState.firstLatLng.lat) ? "First Point" : "Create Line"}
        </button>
      </div>
    </Provider>
  );
};

export default App;
