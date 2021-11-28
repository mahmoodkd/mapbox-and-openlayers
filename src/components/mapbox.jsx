import React, { Component, Fragment } from "react";
import mapboxgl from "mapbox-gl";
import { store } from "../redux/store";
import { createLineMbAction } from "../redux/action";

export class MapComp extends Component {
  componentDidMount() {
    this.createMap();
  }
  createMap = () => {
    const { mapState } = store.getState();
    mapboxgl.accessToken =
      "pk.eyJ1IjoibWFobW9vZGtkIiwiYSI6ImNrZG4xMDEyejFkbGYydHJvY216OTUwaW8ifQ.KGdYr9NFl6ii17bXqhr5Vw";
    let result = mapboxgl.getRTLTextPluginStatus();
    if (result !== "loaded") {
      mapboxgl.setRTLTextPlugin(
        "https://api.mapbox.com/mapbox-gl-js/plugins/mapbox-gl-rtl-text/v0.2.3/mapbox-gl-rtl-text.js",
        null,
        true
      );
    }
    this.map = new mapboxgl.Map({
      container: this.mapContainer,
      style: "mapbox://styles/mahmoodkd/ckf58vtyo2a6h1andxixcr5ng",
      center: [mapState.center.lng, mapState.center.lat],
      zoom: mapState.zoom,
    });
    this.destination = new mapboxgl.Marker();

    this.map.on("load", () => {
      this.destination
        .setLngLat([mapState.center.lng, mapState.center.lat])
        .addTo(this.map);
    });

    this.map.on("moveend", () => {
      const pos = this.map.getCenter();
      const center = { lat: pos.lat, lng: pos.lng };
      const zoom = this.map.getZoom();
      this.destination.setLngLat([center.lng, center.lat]);
      this.props.setZoom(zoom);
      this.props.setCenter(center);
    });
  };
  componentDidUpdate = (a, b) => {
    const { mapState } = store.getState();
    const { center, zoom } = this.props;
    this.map.flyTo({
      center: [center.lng, center.lat],
      zoom: zoom,
    });
    this.destination.setLngLat([center.lng, center.lat]);
    const mpoints = mapState.points;
    if (mpoints.length && mapState.createLineMb) {
      mpoints.forEach((item, i) => {
        if (item.length === 2) {
          this.createLine(item, i);
        }
      });
      store.dispatch(createLineMbAction(false));
    }
  };
  handleRemove = (i) => {
    if (this.map.getLayer(`line${i}`)) this.map.removeLayer(`line${i}`);
    if (this.map.getSource(`line${i}`)) {
      this.map.removeSource(`line${i}`);
    }
  };
  createLine(coord, ind) {
    this.handleRemove(ind);
    const origin = [coord[0].lng, coord[0].lat];
    const destination = [coord[1].lng, coord[1].lat];
    let route = {
      type: "FeatureCollection",
      features: [
        {
          type: "Feature",
          geometry: {
            type: "LineString",
            coordinates: [origin, destination],
          },
        },
      ],
    };

    this.map.addSource(`line${ind}`, {
      type: "geojson",
      data: route,
      lineMetrics: true,
    });
    this.map.fitBounds([[...destination], [...origin]], {
      padding: {
        right: 50,
        top: 50,
        bottom: 50,
        left: 50,
      },
    });

    this.map.addLayer({
      id: `line${ind}`,
      type: "line",
      source: `line${ind}`,
      layout: {
        "line-join": "round",
        "line-cap": "round",
      },
      paint: {
        "line-color": "#ffa300",
        "line-width": 5,
        "line-gradient": [
          "interpolate",
          ["linear"],
          ["line-progress"],
          0,
          "#ff546b",
          1,
          "#ffa100",
        ],
      },
    });
  }
  render() {
    return (
      <div className="mapContaner" ref={(el) => (this.mapContainer = el)}></div>
    );
  }
}

export default MapComp;
