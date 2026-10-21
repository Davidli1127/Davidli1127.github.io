/* Original procedural scene. Three.js is bundled locally under its MIT license. */
(() => {
'use strict';
const mount = document.querySelector('#scene');
const fallback = document.querySelector('#scene-fallback');
if (!window.THREE) { fallback.hidden = false; return; }
const T = window.THREE;
let renderer;
try { renderer = new T.WebGLRenderer({antialias:true,alpha:true,powerPreference:'high-performance'}); }
catch (error) { fallback.hidden=false; console.warn('3D unavailable:',error.message); return; }
renderer.setPixelRatio(Math.min(window.devicePixelRatio,1.7));
renderer.setSize(innerWidth,innerHeight);
renderer.shadowMap.enabled=true;
renderer.shadowMap.type=T.PCFSoftShadowMap;
renderer.toneMapping=T.ACESFilmicToneMapping;
renderer.toneMappingExposure=1.4;
mount.appendChild(renderer.domElement);
const scene=new T.Scene();
const camera=new T.PerspectiveCamera(35,innerWidth/innerHeight,.1,100);
const target=new T.Vector3(0,1.5,0);
const stage=new T.Group(); scene.add(stage);
const props=new T.Group(); stage.add(props);
const material=(color,roughness=.6,metalness=0)=>new T.MeshStandardMaterial({color,roughness,metalness});
const skin=material('#c9a68f',.72), hair=material('#20232a',.72), hoodie=material('#252d3d',.92), trousers=material('#3a4454',.95), sole=material('#c9d4d2',.8), steel=material('#7e9a9f',.3,.65), dark=material('#172630',.5), walnut=material('#7f625b',.75), mint=material('#a5d0c3',.5), purple=material('#7f77a6',.6), porcelain=material('#c5d3cf',.3);
const glow=new T.MeshStandardMaterial({color:'#a1eadb',emissive:'#69c9bc',emissiveIntensity:.65,roughness:.35});
const eyeMat=material('#19232a',.45), glint=new T.MeshBasicMaterial({color:'#e5f9f2'});
function mesh(geometry,mat,parent=props){const o=new T.Mesh(geometry,mat);o.castShadow=true;o.receiveShadow=true;parent.add(o);return o;}
function ellipsoid(x,y,z,sx,sy,sz,mat,parent=props){const o=mesh(new T.SphereGeometry(1,28,20),mat,parent);o.position.set(x,y,z);o.scale.set(sx,sy,sz);return o;}
function box(x,y,z,w,h,d,mat,parent=props,r=.08){const shape=new T.Shape();const a=-w/2,b=-h/2;r=Math.min(r,w/3,h/3,d/3);shape.moveTo(a+r,b);shape.lineTo(a+w-r,b);shape.quadraticCurveTo(a+w,b,a+w,b+r);shape.lineTo(a+w,b+h-r);shape.quadraticCurveTo(a+w,b+h,a+w-r,b+h);shape.lineTo(a+r,b+h);shape.quadraticCurveTo(a,b+h,a,b+h-r);shape.lineTo(a,b+r);shape.quadraticCurveTo(a,b,a+r,b);const g=new T.ExtrudeGeometry(shape,{depth:d-2*r,bevelEnabled:true,bevelSegments:3,steps:1,bevelSize:r,bevelThickness:r,curveSegments:6});g.translate(0,0,-(d-2*r)/2);const o=mesh(g,mat,parent);o.position.set(x,y,z);return o;}
function cylinder(x,y,z,rt,rb,h,mat,parent=props){const o=mesh(new T.CylinderGeometry(rt,rb,h,40),mat,parent);o.position.set(x,y,z);return o;}
function rod(a,b,r,mat,parent=props){const va=new T.Vector3(...a),vb=new T.Vector3(...b),delta=vb.clone().sub(va);const o=mesh(new T.CylinderGeometry(r,r,delta.length(),12),mat,parent);o.position.copy(va).add(vb).multiplyScalar(.5);o.quaternion.setFromUnitVectors(new T.Vector3(0,1,0),delta.normalize());return o;}
function torus(x,y,z,r,t,mat,parent=props,rx=0,ry=0,rz=0){const o=mesh(new T.TorusGeometry(r,t,12,96),mat,parent);o.position.set(x,y,z);o.rotation.set(rx,ry,rz);return o;}
function curve(points,color,width=.012,parent=props){const c=new T.CatmullRomCurve3(points.map(p=>new T.Vector3(...p)));return mesh(new T.TubeGeometry(c,32,width,7,false),material(color,.5),parent);}
const hemi=new T.HemisphereLight('#c3e2ff','#1a2334',2);scene.add(hemi);
const key=new T.DirectionalLight('#f8ddc4',4.8);key.position.set(-4,8,6);key.castShadow=true;key.shadow.mapSize.set(2048,2048);Object.assign(key.shadow.camera,{left:-7,right:7,top:8,bottom:-5,near:.1,far:24});key.shadow.normalBias=.04;scene.add(key);
const rim=new T.DirectionalLight('#8e9de9',3.8);rim.position.set(4,5,-5);scene.add(rim);
const fill=new T.DirectionalLight('#77dacc',2.1);fill.position.set(6,2,4);scene.add(fill);
const deskGlow=new T.PointLight('#7bdfd6',2.5,5);deskGlow.position.set(0,2.5,1.2);stage.add(deskGlow);
const baseMat=material('#20323c',.7,.2);
cylinder(0,-.16,0,3.45,3.35,.25,baseMat);
torus(0,-.02,0,3.37,.012,glow,props,Math.PI/2);
// Thin orbital guides and small studs make the floating platform feel like a miniature world.
const floorRing=torus(0,-.26,0,3.67,.008,material('#526773',.6),props,Math.PI/2);
for(let i=0;i<40;i++){const a=i/40*Math.PI*2;ellipsoid(Math.cos(a)*3.61,-.26,Math.sin(a)*3.61,.012,.012,.012,mint);}
const floorShadow=mesh(new T.CircleGeometry(5.3,64),new T.ShadowMaterial({opacity:.18}),stage);floorShadow.rotation.x=-Math.PI/2;floorShadow.position.y=-.32;floorShadow.castShadow=false;
// Desk and chair.
box(0,1.55,.5,4.35,.17,2.15,walnut,props,.06);
box(0,1.45,.5,3.95,.08,1.85,dark,props,.025);
for(const x of [-1.85,1.85])for(const z of [-.27,1.27]){rod([x,.02,z],[x,1.43,z],.055,steel);cylinder(x,.04,z,.08,.08,.06,dark);}
box(0,1.18,-.68,1.26,.23,1.2,material('#46596a',.95),props,.12);
box(0,1.9,-1.16,1.25,1.18,.19,material('#46596a',.95),props,.09);
rod([0,.13,-.6],[0,1.14,-.6],.11,steel);
for(let i=0;i<5;i++){const a=i*Math.PI*2/5;rod([0,.2,-.6],[Math.cos(a)*.68,.12,-.6+Math.sin(a)*.68],.045,dark);ellipsoid(Math.cos(a)*.68,.09,-.6+Math.sin(a)*.68,.09,.06,.09,dark);}
// A deliberately stylised toy portrait, inspired by David's black hair and black shirt.
const avatar=new T.Group();props.add(avatar);
ellipsoid(0,2.09,-.58,.56,.7,.37,hoodie,avatar);
box(0,1.47,-.38,.85,.28,.7,trousers,avatar,.12);
for(const s of [-1,1]){
 rod([s*.3,1.48,-.42],[s*.42,1.04,.35],.19,trousers,avatar);
 rod([s*.42,1.04,.35],[s*.43,.35,.52],.14,trousers,avatar);
 ellipsoid(s*.43,.27,.68,.22,.16,.36,hair,avatar);
 box(s*.43,.16,.69,.43,.075,.66,sole,avatar,.025);
 // Elbows travel around the outside of the display; wrists approach the keyboard from its front.
 rod([s*.45,2.39,-.58],[s*1.13,1.94,.1],.155,hoodie,avatar);
 ellipsoid(s*1.13,1.94,.1,.16,.16,.16,hoodie,avatar);
 rod([s*1.13,1.94,.1],[s*1.12,1.83,.97],.115,hoodie,avatar);
 rod([s*1.12,1.83,.97],[s*.67,1.82,1.08],.105,hoodie,avatar);
 ellipsoid(s*.59,1.8,1.04,.16,.075,.15,skin,avatar);
}
cylinder(0,2.68,-.56,.17,.19,.26,skin,avatar);
const head=new T.Group();head.position.set(0,3.16,-.52);avatar.add(head);
ellipsoid(0,0,0,.51,.57,.46,skin,head);
ellipsoid(-.49,-.01,0,.08,.125,.085,skin,head);ellipsoid(.49,-.01,0,.08,.125,.085,skin,head);
const hairCap=mesh(new T.SphereGeometry(.535,32,20,0,Math.PI*2,0,Math.PI*.57),hair,head);hairCap.scale.set(1,1.08,.95);hairCap.position.set(0,.06,-.035);
for(let i=0;i<9;i++){const x=(i-4)*.105;const y=.29-Math.abs(i-4)*.023;const lock=ellipsoid(x,y,.325,.105,.24,.12,hair,head);lock.rotation.z=(i-4)*-.13;}
for(const s of [-1,1]){
 const e=ellipsoid(s*.18,-.015,.435,.041,.049,.022,eyeMat,head);
 ellipsoid(s*.18-.008,-.002,.455,.011,.013,.008,glint,head);
 const brow=box(s*.18,.108,.422,.12,.023,.025,hair,head,.007);brow.rotation.z=s*-.08;
}
ellipsoid(0,-.115,.46,.063,.075,.055,skin,head);
curve([[-.075,-.235,.416],[0,-.253,.433],[.075,-.235,.416]],'#805b53',.009,head);
// Screen texture is generated locally; it is a visual label, not external application content.
const screenCanvas=document.createElement('canvas');screenCanvas.width=768;screenCanvas.height=480;
const ctx=screenCanvas.getContext('2d');ctx.fillStyle='#142a30';ctx.fillRect(0,0,768,480);
ctx.fillStyle='#2c4851';ctx.fillRect(0,0,768,43);for(let i=0;i<3;i++){ctx.fillStyle=['#e69d98','#dac88f','#a2d3ba'][i];ctx.beginPath();ctx.arc(23+i*23,22,6,0,7);ctx.fill();}
ctx.font='22px monospace';ctx.fillStyle='#7cabae';ctx.fillText('david / building-something-good',110,30);
const lines=[['#759a9f','// a small universe of ideas'],['#b2a4e0','const curiosity = Infinity;'],['#d5e8dc','function buildSomething() {'],['#a1d8cd','  explore();'],['#a1d8cd','  make();'],['#a1d8cd','  learn();'],['#d5e8dc','}']];
ctx.font='28px monospace';lines.forEach((l,i)=>{ctx.fillStyle=l[0];ctx.fillText(l[1],48,104+i*41);});ctx.fillStyle='#a3d7c7';ctx.fillRect(48,411,16,25);
const tex=new T.CanvasTexture(screenCanvas);tex.colorSpace=T.SRGBColorSpace;
const laptop=new T.Group();laptop.position.set(-.16,1.7,.67);laptop.rotation.y=-.14;props.add(laptop);
box(0,0,.13,1.64,.065,1.05,steel,laptop,.025);
box(0,.017,.33,.6,.015,.27,material('#809498',.6),laptop,.02);
for(let row=0;row<4;row++)for(let col=0;col<12;col++)box(-.67+col*.121,.04,-.22+row*.105,.096,.012,.075,dark,laptop,.003);
const lid=new T.Group();lid.position.set(0,.05,-.32);lid.rotation.x=-.16;laptop.add(lid);
box(0,.51,0,1.72,1.04,.075,dark,lid,.045);
const screen=mesh(new T.PlaneGeometry(1.57,.86),new T.MeshBasicMaterial({map:tex}),lid);screen.position.set(0,.52,.042);screen.castShadow=false;
ellipsoid(0,1,.042,.015,.015,.005,steel,lid);
// Coffee, plant, books, and a little robot companion.
cylinder(.99,1.85,1.15,.15,.12,.38,porcelain);
cylinder(.99,2.043,1.15,.122,.122,.008,material('#513b32',.85));
torus(1.15,1.87,1.15,.105,.024,porcelain,props,0,0,0);
const steam=curve([[.98,2.08,1.15],[1.02,2.25,1.14],[.94,2.41,1.13]],'#73938f',.008);steam.material.transparent=true;steam.material.opacity=.35;
cylinder(-1.68,1.82,.15,.2,.14,.4,purple);
cylinder(-1.68,2.024,.15,.177,.177,.01,material('#3d4439',1));
for(let i=0;i<7;i++){const a=i*2.4;const x=-1.68+Math.cos(a)*.2,z=.15+Math.sin(a)*.18;rod([-1.68,2,.15],[x,2.36+(i%3)*.11,z],.012,material('#456b5e'));const leaf=ellipsoid(x,2.35+(i%3)*.11,z,.09,.22,.033,material(i%2?'#759a74':'#477e6a'));leaf.rotation.set(Math.cos(a)*.55,0,Math.sin(a)*.6);}
for(let i=0;i<3;i++){const b=box(-1.3,1.7+i*.085,1.08,.54,.07,.4,[purple,mint,porcelain][i],props,.01);b.rotation.y=-.1+i*.13;}
const bot=new T.Group();bot.position.set(1.52,2.06,.08);props.add(bot);
ellipsoid(0,-.08,0,.23,.27,.21,porcelain,bot);
box(0,.22,0,.53,.39,.39,porcelain,bot,.1);
box(0,.23,.2,.4,.23,.025,dark,bot,.035);
for(const s of [-1,1]){ellipsoid(s*.1,.24,.218,.034,.048,.013,glow,bot);ellipsoid(s*.29,-.05,0,.065,.13,.065,porcelain,bot);}
rod([0,.42,0],[0,.55,0],.017,steel,bot);ellipsoid(0,.57,0,.046,.046,.046,glow,bot);
torus(0,-.39,0,.25,.009,glow,bot,Math.PI/2);
const botHit=mesh(new T.SphereGeometry(.52,12,12),new T.MeshBasicMaterial({visible:false}),bot);botHit.position.y=.1;
const redMat=material('#b74651',.23,.15), blackMat=material('#18212b',.15,.2);
const ball1=ellipsoid(2.17,.27,1.25,.23,.23,.23,redMat),ball2=ellipsoid(2.56,.19,.89,.16,.16,.16,blackMat);
rod([1.1,.15,1.95],[2.6,.15,-.5],.022,material('#be9d78',.5));
// A detached miniature neural constellation quietly orbits the desk.
const constellation=new T.Group();constellation.position.set(-2.2,3.15,-1.2);props.add(constellation);
for(let i=0;i<9;i++){const a=i*Math.PI*2/9,x=Math.cos(a)*.47,y=Math.sin(a)*.47,z=Math.sin(a*2)*.2;ellipsoid(x,y,z,.045,.045,.045,i%2?glow:purple,constellation);if(i<8){const b=(i+1)*Math.PI*2/9;rod([x,y,z],[Math.cos(b)*.47,Math.sin(b)*.47,Math.sin(b*2)*.2],.008,steel,constellation);}}
ellipsoid(0,0,0,.105,.105,.105,purple,constellation);
const haloMat=new T.MeshBasicMaterial({color:'#7f91b6',transparent:true,opacity:.2});
const halo=torus(.15,2,-2.2,3.3,.008,haloMat,props,.27,.6,.3);halo.castShadow=false;
const halo2=torus(.15,2,-2.2,3.5,.004,new T.MeshBasicMaterial({color:'#90cabb',transparent:true,opacity:.17}),props,.4,.55,.2);halo2.castShadow=false;
const starsGeo=new T.BufferGeometry();const starPositions=[];let seed=731;const rand=()=>{seed=(seed*16807)%2147483647;return(seed-1)/2147483646;};for(let i=0;i<190;i++)starPositions.push((rand()-.5)*25,(rand()-.4)*16,-4-rand()*12);starsGeo.setAttribute('position',new T.Float32BufferAttribute(starPositions,3));const starMat=new T.PointsMaterial({color:'#9ebdb9',size:.018,transparent:true,opacity:.5,sizeAttenuation:true});scene.add(new T.Points(starsGeo,starMat));
const reduced=window.matchMedia('(prefers-reduced-motion: reduce)');let paused=reduced.matches,theme='dark',scroll=0,elapsed=0,previous=performance.now(),running=true;
let dragX=0,dragY=0,mouseX=0,mouseY=0,gesture=null,botBounce=0;
const ray=new T.Raycaster(),pointer=new T.Vector2();
const clamp=T.MathUtils.clamp,lerp=T.MathUtils.lerp;
function setTheme(value){theme=value;const light=value==='light';scene.fog=new T.Fog(light?'#f3f1eb':'#0b1017',17,35);baseMat.color.set(light?'#c9d5cd':'#20323c');starMat.opacity=light?.15:.5;renderer.toneMappingExposure=light?1.2:1.4;hemi.intensity=light?2.5:2;document.documentElement.dataset.theme=value;}
function resize(){camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix();renderer.setSize(innerWidth,innerHeight);renderer.setPixelRatio(Math.min(devicePixelRatio,1.7));}
function reset(){dragX=0;dragY=0;}
// Camera poses are authored for David's own scene. Scroll only scrubs them; it never captures scrolling.
let stops=[],projectFocus='feedback',measurePending=false;
const pose=(at,focus,azimuth,elevation,distance,x,y,shade)=>({at,focus,azimuth,elevation,distance,x,y,shade});
function measureStops(){
 measurePending=false;
 const h=innerHeight, byId=id=>document.getElementById(id), j=byId('journey'),w=byId('work'),l=byId('offscreen'),c=byId('contact');
 const mobile=innerWidth<=800;
 const mobileHomeDistance=21*(h/844)*(390/innerWidth);
 stops=[
  pose(0,[0,1.65,0],.35,.22,mobile?mobileHomeDistance:12.8,mobile?.4:.36,mobile?-.4:-.03,0),
  pose(j.offsetTop-h*.53,[0,2.15,-.3],.04,.16,mobile?12:9,mobile?.1:0,-.1,.04),
  pose(j.offsetTop-90,[0,3.2,-.3],-.42,.12,mobile?12:6.7,mobile?.38:-.46,mobile?-.35:-.65,.10),
  pose(j.offsetTop+j.offsetHeight*.45,[0,3.2,-.3],.12,.18,mobile?12:7.5,mobile?.42:-.5,mobile?-.35:-.62,.12),
  pose(w.offsetTop-180,[-.1,2.13,.55],-.18,.32,mobile?11:6.1,mobile?.42:.51,-.04,.14),
  pose(w.offsetTop+w.offsetHeight*.42,[-.1,2.05,.6],.36,.48,mobile?12:7.1,mobile?.3:-.35,-.05,.25),
  pose(l.offsetTop-130,[2.1,.48,1.1],.45,.85,mobile?11:5.8,mobile?.5:.58,.08,.13),
  pose(l.offsetTop+l.offsetHeight*.5,[2.15,.37,1.1],.1,.95,mobile?11:6.3,mobile?.5:.55,.1,.23),
  pose(c.offsetTop-160,[1.52,2.24,.08],.35,.13,mobile?12:5.5,mobile?.55:.63,.0,.1),
  pose(c.offsetTop+c.offsetHeight,[1.52,2.24,.08],-.12,.19,mobile?12:6,mobile?.55:.64,.02,.1)
 ].sort((a,b)=>a.at-b.at);
}
function scheduleMeasure(){if(measurePending)return;measurePending=true;requestAnimationFrame(measureStops);}
function onScroll(){scroll=window.scrollY;}
window.addEventListener('resize',()=>{resize();scheduleMeasure();});
window.addEventListener('scroll',onScroll,{passive:true});
window.addEventListener('portfolio-layout',scheduleMeasure);
if(window.ResizeObserver)new ResizeObserver(scheduleMeasure).observe(document.querySelector('main'));
measureStops();
window.addEventListener('pointermove',event=>{mouseX=event.clientX/innerWidth*2-1;mouseY=event.clientY/innerHeight*2-1;});
mount.addEventListener('pointerdown',event=>{gesture={x:event.clientX,y:event.clientY,lastX:event.clientX,lastY:event.clientY,moved:0};if(event.pointerType==='mouse')mount.setPointerCapture(event.pointerId);});
mount.addEventListener('pointermove',event=>{if(!gesture)return;const dx=event.clientX-gesture.lastX,dy=event.clientY-gesture.lastY;gesture.moved+=Math.abs(dx)+Math.abs(dy);if(event.pointerType==='mouse'||Math.abs(event.clientX-gesture.x)>Math.abs(event.clientY-gesture.y)){dragX=clamp(dragX+dx*.004,-.7,.7);dragY=clamp(dragY+dy*.002,-.25,.25);}gesture.lastX=event.clientX;gesture.lastY=event.clientY;});
mount.addEventListener('pointerup',event=>{if(gesture&&gesture.moved<10){pointer.set(event.clientX/innerWidth*2-1,-event.clientY/innerHeight*2+1);ray.setFromCamera(pointer,camera);if(ray.intersectObject(botHit,true).length){botBounce=1;window.dispatchEvent(new CustomEvent('robot-hello'));}}gesture=null;});
mount.addEventListener('pointercancel',()=>{gesture=null;});
reduced.addEventListener('change',e=>{paused=e.matches;window.dispatchEvent(new CustomEvent('scene-motion',{detail:paused}));});
window.portfolioScene={setTheme,reset,setPaused(value){paused=value;},get paused(){return paused;},focusProject(id){projectFocus=id;},greet(){botBounce=1;}};
setTheme(document.documentElement.dataset.theme||'dark');onScroll();
const currentCamera=new T.Vector3(),desiredCamera=new T.Vector3(),currentTarget=new T.Vector3(),focusPoint=new T.Vector3();
const offset=new T.Vector3(),right=new T.Vector3(),up=new T.Vector3(),direction=new T.Vector3();
let firstFrame=true,shadeValue=0;
function render(now){
 if(!running)return;requestAnimationFrame(render);
 if(document.hidden){previous=now;return;}
 const dt=Math.min((now-previous)/1000,.05);previous=now;if(!paused)elapsed+=dt;
 const mobile=innerWidth<=800;
 let a=stops[0],b=stops[stops.length-1];
 for(let i=0;i<stops.length-1;i++){if(scroll<=stops[i+1].at){a=stops[i];b=stops[i+1];break;}a=b=stops[stops.length-1];}
 let t=clamp((scroll-a.at)/Math.max(1,b.at-a.at),0,1);
 // Hold compositions briefly near a chapter, then ease through the orbit between them.
 t=clamp((t-.12)/.76,0,1);t=t*t*(3-2*t);
 if(reduced.matches){a=b=stops[0];t=0;}
 const blend=k=>lerp(a[k],b[k],t);
 focusPoint.set(...a.focus).lerp(new T.Vector3(...b.focus),t);
 let az=blend('azimuth')+dragX*.5,el=blend('elevation')+dragY*.3,dist=blend('distance');
 const subtle=paused||reduced.matches?0:1;
 az+=mouseX*.018*subtle;el+=mouseY*.008*subtle;
 offset.set(Math.sin(az)*Math.cos(el),Math.sin(el),Math.cos(az)*Math.cos(el)).multiplyScalar(dist);
 direction.copy(offset).normalize();right.set(Math.cos(az),0,-Math.sin(az));up.crossVectors(direction,right).normalize();
 const halfHeight=dist*Math.tan(T.MathUtils.degToRad(camera.fov/2));
 const shift=right.clone().multiplyScalar(-blend('x')*halfHeight*camera.aspect).addScaledVector(up,-blend('y')*halfHeight);
 desiredCamera.copy(focusPoint).add(offset).add(shift);
 const desiredTarget=focusPoint.clone().add(shift);
 const damping=reduced.matches||firstFrame?1:1-Math.exp(-dt*8);
 currentCamera.lerp(desiredCamera,damping);currentTarget.lerp(desiredTarget,damping);camera.position.copy(currentCamera);camera.lookAt(currentTarget);
 stage.position.set(0,0,0);stage.scale.setScalar(1);stage.rotation.y=lerp(stage.rotation.y,dragX*.12,damping);
 const wantedShade=reduced.matches&&scroll>300?.8:blend('shade');shadeValue=lerp(shadeValue,wantedShade,damping);
 document.documentElement.style.setProperty('--scene-shade',shadeValue.toFixed(3));
 mount.dataset.cameraChapter=String(stops.indexOf(a));
 firstFrame=false;
 stage.rotation.z=paused?0:Math.sin(elapsed*.35)*.003;
 props.position.y=paused?0:Math.sin(elapsed*.65)*.025;
 head.rotation.y=lerp(head.rotation.y,paused?0:mouseX*.13,.05);head.rotation.x=lerp(head.rotation.x,paused?0:mouseY*.035,.05);
 botBounce=Math.max(0,botBounce-dt*.6);bot.position.y=2.06+(paused?0:Math.sin(elapsed*1.7)*.045)+Math.sin(botBounce*Math.PI*4)*botBounce*.23;bot.rotation.z=Math.sin(botBounce*8)*botBounce*.2;bot.rotation.y=paused?0:mouseX*.16;
 constellation.rotation.y=elapsed*.17;constellation.rotation.z=Math.sin(elapsed*.3)*.1;halo.rotation.z=.3+Math.sin(elapsed*.13)*.08;halo2.rotation.z=.2-Math.sin(elapsed*.12)*.06;floorRing.rotation.z=elapsed*.015;steam.material.opacity=paused?.25:.2+Math.sin(elapsed*1.2)*.08;
 renderer.render(scene,camera);
}
renderer.domElement.addEventListener('webglcontextlost',event=>{event.preventDefault();running=false;fallback.hidden=false;});
renderer.domElement.addEventListener('webglcontextrestored',()=>{running=true;fallback.hidden=true;previous=performance.now();requestAnimationFrame(render);});
requestAnimationFrame(render);
window.dispatchEvent(new CustomEvent('scene-ready'));
})();
