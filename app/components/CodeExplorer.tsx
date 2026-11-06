"use client";

import { useState, type ReactNode } from "react";
import { finalAndroidFiles } from "../data/finalAndroidCode";
import "../inline-code.css";
import "../syntax.css";
import "../beginner-explanations.css";

type Note = { title: string; kind: "Android" | "Java" | "Pattern"; focus: string; explanation: string; };
const tickListener = { path: "ui/TickListener.java", purpose: "A small shared animation callback contract.", code: `package edu.byuh.mc.cis.cs300.frogameproject.ui;\n\npublic interface TickListener {\n    void onTick();\n}` };
const files = [...finalAndroidFiles, tickListener];

const notes: Record<string, Note[]> = {
  "ui/MainActivity.java": [
    { title:"The package line", kind:"Java", focus:"package edu.byuh...ui;", explanation:"A package is the class's address. The folder structure and package declaration must agree, otherwise Java cannot reliably find the class." },
    { title:"extends Activity", kind:"Android", focus:"public class MainActivity extends Activity", explanation:"Activity is Android's screen class. The word extends means MainActivity inherits Android behavior and can override lifecycle methods." },
    { title:"onCreate callback", kind:"Android", focus:"protected void onCreate(Bundle savedInstanceState)", explanation:"Android calls this method when it creates this screen. Bundle may contain saved screen information after events such as a rotation." },
    { title:"setContentView", kind:"Android", focus:"setContentView(new SecondView(this));", explanation:"This tells Android what to display. new creates one SecondView object. this supplies the Activity Context that the View needs for Android resources." },
  ],
  "ui/SecondView.java": [
    { title:"extends View", kind:"Android", focus:"public class SecondView extends View", explanation:"This is a custom drawing surface. Instead of building the board from XML widgets, the project controls every pixel through Canvas." },
    { title:"Field ownership", kind:"Java", focus:"private final ArrayList<Tokenzz> tokens", explanation:"A field belongs to one SecondView object and survives after a method finishes. This list remembers every visual token currently in the game." },
    { title:"Model–View separation", kind:"Pattern", focus:"private final GameBoard board = new GameBoard();", explanation:"GameBoard owns the game rules; SecondView owns drawing and input. This prevents images from becoming the source of truth about who won." },
    { title:"Resource loading", kind:"Android", focus:"BitmapFactory.decodeResource", explanation:"The fruit images live in res/drawable. They are loaded once when the View is created, not repeatedly inside onDraw, which would be slow." },
    { title:"onSizeChanged", kind:"Android", focus:"protected void onSizeChanged", explanation:"Android calls this after the View knows its usable width and height. It is the correct time to calculate button rectangles that fit the screen." },
    { title:"onTouchEvent", kind:"Android", focus:"public boolean onTouchEvent(MotionEvent event)", explanation:"Every touch reaches this method. Returning true means this View handled the touch and wants future touch events too." },
    { title:"onDraw", kind:"Android", focus:"protected void onDraw(Canvas canvas)", explanation:"Android calls onDraw whenever the screen needs painting. Do not call it yourself; change state and call invalidate instead." },
    { title:"Stop safely", kind:"Android", focus:"onDetachedFromWindow", explanation:"When the View leaves the screen, animation callbacks are stopped. This avoids keeping a removed View alive or wasting battery." },
  ],
  "ui/GridButton.java": [
    { title:"Encapsulation", kind:"Java", focus:"private final char label", explanation:"private means only GridButton can directly change this field. Other classes use getLabel, which keeps the object's data protected." },
    { title:"RectF hit box", kind:"Android", focus:"private final RectF bounds", explanation:"RectF represents a decimal rectangle. The same bounds are used for drawing and tap testing, so the visual button matches its clickable area." },
    { title:"Constructor", kind:"Java", focus:"public GridButton(...)", explanation:"A constructor initializes one new button. Each of the ten buttons receives a different label and rectangle, while sharing the same class design." },
    { title:"contains method", kind:"Android", focus:"return bounds.contains(x, y);", explanation:"Android gives a touch coordinate. RectF.contains answers whether that coordinate landed inside this button." },
  ],
  "Tokenzz.java": [
    { title:"One token object", kind:"Java", focus:"public class Tokenzz", explanation:"Each fruit has its own Tokenzz object. Its fields hold only that fruit's player, rectangle, row, column, speed, and destination." },
    { title:"Shared moving count", kind:"Java", focus:"private static int movingCount", explanation:"static means this value is shared by every Tokenzz object. It lets the game ask whether any token is still moving." },
    { title:"Velocity vector", kind:"Android", focus:"private final PointF velocity", explanation:"PointF stores decimal x and y values. A velocity of (0, 12) moves down; (12, 0) moves right because Android y increases downward." },
    { title:"Frame update", kind:"Pattern", focus:"public void move()", explanation:"Animation uses state updates: change bounds a little each frame, then let SecondView request a redraw. The token does not draw itself inside move." },
    { title:"Overshoot protection", kind:"Java", focus:"closeX && closeY", explanation:"A token may step past the exact destination. This check asks whether it is within one movement step, then snaps it exactly into the final cell." },
  ],
  "logic/Player.java": [
    { title:"Utility class", kind:"Java", focus:"public final class Player", explanation:"final prevents this tiny constants class from being extended. Its private constructor prevents meaningless Player objects from being created." },
    { title:"Named constants", kind:"Java", focus:"public static final int X", explanation:"static final creates a permanent class-level name. Player.X communicates meaning much better than a raw number such as 0." },
    { title:"Conversion method", kind:"Java", focus:"public static String toString", explanation:"This method turns a stored integer into readable text for debugging and messages. static is appropriate because it needs no particular Player object." },
  ],
  "logic/GameBoard.java": [
    { title:"The model", kind:"Pattern", focus:"public class GameBoard", explanation:"This is the Model in a Model–View design. It contains rules and data only; it should not import Canvas, Bitmap, Toast, or touch classes." },
    { title:"2D array", kind:"Java", focus:"private final int[][] grid", explanation:"The first index is row and second is column: grid[row][column]. The array has a fixed five-by-five shape, perfect for this board." },
    { title:"Reset nested loop", kind:"Java", focus:"for (int row", explanation:"The outer loop selects one row. The inner loop visits every column in that row. Together they visit all 25 board positions." },
    { title:"Turn state", kind:"Pattern", focus:"private int currentPlayer", explanation:"One object owns one fact. GameBoard is the single source of truth for whose turn it is, instead of the UI keeping a duplicate boolean." },
    { title:"Carry insertion", kind:"Java", focus:"int carry = player", explanation:"carry holds the value that must be placed next. Each existing value becomes the next carry, making the row or column shift one square." },
    { title:"Win helpers", kind:"Java", focus:"allEqualRow", explanation:"Small helper methods make checkForWin readable. Each helper answers one focused yes/no question instead of placing all logic in one giant method." },
  ],
  "ui/AnimationHandler.java": [
    { title:"Handler on UI thread", kind:"Android", focus:"super(Looper.getMainLooper())", explanation:"Android Views must be changed on the main UI thread. This Looper makes scheduled animation frames run on that safe thread." },
    { title:"Runnable callback", kind:"Java", focus:"private final Runnable frame", explanation:"Runnable represents code that can run later. SecondView provides the frame work, while AnimationHandler only schedules it." },
    { title:"Separation of jobs", kind:"Pattern", focus:"public void nextFrame()", explanation:"The handler does scheduling; SecondView decides what a frame means; Tokenzz decides how it moves. Separate responsibilities make each class easier to understand." },
  ],
  "ui/TickListener.java": [
    { title:"Interface contract", kind:"Java", focus:"public interface TickListener", explanation:"An interface lists a promise without implementation. Any class that implements TickListener must provide onTick." },
    { title:"Observer pattern", kind:"Pattern", focus:"void onTick();", explanation:"In the original project, AnimationHandler notifies all registered TickListeners. One publisher sends a tick; several subscribers respond independently." },
  ],
};

