
// === KAYOKO 3D CHARACTER ===
const player = new THREE.Group();
scene.add(player);

const makeMat = (color, roughness = 0.8) =>
  new THREE.MeshStandardMaterial({ color, roughness });

const colors = {
  hair: makeMat(0xe9eaf2),
  skin: makeMat(0xffd9c8),
  navy: makeMat(0x263b65),
  blue: makeMat(0x477fce),
  red: makeMat(0xd94c68),
  gold: makeMat(0xe5bd65),
  white: makeMat(0xffffff),
  dark: makeMat(0x273047),
  shoes: makeMat(0x34374b),
  blush: new THREE.MeshStandardMaterial({
    color: 0xf29ba8,
    transparent: true,
    opacity: 0.65
  })
};

function ellipsoid(parent, material, x, y, z, sx, sy, sz) {
  const m = new THREE.Mesh(
    new THREE.SphereGeometry(1, 24, 16),
    material
  );
  m.position.set(x, y, z);
  m.scale.set(sx, sy, sz);
  m.castShadow = true;
  parent.add(m);
  return m;
}

function partBox(parent, material, x, y, z, sx, sy, sz) {
  const m = new THREE.Mesh(
    new THREE.BoxGeometry(sx, sy, sz),
    material
  );
  m.position.set(x, y, z);
  m.castShadow = true;
  parent.add(m);
  return m;
}

function partCylinder(parent, material, x, y, z, rt, rb, h) {
  const m = new THREE.Mesh(
    new THREE.CylinderGeometry(rt, rb, h, 16),
    material
  );
  m.position.set(x, y, z);
  m.castShadow = true;
  parent.add(m);
  return m;
}

// Legs
for (const s of [-1, 1]) {
  partCylinder(player, colors.skin, s * 0.22, 0.43, 0, 0.14, 0.15, 0.72);
  partCylinder(player, colors.white, s * 0.22, 0.18, 0, 0.15, 0.15, 0.25);
  ellipsoid(player, colors.shoes, s * 0.22, 0.09, 0.12, 0.19, 0.09, 0.29);
}

// Navy pleated skirt
partCylinder(player, colors.navy, 0, 0.94, 0, 0.38, 0.65, 0.52);

// Skirt gold details
for (let i = 0; i < 8; i++) {
  const a = i * Math.PI / 4;
  const line = ellipsoid(
    player, colors.gold,
    Math.sin(a) * 0.48, 0.94, Math.cos(a) * 0.48,
    0.025, 0.24, 0.025
  );
}

// Jacket
partBox(player, colors.navy, 0, 1.68, 0, 0.78, 0.95, 0.42);

// Gold jacket buttons
for (let y = 1.48; y <= 1.85; y += 0.18) {
  ellipsoid(player, colors.gold, 0.08, y, 0.22, 0.035, 0.035, 0.025);
}

// Shirt and collar
partBox(player, colors.white, 0, 1.91, 0.225, 0.38, 0.3, 0.035);
partBox(player, colors.gold, -0.13, 2.02, 0.24, 0.12, 0.19, 0.04);
partBox(player, colors.gold, 0.13, 2.02, 0.24, 0.12, 0.19, 0.04);

// Arms and sleeves
for (const s of [-1, 1]) {
  ellipsoid(player, colors.navy, s * 0.49, 1.65, 0, 0.2, 0.47, 0.2);
  ellipsoid(player, colors.white, s * 0.49, 1.25, 0.02, 0.14, 0.12, 0.14);
  ellipsoid(player, colors.skin, s * 0.49, 1.08, 0.02, 0.13, 0.15, 0.13);
}

// Neck
partCylinder(player, colors.skin, 0, 2.27, 0, 0.15, 0.15, 0.22);

// Head
ellipsoid(player, colors.skin, 0, 2.78, 0, 0.51, 0.57, 0.47);

// Back hair
ellipsoid(player, colors.hair, 0, 2.65, -0.23, 0.59, 0.83, 0.43);

// Hair top
const cap = new THREE.Mesh(
  new THREE.SphereGeometry(
    0.58, 32, 20, 0, Math.PI * 2, 0, Math.PI * 0.58
  ),
  colors.hair
);
cap.position.set(0, 2.92, -0.04);
cap.scale.set(1.12, 1.12, 1.0);
cap.castShadow = true;
player.add(cap);

// Long side locks
for (const s of [-1, 1]) {
  ellipsoid(
    player, colors.hair,
    s * 0.46, 2.13, 0.02,
    0.15, 0.77, 0.18
  );
}

// Front bangs
for (let i = -2; i <= 2; i++) {
  ellipsoid(
    player, colors.hair,
    i * 0.17, 3.02 - Math.abs(i) * 0.035, 0.36,
    0.19, 0.22, 0.17
  );
}

// Eyes: blue anime eyes
for (const s of [-1, 1]) {
  ellipsoid(player, colors.white, s * 0.21, 2.79, 0.425, 0.115, 0.15, 0.065);
  ellipsoid(player, colors.blue, s * 0.21, 2.78, 0.48, 0.072, 0.105, 0.035);
  ellipsoid(player, colors.dark, s * 0.21, 2.77, 0.51, 0.035, 0.068, 0.025);
  ellipsoid(player, colors.white, s * 0.19, 2.82, 0.535, 0.025, 0.03, 0.015);
  ellipsoid(player, colors.dark, s * 0.21, 2.94, 0.43, 0.12, 0.025, 0.035);

  ellipsoid(player, colors.blush, s * 0.34, 2.63, 0.41, 0.09, 0.045, 0.025);
}

// Small nose and mouth
ellipsoid(player, colors.skin, 0, 2.65, 0.477, 0.035, 0.035, 0.025);
ellipsoid(player, colors.red, 0, 2.52, 0.46, 0.055, 0.018, 0.018);

// Red hair bow
ellipsoid(player, colors.red, -0.17, 3.29, 0.1, 0.19, 0.12, 0.09);
ellipsoid(player, colors.red, 0.17, 3.29, 0.1, 0.19, 0.12, 0.09);
ellipsoid(player, colors.gold, 0, 3.29, 0.18, 0.07, 0.07, 0.06);

// Initial position
player.position.set(0, 0, 20);
