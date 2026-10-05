// @mpheadley/books — the ONE 3D shelf. Vanilla three.js, no framework.
// Used by: the standalone demo page (demo/3d-shelf.html) and, through Book3D.tsx,
// every site that shows books. Change behavior here; everything updates.
import * as THREE from 'three';

const W = 3, H = 4.5, D = 0.3, GAP = 1.1;

/**
 * mountShelf(el, { books, base, interactive, onLabel })
 *   books: [{ key, title, subtitle? }]   key → textures at `${base}${key}-{front,spine,back}.webp`
 *   base:  URL prefix for textures (default '/images/books/3d/')
 *   onLabel(book|null): called when hover changes (for captions)
 * Returns { dispose() }.
 */
export function mountShelf(el, { books, base = '/images/books/3d/', interactive = true, onLabel } = {}) {
  const n = books.length;
  const span = n * W + (n - 1) * GAP;
  const reduce = typeof matchMedia !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches;

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  const cv = renderer.domElement;
  cv.style.touchAction = 'pan-y';
  cv.setAttribute('role', 'img');
  cv.setAttribute('aria-label', `${books.map(b => b.title).join(', ')} — drag a book to turn it`);
  el.appendChild(cv);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(32, 1, 0.1, 100);

  // Fixed lights: shelf and camera never move, so shadows shift only as books turn.
  scene.add(new THREE.HemisphereLight(0xfff4e6, 0x1a1612, 0.95));
  const key = new THREE.DirectionalLight(0xfff1dc, 2.3);
  key.position.set(5, 8, 8);
  key.castShadow = true;
  key.shadow.mapSize.set(2048, 2048);
  const sc = span / 2 + 3;
  Object.assign(key.shadow.camera, { left: -sc, right: sc, top: 7, bottom: -7 });
  key.shadow.bias = -0.0005;
  scene.add(key);
  const rim = new THREE.DirectionalLight(0xc9a96e, 0.7);
  rim.position.set(-6, 3, -5);
  scene.add(rim);

  const loader = new THREE.TextureLoader();
  // Stage: shelf + books slide together so a grabbed book comes to center.
  const stage = new THREE.Group();
  scene.add(stage);
  const woodTex = loader.load(`${base}shelf-wood.webp`);
  woodTex.colorSpace = THREE.SRGBColorSpace;
  woodTex.wrapS = woodTex.wrapT = THREE.RepeatWrapping;
  woodTex.anisotropy = 8;
  woodTex.repeat.set((span + 2.4) / 4, 1.6);
  const shelf = new THREE.Mesh(
    new THREE.BoxGeometry(span + 2.4, 0.32, n > 1 ? 3.6 : 2.4),
    new THREE.MeshStandardMaterial({ map: woodTex, color: 0xd9b48a, roughness: 0.75 })
  );
  shelf.position.y = -H / 2 - 0.16;
  shelf.receiveShadow = true;
  stage.add(shelf);

  const tex = f => {
    const t = loader.load(`${base}${f}.webp`);
    t.colorSpace = THREE.SRGBColorSpace;
    t.anisotropy = 8;
    return t;
  };
  const pc = document.createElement('canvas');
  pc.width = 64; pc.height = 512;
  const g = pc.getContext('2d');
  g.fillStyle = '#efe6d2'; g.fillRect(0, 0, 64, 512);
  for (let x = 0; x < 64; x += 2) { g.fillStyle = `rgba(120,100,70,${0.05 + Math.random() * 0.12})`; g.fillRect(x, 0, 1, 512); }
  const pagesTex = new THREE.CanvasTexture(pc);
  pagesTex.colorSpace = THREE.SRGBColorSpace;
  const pageMat = new THREE.MeshStandardMaterial({ map: pagesTex, roughness: 0.95 });
  const mat = t => new THREE.MeshStandardMaterial({ map: t, roughness: 0.55 });

  const states = books.map((item, i) => {
    // BoxGeometry faces: +x, -x, +y, -y, +z, -z
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(W, H, D), [
      pageMat, mat(tex(`${item.key}-spine`)), pageMat, pageMat, mat(tex(`${item.key}-front`)), mat(tex(`${item.key}-back`)),
    ]);
    mesh.castShadow = true;
    mesh.userData.i = i;
    const pivot = new THREE.Group();
    pivot.add(mesh);
    stage.add(pivot);
    return { item, mesh, pivot, x: (i - (n - 1) / 2) * (W + GAP), ry: 0, vry: 0, rx: 0, vrx: 0, lift: 0, vlift: 0, face: 0, held: false };
  });

  const size = () => {
    const w = el.clientWidth, h = el.clientHeight;
    if (!w || !h) return;
    renderer.setSize(w, h, false);
    cv.style.width = '100%'; cv.style.height = '100%';
    camera.aspect = w / h;
    const tan = Math.tan(THREE.MathUtils.degToRad(camera.fov / 2));
    const fitH = (H + 1.4) / 2 / tan;
    const fitW = (span + 1.8) / 2 / (tan * camera.aspect);
    camera.position.set(0, 0.8, Math.max(fitH, fitW));
    camera.lookAt(0, -0.2, 0);
    camera.updateProjectionMatrix();
  };
  size();
  const ro = new ResizeObserver(size);
  ro.observe(el);

  const ray = new THREE.Raycaster(), p = new THREE.Vector2();
  const pick = e => {
    const r = cv.getBoundingClientRect();
    p.set(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1);
    ray.setFromCamera(p, camera);
    const hit = ray.intersectObjects(states.map(s => s.mesh))[0];
    return hit ? states[hit.object.userData.i] : null;
  };
  const spring = (x, v, t, k, c, dt) => { v += (-k * (x - t) - c * v) * dt; return [x + v * dt, v]; };

  let held = null, hovered = null, stageX = 0, vStageX = 0, stageTarget = 0;
  let last = [0, 0], down = [0, 0, 0];
  const setHover = s => {
    if (s === hovered) return;
    hovered = s;
    cv.style.cursor = s ? 'grab' : 'default';
    if (onLabel) onLabel(s ? s.item : null);
  };
  const onDown = e => {
    if (!interactive) return;
    const s = pick(e);
    if (!s) { stageTarget = 0; return; }
    if (n > 1) stageTarget = -s.x;     // slide the shelf so this book is centered
    held = s; s.held = true;
    last = [e.clientX, e.clientY]; down = [e.clientX, e.clientY, performance.now()];
    cv.setPointerCapture(e.pointerId);
    cv.style.cursor = 'grabbing';
  };
  const onMove = e => {
    if (held) {
      const dx = e.clientX - last[0], dy = e.clientY - last[1];
      last = [e.clientX, e.clientY];
      held.ry += dx * 0.014; held.vry = dx * 0.6;
      held.rx = THREE.MathUtils.clamp(held.rx + dy * 0.008, -0.6, 0.6); held.vrx = 0;
      return;
    }
    if (interactive) setHover(pick(e));
  };
  const onUp = e => {
    if (!held) return;
    const s = held; held = null; s.held = false;
    cv.style.cursor = hovered ? 'grab' : 'default';
    const moved = Math.hypot(e.clientX - down[0], e.clientY - down[1]);
    if (moved < 6 && performance.now() - down[2] < 450) { s.face = s.face ? 0 : Math.PI; s.vry += 6; return; }
    s.face = Math.round(s.ry / Math.PI) * Math.PI;   // gravity: settle to nearest face
  };
  const onLeave = () => { if (!held) setHover(null); };
  if (interactive) {
    cv.addEventListener('pointerdown', onDown);
    cv.addEventListener('pointermove', onMove);
    cv.addEventListener('pointerup', onUp);
    cv.addEventListener('pointercancel', onUp);
    cv.addEventListener('pointerleave', onLeave);
  }

  let raf = 0, visible = true;
  const io = new IntersectionObserver(([en]) => { visible = en.isIntersecting; });
  io.observe(el);
  const clock = new THREE.Clock();
  const tick = () => {
    raf = requestAnimationFrame(tick);
    if (!visible) { clock.getDelta(); return; }
    const dt = Math.min(clock.getDelta(), 0.033), t = clock.elapsedTime;
    [stageX, vStageX] = spring(stageX, vStageX, stageTarget, 40, 11, dt);
    stage.position.x = stageX;
    states.forEach((s, i) => {
      [s.lift, s.vlift] = spring(s.lift, s.vlift, s.held ? 1 : s === hovered ? 0.3 : 0, 90, 13, dt);
      if (!s.held) {
        [s.ry, s.vry] = spring(s.ry, s.vry, s.face, 60, 9, dt);
        [s.rx, s.vrx] = spring(s.rx, s.vrx, 0, 70, 10, dt);
      }
      const idle = s.held || s === hovered || reduce ? 0 : Math.sin(t * 0.6 + i) * 0.04;
      s.pivot.rotation.set(s.rx, (n > 1 ? -0.1 : -0.22) + s.ry + idle, 0);
      s.pivot.position.set(s.x, s.lift * 0.6, s.lift * 1.4);
    });
    renderer.render(scene, camera);
  };
  tick();

  return {
    dispose() {
      cancelAnimationFrame(raf); ro.disconnect(); io.disconnect();
      renderer.dispose(); cv.remove();
    },
  };
}
