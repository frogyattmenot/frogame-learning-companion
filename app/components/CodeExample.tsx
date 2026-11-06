"use client";

import { useState } from "react";

type CodeExampleProps = { title: string; code: string; language?: string };

export function CodeExample({ title, code, language = "Java" }: CodeExampleProps) {
  const [copied, setCopied] = useState(false);

  async function copyCode() {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1500);
  }

  return (
    <section className="code-example" aria-label={`${title} code example`}>
      <div className="code-header">
        <div><span className="code-dot" /> {title}</div>
        <button className="copy-button" type="button" onClick={copyCode}>
          {copied ? "Copied!" : `Copy ${language}`}
        </button>
      </div>
      <pre><code>{code}</code></pre>
    </section>
  );
}
