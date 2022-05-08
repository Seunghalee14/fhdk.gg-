import Leaflet from "leaflet";

function TextIcon(text, isNext, size, color) {
  return new Leaflet.DivIcon({
    className: "text-icon",
    html:
      `<div style="color:${color} !important;" class="${
        isNext ? "text_label next_event" : "text_label"
      }">` +
      text +
      "</div>",
    iconSize: size,
  });
}

export default TextIcon;
