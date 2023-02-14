export const convertToHex = (value: string | number, length: number) => {
  if (typeof value === "string") {
    return value.charCodeAt(0).toString(16).padStart(length, "0");
  } else {
    return value.toString(16).padStart(length, "0");
  }
};
