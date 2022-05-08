import Leaflet from "leaflet";

function CommunityIcon(photo, size) {
  return new Leaflet.Icon({
    iconUrl: photo,
    iconSize: [size, size], // size of the icon
    iconAnchor: [size / 2, size / 2], // point of the icon which will correspond to marker's location
    popupAnchor: [0, -size / 2], // point from which the popup should open relative to the iconAnchor
  });
}

export default CommunityIcon;
