import React from "react";
import readFile from "./lib/readFile";
import { HexViewer } from "./components/";
import styles from "./App.module.scss";
import { FileTypes } from "./types/hexViewerTypes";

function App() {
  const [file, setFile] = React.useState<FileTypes>(null);
  const updateFileState = async (e: React.FormEvent<HTMLInputElement>) => {
    const result = await readFile(e);
    setFile(result);
  };

  const renderComponents = () => {
    if (!file) {
      return (
        <div className={styles.file_selection}>
          <input
            name="file"
            type="file"
            role="button"
            onInput={updateFileState}
          />
        </div>
      );
    }

    const isBinary = typeof file !== "string";
    return (
      <>
        <div className={styles.reset_container}>
          <span className={styles.loaded_message}>
            Loaded {isBinary ? "binary" : "text"} file
          </span>
          <button onClick={() => setFile(null)}>Reset</button>
        </div>
        <HexViewer data={file} />
      </>
    );
  };

  return <div className="App">{renderComponents()}</div>;
}

export default App;
