"use client";

import { useState, type ReactNode } from "react";
import { finalAndroidFiles } from "../data/finalAndroidCode";
import "../inline-code.css";
import "../syntax.css";
import "../beginner-explanations.css";

type Note = { title: string; kind: "Android" | "Java" | "Pattern"; focus: string; explanation: string; };
const files = finalAndroidFiles;

const notes: Record<string, Note[]> = {
  "ui/MainActivity.java": [
    { title:"extends Activity", kind:"Android", focus:"public class MainActivity extends Activity", explanation:"Activity is Android's screen class. The word extends means MainActivity inherits all of Android's screen behavior and can override lifecycle methods such as onCreate." },
    { title:"onCreate callback", kind:"Android", focus:"protected void onCreate(Bundle savedInstanceState)", explanation:"Android calls this method when it creates this screen. You never call it yourself. Bundle may contain saved screen information after events such as a rotation." },
    { title:"Call the parent first", kind:"Java", focus:"super.onCreate(savedInstanceState);", explanation:"super runs the Activity version of onCreate before your own code. Android requires this so its own setup happens first; leaving it out crashes the app." },
    { title:"setContentView", kind:"Android", focus:"setContentView(new SecondView(this));", explanation:"This tells Android what to display. new creates one SecondView object, and this passes the Activity as the Context that the View needs to load images and show dialogs." },
  ],
  "ui/SecondView.java": [
    { title:"extends View, implements TickListener", kind:"Android", focus:"public class SecondView extends View implements TickListener", explanation:"extends View makes this a custom drawing surface: the project paints every pixel itself on a Canvas. implements TickListener promises that SecondView has an onTick method, so AnimationHandler can call it every frame." },
    { title:"Game mode field", kind:"Java", focus:"private int gameMode = GameMode.ONE_PLAYER;", explanation:"This field remembers whether the human is playing the computer or a friend. It starts as ONE_PLAYER and the welcome dialog can change it." },
    { title:"Which side the computer plays", kind:"Java", focus:"private final int computerPlayer = Player.O;", explanation:"final means this never changes after it is set. The human is always X (durian) and the computer is always O (persimmon) in one-player mode." },
    { title:"Thinking guard flag", kind:"Java", focus:"private boolean computerThinking = false;", explanation:"onTick runs about 60 times a second. Without this flag the view would start a new AI search on every tick while the first one is still thinking. The flag makes sure only one search runs at a time." },
    { title:"Model–View separation", kind:"Pattern", focus:"private final GameBoard gameBoard = new GameBoard();", explanation:"GameBoard owns the rules and data; SecondView owns drawing and touch. The pictures on screen are never the source of truth about whose turn it is or who won." },
    { title:"The computer opponent object", kind:"Java", focus:"private final ComputerPlayer computer = new ComputerPlayer(computerPlayer);", explanation:"One ComputerPlayer object is created for the whole game. It is told which player it is (O) so it knows which outcomes are good for it." },
    { title:"2D array of card rectangles", kind:"Java", focus:"private final RectF[][] cardSlots", explanation:"cardSlots[player][index] is the on-screen rectangle for one card. The first index picks X or O; the second picks which of up to MAX_HAND cards. Rectangles are used both to draw a card and to test whether a tap hit it." },
    { title:"Paints created once", kind:"Android", focus:"private final Paint cardFill", explanation:"Paint objects hold colors and text styles. Creating them in onDraw would make a new object 60 times a second, which is slow and makes Android's garbage collector work hard. So they are created once as fields." },
    { title:"Find a token by grid position", kind:"Java", focus:"private Tokenzz findTokenAt(char row, char column)", explanation:"A simple linear search: loop through every token and return the one whose row and column match. If none matches, return null, which means that square is empty on screen." },
    { title:"Chain push downward", kind:"Pattern", focus:"private void slideDown(Tokenzz newToken, char column)", explanation:"A push moves a whole chain. This collects the new token plus every token directly below it until the first empty square, then moves each one down by one row, just like the rule in GameBoard.submitMove." },
    { title:"char arithmetic", kind:"Java", focus:"token.position.row++;", explanation:"A char is stored as a number, so 'A' + 1 is 'B'. Adding one to the row moves the token to the next letter row. Subtracting 'A' turns a letter row back into a 0–4 array index." },
    { title:"One move method for everyone", kind:"Pattern", focus:"private void makeMove(char label)", explanation:"Both the human's tap and the computer's decision call this same method. Sharing one path means the computer can never move differently from a human, and bugs only need fixing in one place." },
    { title:"Builder setup", kind:"Pattern", focus:"Tokenzz token = new Tokenzz.Builder()", explanation:"Each .something(...) call names one value for the new token, then build() creates it. This is easier to read and harder to get wrong than a constructor with six arguments in a row." },
    { title:"Subscribe the token to ticks", kind:"Pattern", focus:"animationHandler.register(token);", explanation:"Observer pattern: the new token joins AnimationHandler's listener list, so it will receive onTick (and move a little) on every frame." },
    { title:"Update the rules once", kind:"Java", focus:"gameBoard.submitMove(label, player);", explanation:"After starting the visual animation, the logical board is updated exactly once. The animation only shows what GameBoard already decided." },
    { title:"onTick: the game loop", kind:"Android", focus:"public void onTick() {", explanation:"Called every frame. It redraws the screen, and only when every token has stopped does it check for a winner or start the computer's turn. Waiting avoids judging the board in the middle of an animation." },
    { title:"Search a copy, not the real board", kind:"Pattern", focus:"GameBoard snapshot = new GameBoard(gameBoard);", explanation:"The AI tries thousands of moves. It does this on a copy made by GameBoard's copy constructor, so the real game can never be changed by the computer's 'what if' thinking." },
    { title:"Background thread", kind:"Android", focus:"new Thread(() -> {", explanation:"Thinking can take up to 4.5 seconds. Doing that on the main thread would freeze the screen and Android could show 'App not responding'. A new Thread runs the search in the background while the UI keeps working." },
    { title:"Minimum thinking pause", kind:"Java", focus:"Thread.sleep(500 - elapsed);", explanation:"If the AI answers very fast, the thread waits so the total is at least half a second. Otherwise the computer's move would appear instantly and the human couldn't see what happened." },
    { title:"post(): back to the main thread", kind:"Android", focus:"post(() -> {", explanation:"Only the main thread may change Views. post hands this lambda to the main thread to run, so the computer's card or push is applied safely." },
    { title:"Welcome dialog", kind:"Android", focus:"new AlertDialog.Builder(context)", explanation:"AlertDialog.Builder is Android's own Builder pattern. It asks how many players, and each button's lambda sets gameMode. setCancelable(false) forces the player to choose." },
    { title:"onTouchEvent", kind:"Android", focus:"public boolean onTouchEvent(MotionEvent event)", explanation:"Every touch reaches this method. It reads the action (down or up) and the x/y position. Returning true tells Android this View handled the touch and wants the rest of it." },
    { title:"Finger lifted", kind:"Android", focus:"if (action == MotionEvent.ACTION_UP)", explanation:"When the finger lifts, every button returns to its unpressed image. This runs even while tokens are moving, so a button never gets stuck looking pressed." },
    { title:"Input lock", kind:"Java", focus:"if (gameFinished || Tokenzz.anyTokensMoving())", explanation:"No new moves while tokens are still sliding or after someone has won. The || means 'or': if either condition is true, the touch is ignored." },
    { title:"Tapping a power card", kind:"Java", focus:"cardSlots[player][i].contains(x, y)", explanation:"Before checking the grid buttons, the view checks whether the tap landed on one of the current player's cards. canPlayCard decides whether the card is allowed right now." },
    { title:"onSizeChanged", kind:"Android", focus:"protected void onSizeChanged(int w, int h, int oldw, int oldh)", explanation:"Android calls this once the View knows its real width and height (and again after a rotation). It is the right moment to calculate button and card rectangles that fit the screen." },
    { title:"Layout the card slots", kind:"Java", focus:"private void layoutCards(", explanation:"This calculates where each player's cards go. It is its own method so onSizeChanged stays short and readable." },
    { title:"Portrait vs landscape", kind:"Android", focus:"if (h >= w) {", explanation:"Taller than wide means portrait: cards go above and below the board. Otherwise it's landscape and the cards go to the left and right." },
    { title:"Play a card", kind:"Java", focus:"private void playCard(PowerCard card)", explanation:"GameBoard.playCard decides whether the card is legal. Only if it returns true does the view show a Toast describing the effect and redraw." },
    { title:"switch on an enum", kind:"Java", focus:"switch (card) {", explanation:"switch picks one branch based on the card. With an enum you write the bare constant name (PLUS_TWO), and default catches every case not listed (SKIP and REVERSE here)." },
    { title:"Dim the waiting player", kind:"Java", focus:"fill.setAlpha(p == current ? 255 : 110);", explanation:"The ternary operator condition ? a : b picks a value. 255 is fully opaque; 110 is see-through, so the cards of the player who is waiting look faded." },
    { title:"Grid cell rectangle", kind:"Java", focus:"private RectF getCellBounds(int row, int col)", explanation:"Turns a row and column number into a screen rectangle, with a little padding so tokens don't cover the grid lines. Tokens use this as their destination." },
    { title:"onDraw", kind:"Android", focus:"protected void onDraw(Canvas c)", explanation:"Android calls onDraw whenever the screen needs painting. Never call it yourself; change data and call invalidate() instead. Order matters: background, grid, tokens, buttons, then cards." },
    { title:"Safe removal while looping", kind:"Java", focus:"Iterator<Tokenzz> iterator = tokens.iterator();", explanation:"Tokens that have fallen off the screen are removed here. iterator.remove() removes only the current token; calling tokens.remove(token) inside a for-each loop would throw a ConcurrentModificationException." },
    { title:"Unsubscribe from ticks", kind:"Pattern", focus:"animationHandler.deregister(token);", explanation:"A removed token must also leave the listener list. Otherwise AnimationHandler would keep calling onTick on a token nobody can see." },
    { title:"Anonymous class", kind:"Java", focus:"new DialogInterface.OnClickListener()", explanation:"An anonymous class creates a one-time object that implements an interface, without giving the class a name. Its onClick method restarts the game." },
    { title:"Lambda listener", kind:"Java", focus:"(dialog, which) -> {", explanation:"This lambda is a shorter way to write the same kind of OnClickListener as the anonymous class just above. Lambdas work for any interface that has exactly one method." },
    { title:"Reset everything", kind:"Java", focus:"private void resetGame()", explanation:"A new game must reset both layers: the visual tokens (deregister, stop, clear) and the logical board (gameBoard.clear()). Then the animation loop is restarted." },
  ],
  "logic/GameMode.java": [
    { title:"Constants-only class", kind:"Java", focus:"public class GameMode", explanation:"This class exists only to give names to numbers. Code can say GameMode.ONE_PLAYER instead of a mysterious 1." },
    { title:"Named constant", kind:"Java", focus:"public static final int ONE_PLAYER = 1;", explanation:"static means it belongs to the class (no object needed). final means it can never change. Together they make a constant." },
  ],
  "logic/Player.java": [
    { title:"Constants class", kind:"Java", focus:"public class Player {", explanation:"Player is not a person object. It only names the three values a square can hold, plus a helper to print them." },
    { title:"Named constants", kind:"Java", focus:"public static final int X = 0;", explanation:"static final creates a permanent class-level name. Player.X communicates meaning much better than a raw 0. X and O are 0 and 1 so they can also be used as array indexes, like hands.get(Player.X)." },
    { title:"BLANK means 'nobody'", kind:"Java", focus:"public static final int BLANK = 2;", explanation:"BLANK is used both for an empty square and for 'no winner yet'. One value with one clear meaning: nobody." },
    { title:"Static conversion method", kind:"Java", focus:"public static String toString(int p)", explanation:"Turns a stored number into readable text for messages and debugging. It is static because it doesn't need any Player object: call it as Player.toString(Player.X)." },
  ],
  "logic/GameBoard.java": [
    { title:"The model", kind:"Pattern", focus:"public class GameBoard {", explanation:"This is the Model in a Model–View design. It contains rules and data only and imports no Android drawing classes, which is why the AI can copy and test it freely." },
    { title:"Card rule constants", kind:"Java", focus:"public static final int STARTING_HAND = 3;", explanation:"Each player starts with 3 cards, can hold at most 3, and draws a new one every 3 turns. Naming these numbers makes the rules easy to find and change." },
    { title:"2D array", kind:"Java", focus:"private int[][] grid;", explanation:"grid[row][column] stores Player.X, Player.O or Player.BLANK. The first index is the row (A–E), the second is the column (1–5)." },
    { title:"Turn state", kind:"Pattern", focus:"private int whoseTurnIsIt;", explanation:"GameBoard is the single source of truth for whose turn it is. The view asks with getCurrentPlayer() instead of keeping its own copy that could get out of sync." },
    { title:"A list of lists", kind:"Java", focus:"private final List<List<PowerCard>> hands", explanation:"hands holds two lists: hands.get(Player.X) is X's cards and hands.get(Player.O) is O's. Generics (<PowerCard>) mean the compiler only lets PowerCards go into these lists." },
    { title:"Pushes this turn", kind:"Java", focus:"private int pushesLeft;", explanation:"Normally 1. A +2 or +4 card raises it so the same player pushes again before the turn ends." },
    { title:"Turning off randomness for the AI", kind:"Java", focus:"private boolean drawsEnabled = true;", explanation:"Random card draws would make the AI's predictions noisy, so board copies made for the AI set this to false." },
    { title:"Copy constructor", kind:"Pattern", focus:"public GameBoard(GameBoard other)", explanation:"A second constructor that builds an independent copy of another board. The AI tries moves on copies so the real game never changes while it thinks." },
    { title:"Deep copy of each row", kind:"Java", focus:"grid[i] = Arrays.copyOf(other.grid[i], DIM);", explanation:"Writing grid = other.grid would share the same array, so changing the copy would change the original. Arrays.copyOf makes a brand-new row with the same values." },
    { title:"Start a fresh game", kind:"Java", focus:"public void clear()", explanation:"A nested loop sets all 25 squares to BLANK. Then X goes first, each player gets a fresh hand of random cards, and the turn counters reset." },
    { title:"Random card", kind:"Java", focus:"private PowerCard randomCard()", explanation:"PowerCard.values() gives an array of every enum constant. random.nextInt(length) picks a random index into it." },
    { title:"Read-only view", kind:"Java", focus:"java.util.Collections.unmodifiableList", explanation:"Other classes may look at a hand but not change it. If code tries to add or remove through this list, Java throws an error. Encapsulation: only GameBoard changes hands." },
    { title:"When can a card be played?", kind:"Java", focus:"public boolean canPlayCard()", explanation:"Only one card per turn, and only before the first push. ! means 'not' and && means both must be true." },
    { title:"Play a card", kind:"Java", focus:"public boolean playCard(PowerCard card)", explanation:"If the card isn't allowed, or isn't in the hand, return false and change nothing. Otherwise remove it, add its extra pushes, and remember whether the opponent is skipped." },
    { title:"End of turn", kind:"Java", focus:"private void endTurn()", explanation:"Counts the turn, maybe draws a card, then either gives the turn to the other player or (after a skip) lets the same player go again. It is private because only submitMove should end a turn." },
    { title:"Modulo for every 3rd turn", kind:"Java", focus:"turnsTaken[p] % TURNS_PER_DRAW == 0", explanation:"% gives the remainder after division. The remainder is 0 on turns 3, 6, 9..., so the player draws a card every third turn." },
    { title:"Submit one push", kind:"Java", focus:"public void submitMove(char move, int p)", explanation:"A label of '1'–'5' pushes down a column; 'A'–'E' pushes right along a row. Each existing token shifts one square until the first empty square is filled." },
    { title:"Label to index", kind:"Java", focus:"int col = (int)(move - '1');", explanation:"Subtracting characters gives a number: '3' - '1' is 2. That turns a button label into an array index from 0 to 4." },
    { title:"Carry and swap", kind:"Java", focus:"int tmp = grid[i][col];", explanation:"tmp saves the token that was in this square, the new value is placed, and tmp becomes the next value to push further down. This is how the whole column shifts." },
    { title:"Use up a push", kind:"Java", focus:"pushesLeft--;", explanation:"-- subtracts one. The turn only ends when pushesLeft reaches 0, which is how +2 and +4 cards give extra pushes." },
    { title:"Check for a win", kind:"Java", focus:"public int checkForWin()", explanation:"Checks every row, every column and both diagonals for five matching tokens. It returns the winner, or BLANK if nobody has won." },
    { title:"Anti-diagonal index", kind:"Java", focus:"grid[DIM-1-i][i]", explanation:"As i goes 0 to 4, the row goes 4 to 0 while the column goes 0 to 4. That walks from bottom-left to top-right." },
    { title:"Streams", kind:"Java", focus:"public boolean isFull()", explanation:"A stream processes data like a pipeline: turn the 2D grid into one stream of ints, then noneMatch asks 'is no cell BLANK?'. That is true only when the board is full." },
    { title:"Method reference", kind:"Java", focus:".flatMapToInt(Arrays::stream)", explanation:"Arrays::stream is a short way to write the lambda row -> Arrays.stream(row). flatMap joins all the rows into one long stream." },
    { title:"Text debugging", kind:"Java", focus:"public void consoleDraw()", explanation:"Prints the board as text to the console. It is useful for testing the rules without running the Android screen." },
    { title:"Ask the AI for a hint", kind:"Java", focus:"public char getSuggestedMove()", explanation:"Creates a ComputerPlayer for whoever's turn it is and asks for its best push." },
  ],
  "logic/PowerCard.java": [
    { title:"enum", kind:"Java", focus:"public enum PowerCard", explanation:"An enum is a type with a fixed list of values. A PowerCard can only ever be SKIP, REVERSE, PLUS_TWO or PLUS_FOUR, and the compiler checks that for you." },
    { title:"Enum constants with data", kind:"Java", focus:"SKIP(\"SKIP\", 0, true)", explanation:"Each constant passes values to the enum's constructor: the label drawn on the card, how many extra pushes it gives, and whether it skips the opponent." },
    { title:"+4 combines both effects", kind:"Java", focus:"PLUS_FOUR(\"+4\", 1, true)", explanation:"One extra push this turn AND the opponent is skipped. GameBoard reads these fields, so adding a new card means adding one line here." },
    { title:"Public final fields", kind:"Java", focus:"public final int extraPushes;", explanation:"final fields can be public safely because nobody can change them after construction. Other classes read card.extraPushes directly." },
    { title:"Enum constructor", kind:"Java", focus:"PowerCard(String label, int extraPushes, boolean skipsOpponent)", explanation:"Enum constructors are always private. Java calls this once for each constant listed at the top; you can never write new PowerCard(...)." },
  ],
  "logic/ComputerPlayer.java": [
    { title:"The AI class", kind:"Pattern", focus:"public class ComputerPlayer", explanation:"This class only does logic: given a GameBoard, choose the best action. It never draws or touches the screen, which is why it can run on a background thread." },
    { title:"Search depth limit", kind:"Java", focus:"public static final int MAX_DEPTH = 7;", explanation:"The AI looks at most 7 pushes ahead. Each extra level multiplies the work by about 10, so deeper searches get slow very quickly." },
    { title:"Score for a win", kind:"Java", focus:"private static final int WIN = 1_000_000;", explanation:"Underscores in number literals are just for readability: 1_000_000 is one million. A win is scored far higher than any normal position." },
    { title:"Line weights", kind:"Java", focus:"private static final int[] LINE_WEIGHT", explanation:"How much a line is worth by how many of my tokens are in it (0 to 5). The weights grow quickly, so 4 in a line matters much more than two lines of 2." },
    { title:"Custom exception", kind:"Java", focus:"private static class TimeUp extends RuntimeException", explanation:"When time runs out deep inside the recursion, throwing an exception is the quickest way to jump all the way back out. Turning off the stack trace makes it cheap." },
    { title:"Nested Action class", kind:"Java", focus:"public static class Action", explanation:"An action is either playing a card or pushing a token. If card is null, it is a push. A static nested class keeps this small helper type inside the class that uses it." },
    { title:"Static factory methods", kind:"Pattern", focus:"static Action card(PowerCard c)", explanation:"Action.card(...) and Action.push(...) read more clearly than calling the private constructor with a null or a blank character." },
    { title:"Who am I?", kind:"Java", focus:"public ComputerPlayer(int me)", explanation:"The constructor stores which player the AI is and works out the opponent with a ternary operator." },
    { title:"Iterative deepening", kind:"Pattern", focus:"private Action iterativeDeepening(", explanation:"Search 1 push deep, then 2, then 3... and keep the best answer from the deepest search that finished in time. The computer always has a move ready, whatever the phone's speed." },
    { title:"Shuffle for variety", kind:"Java", focus:"Collections.shuffle(actions);", explanation:"When several moves score the same, a shuffled order means the computer won't play the identical game every time." },
    { title:"Best move first", kind:"Pattern", focus:"actions.add(0, best);", explanation:"Moving last round's best move to the front makes the next, deeper search find good scores early, which lets alpha-beta skip much more work." },
    { title:"Catching the timeout", kind:"Java", focus:"} catch (TimeUp e) {", explanation:"If TimeUp is thrown during a deeper search, the loop stops and keeps the best move from the last search that finished." },
    { title:"Minimax", kind:"Pattern", focus:"private int minimax(GameBoard board, int depth, int alpha, int beta)", explanation:"A recursive method: it calls itself for every possible next action. On the computer's turn it picks the highest score; on the human's turn it assumes the human picks the lowest score for the computer." },
    { title:"Out of time", kind:"Java", focus:"throw new TimeUp();", explanation:"Every call checks the clock first. Once the deadline passes, the exception unwinds the whole search instantly." },
    { title:"Prefer faster wins", kind:"Java", focus:"return WIN + depth;", explanation:"depth is larger when fewer moves have been made, so a win found sooner scores higher. The AI goes for the quickest win and delays losses as long as possible." },
    { title:"Whose turn in the search?", kind:"Java", focus:"boolean maximizing = board.getCurrentPlayer() == me;", explanation:"The board copy itself says whose turn it is, so skips and extra pushes from power cards are handled automatically." },
    { title:"Alpha-beta pruning", kind:"Pattern", focus:"if (alpha >= beta) {", explanation:"alpha is the best the computer is already guaranteed; beta is the best the human is guaranteed. If they cross, the other player would never allow this line, so the rest of it can be skipped." },
    { title:"EnumSet removes duplicates", kind:"Java", focus:"EnumSet.copyOf(hand)", explanation:"Holding two SKIP cards gives the same choice twice. Copying the hand into an EnumSet keeps each card type once, so the AI doesn't search identical branches." },
    { title:"Try an action on a copy", kind:"Java", focus:"private GameBoard apply(GameBoard board, Action a)", explanation:"Makes a new GameBoard with the copy constructor and applies the action to it. The original board is never touched." },
    { title:"Evaluation function", kind:"Pattern", focus:"int evaluate(GameBoard board)", explanation:"When the search stops before anyone wins, this guesses how good the position is: lines only I occupy are good, cards in hand are worth something, and having extra pushes is an advantage." },
    { title:"Score one line", kind:"Java", focus:"private int scoreLine(GameBoard board, int row, int col, int dRow, int dCol)", explanation:"dRow and dCol give the direction: (0,1) is a row, (1,0) a column, (1,1) and (-1,1) the diagonals. One method handles all 12 lines." },
    { title:"Value of cards in hand", kind:"Java", focus:"private int handValue(List<PowerCard> hand)", explanation:"Each card adds points (+4 is worth the most), so the AI doesn't throw cards away unless they really help." },
  ],
  "ui/GridButton.java": [
    { title:"RectF hit box", kind:"Android", focus:"private final RectF bounds;", explanation:"RectF is a rectangle with decimal coordinates. The same rectangle is used for drawing and for tap testing, so what you see matches what you can tap." },
    { title:"Encapsulated label", kind:"Java", focus:"private final char label;", explanation:"private means only GridButton can see this field directly; final means it never changes. Other classes read it through getLabel()." },
    { title:"Defensive copy", kind:"Java", focus:"return new RectF(bounds);", explanation:"Returning a new copy means other classes can't accidentally move this button by changing the rectangle they were given." },
    { title:"Constructor", kind:"Java", focus:"public GridButton(char label, float x, float y, float width, float height, Resources resources)", explanation:"Builds one button. SecondView calls this ten times with different labels and positions; the class design is shared." },
    { title:"Scale images once", kind:"Android", focus:"Bitmap.createScaledBitmap(originalUnpressed", explanation:"Images are loaded and resized once in the constructor, not every frame in onDraw, which would be very slow." },
    { title:"contains method", kind:"Android", focus:"return bounds.contains(x,y);", explanation:"Android gives a touch coordinate. RectF.contains answers whether that point is inside this button." },
    { title:"Pick the image", kind:"Java", focus:"Bitmap imageToDraw = isPressed ? pressedButton : unpressedButton;", explanation:"The ternary operator picks the pressed image if isPressed is true, otherwise the normal one." },
  ],
  "Tokenzz.java": [
    { title:"A token listens to ticks", kind:"Pattern", focus:"public class Tokenzz implements TickListener", explanation:"Each token is an observer: AnimationHandler calls its onTick every frame, and the token moves itself a little." },
    { title:"Static nested class", kind:"Java", focus:"public static class GridPosition", explanation:"A small helper type that groups a row and a column together. It lives inside Tokenzz because only tokens use it." },
    { title:"Shared moving count", kind:"Java", focus:"private static int movers = 0;", explanation:"static means one value shared by every token. It counts how many tokens are moving, so the game can ask anyTokensMoving() without looping through them all." },
    { title:"Velocity vector", kind:"Android", focus:"private PointF velocity;", explanation:"PointF stores decimal x and y. (0, 12) moves down 12 pixels per frame and (12, 0) moves right, because on Android y grows downward." },
    { title:"Start moving", kind:"Java", focus:"public void startMoving(float x, float y, RectF", explanation:"Gives the token a speed and a destination square. The if (!moving) check makes sure a token is counted in movers only once." },
    { title:"Stop moving", kind:"Java", focus:"public void stopMoving()", explanation:"The opposite of startMoving: mark it stopped and lower the shared count, but only if it was moving, so the count can't go wrong." },
    { title:"Off the screen?", kind:"Android", focus:"public boolean isInvisible(int screenHeight)", explanation:"Once the token's top edge is below the bottom of the screen, it can't be seen and SecondView removes it." },
    { title:"onTick", kind:"Pattern", focus:"public void onTick() {", explanation:"This is the method TickListener requires. Each tick just calls move()." },
    { title:"Private constructor", kind:"Pattern", focus:"private Tokenzz(Builder builder)", explanation:"Because the constructor is private, the only way to create a token is through the Builder. It copies the rectangles so the token owns its own data." },
    { title:"Builder class", kind:"Pattern", focus:"public static class Builder", explanation:"The Builder collects the setup values one named method at a time, then build() creates the finished token." },
    { title:"Method chaining", kind:"Java", focus:"public Builder images(", explanation:"Each builder method ends with return this, returning the same Builder. That is what lets you chain .images(...).player(...).build() in one statement." },
    { title:"Build the token", kind:"Pattern", focus:"public Tokenzz build()", explanation:"Passes the finished Builder to the private constructor and returns the new token." },
    { title:"Move one frame", kind:"Java", focus:"public void move()", explanation:"Moves the token one step. A stopped token returns immediately; a falling token keeps falling; otherwise it slides toward its destination square." },
    { title:"Gravity", kind:"Java", focus:"velocity.y *= 2.0f;", explanation:"*= 2 doubles the downward speed every frame, so a token pushed off the board accelerates like it's falling." },
    { title:"Overshoot protection", kind:"Java", focus:"boolean closeEnoughX = velocity.x == 0", explanation:"A 12-pixel step can jump past the exact target. This asks whether the token is within one step of it, then snaps it exactly into place." },
    { title:"Pushed off the board", kind:"Java", focus:"boolean offGrid = position.row > 'E' || position.column > '5';", explanation:"Characters can be compared like numbers. Past row E or column 5 means the token was pushed off the board, so it starts falling instead of stopping." },
  ],
  "ui/AnimationHandler.java": [
    { title:"extends Handler", kind:"Android", focus:"public class AnimationHandler extends Handler", explanation:"A Handler receives messages and runs code for them on a chosen thread. This one turns each message into one animation frame." },
    { title:"Listener list", kind:"Pattern", focus:"private final ArrayList<TickListener> listeners;", explanation:"Observer pattern: everything that wants ticks (SecondView and every token) is stored here. The handler doesn't need to know what each one does." },
    { title:"Handler on UI thread", kind:"Android", focus:"super(Looper.getMainLooper());", explanation:"Views may only be changed on the main thread. Passing the main Looper makes every frame run there safely." },
    { title:"Subscribe", kind:"Pattern", focus:"public void register(TickListener listener)", explanation:"Adds a listener. SecondView registers itself, and each new token is registered when it is created." },
    { title:"Unsubscribe", kind:"Pattern", focus:"public void deregister(TickListener listener)", explanation:"Removes a listener, for example a token that fell off the screen or a token cleared by a reset." },
    { title:"Pause", kind:"Java", focus:"public void setPaused(boolean paused)", explanation:"When the game ends, the loop is paused so it stops using battery. this.paused means the field, not the parameter with the same name." },
    { title:"One frame", kind:"Android", focus:"public void handleMessage(Message message)", explanation:"Android calls this when a message arrives. If not paused, it ticks every listener and then schedules the next message." },
    { title:"Loop over a copy", kind:"Java", focus:"for (TickListener listener : new ArrayList<>(listeners))", explanation:"A listener might register or deregister during its onTick. Looping over a copy avoids a ConcurrentModificationException." },
    { title:"About 60 frames per second", kind:"Android", focus:"sendEmptyMessageDelayed(0,16);", explanation:"Sends the next message 16 milliseconds from now. 1000 / 16 ≈ 60 frames each second, which looks smooth." },
  ],
  "ui/TickListener.java": [
    { title:"Interface contract", kind:"Java", focus:"public interface TickListener", explanation:"An interface lists a promise without implementation. Any class that implements TickListener must provide onTick." },
    { title:"Observer pattern", kind:"Pattern", focus:"void onTick();", explanation:"AnimationHandler notifies all registered TickListeners. One publisher sends a tick; SecondView and every token respond independently." },
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
