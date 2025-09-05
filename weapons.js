export const DAMAGE = { knife: 50, pistol: 25, ak: 20 };
export let currentWeapon = "knife";
export let ammo = { pistol: 15, ak: 30 };
export let reserve = { pistol: 45, ak: 90 };

let weaponMesh = null;

export function setWeaponText(type) {
  const weaponEl = document.getElementById("weapon");
  if (weaponEl) weaponEl.innerText = "Silah: " + (
    type === "knife" ? "Bıçak" :
    type === "pistol" ? "Tabanca" : "AK"
  );
}

export function updateAmmoUI() {
  const ammoEl = document.getElementById("ammo");
  if (!ammoEl) return;

  if (currentWeapon === "knife") ammoEl.innerText = "Mermi: ∞";
  else if (currentWeapon === "pistol") ammoEl.innerText = `Mermi: ${ammo.pistol}/${reserve.pistol}`;
  else ammoEl.innerText = `Mermi: ${ammo.ak}/${reserve.ak}`;
}

export function switchWeapon(type, camera) {
  currentWeapon = type;
  setWeaponText(type);
  updateAmmoUI();
  createWeaponMesh(type, camera);
}

export function createWeaponMesh(type, camera) {
  if (weaponMesh && weaponMesh.parent) {
    weaponMesh.parent.remove(weaponMesh);
  }

  let geo, mat;
  if (type === "knife") {
    geo = new THREE.BoxGeometry(0.08, 0.5, 0.06);
    mat = new THREE.MeshStandardMaterial({ color: 0xffffff });
  } else if (type === "pistol") {
    geo = new THREE.BoxGeometry(0.32, 0.2, 0.1);
    mat = new THREE.MeshStandardMaterial({ color: 0x333333 });
  } else {
    geo = new THREE.BoxGeometry(0.85, 0.22, 0.12);
    mat = new THREE.MeshStandardMaterial({ color: 0x222222 });
  }

  weaponMesh = new THREE.Mesh(geo, mat);
  weaponMesh.position.set(0.5, -0.5, -1);
  if (camera) camera.add(weaponMesh);
}

export function reload() {
  if (currentWeapon === "pistol") {
    const need = 15 - ammo.pistol;
    if (need > 0 && reserve.pistol > 0) {
      const take = Math.min(need, reserve.pistol);
      ammo.pistol += take; reserve.pistol -= take;
    }
  } else if (currentWeapon === "ak") {
    const need = 30 - ammo.ak;
    if (need > 0 && reserve.ak > 0) {
      const take = Math.min(need, reserve.ak);
      ammo.ak += take; reserve.ak -= take;
    }
  }
  updateAmmoUI();
}

export function spendAmmoIfNeeded() {
  if (currentWeapon === "knife") return true;
  if (currentWeapon === "pistol") {
    if (ammo.pistol <= 0) return false;
    ammo.pistol--; updateAmmoUI(); return true;
  }
  if (currentWeapon === "ak") {
    if (ammo.ak <= 0) return false;
    ammo.ak--; updateAmmoUI(); return true;
  }
  return true;
}
