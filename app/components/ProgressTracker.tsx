type ProgressTrackerProps = { completed: number; total: number; onReset: () => void };

export function ProgressTracker({ completed, total, onReset }: ProgressTrackerProps) {
  const percent = Math.round((completed / total) * 100);
  return (
    <aside className="progress-card" aria-label="Learning progress">
      <div className="progress-ring" style={{ "--progress": `${percent}%` } as React.CSSProperties}>
        <span>{percent}%</span>
      </div>
      <div><p className="eyebrow">YOUR PROGRESS</p><h2>{completed} of {total} lessons</h2><p>Small, working steps build real confidence.</p></div>
      <button className="text-button" type="button" onClick={onReset}>Reset progress</button>
    </aside>
  );
}
