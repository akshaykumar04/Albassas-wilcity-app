import he from "he";

const isArray = arr => Array.isArray(arr);

const checkValue = value => {
  if (typeof value === "string") {
    return he.decode(value);
  }
  if (isArray(value)) {
    return value.map(item => decodeObject(item));
  }
  if (!isArray(value) && typeof value === "object") {
    return decodeObject(value);
  }
};

export const decodeObject = obj => {
  return Object.keys(obj).reduce(
    (_obj, key) => ({
      ..._obj,
      [key]: checkValue(obj[key])
    }),
    {}
  );
};
