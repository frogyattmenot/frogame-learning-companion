"use client";

import { useState } from "react";
import { finalAndroidFiles } from "../data/finalAndroidCode";
import { CodeExample } from "./CodeExample";

export function FinalProjectCode() {
  const [selectedPath, setSelectedPath] = useState(finalAndroidFiles[0].path);
  const selected = finalAndroidFiles.find((file) => file.path === selectedPath) ?? finalAndroidFiles[0];

  return <section className="final-code-section" id="final-code">
    <div className="section-heading"><p className="eyebrow">FINAL REFERENCE IMPLEMENTATION</p><h2>What each finished file should look like</h2><p>Complete the lessons first. Then use this as a reference, file by file. Compare and understand; do not paste everything blindly.</p></div>
    <div className="final-code-layout">
      <nav className="file-tabs" aria-label="Final Android project files">
        {finalAndroidFiles.map((file) => <button type="button" key={file.path} className={selected.path === file.path ? "active" : ""} onClick={() => setSelectedPath(file.path)}>{file.path}</button>)}
      </nav>
      <div><p className="file-purpose"><strong>{selected.path}</strong> — {selected.purpose}</p><CodeExample title={selected.path} code={selected.code} /></div>
    </div>
  </section>;
}
