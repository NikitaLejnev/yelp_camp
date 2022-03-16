/* eslint-disable no-undef */
mapboxgl.accessToken = mapBoxToken;
const map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/mapbox/streets-v11',
  center: coordinates,
  zoom: 10,
});

new mapboxgl.Marker()
  .setLngLat(coordinates)
  .addTo(map);
