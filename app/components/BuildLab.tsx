"use client";

import { useState } from "react";
import { buildLab } from "../data/buildLab";
import { CodeExample } from "./CodeExample";

export function BuildLab() {
  const [openStep, setOpenStep] = useState(0);
  return <section className="build-lab" id="build-lab">
    <div className="section-heading"><p className="eyebrow">DETAILED BUILD-ALONG LAB</p><h2>Build the final game in nine working milestones</h2><p>Do these in order. Do not continue until the “you should see” check is true. The final reference code below is your comparison tool after each milestone.</p></div>
    <div className="lab-list">{buildLab.map((lesson, index) => <article className="lab-step" key={lesson.title}><button type="button" className="lab-summary" aria-expanded={openStep === index} onClick={() => setOpenStep(openStep === index ? -1 : index)}><span>BUILD {String(index + 1).padStart(2, "0")}</span><strong>{lesson.title}</strong><i>{openStep === index ? "−" : "+"}</i></button>{openStep === index && <div className="lab-content"><p className="lab-outcome"><strong>Result:</strong> {lesson.outcome}</p><p>{lesson.explanation}</p><h3>Follow these steps</h3><ol>{lesson.steps.map((step) => <li key={step}>{step}</li>)}</ol><CodeExample title={lesson.codeTitle} code={lesson.code} /><p className="lab-check"><strong>You should see:</strong> {lesson.check}</p></div>}</article>)}</div>
  </section>;
}
