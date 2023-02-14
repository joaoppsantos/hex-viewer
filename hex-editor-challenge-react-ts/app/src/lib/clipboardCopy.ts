export const clipboardCopy = async (value: string) => {
  const hiddenTextarea = document.createElement("textarea");
  hiddenTextarea.value = value;

  document.body.appendChild(hiddenTextarea);
  hiddenTextarea.select();

  document.execCommand("copy");
  document.body.removeChild(hiddenTextarea);
};
