const files = [
  ["ui/MainActivity.java", "Starts the Android screen."],
  ["ui/SecondView.java", "Draws the board and receives taps."],
  ["ui/GridButton.java", "Knows one edge button’s shape and image."],
  ["Tokenzz.java", "Draws and animates one fruit token."],
  ["logic/GameBoard.java", "Stores rules, turns, and win checks."],
  ["res/drawable", "Holds fruit and button images."],
] as const;

export function ProjectMap() {
  return (
    <section className="project-map" aria-labelledby="map-heading">
      <p className="eyebrow">YOUR CURRENT PROJECT</p>
      <h2 id="map-heading">Know where each piece belongs</h2>
      <div className="map-flow" aria-label="Project flow">Tap → rules update → token moves → screen redraws</div>
      <div className="file-grid">
        {files.map(([file, description]) => (
          <div className="file-item" key={file}>
            <code>{file}</code><span>{description}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
