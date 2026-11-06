export type FinalFile = { path: string; purpose: string; code: string };

export const finalAndroidFiles: FinalFile[] = [
  { path: "logic/Player.java", purpose: "Names the three possible values in a board square.", code: `package edu.byuh.mc.cis.cs300.frogameproject.logic;

public final class Player {
    private Player() { }

    public static final int X = 0;
    public static final int O = 1;
    public static final int BLANK = 2;

    public static String toString(int player) {
        if (player == X) return "X";
        if (player == O) return "O";
        return "BLANK";
    }
}` },
  { path: "logic/GameBoard.java", purpose: "The source of truth for turns, moves, wins, ties, and resetting.", code: `package edu.byuh.mc.cis.cs300.frogameproject.logic;

public class GameBoard {
    public static final int DIM = 5;
    private final int[][] grid = new int[DIM][DIM];
    private int currentPlayer;

    public GameBoard() { reset(); }

    public void reset() {
        for (int row = 0; row < DIM; row++) {
            for (int column = 0; column < DIM; column++) {
                grid[row][column] = Player.BLANK;
            }
        }
        currentPlayer = Player.X;
    }

    public int getCurrentPlayer() { return currentPlayer; }

    public void submitMove(char label) {
        int player = currentPlayer;
        if (label >= '1' && label <= '5') insertFromTop(label, player);
        else if (label >= 'A' && label <= 'E') insertFromLeft(label, player);
        else return;
        currentPlayer = currentPlayer == Player.X ? Player.O : Player.X;
    }

    private void insertFromTop(char label, int player) {
        int column = label - '1';
        int carry = player;
        for (int row = 0; row < DIM; row++) {
            int oldValue = grid[row][column];
            grid[row][column] = carry;
            if (oldValue == Player.BLANK) return;
            carry = oldValue;
        }
    }

    private void insertFromLeft(char label, int player) {
        int row = label - 'A';
        int carry = player;
        for (int column = 0; column < DIM; column++) {
            int oldValue = grid[row][column];
            grid[row][column] = carry;
            if (oldValue == Player.BLANK) return;
            carry = oldValue;
        }
    }

    public int checkForWin() {
        for (int i = 0; i < DIM; i++) {
            int rowWinner = grid[i][0];
            if (rowWinner != Player.BLANK && allEqualRow(i, rowWinner)) return rowWinner;
            int columnWinner = grid[0][i];
            if (columnWinner != Player.BLANK && allEqualColumn(i, columnWinner)) return columnWinner;
        }
        int diagonal = grid[0][0];
        if (diagonal != Player.BLANK && allEqualMainDiagonal(diagonal)) return diagonal;
        diagonal = grid[DIM - 1][0];
        if (diagonal != Player.BLANK && allEqualOtherDiagonal(diagonal)) return diagonal;
        return Player.BLANK;
    }

    private boolean allEqualRow(int row, int value) {
        for (int column = 1; column < DIM; column++) if (grid[row][column] != value) return false;
        return true;
    }
    private boolean allEqualColumn(int column, int value) {
        for (int row = 1; row < DIM; row++) if (grid[row][column] != value) return false;
        return true;
    }
    private boolean allEqualMainDiagonal(int value) {
        for (int i = 1; i < DIM; i++) if (grid[i][i] != value) return false;
        return true;
    }
    private boolean allEqualOtherDiagonal(int value) {
        for (int i = 1; i < DIM; i++) if (grid[DIM - 1 - i][i] != value) return false;
        return true;
    }

    public boolean isFull() {
        for (int[] row : grid) for (int square : row) if (square == Player.BLANK) return false;
        return true;
    }
}` },
  { path: "ui/GridButton.java", purpose: "A drawable edge-control button with a label and tap rectangle.", code: `package edu.byuh.mc.cis.cs300.frogameproject.ui;

import android.content.res.Resources;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.graphics.Canvas;
import android.graphics.RectF;
import edu.byuh.mc.cis.cs300.frogameproject.R;

public class GridButton {
    private final char label;
    private final RectF bounds;
    private final Bitmap unpressed;
    private final Bitmap pressed;
    private boolean isPressed;

    public GridButton(char label, float x, float y, float width, float height, Resources resources) {
        this.label = label;
        bounds = new RectF(x, y, x + width, y + height);
        Bitmap normal = BitmapFactory.decodeResource(resources, R.drawable.unpressed_button);
        Bitmap down = BitmapFactory.decodeResource(resources, R.drawable.pressed_button);
        unpressed = Bitmap.createScaledBitmap(normal, (int) width, (int) height, true);
        pressed = Bitmap.createScaledBitmap(down, (int) width, (int) height, true);
    }

    public boolean contains(float x, float y) { return bounds.contains(x, y); }
    public RectF getBounds() { return new RectF(bounds); }
    public char getLabel() { return label; }
    public void press() { isPressed = true; }
    public void release() { isPressed = false; }
    public void draw(Canvas canvas) { canvas.drawBitmap(isPressed ? pressed : unpressed, bounds.left, bounds.top, null); }
}` },
  { path: "Tokenzz.java", purpose: "One visual fruit token. It moves toward a destination one frame at a time.", code: `package edu.byuh.mc.cis.cs300.frogameproject;

import android.graphics.Bitmap;
import android.graphics.Canvas;
import android.graphics.Paint;
import android.graphics.PointF;
import android.graphics.RectF;

public class Tokenzz {
    public static final int PLAYER_X = 0;
    public static final int PLAYER_O = 1;
    private static int movingCount = 0;

    public char row;
    public char column;
    private final Bitmap xImage;
    private final Bitmap oImage;
    private final int player;
    private final RectF bounds;
    private final RectF destination;
    private final PointF velocity = new PointF();
    private final Paint paint = new Paint(Paint.ANTI_ALIAS_FLAG);
    private boolean moving;

    public Tokenzz(Bitmap xImage, Bitmap oImage, RectF startBounds, int player, char row, char column) {
        this.xImage = xImage;
        this.oImage = oImage;
        this.player = player;
        this.row = row;
        this.column = column;
        bounds = new RectF(startBounds);
        destination = new RectF(startBounds);
    }

    public static boolean anyTokensMoving() { return movingCount > 0; }

    public void startMoving(float xSpeed, float ySpeed, RectF newDestination) {
        if (!moving) movingCount++;
        velocity.set(xSpeed, ySpeed);
        destination.set(newDestination);
        moving = true;
    }

    public void move() {
        if (!moving) return;
        bounds.offset(velocity.x, velocity.y);
        boolean closeX = velocity.x == 0 || Math.abs(bounds.left - destination.left) <= Math.abs(velocity.x);
        boolean closeY = velocity.y == 0 || Math.abs(bounds.top - destination.top) <= Math.abs(velocity.y);
        if (closeX && closeY) {
            bounds.set(destination);
            velocity.set(0, 0);
            moving = false;
            movingCount--;
        }
    }

    public void draw(Canvas canvas) {
        canvas.drawBitmap(player == PLAYER_X ? xImage : oImage, null, bounds, paint);
    }
}` },
  { path: "ui/AnimationHandler.java", purpose: "Schedules the next animation frame only while a token is moving.", code: `package edu.byuh.mc.cis.cs300.frogameproject.ui;

import android.os.Handler;
import android.os.Looper;

public class AnimationHandler extends Handler {
    private static final long FRAME_DELAY = 16L;
    private final Runnable frame;

    public AnimationHandler(Runnable frame) {
        super(Looper.getMainLooper());
        this.frame = frame;
    }

    public void start() {
        removeCallbacksAndMessages(null);
        post(frame);
    }

    public void nextFrame() { postDelayed(frame, FRAME_DELAY); }
    public void stop() { removeCallbacksAndMessages(null); }
}` },
  { path: "ui/MainActivity.java", purpose: "Starts the custom game view.", code: `package edu.byuh.mc.cis.cs300.frogameproject.ui;

import android.app.Activity;
import android.os.Bundle;

public class MainActivity extends Activity {
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(new SecondView(this));
    }
}` },
  { path: "ui/SecondView.java", purpose: "Connects touch input, GameBoard rules, drawing, tokens, and animation.", code: `package edu.byuh.mc.cis.cs300.frogameproject.ui;

import android.content.Context;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.graphics.Canvas;
import android.graphics.Color;
import android.graphics.Paint;
import android.graphics.RectF;
import android.view.MotionEvent;
import android.view.View;
import android.widget.Toast;
import java.util.ArrayList;
import edu.byuh.mc.cis.cs300.frogameproject.R;
import edu.byuh.mc.cis.cs300.frogameproject.Tokenzz;
import edu.byuh.mc.cis.cs300.frogameproject.logic.GameBoard;
import edu.byuh.mc.cis.cs300.frogameproject.logic.Player;

public class SecondView extends View {
    private final ArrayList<Tokenzz> tokens = new ArrayList<>();
    private final GameBoard board = new GameBoard();
    private final Bitmap durian;
    private final Bitmap persimmon;
    private final AnimationHandler animationHandler;
    private GridButton[] buttons;
    private boolean gameOver;
    private static final float SPEED = 12.0f;

    public SecondView(Context context) {
        super(context);
        durian = BitmapFactory.decodeResource(getResources(), R.drawable.duriankawaii);
        persimmon = BitmapFactory.decodeResource(getResources(), R.drawable.persimmonkawaii);
        animationHandler = new AnimationHandler(this::updateAnimation);
    }

    private void updateAnimation() {
        for (Tokenzz token : tokens) token.move();
        invalidate();
        if (Tokenzz.anyTokensMoving()) animationHandler.nextFrame();
    }

    @Override protected void onSizeChanged(int w, int h, int oldW, int oldH) {
        float side = .90f * Math.min(w, h);
        float cell = side / 6f;
        float left = (w - side) / 2f;
        float top = (h - side) / 2f;
        buttons = new GridButton[10];
        for (int i = 0; i < 5; i++) buttons[i] = new GridButton((char) ('1' + i), left + cell + i * cell, top, cell, cell, getResources());
        for (int i = 0; i < 5; i++) buttons[5 + i] = new GridButton((char) ('A' + i), left, top + cell + i * cell, cell, cell, getResources());
    }

    @Override public boolean onTouchEvent(MotionEvent event) {
        if (event.getAction() == MotionEvent.ACTION_UP && buttons != null) {
            for (GridButton button : buttons) button.release();
            invalidate();
            return true;
        }
        if (event.getAction() != MotionEvent.ACTION_DOWN || gameOver || Tokenzz.anyTokensMoving() || buttons == null) return true;
        for (GridButton button : buttons) {
            if (button.contains(event.getX(), event.getY())) {
                button.press();
                makeMove(button.getLabel(), button.getBounds());
                invalidate();
                return true;
            }
        }
        Toast.makeText(getContext(), "Touch a numbered or lettered button.", Toast.LENGTH_SHORT).show();
        return true;
    }

    private void makeMove(char label, RectF startBounds) {
        int player = board.getCurrentPlayer();
        Tokenzz token = new Tokenzz(durian, persimmon, shrink(startBounds), player,
                label >= '1' && label <= '5' ? '@' : label,
                label >= '1' && label <= '5' ? label : '0');
        tokens.add(token);
        if (label >= '1' && label <= '5') slideDown(token, label);
        else slideRight(token, label);
        board.submitMove(label);
        animationHandler.start();
        int winner = board.checkForWin();
        if (winner != Player.BLANK) finish(Player.toString(winner) + " wins!");
        else if (board.isFull()) finish("Tie game!");
    }

    private void finish(String message) {
        gameOver = true;
        Toast.makeText(getContext(), message, Toast.LENGTH_LONG).show();
    }

    private Tokenzz findTokenAt(char row, char column) {
        for (Tokenzz token : tokens) if (token.row == row && token.column == column) return token;
        return null;
    }
    private void slideDown(Tokenzz newToken, char column) {
        ArrayList<Tokenzz> moving = new ArrayList<>();
        moving.add(newToken);
        for (char row = 'A'; row <= 'E'; row++) { Tokenzz token = findTokenAt(row, column); if (token == null) break; moving.add(token); }
        for (Tokenzz token : moving) { token.row++; token.startMoving(0, SPEED, cellBounds(token.row - 'A', token.column - '1')); }
    }
    private void slideRight(Tokenzz newToken, char row) {
        ArrayList<Tokenzz> moving = new ArrayList<>();
        moving.add(newToken);
        for (char column = '1'; column <= '5'; column++) { Tokenzz token = findTokenAt(row, column); if (token == null) break; moving.add(token); }
        for (Tokenzz token : moving) { token.column++; token.startMoving(SPEED, 0, cellBounds(token.row - 'A', token.column - '1')); }
    }
    private RectF shrink(RectF rectangle) { float pad = rectangle.width() * .10f; return new RectF(rectangle.left + pad, rectangle.top + pad, rectangle.right - pad, rectangle.bottom - pad); }
    private RectF cellBounds(int row, int column) {
        float side = .90f * Math.min(getWidth(), getHeight()); float cell = side / 6f;
        float left = (getWidth() - side) / 2f + cell + column * cell; float top = (getHeight() - side) / 2f + cell + row * cell;
        float pad = cell * .10f; return new RectF(left + pad, top + pad, left + cell - pad, top + cell - pad);
    }
    @Override protected void onDraw(Canvas canvas) {
        canvas.drawColor(Color.WHITE); Paint paint = new Paint(); paint.setColor(Color.BLACK); paint.setStyle(Paint.Style.STROKE); paint.setStrokeWidth(.01f * Math.min(getWidth(), getHeight()));
        float side = .90f * Math.min(getWidth(), getHeight()), cell = side / 6f, left = (getWidth() - side) / 2f + cell, top = (getHeight() - side) / 2f + cell;
        for (int i = 0; i <= 5; i++) { canvas.drawLine(left + i * cell, top, left + i * cell, top + 5 * cell, paint); canvas.drawLine(left, top + i * cell, left + 5 * cell, top + i * cell, paint); }
        for (Tokenzz token : tokens) token.draw(canvas);
        if (buttons != null) for (GridButton button : buttons) button.draw(canvas);
    }
    @Override protected void onDetachedFromWindow() { animationHandler.stop(); super.onDetachedFromWindow(); }
}` },
];
