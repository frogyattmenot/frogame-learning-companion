import { CodeExplorer } from "./components/CodeExplorer";
import { AssignmentObjectives } from "./components/AssignmentObjectives";
import { PracticeLab } from "./components/PracticeLab";
import "./reader.css";

export default function Home() {
  return <main>
    <section className="concept-hero"><p className="eyebrow">FROGAME CODE GUIDE</p><h1>Read every file.<br /><em>Understand why it exists.</em></h1><p>This beginner-friendly reader shows the complete Java files used by your Android game. Click a comment topic to get a plain-language Android, Java, or design-pattern explanation.</p><div className="hero-actions"><a href="#reader">Open the code reader ↓</a><a className="secondary-action" href="#practice">Try a code challenge</a></div></section>
    <section className="project-summary"><div><p className="eyebrow">HOW TO USE THIS GUIDE</p><h2>One file at a time.</h2></div><ol><li>Select a file in the left column.</li><li>Read the complete code in the middle.</li><li>Click a comment topic beneath it.</li><li>Read the explanation on the right.</li><li>Find that block again in the file.</li></ol></section>
    <AssignmentObjectives />
    <PracticeLab />
    <CodeExplorer />
    <footer>Start with MainActivity.java, then SecondView.java, then GameBoard.java.</footer>
  </main>;
}