const javaTokens = /\/\/.*|"(?:\\.|[^"\\])*"|\b(?:package|import|public|private|protected|class|interface|extends|implements|static|final|void|new|return|if|else|for|while|boolean|int|float|char|true|false|null)\b|\b\d+(?:\.\d+)?f?\b|\b[A-Z][A-Za-z0-9_]*\b/g;

function highlightJava(line: string): ReactNode[] {
  const parts: ReactNode[] = [];
  let position = 0;
  for (const match of line.matchAll(javaTokens)) {
    const token = match[0];
    const start = match.index ?? 0;
    if (start > position) parts.push(line.slice(position, start));
    const style = token.startsWith("//") ? "java-comment" : token.startsWith('"') ? "java-string" : /^\d/.test(token) ? "java-number" : /^[A-Z]/.test(token) ? "java-type" : "java-keyword";
    parts.push(<span className={style} key={`${start}-${token}`}>{token}</span>);
    position = start + token.length;
  }
  if (position < line.length) parts.push(line.slice(position));
  return parts.length ? parts : [line || " "];
}

function automaticBlockNotes(code: string, curated: Note[]): Note[] {
  const generated: Note[] = [];
  for (const rawLine of code.split("\n")) {
    const line = rawLine.trim();
    if (!line || curated.some((item) => rawLine.includes(item.focus))) continue;
    if (line.startsWith("package ")) generated.push({ title: "Package address", kind: "Java", focus: line, explanation: "This tells Java the class's full address. It must match the folder structure, otherwise imports and project builds can fail." });
    else if (line.startsWith("import ")) generated.push({ title: "Imported Android/Java tool", kind: "Java", focus: line, explanation: "import lets this file use a class defined elsewhere without writing its complete package address every time. It does not create an object or run code." });
    else if (/^(public|private|protected)\s+(static\s+)?(final\s+)?[\w<>\[\]]+\s+\w+\s*[=;]/.test(line)) generated.push({ title: "Field declaration", kind: "Java", focus: line, explanation: "This line declares a field: information the current object remembers between method calls. Its access word controls which other classes may use it." });
    else if (/^(public|private|protected)\s+(?:(?:static|final)\s+)*(?:[\w<>\[\]]+\s+)+\w+\s*\(/.test(line) || line.startsWith("@Override")) generated.push({ title: "Method or callback block", kind: "Java", focus: line, explanation: "This begins a named block of code. A method groups one responsibility; an overridden Android callback is called by Android at the correct time." });
    else if (line.startsWith("if (") || line.startsWith("else if")) generated.push({ title: "Decision block", kind: "Java", focus: line, explanation: "if tests a true/false condition. Only when the condition is true does Java enter this block. This is how the game chooses what should happen." });
    else if (line.startsWith("for (")) generated.push({ title: "Loop block", kind: "Java", focus: line, explanation: "for repeats the block. In this project loops visit every row, column, button, token, or listener without copying the same code many times." });
    else if (line.startsWith("return")) generated.push({ title: "Return value", kind: "Java", focus: line, explanation: "return ends the current method. In a non-void method it also sends a value back to the code that called the method." });
  }
  return generated;
}

function howToRead(note: Note): string {
  if (note.title === "Package address") return "Read it as: “This class lives in this named neighborhood.” You normally leave this line alone unless you move the Java file into a different package folder.";
  if (note.title === "Imported Android/Java tool") return "Read it as: “This file needs permission to use this tool by its short name.” Imports make the top of a Java file longer, but they do not make anything appear on screen by themselves.";
  if (note.title === "Field declaration") return "Read from left to right: access level, optional shared/fixed words, type, then variable name. Ask: what information will this object need to remember after one method finishes?";
  if (note.title === "Method or callback block") return "Find the opening { and matching }. Everything inside belongs to this one job. Look at the method name first, then read its body one line at a time.";
  if (note.title === "Decision block") return "Read the condition inside parentheses as a yes/no question. If the answer is yes, Java runs the indented lines in its braces; otherwise it skips them.";
  if (note.title === "Loop block") return "Before reading the loop body, ask what collection or number range it will visit. Then pretend the loop runs once for one item, and trace only that one pass.";
  if (note.title === "Return value") return "Read return as “send this answer back now.” Any code below return in the same path will not run, because the method has finished.";
  if (note.kind === "Android") return "Ask two questions: does Android call this code for me, or does my code call Android? Then ask what screen state changes before the next redraw.";
  if (note.kind === "Pattern") return "This is a design choice, not special Java syntax. Notice which class owns the information and which class only asks for or displays it.";
  return "Read this line slowly from left to right. Identify the type first, then the variable or method name, then the value or action being used.";
}

function projectConnection(note: Note): string {
  if (note.kind === "Android") return "In Frogame, this helps Android create the screen, receive player input, load images, or redraw movement safely.";
  if (note.kind === "Pattern") return "In Frogame, this keeps the game from becoming one confusing file: rules, movement, drawing, and timing have separate owners.";
  return "In Frogame, understanding this Java block lets you trace what data is stored, how a decision is made, or how one object asks another object to do work.";
}

function generalPurpose(note: Note): string {
  if (note.focus.includes("onCreate")) return "Generally, onCreate is where an Android Activity performs its first setup after Android creates the screen.";
  if (note.focus.includes("onDraw")) return "Generally, onDraw is a View method whose purpose is to paint the current visual state onto a Canvas.";
  if (note.focus.includes("onTouchEvent")) return "Generally, onTouchEvent receives touch information and decides whether a custom View handled that interaction.";
  if (note.focus.includes("onSizeChanged")) return "Generally, onSizeChanged responds when a View receives or changes its available width and height.";
  if (note.focus.includes("move()")) return "Generally, a move method updates one object's position or state by one small step.";
  if (note.focus.includes("submitMove")) return "Generally, a submitMove-style method validates and records one player action, then updates the game state for the next turn.";
  if (note.focus.includes("checkForWin")) return "Generally, a checkForWin-style method examines stored game data and returns whether a completed winning condition exists.";
  if (note.focus.includes("isFull")) return "Generally, an isFull-style method checks every available position and returns a true/false answer about whether any space remains.";
  if (note.focus.includes("draw(")) return "Generally, a draw method converts an object's stored visual state into pixels on a drawing surface.";
  if (note.focus.includes("contains(")) return "Generally, a contains method answers whether a coordinate or item lies inside an object's boundary.";
  if (note.kind === "Android") return "In Android apps generally, this helps the operating system manage screens, user input, images, drawing, or background timing in a safe and standard way.";
  if (note.kind === "Pattern") return "In software generally, this design pattern gives each class one clear responsibility. That makes larger programs easier to change, test, and debug.";
  if (note.title === "Package address" || note.title === "Imported Android/Java tool") return "In Java generally, this helps the compiler locate classes and organize a project as it grows beyond one file.";
  if (note.title === "Field declaration") return "In Java generally, fields let an object remember information so several methods can work with the same state over time.";
  if (note.title === "Method or callback block") return "In Java generally, methods divide a program into named, reusable jobs instead of putting all code in one long file.";
  if (note.title === "Decision block") return "In Java generally, decisions let a program react differently when its data or user input changes.";
  if (note.title === "Loop block") return "In Java generally, loops repeat a task without duplicating code, which is essential for lists, arrays, and grids.";
  if (note.title === "Return value") return "In Java generally, return lets a method give an answer back to the code that asked a question.";
  return "In Java generally, this code helps a program store information, organize behavior, or communicate between objects.";
}

export function CodeExplorer() {
  const [selectedPath, setSelectedPath] = useState(files[0].path);
  const [selectedNote, setSelectedNote] = useState(0);
  const selectedFile = files.find((file) => file.path === selectedPath) ?? files[0];
  const sourceLines = selectedFile.code.split("\n");
  const curatedNotes = notes[selectedFile.path] ?? [];
  const fileNotes = [...curatedNotes, ...automaticBlockNotes(selectedFile.code, curatedNotes)];
  const note = fileNotes[selectedNote] ?? fileNotes[0];
  const inlineNotes = fileNotes.map((item, index) => ({ ...item, index, line: sourceLines.findIndex((line) => line.includes(item.focus)) }));
  function chooseFile(path: string) { setSelectedPath(path); setSelectedNote(0); }
  return <section className="reader" id="reader"><div className="reader-intro"><p className="eyebrow">INTERACTIVE CODE READER</p><h2>Read the complete files with explanations inside the code.</h2><p>Select a file. Click any gold <code>{"// 💬"}</code> comment inserted beside the code; the detailed beginner explanation appears on the right.</p></div><div className="reader-layout"><nav className="reader-files" aria-label="Android project source files">{files.map((file) => <button type="button" key={file.path} className={file.path === selectedFile.path ? "selected" : ""} onClick={() => chooseFile(file.path)}>{file.path}</button>)}</nav><div className="source-panel"><div className="source-header"><div><p>COMPLETE FILE · INLINE COMMENTS</p><h3>{selectedFile.path}</h3></div><span>{selectedFile.purpose}</span></div><div className="source-code" role="region" aria-label={`Code for ${selectedFile.path}`}>{sourceLines.map((line, lineIndex) => <div className="code-row" key={`${lineIndex}-${line}`}><div className="code-line"><span className="line-number">{lineIndex + 1}</span><code>{highlightJava(line)}</code></div>{inlineNotes.filter((item) => item.line === lineIndex).map((item) => <button type="button" key={item.title} className={`inline-comment ${selectedNote === item.index ? "active" : ""}`} onClick={() => setSelectedNote(item.index)}><span>💬 {item.index + 1}</span>{" // "}{item.title} — click to understand</button>)}</div>)}</div></div><aside className="note-panel" aria-live="polite">{note && <><p className={`note-kind ${note.kind.toLowerCase()}`}>{note.kind}</p><h3>{note.title}</h3><p className="focus">Code focus: <code>{note.focus}</code></p><p className="explanation-label">PLAIN-ENGLISH MEANING</p><p>{note.explanation}</p><p className="explanation-label">HOW TO READ THIS</p><p>{howToRead(note)}</p><p className="explanation-label">GENERAL PURPOSE OF THIS FUNCTION / BLOCK</p><p>{generalPurpose(note)}</p><p className="explanation-label">SPECIFIC PURPOSE IN FROGAME</p><p>{projectConnection(note)}</p><p className="beginner-tip"><strong>Beginner tip:</strong> Find this code in the complete file, then read five lines above and below it. Notice what information enters and leaves that block.</p></>}</aside></div></section>;
}
