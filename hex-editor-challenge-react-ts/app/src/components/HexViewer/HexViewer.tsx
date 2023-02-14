import React, { FC, useState, MouseEvent } from "react";
import { convertToHex, clipboardCopy } from "../../lib/";
import { ElementData, HexProps } from "../../types/hexViewerTypes";
import {
  BLOCKS_PER_ROW,
  BLOCKS_PER_ROW_650,
  BLOCKS_PER_ROW_840,
} from "../../utils/constants";
import styles from "./HexViewer.module.scss";
import { useMediaQuery } from "react-responsive";

export const HexViewer: FC<HexProps> = ({ data }) => {
  const lines: React.ReactElement[] = [];
  const [elementCopy, setElementCopy] = useState("");
  const [elementSelected, setElementSelected] = useState<ElementData>({
    value: "",
    index: null,
    offset: null,
  });
  const isSmallScreen = useMediaQuery({ query: "(max-width: 650px)" });
  const isMediumScreen = useMediaQuery({ query: "(max-width: 840px)" });
  const blocksPerRow = getBlocksPerRow(isSmallScreen, isMediumScreen);

  function getBlocksPerRow(isSmallScreen: boolean, isMediumScreen: boolean) {
    if (isSmallScreen) {
      return BLOCKS_PER_ROW;
    } else if (isMediumScreen) {
      return BLOCKS_PER_ROW_650;
    } else {
      return BLOCKS_PER_ROW_840;
    }
  }

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

  const byteLength =
    data instanceof ArrayBuffer ? data.byteLength : data.length;
  const encoder = new TextEncoder();
  const uint8Array =
    typeof data === "string" ? encoder.encode(data) : new Uint8Array(data);

  for (let offset = 0; offset < byteLength; offset += blocksPerRow) {
    const blocks = [...uint8Array.slice(offset, offset + blocksPerRow)];
    const bytes = blocks.map((block, index) => {
      const selected =
        elementSelected.index === index && elementSelected.offset === offset
          ? styles.viewer_highlighted
          : "";

      return (
        <span
          key={`${index}-${offset}`}
          className={`${styles.viewer_block} ${selected}`}
          onClick={(e) => onClickElement(index, offset, e)}
        >
          {convertToHex(block, 2)}
        </span>
      );
    });

    while (bytes.length < blocksPerRow) {
      bytes.push(
        <span key={`empty-${bytes.length}`} className={styles.viewer_block}>
          &nbsp;&nbsp;
        </span>
      );
    }

    const hexValues = (
      <div className={styles.viewer_offsetLine}>{convertToHex(offset, 8)}</div>
    );
    const hexTable = (
      <div className={styles.viewer_blockLine}>
        {bytes.slice(0, 8)} {bytes.slice(8)}
      </div>
    );
    const asciiSection = (
      <div className={styles.viewer_asciiLine}>
        {blocks.map((block, index) => {
          const selected =
            elementSelected.index === index && elementSelected.offset === offset
              ? styles.viewer_highlighted
              : "";

          return typeof block === "string" ? (
            <span
              key={`${index}-${offset}`}
              className={selected}
              onClick={(e) => onClickElement(index, offset, e)}
            >
              {block}
            </span>
          ) : block >= 0x20 && block < 0x7f ? (
            <span
              key={`${index}-${offset}`}
              className={selected}
              onClick={(e) => onClickElement(index, offset, e)}
            >
              {String.fromCharCode(block)}
            </span>
          ) : (
            <span
              key={`${index}-${offset}`}
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
      <>
        <div className={styles.clipboard_container}>
          <span className={styles.clipboard}>
            Click in a value from hex or ascii tables and Copy button to get it
            copied to clipboard
          </span>
          {elementCopy && (
            <span className={styles.clipboard}>
              <b>{elementCopy}</b> was copied to clipboard
            </span>
          )}
          <button
            className={styles.copy_button}
            onClick={() => {
              if (elementSelected.value) {
                const value = elementSelected.value?.toString();
                clipboardCopy(value).then(() => {
                  setElementCopy(`${value}`);
                });
              }
            }}
          >
            Copy
          </button>
        </div>
        {lines}
      </>
    </pre>
  );
};
