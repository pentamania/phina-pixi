/**
 * toHex
 * @param  {String} str
 * @return {Number[hex]}
 */
export const toHex = function(str) {
  if (typeof str !== 'string') return str; // if hex
  if (str.indexOf("#") !== -1) str = str.slice(1);
  return parseInt(str, 16);
}