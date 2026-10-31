import * as THREE from 'three';

const scene = new THREE.Scene();
scene.background = new THREE.Color(0xbfe2ec);
scene.fog = new THREE.Fog(0xbfe2ec, 55, 155);

const camera = new THREE.PerspectiveCamera(58, innerWidth/innerHeight, 0.1, 300);
const renderer = new THREE.WebGLRenderer({antialias:true});
renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
renderer.setSize(innerWidth, innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
document.body.appendChild(renderer.domElement);

scene.add(new THREE.HemisphereLight(0xffffff, 0x8da9b5, 2.0));
const sun = new THREE.DirectionalLight(0xfff1dc, 2.1);
sun.position.set(-25, 45, 30); sun.castShadow = true;
sun.shadow.mapSize.set(2048,2048); scene.add(sun);

const mat = (color, roughness=0.9) => new THREE.MeshStandardMaterial({color, roughness});
const groundMat = mat(0xd7d8c8), roadMat = mat(0x68747e), sidewalkMat = mat(0xb9c0bb);
const white = mat(0xffffff), navy = mat(0x263c63), red = mat(0xd84f68), hair = mat(0xe8e8ed);
const skin = mat(0xffd9c5), dark = mat(0x283044), glass = new THREE.MeshStandardMaterial({color:0x9bc9d8,roughness:.3});
const ground = new THREE.Mesh(new THREE.PlaneGeometry(240,240), groundMat);
ground.rotation.x=-Math.PI/2; ground.receiveShadow=true; scene.add(ground);

// Roads and sidewalks
function box(name,x,y,z,sx,sy,sz,material,cast=true){
  const m=new THREE.Mesh(new THREE.BoxGeometry(sx,sy,sz),material);
  m.name=name; m.position.set(x,y,z); m.castShadow=cast; m.receiveShadow=true; scene.add(m); return m;
}
box('main road',0,.015,0,13,.03,220,roadMat,false);
box('cross road',0,.02,0,220,.04,13,roadMat,false);
for(let z=-100;z<=100;z+=8){
  box('lane mark',0,.045,z,0.22,.025,3,white,false);
}
for(const side of [-1,1]){
  box('walkway',side*8,.08,0,3,.16,220,sidewalkMat,false);
  box('walkway',0,.08,side*8,220,.16,3,sidewalkMat,false);
}
for(let x=-90;x<=90;x+=18){
  for(let z=-90;z<=90;z+=18){
    if(Math.abs(x)<15 || Math.abs(z)<15) continue;
    const h=8+Math.random()*15, w=8+Math.random()*4, d=8+Math.random()*4;
    const colors=[0xe7cfc7,0xc8dce0,0xd9d5e8,0xe7dfc9,0xcbd9cb];
    const building=box('building',x,h/2,z,w,h,d,mat(colors[Math.floor(Math.random()*colors.length)]));
    // simple window rows
    for(let yy=3;yy<h-1;yy+=3){
      for(let xx=-w/2+1.2;xx<w/2-.5;xx+=2.2){
        const win=new THREE.Mesh(new THREE.BoxGeometry(1.1,1.35,.08),glass);
        win.position.set(x+xx,yy,z+d/2+.05); scene.add(win);
      }
    }
  }
}

// Landmark signs
function sign(text,x,y,z,color=0xe78aa7){
  const canvas=document.createElement('canvas'); canvas.width=512;canvas.height=128;
  const ctx=canvas.getContext('2d');ctx.fillStyle='#fffaf4';ctx.fillRect(0,0,512,128);
  ctx.fillStyle='#24364b';ctx.font='bold 52px sans-serif';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(text,256,64);
  const tex=new THREE.CanvasTexture(canvas);
  const board=new THREE.Mesh(new THREE.BoxGeometry(8,2,.25),new THREE.MeshStandardMaterial({map:tex}));
  board.position.set(x,y,z);scene.add(board);
}
sign('ACADEMY MIZUHANA',0,5,-27);
sign('SAKURA CAFE',23,4,0);
sign('KONBINI',-24,4,0);
sign('SAKURA PARK',0,4,28);

// Academy, cafe, shop, park landmarks
function buildingFacade(x,z,w,d,h,color,label){
  box(label,x,h/2,z,w,h,d,mat(color));
  box(label+' door',x,h*.25,z+d/2+.12,2.2,h*.5,.18,mat(0x6b8491));
  box(label+' awning',x,h*.64,z+d/2+.5,w*.82,.35,.9,mat(0xeaa0b1));
}
buildingFacade(0,-36,19,12,10,0xe9e1e1,'Academy Mizuhana');
buildingFacade(23,0,12,10,7,0xf2d9c9,'Sakura Cafe');
buildingFacade(-24,0,11,10,7,0xd7e8dc,'Konbini');
buildingFacade(0,36,13,9,5,0xe6e9d7,'Park kiosk');

// Trees
function tree(x,z){
  const trunk=new THREE.Mesh(new THREE.CylinderGeometry(.25,.35,2.5,7),mat(0x80604d));trunk.position.set(x,1.25,z);trunk.castShadow=true;scene.add(trunk);
  const crown=new THREE.Mesh(new THREE.SphereGeometry(2.1,9,7),mat(0xe9a9bf));crown.position.set(x,3.5,z);crown.castShadow=true;scene.add(crown);
}
for(let z=-48;z<=48;z+=12){tree(11,z);tree(-11,z);}
for(let x=-48;x<=48;x+=12){tree(x,11);tree(x,-11);}

// Kayoko: intentionally simple stylized placeholder model; easy to replace with a custom model later.
const player=new THREE.Group(); scene.add(player);
const body=new THREE.Mesh(new THREE.CylinderGeometry(.55,.7,1.55,8),navy);body.position.y=1.45;body.castShadow=true;player.add(body);
const skirt=new THREE.Mesh(new THREE.CylinderGeometry(.85,.95,.48,8),mat(0x243858));skirt.position.y=.72;skirt.castShadow=true;player.add(skirt);
const head=new THREE.Mesh(new THREE.SphereGeometry(.58,16,12),skin);head.position.y=2.65;head.castShadow=true;player.add(head);
const hairCap=new THREE.Mesh(new THREE.SphereGeometry(.63,16,10,0,Math.PI*2,0,Math.PI*.58),hair);hairCap.position.set(0,2.83,-.04);player.add(hairCap);
for(const s of [-1,1]){
  const lock=new THREE.Mesh(new THREE.CylinderGeometry(.13,.19,1.35,7),hair);lock.position.set(s*.48,2.05,.02);lock.rotation.z=s*.12;player.add(lock);
  const eye=new THREE.Mesh(new THREE.SphereGeometry(.055,8,8),dark);eye.position.set(s*.22,2.68,.52);player.add(eye);
}
const bow=new THREE.Group();
const bowL=new THREE.Mesh(new THREE.SphereGeometry(.18,8,6),red);bowL.scale.set(1,.65,.35);bowL.position.x=-.16;
const bowR=bowL.clone();bowR.position.x=.16;bow.add(bowL,bowR);bow.position.set(0,2.93,.49);player.add(bow);
player.position.set(0,0,20);

// Collectibles and interactables
let cats=0, photos=0, coins=0;
const saved=JSON.parse(localStorage.getItem('kayokoTokyoLife')||'{}');
cats=saved.cats||0;photos=saved.photos||0;coins=saved.coins||0;
const catSpots=[[-8,32],[30,22],[-32,-25],[39,-35],[8,-52]];
const catObjects=[];
for(const [x,z] of catSpots){
  const g=new THREE.Group();
  const c=new THREE.Mesh(new THREE.SphereGeometry(.48,10,8),mat(0x77727a));c.scale.set(1,.7,.8);c.position.y=.48;g.add(c);
  for(const sx of [-1,1]){const ear=new THREE.Mesh(new THREE.ConeGeometry(.16,.38,5),mat(0x77727a));ear.position.set(sx*.28,.86,0);g.add(ear);}
  const eyeMat=mat(0x253142);
  for(const sx of [-1,1]){const e=new THREE.Mesh(new THREE.SphereGeometry(.045,6,6),eyeMat);e.position.set(sx*.16,.55,.39);g.add(e);}
  g.position.set(x,0,z);scene.add(g);catObjects.push(g);
}
const photoSpots=[[-20,-35],[25,18],[0,48],[42,5]];
const photoObjects=[];
for(const [x,z] of photoSpots){
  const g=new THREE.Group();
  const ring=new THREE.Mesh(new THREE.TorusGeometry(.65,.12,8,16),mat(0xf3c45f));ring.position.y=1.5;g.add(ring);
  const dot=new THREE.Mesh(new THREE.SphereGeometry(.16,8,8),mat(0xffffff));dot.position.y=1.5;g.add(dot);
  g.position.set(x,0,z);scene.add(g);photoObjects.push(g);
}
function updateStats(){
  document.getElementById('cats').textContent=cats;
  document.getElementById('photos').textContent=photos;
  document.getElementById('coins').textContent=coins;
  localStorage.setItem('kayokoTokyoLife',JSON.stringify({cats,photos,coins}));
}
updateStats();
let messageTimer;
function say(t){
  const el=document.getElementById('message');el.textContent=t;el.classList.add('show');
  clearTimeout(messageTimer);messageTimer=setTimeout(()=>el.classList.remove('show'),2300);
}
say('Добро пожаловать в Токио! Исследуй город и найди кошек 🐈');

// Movement
const keys={};addEventListener('keydown',e=>{keys[e.key.toLowerCase()]=true;if(e.key.toLowerCase()==='e')interact();});
addEventListener('keyup',e=>keys[e.key.toLowerCase()]=false);
let joyX=0,joyY=0;
const area=document.getElementById('stick-area'),stick=document.getElementById('stick');
let pointer=null;
function joystick(e){
  const r=area.getBoundingClientRect(),cx=r.left+r.width/2,cy=r.top+r.height/2;
  let dx=e.clientX-cx,dy=e.clientY-cy;const max=34,len=Math.hypot(dx,dy);
  if(len>max){dx=dx/len*max;dy=dy/len*max;}
  joyX=dx/max;joyY=dy/max;stick.style.transform=`translate(${dx}px,${dy}px)`;
}
area.addEventListener('pointerdown',e=>{pointer=e.pointerId;area.setPointerCapture(pointer);joystick(e);});
area.addEventListener('pointermove',e=>{if(pointer===e.pointerId)joystick(e);});
function resetJoy(){pointer=null;joyX=joyY=0;stick.style.transform='translate(0,0)';}
area.addEventListener('pointerup',resetJoy);area.addEventListener('pointercancel',resetJoy);
document.getElementById('action-button').addEventListener('click',interact);

function interact(){
  let nearest=null,dist=4.2;
  for(const o of [...catObjects,...photoObjects]){
    const d=Math.hypot(player.position.x-o.position.x,player.position.z-o.position.z);
    if(d<dist){dist=d;nearest=o;}
  }
  if(!nearest){say('Здесь пока нечего делать. Осмотрись вокруг!');return;}
  const ci=catObjects.indexOf(nearest);
  if(ci>=0){catObjects.splice(ci,1);scene.remove(nearest);cats++;coins+=5;updateStats();say('Мяу! Каёко нашла кошку. +5 монет 🐈');return;}
  const pi=photoObjects.indexOf(nearest);
  if(pi>=0){photoObjects.splice(pi,1);scene.remove(nearest);photos++;coins+=3;updateStats();say('Красивый кадр! +3 монеты 📸');}
}
document.getElementById('reset-button').addEventListener('click',()=>{
  if(confirm('Сбросить найденных кошек, фотографии и монеты?')){
    cats=photos=coins=0;localStorage.removeItem('kayokoTokyoLife');location.reload();
  }
});

// Camera follows the player
const clock=new THREE.Clock();
function animate(){
  requestAnimationFrame(animate);
  const dt=Math.min(clock.getDelta(),.04);
  let x=(keys.d||keys.arrowright?1:0)-(keys.a||keys.arrowleft?1:0)+joyX;
  let z=(keys.s||keys.arrowdown?1:0)-(keys.w||keys.arrowup?1:0)+joyY;
  const len=Math.hypot(x,z);
  if(len>.08){
    x/=Math.max(1,len);z/=Math.max(1,len);
    player.position.x+=x*9*dt;player.position.z+=z*9*dt;
    player.rotation.y=Math.atan2(x,z);
  }
  player.position.x=THREE.MathUtils.clamp(player.position.x,-105,105);
  player.position.z=THREE.MathUtils.clamp(player.position.z,-105,105);
  const target=new THREE.Vector3(player.position.x,4.8,player.position.z+9);
  camera.position.lerp(new THREE.Vector3(player.position.x,8.5,player.position.z+13),1-Math.pow(.001,dt));
  camera.lookAt(target);
  catObjects.forEach((o,i)=>{o.rotation.y+=dt*(i%2?-.6:.6);});
  photoObjects.forEach(o=>{o.rotation.y+=dt*1.2;});
  renderer.render(scene,camera);
}
animate();

addEventListener('resize',()=>{
  camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix();
  renderer.setSize(innerWidth,innerHeight);renderer.setPixelRatio(Math.min(devicePixelRatio,2));
});
document.getElementById('loading').style.display='none';
