"use client";

import { useState } from "react";
import "./PracticeLab.css";

type Challenge = { title: string; prompt: string; code: string; answer: string; takeaway: string };

const challenges: Challenge[] = [
  { title: "Trace one tap", prompt: "A player taps the button labelled '3'. What is the first job of the view?", code: `if (button.contains(x, y)) {\n    button.press();\n    makeMove(button.getLabel());\n}`, answer: "The view confirms which button contains the touch, marks it pressed, and passes its label into makeMove. It does not directly change the board array here.", takeaway: "Input code identifies an action, then hands the work to a focused method." },
  { title: "Follow the state", prompt: "Why should GameBoard, rather than the picture on screen, decide whose turn comes next?", code: `int player = gameBoard.getCurrentPlayer();\ngameBoard.submitMove(label, player);`, answer: "Images can be moving, removed, or still drawing an old frame. GameBoard stores dependable game facts, so it is the source of truth for turn order and winning checks.", takeaway: "Keep rules and data in a model class; let the view show that state." },
  { title: "Read a loop", prompt: "What does this loop protect you from when tokens are removed?", code: `Iterator<Tokenzz> iterator = tokens.iterator();\nwhile (iterator.hasNext()) {\n    Tokenzz token = iterator.next();\n    if (token.isInvisible(getHeight())) {\n        iterator.remove();\n    }\n}`, answer: "The Iterator controls both visiting and removing the current item. Removing directly from tokens during a for-each loop can cause a ConcurrentModificationException.", takeaway: "When a collection changes during a loop, use the collection's Iterator." },
  { title: "Count the pushes", prompt: "Player X plays a +2 card, then taps '3'. Whose turn is it now, and why?", code: `// playCard(PLUS_TWO)\npushesLeft += card.extraPushes;   // 1 + 1 = 2\n\n// submitMove('3', X)\npushesLeft--;                     // 2 - 1 = 1\nif (pushesLeft <= 0) {\n    endTurn();\n}`, answer: "It is still X's turn. The +2 card raised pushesLeft to 2, and one push only lowers it to 1, so endTurn() is not called yet. X pushes once more, and then the turn passes to O.", takeaway: "GameBoard counts pushes, so the screen never has to remember the card rules." },
  { title: "Why a copy?", prompt: "The computer tries thousands of moves. Why does it call new GameBoard(gameBoard) instead of using gameBoard directly?", code: `GameBoard snapshot = new GameBoard(gameBoard);\n\n// inside ComputerPlayer.apply(...)\nGameBoard next = new GameBoard(board);\nnext.submitMove(a.push, next.getCurrentPlayer());`, answer: "Every \"what if\" move changes the board it is applied to. Working on copies made by the copy constructor means the real game is never changed by the AI's experiments, and the background thread can't change the board that the screen is drawing.", takeaway: "When you need to experiment with data, change a copy, not the original." },
  { title: "Which thread?", prompt: "Why is the computer's move wrapped in post(...) instead of being run directly inside the new Thread?", code: `new Thread(() -> {\n    ComputerPlayer.Action action = computer.bestAction(snapshot, 4500);\n    post(() -> {\n        makeMove(action.push);\n    });\n}).start();`, answer: "Thinking is slow, so it runs on a background thread to keep the screen responsive. But Android only allows the main (UI) thread to change Views. post() hands the final move back to the main thread.", takeaway: "Do slow work in the background; change the screen only on the main thread." },
  { title: "Prune a branch", prompt: "In minimax, alpha = 30 and beta = 10. What happens next, and why is that safe?", code: `if (alpha >= beta) {\n    break; // prune\n}`, answer: "The loop stops, so the remaining moves at this point are not searched. The computer already has a line worth at least 30, and the human can already hold it to 10 elsewhere. The human would never let the game reach this position, so searching it further can't change the decision.", takeaway: "Alpha-beta pruning skips work that can't change the answer. It is faster, but it chooses the same move." },
];

export function PracticeLab() {
  const [active, setActive] = useState(0);
  const [revealed, setRevealed] = useState<number[]>([]);
  const challenge = challenges[active];
  const isRevealed = revealed.includes(active);
  const revealAnswer = () => setRevealed((current) => current.includes(active) ? current : [...current, active]);

  return <section className="practice-lab" id="practice">
    <div className="practice-intro"><p className="eyebrow">CODE PRACTICE LAB</p><h2>Pause. Predict. Then check your thinking.</h2><p>Use these tiny code traces after reading a file. Try to explain the result aloud before revealing the answer—this is where the code starts to stick.</p></div>
    <div className="practice-layout"><div className="challenge-tabs" role="tablist" aria-label="Practice challenges">{challenges.map((item, index) => <button key={item.title} type="button" role="tab" aria-selected={active === index} className={active === index ? "active" : ""} onClick={() => setActive(index)}><span>{String(index + 1).padStart(2, "0")}</span>{item.title}</button>)}</div>
      <article className="challenge-card"><p className="challenge-count">CHALLENGE {active + 1} OF {challenges.length}</p><h3>{challenge.prompt}</h3><pre><code>{challenge.code}</code></pre>{isRevealed ? <div className="challenge-answer"><p><strong>Answer:</strong> {challenge.answer}</p><p><strong>Remember:</strong> {challenge.takeaway}</p></div> : <button className="reveal-button" type="button" onClick={revealAnswer}>Reveal explanation</button>}</article>
    </div>
  </section>;
}
