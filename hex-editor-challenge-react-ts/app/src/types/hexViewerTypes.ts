export interface HexProps {
  data: string | Uint8Array | Uint16Array | ArrayBuffer;
}

export interface ElementData {
  value: string | null;
  index: number | null;
  offset: number | null;
}

export type FileTypes = string | Uint8Array | Uint16Array | ArrayBuffer | null;
