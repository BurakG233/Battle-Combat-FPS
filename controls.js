function setupControls(camera, controls, scene) {
  document.addEventListener("keydown", (e) => {
    if (e.code === "Digit1") switchWeapon("knife", camera);
    if (e.code === "Digit2") switchWeapon("pistol", camera);
    if (e.code === "Digit3") switchWeapon("ak", camera);
    if (e.code === "KeyR") reload();
    if (e.code === "Space") attack(camera, scene);
  });
}