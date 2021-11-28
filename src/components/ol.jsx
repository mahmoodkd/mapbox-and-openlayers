import React, { Component } from "react";
import OlMap from "ol/Map";
import OlView from "ol/View";
import OlLayerTile from "ol/layer/tile";
import Feature from "ol/Feature";
import { Point, LineString } from "ol/geom";
import Vector from "ol/layer/Vector";
import SourceVector from "ol/source/Vector";
import OlSourceOSM from "ol/source/osm";
import { store } from "../redux/store";
import { createLineOlAction } from "../redux/action";
import { Style, Stroke } from "ol/style";

class PublicMap extends Component {
  constructor(props) {
    super(props);

    this.state = { center: [59.5785961574492, 36.306704592443], zoom: 12 };
    this.olmap = new OlMap({
      target: null,
      layers: [
        new OlLayerTile({
          source: new OlSourceOSM(),
        }),
      ],
      view: new OlView({
        center: this.state.center,
        zoom: this.state.zoom,

        projection: "EPSG:4326",
      }),
    });
  }
  handleClick = (e) => {
    console.log(e);
  };
  updateMap() {
    this.olmap.getView().setCenter(this.state.center);
    this.olmap.getView().setZoom(this.state.zoom);
  }
  componentDidUpdate = (a, b) => {
    const { mapState } = store.getState();
    const { center, zoom } = this.props;
    this.olmap.getView().setCenter([center.lng, center.lat]);
    this.olmap.getView().setZoom(zoom);
    this.marker.setGeometry(new Point([center.lng, center.lat]));
    const mpoints = mapState.points;
    if (mpoints.length && mapState.createLineOl) {
      mpoints.forEach((item, i) => {
        if (item.length === 2) {
          this.createLine(item, i);
        }
      });
      store.dispatch(createLineOlAction(false));
    }
  };
  handleRemove = (i) => {
    console.log("features:", this.vectorLayer.getSource().getFeatures());
    // if () {

    // }
    // this.vectorLayer.getSource().removeFeature(this.line);
  };
  line = [];
  createLine(coord, ind) {
    const source = new Point([coord[0].lng, coord[0].lat]);
    const destinate = new Point([coord[1].lng, coord[1].lat]);

    this.line = new Feature({
      geometry: new LineString([source, destinate]),
    });

    this.vectorSource = new SourceVector({
      features: [this.line],
      wrapX: false,
    });
    const myStyle = new Style({
      stroke: new Stroke({
        color: "#ffcc33",
        width: 2,
      }),
    });
    this.lineLayer = new Vector({
      source: this.vectorSource,
      style: myStyle,
    });
    this.olmap.addLayer(this.lineLayer);
  }
  componentDidMount() {
    const { center, zoom } = this.props;
    this.olmap.setTarget("map");
    this.marker = new Feature({
      geometry: new Point([center.lng, center.lat]),
      type: "park",
      name: "test",
    });
    (this.vectorSource = new SourceVector({
      features: [this.marker],
    })),
      (this.vectorLayer = new Vector({
        title: "POI",
        source: this.vectorSource,
      }));
    this.olmap.addLayer(this.vectorLayer);
    // Listen to map changes

    this.olmap.on("moveend", () => {
      let pos = this.olmap.getView().getCenter();
      let zoom = this.olmap.getView().getZoom();
      this.setState({ center: pos, zoom: zoom });
      const center = { lng: pos[0], lat: pos[1] };
      this.props.setZoom(zoom);
      this.props.setCenter(center);
    });
  }

  shouldComponentUpdate(nextProps, nextState) {
    const { center, zoom } = this.props;
    const pos = [center.lng, center.lat];
    if (pos === nextState.center && zoom === nextState.zoom) return false;

    return true;
  }

  userAction() {
    const center = this.olmap.getView().getCenter();
    console.log(center);
  }

  render() {
    this.updateMap(); // Update map on render?
    return (
      <div
        id="map"
        className="mapContaner"
        onClick={(e) => this.handleClick(e)}
      >
        {/* <button onClick={(e) => this.userAction()}>setState on click</button> */}
      </div>
    );
  }
}

export default PublicMap;
