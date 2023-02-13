import React, { FC, useState, MouseEvent } from "react";
import ConvertToHex from "../../lib/hexConversion";
import { ElementData, HexProps } from "../../types/hexViewerTypes";
import { BLOCKS_PER_ROW } from "../../utils/constants";
import styles from "./HexViewer.module.scss";

export const HexViewer: FC<HexProps> = ({ data }) => {
  const [elementSelected, setElementSelected] = useState<ElementData>({
    value: "",
    index: null,
    offset: null,
  });

  return (
    <pre className={styles.wrapper}>
      <span className={styles.title}>Here comes the HexViewer</span>
    </pre>
  );
};
