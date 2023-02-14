import React, { FC, useState, MouseEvent } from "react";
import ConvertToHex from "../../lib/hexConversion";
import { ElementData, HexProps } from "../../types/hexViewerTypes";
import { BLOCKS_PER_ROW } from "../../utils/constants";
import styles from "./HexViewer.module.scss";

export const HexViewer: FC<HexProps> = ({ data }) => {
  const lines: React.ReactElement[] = [];
  const [elementSelected, setElementSelected] = useState<ElementData>({
    value: "",
    index: null,
    offset: null,
  });

  const onClickElement = (
    index: number,
    offset: number,
    event: MouseEvent<HTMLSpanElement, globalThis.MouseEvent>
  ) => {
    setElementSelected({
      index: index,
      offset: offset,
      value: event.currentTarget.textContent,
    });
  };

  for (let offset = 0; offset < data.length; offset += BLOCKS_PER_ROW) {
    const blocks = [...data.slice(offset, offset + BLOCKS_PER_ROW)];
    const bytes = blocks.map((block, i) => {
      const selected =
        elementSelected.index === i && elementSelected.offset === offset
          ? styles.viewer_highlighted
          : "";

      return (
        <span
          key={offset + i}
          className={`${styles.viewer_block} ${selected}`}
          onClick={(e) => onClickElement(i, offset, e)}
        >
          {ConvertToHex({ value: block, length: 2 })}
        </span>
      );
    });

    const hexValues = (
      <div className={styles.viewer_offsetLine}>
        {ConvertToHex({ value: offset, length: 8 })}
      </div>
    );
    const hexTable = (
      <div className={styles.viewer_blockLine}>
        {bytes.slice(0, 8)} {bytes.slice(8)}
      </div>
    );
    const asciiSection = (
      <div className={styles.viewer_asciiLine}>
        {blocks.map((block, index) => {
          console.log(elementSelected, index, offset, "index offset");
          const selected =
            elementSelected.index === index && elementSelected.offset === offset
              ? styles.viewer_highlighted
              : "";

          return typeof block === "string" ? (
            <span
              key={offset + index}
              className={selected}
              onClick={(e) => onClickElement(index, offset, e)}
            >
              {block}
            </span>
          ) : block >= 0x20 && block < 0x7f ? (
            <span
              key={offset + index}
              className={selected}
              onClick={(e) => onClickElement(index, offset, e)}
            >
              {String.fromCharCode(block)}
            </span>
          ) : (
            <span
              key={offset + index}
              className={selected}
              onClick={(e) => onClickElement(index, offset, e)}
            >
              &middot;
            </span>
          );
        })}
      </div>
    );

    lines.push(
      <div className={styles.viewer_line} key={offset}>
        {hexValues}
        {hexTable}
        {asciiSection}
      </div>
    );
  }

  return (
    <pre className={styles.wrapper}>
      <span className={styles.title}>Here comes the HexViewer</span>
      {lines}
    </pre>
  );
};
