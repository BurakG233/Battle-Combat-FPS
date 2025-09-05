export class BotManager {
  constructor(scene) {
    this.scene = scene;
    this.bots = [];
    this.geo = new THREE.BoxGeometry(1, 2, 1);
    this.mat = new THREE.MeshStandardMaterial({ color: 0xff4444 });
  }

  spawn(position = new THREE.Vector3((Math.random()-0.5)*60, 1, (Math.random()-0.5)*60)) {
    const mesh = new THREE.Mesh(this.geo, this.mat.clone());
    mesh.position.copy(position);
    const bot = { mesh, health: 100, speed: 0.03+Math.random()*0.02, alive: true, lastHitTime: 0 };
    this.scene.add(mesh);
    this.bots.push(bot);
  }

  update(dt, playerPos) {
    for (const b of this.bots) {
      if (!b.alive) continue;
      const dir = new THREE.Vector3().subVectors(playerPos, b.mesh.position);
      dir.y = 0;
      if (dir.length() > 0.01) dir.normalize();
      b.mesh.position.addScaledVector(dir, b.speed * dt * 60);

      if (performance.now()-b.lastHitTime<120) b.mesh.material.emissive = new THREE.Color(0x660000);
      else b.mesh.material.emissive = new THREE.Color(0x000000);
    }
  }

  raycastHit(raycaster, damage) {
    const hits = raycaster.intersectObjects(this.bots.filter(b=>b.alive).map(b=>b.mesh));
    if (!hits.length) return null;
    const bot = this.bots.find(b=>b.mesh===hits[0].object);
    bot.health -= damage; bot.lastHitTime=performance.now();
    if (bot.health<=0) { bot.alive=false; bot.mesh.material.color.set(0x222222); }
    return bot;
  }

  cleanupDead() {
    this.bots=this.bots.filter(b=>{
      if(!b.alive){ this.scene.remove(b.mesh); return false; }
      return true;
    });
  }
}
