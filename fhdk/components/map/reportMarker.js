import Leaflet from "leaflet";
import { colorChanger } from "script/script";

function ReportMarker(data, size) {
  return new Leaflet.DivIcon({
    className: "report-marker",
    html:
      `<div class="report_on_map_wrap">` +
      `<div>` +
      data.territory.name +
      `</div>` +
      `<div style="color:${colorChanger(data.itemcard.class)}">` +
      data.itemcard.name +
      `</div>` +
      `<div style="color:${colorChanger(data.itemfavor.class)}">` +
      data.itemfavor.name +
      `</div>` +
      "</div>",
  });
}

export default ReportMarker;
