export function html_generatePauseOverlay(): HTMLDivElement {
  const pauseOverlay = document.createElement("div");
  pauseOverlay.style.position = "fixed";
  pauseOverlay.style.width = "100%";
  pauseOverlay.style.height = "100vh";
  pauseOverlay.style.backgroundColor = "rgba(0,0,0,0.5)";
  pauseOverlay.style.display = "flex";
  pauseOverlay.style.justifyContent = "center";
  pauseOverlay.style.alignItems = "center";
  pauseOverlay.textContent = "PAUSED";
  pauseOverlay.style.font = "bold 4rem monospace, monospace";
  pauseOverlay.style.color = "#fff";

  return pauseOverlay;
}

export function html_getFPSDisplay(): HTMLElement | null {
  const fpsDisplay = document.getElementById("fps");
  if (!fpsDisplay) return null;

  fpsDisplay.style.position = "fixed";
  fpsDisplay.style.top = "0";
  fpsDisplay.style.color = "white";
  return fpsDisplay;
}
