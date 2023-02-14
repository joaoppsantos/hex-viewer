import { useCallback } from "react";

const getConvertToHex = (value: string | number, length: number) => {
  if (typeof value === "string") {
    return value.charCodeAt(0).toString(16).padStart(length, "0");
  } else {
    return value.toString(16).padStart(length, "0");
  }
};

const ConvertToHex = ({
  value,
  length,
}: {
  value: string | number;
  length: number;
}) => {
  const memoizedConvertToHex = useCallback(
    () => getConvertToHex(value, length),
    [value, length]
  );
  const result = memoizedConvertToHex();

  return result;
};

export default ConvertToHex;
