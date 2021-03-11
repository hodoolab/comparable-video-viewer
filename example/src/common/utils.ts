export const stripTrailingSlash = str => {
  return str.endsWith('/') ? str.slice(0, -1) : str;
};

export const wait = ms => {
  return new Promise(r => setTimeout(r, ms));
};

export function getType(payload: any): string {
  return Object.prototype.toString.call(payload).slice(8, -1)
}

export function isNumber(payload: any): payload is number {
  return getType(payload) === 'Number' && !isNaN(payload)
}