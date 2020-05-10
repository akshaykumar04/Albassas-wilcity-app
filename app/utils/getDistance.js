import { mapDistance } from "../wiloke-elements";

export function getDistance(lat1, lng1, lat2, lng2, unit) {
  const distance =
    !!lat1 || !!lat2
      ? mapDistance(lat1, lng1, lat2, lng2, unit === "km" ? "K" : "M")
      : "";
  return (_distance =
    distance < 300 && !!distance
      ? `${Number.parseFloat(distance).toFixed(1)} ${unit}`
      : "");
}
