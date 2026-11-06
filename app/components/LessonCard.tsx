import { finalAndroidFiles } from "../data/finalAndroidCode";
import { CodeExample } from "./CodeExample";

type LessonCardProps = {
  number: number;
  title: string;
  description: string;
  goal: string;
  teaching: readonly string[];
  steps: readonly string[];
  code: string;
  finalFilePaths?: string[];
  complete: boolean;
  onToggle: () => void;
};

export function LessonCard({ number, title, description, goal, teaching, steps, code, finalFilePaths, complete, onToggle }: LessonCardProps) {
  const finalFiles = finalAndroidFiles.filter((file) => finalFilePaths?.includes(file.path));
  return (
    <article className={`lesson-card ${complete ? "is-complete" : ""}`}>
      <div className="lesson-number">{String(number).padStart(2, "0")}</div>
      <div className="lesson-copy">
        <h3>{title}</h3>
        <p>{description}</p>
        <details className="lesson-details" open>
          <summary>Lesson {number}: follow the complete steps <span>↓</span></summary>
          <div className="lesson-teaching">
            <p className="teaching-label">1. LEARN THE IDEA FIRST</p>
            {teaching.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
            <p className="teaching-label">2. CODE YOU ARE LEARNING IN THIS LESSON</p>
            <pre><code>{code}</code></pre>
            <p className="teaching-label">3. FOLLOW THESE ACTIONS IN ORDER</p>
            <ol>{steps.map((step) => <li key={step}>{step}</li>)}</ol>
            {finalFiles.length > 0 && <div className="lesson-final-files">
              <p className="teaching-label">4. FINAL CODE FOR EVERY FILE AFFECTED HERE</p>
              <p>These are the complete finished versions of every file touched by this lesson, including files that only connect to the new code. First find the small example above inside each final file. Then read the rest to see how the files work together.</p>
              {finalFiles.map((file) => <CodeExample key={file.path} title={`Final ${file.path}`} code={file.code} />)}
            </div>}
            <p className="teaching-label">5. CHECK BEFORE CONTINUING</p>
            <p>{goal} If the result is different, stop here, compare your code with the example, and fix the first error before starting the next lesson.</p>
          </div>
        </details>
      </div>
      <button className="complete-button" type="button" aria-pressed={complete} onClick={onToggle}>
        {complete ? "Completed ✓" : "Mark complete"}
      </button>
    </article>
  );
}
