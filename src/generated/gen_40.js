/**
 * gen_40.js — Generated: Geo helpers
 */

const EARTH_RADIUS_KM = 6371;

function toRad(deg) { return (deg * Math.PI) / 180; }
function toDeg(rad) { return (rad * 180) / Math.PI; }

function haversine(lat1, lon1, lat2, lon2) {
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  return EARTH_RADIUS_KM * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function bearing(lat1, lon1, lat2, lon2) {
  const dLon = toRad(lon2 - lon1);
  const x = Math.sin(dLon) * Math.cos(toRad(lat2));
  const y =
    Math.cos(toRad(lat1)) * Math.sin(toRad(lat2)) -
    Math.sin(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.cos(dLon);
  return (toDeg(Math.atan2(x, y)) + 360) % 360;
}

function midpoint(lat1, lon1, lat2, lon2) {
  const dLon = toRad(lon2 - lon1);
  const Bx = Math.cos(toRad(lat2)) * Math.cos(dLon);
  const By = Math.cos(toRad(lat2)) * Math.sin(dLon);
  const lat = toDeg(Math.atan2(
    Math.sin(toRad(lat1)) + Math.sin(toRad(lat2)),
    Math.sqrt((Math.cos(toRad(lat1)) + Bx) ** 2 + By ** 2)
  ));
  const lon = lon1 + toDeg(Math.atan2(By, Math.cos(toRad(lat1)) + Bx));
  return { lat: parseFloat(lat.toFixed(6)), lon: parseFloat(lon.toFixed(6)) };
}

function isValidCoord(lat, lon) {
  return lat >= -90 && lat <= 90 && lon >= -180 && lon <= 180;
}

module.exports = { haversine, bearing, midpoint, isValidCoord, toRad, toDeg, EARTH_RADIUS_KM };
