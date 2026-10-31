 // === KAYOKO: CASUAL ANIME MODEL ===

const player = new THREE.Group();
scene.add(player);

const material = (color, roughness = 0.85) =>
  new THREE.MeshStandardMaterial({ color, roughness });

const C = {
  hair: material(0xe9e5eb),
  hairShade: material(0xc9c4d0),
  skin: material(0xffdccc),
  sweater: material(0x302a31),
  sweaterLight: material(0x49404a),
  skirt: material(0x51434b),
  tights: material(0x29252e),
  shoes: material(0x27232d),
  blue: material(0x609acb),
  white: material(0xffffff),
  dark: material(0x303044),
  blush: material(0xf4a7aa)
};

function sphere(parent, mat, x,y,z,sx,sy,sz) {
  const mesh = new THREE.Mesh(
    new THREE.SphereGeometry(1,24,16), mat
  );
  mesh.position.set(x,y,z);
  mesh.scale.set(sx,sy,sz);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  parent.add(mesh);
  return mesh;
}

function cylinder(parent,mat,x,y,z,top,bottom,height) {
  const mesh = new THREE.Mesh(
    new THREE.CylinderGeometry(top,bottom,height,20),mat
  );
  mesh.position.set(x,y,z);
  mesh.castShadow = true;
  parent.add(mesh);
  return mesh;
}

// Plaid fabric texture
const canvas = document.createElement('canvas');
canvas.width = 256;
canvas.height = 256;
const ctx = canvas.getContext('2d');

ctx.fillStyle = '#554650';
ctx.fillRect(0,0,256,256);

ctx.fillStyle = '#786873';
for(let i=0;i<256;i+=64){
  ctx.fillRect(i,0,9,256);
  ctx.fillRect(0,i,256,9);
}

ctx.fillStyle = '#b1a0a7';
for(let i=20;i<256;i+=64){
  ctx.fillRect(i,0,3,256);
  ctx.fillRect(0,i,256,3);
}

ctx.fillStyle = '#39333d';
for(let i=45;i<256;i+=64){
  ctx.fillRect(i,0,2,256);
  ctx.fillRect(0,i,256,2);
}

const plaid = new THREE.CanvasTexture(canvas);
plaid.wrapS = plaid.wrapT = THREE.RepeatWrapping;
plaid.repeat.set(2,2);

const plaidMat = new THREE.MeshStandardMaterial({
  map: plaid,
  roughness: 1,
  side: THREE.DoubleSide
});

// Legs and dark tights
for(const s of [-1,1]){
  cylinder(player,C.tights,s*.23,.52,0,.145,.16,.85);
  sphere(player,C.tights,s*.23,.12,0,.15,.14,.19);

  // Shoes
  sphere(player,C.shoes,s*.23,.09,.12,.19,.09,.29);
}

// Plaid skirt
const skirt = new THREE.Mesh(
  new THREE.CylinderGeometry(.43,.68,.48,32,1,false),
  plaidMat
);
skirt.position.y = 1.05;
skirt.castShadow = true;
player.add(skirt);

// Sweater body
const torso = new THREE.Mesh(
  new THREE.CapsuleGeometry(.46,.85,8,16),
  C.sweater
);
torso.position.set(0,1.78,0);
torso.scale.set(1.08,1,0.78);
torso.castShadow = true;
player.add(torso);

// Sweater collar
const collar = new THREE.Mesh(
  new THREE.CylinderGeometry(.27,.3,.24,24),
  C.sweaterLight
);
collar.position.y = 2.38;
player.add(collar);

// Long oversized sleeves
for(const s of [-1,1]){
  const sleeve = new THREE.Mesh(
    new THREE.CapsuleGeometry(.19,.72,8,12),
    C.sweater
  );
  sleeve.position.set(s*.48,1.48,.02);
  sleeve.rotation.z = -s*.16;
  sleeve.scale.set(1,1,.95);
  sleeve.castShadow = true;
  player.add(sleeve);

  sphere(player,C.sweater,s*.49,1.05,.08,.20,.16,.20);
}

// Neck
cylinder(player,C.skin,0,2.48,0,.14,.15,.3);

// Head
sphere(player,C.skin,0,2.92,0,.49,.57,.43);

// Back of long hair
sphere(player,C.hair,0,2.75,-.22,.61,.83,.40);

// Hair cap
const hairCap = new THREE.Mesh(
  new THREE.SphereGeometry(.57,32,20,0,Math.PI*2,0,Math.PI*.59),
  C.hair
);
hairCap.position.set(0,3.05,-.04);
hairCap.scale.set(1.12,1.12,1);
hairCap.castShadow=true;
player.add(hairCap);

// Long hair strands
function hairStrand(points,radius,mat){
  const curve = new THREE.CatmullRomCurve3(
    points.map(p=>new THREE.Vector3(...p))
  );
  const mesh = new THREE.Mesh(
    new THREE.TubeGeometry(curve,24,radius,8,false),
    mat
  );
  mesh.castShadow=true;
  player.add(mesh);
}

for(const s of [-1,1]){
  // Main side locks
  hairStrand([
    [s*.42,3.12,.12],
    [s*.56,2.65,.18],
    [s*.58,2.0,.16],
    [s*.48,1.3,.12],
    [s*.34,.72,.04]
  ],.115,C.hair);

  // Outer hair locks
  hairStrand([
    [s*.38,3.12,-.12],
    [s*.68,2.65,-.13],
    [s*.73,1.9,-.18],
    [s*.76,1.2,-.13],
    [s*.62,.55,-.10]
  ],.10,C.hairShade);
}

// Front bangs
hairStrand([
  [-.38,3.35,.30],
  [-.24,3.15,.43],
  [-.12,2.95,.45],
  [-.05,2.78,.43]
],.12,C.hair);

hairStrand([
  [-.12,3.42,.31],
  [.02,3.20,.44],
  [.14,3.02,.44],
  [.24,2.85,.39]
],.12,C.hair);

hairStrand([
  [.20,3.37,.27],
  [.34,3.16,.39],
  [.36,2.98,.40]
],.10,C.hairShade);

// Blue anime eyes
for(const s of [-1,1]){
  sphere(player,C.white,s*.205,2.97,.394,.125,.15,.055);
  sphere(player,C.blue,s*.205,2.97,.444,.083,.115,.035);
  sphere(player,C.dark,s*.205,2.97,.467,.041,.078,.025);
  sphere(player,C.white,s*.18,3.02,.488,.025,.03,.014);

  // Eyebrows
  sphere(player,C.hairShade,s*.20,3.17,.38,.13,.025,.025);

  // Blush
  sphere(player,C.blush,s*.34,2.79,.365,.09,.035,.018);
}

// Small nose and mouth
sphere(player,C.skin,0,2.83,.44,.025,.025,.02);
sphere(player,C.dark,0,2.70,.423,.035,.012,.012);

// Position in the city
player.position.set(0,0,20);
