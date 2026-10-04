<script lang="ts">
 import {onMount} from 'svelte';
 import * as THREE from 'three';
 import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';
 let {motion=true,group='All'}=$props<{motion?:boolean;group?:string}>();
 let host:HTMLDivElement;
 let failed=$state(false);
 let changePose:((group:string)=>void)|undefined;
 $effect(()=>{const category=group;changePose?.(category);});
 onMount(()=>{
  let disposed=false;
  const scene=new THREE.Scene();scene.add(new THREE.AmbientLight(0x00d9f5,0.7));const light=new THREE.DirectionalLight(0xffffff,0.9);light.position.set(-60,100,120);scene.add(light);
  const camera=new THREE.PerspectiveCamera(30,1,0.1,4000);
  const destination=camera.clone();
  let renderer:THREE.WebGLRenderer;
  try{renderer=new THREE.WebGLRenderer({alpha:true,antialias:true});}catch{failed=true;return;}
  renderer.setPixelRatio(Math.min(devicePixelRatio,2));renderer.setClearColor(0,0);host.appendChild(renderer.domElement);
  const resize=()=>{const width=host.clientWidth,height=host.clientHeight;renderer.setSize(width,height);camera.aspect=width/height;camera.updateProjectionMatrix()};const observer=new ResizeObserver(resize);observer.observe(host);resize();
  let mixer:THREE.AnimationMixer|undefined,model:THREE.Group|undefined,current:THREE.AnimationAction|undefined;
  const textures=new THREE.TextureLoader();const face=textures.load('/T_PC0051_F000_00_Col.png'),body=textures.load('/T_PC0051_C002_00_Col.png'),eye=textures.load('/T_PC0051_E000_00_Col.png');
  for(const t of [face,body,eye]){t.flipY=false;t.colorSpace=THREE.SRGBColorSpace;}
  new GLTFLoader().load('/menu-character.glb',gltf=>{
   if(disposed){gltf.scene.traverse(o=>{if(o instanceof THREE.Mesh){o.geometry.dispose();(o.material as THREE.Material).dispose();}});return;}model=gltf.scene;scene.add(model);
   model.traverse(o=>{if(!(o instanceof THREE.Mesh))return;o.frustumCulled=false;const old=o.material as THREE.Material;
    const name=old.name;const hidden=name.includes('OlOpCamp')||/C002_0[3456]_CaFi/.test(name);
    const map=name.includes('CaEy')?eye:name.includes('F000')?face:name.includes('C002')&&name.includes('CaBa')?body:null;
    const color=name.includes('H000')?(name.includes('CaRt')?0x071044:0x00e7f8):name.includes('CaRt')?0x061348:0xffffff;
    const material=new THREE.MeshToonMaterial({map,color: name.includes('TxRs')?0x7249d8:color,side:THREE.FrontSide,transparent:hidden,opacity:hidden?0:1,depthWrite:!hidden});
    material.name=name;
    material.onBeforeCompile=shader=>{shader.fragmentShader=shader.fragmentShader.replace('vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;', 'float inkLight = step(0.12, dot(normal, normalize(vec3(-0.45, 0.65, 1.0)))); vec3 outgoingLight = diffuseColor.rgb * mix(vec3(0.0, 0.80, 0.94), vec3(1.0), inkLight);');};
    o.material=material;old.dispose();
   });
   // Menu meshes have facial bind poses different from the shared game skeleton.
   // Apply the clip's facial motion relative to its first frame, in this mesh's bind pose.
   model.traverse(o=>{if(o instanceof THREE.SkinnedMesh)o.skeleton.pose();});
   const facial=new Map<string,THREE.Bone>();
   model.traverse(o=>{if(!(o instanceof THREE.Bone))return;let parent=o.parent;let retarget=o.name.includes('NeckRibbon');while(parent){if(parent.name==='Jnt_C_Head_00')retarget=true;parent=parent.parent;}if(retarget)facial.set(o.name,o);});
   for(const clip of gltf.animations){for(const track of clip.tracks){const dot=track.name.lastIndexOf('.');const bone=facial.get(track.name.slice(0,dot));if(!bone)continue;const property=track.name.slice(dot+1);const v=track.values;
    if(property==='quaternion'){const initial=new THREE.Quaternion().fromArray(v).invert();const bind=bone.quaternion.clone();for(let i=0;i<v.length;i+=4){const q=new THREE.Quaternion().fromArray(v,i);bind.clone().multiply(initial).multiply(q).normalize().toArray(v,i);}}
    else if(property==='position'||property==='scale'){const initial=[v[0],v[1],v[2]];const bind=bone[property].toArray();for(let i=0;i<v.length;i++)v[i]=property==='position'?bind[i%3]+v[i]-initial[i%3]:bind[i%3]*v[i]/(initial[i%3]||1);}
   }}
   mixer=new THREE.AnimationMixer(model);
   changePose=(category:string)=>{const token=category==='Data'?'CampItemLoop':category==='Tools'?'CampSkillLoop':'CampSTATUSLoop';const clip=gltf.animations.find(a=>a.name.endsWith(token));if(!clip)return;const next=mixer!.clipAction(clip);if(next===current)return;
    if(category==='Tools'){destination.position.set(45,-50,-100);destination.up.set(0,-1,0);destination.lookAt(5,-8,-192);}
    else if(category==='Data'){destination.position.set(-20,35,-55);destination.up.set(.4,1,0);destination.lookAt(0,3,-146);}
    else{destination.position.set(35,5,-5);destination.up.set(0,1,0);destination.lookAt(20,-2,-98);}
    if(!current||!motion){camera.position.copy(destination.position);camera.quaternion.copy(destination.quaternion);}
    next.reset().setEffectiveTimeScale(1).setEffectiveWeight(1).play();if(current){if(motion)next.crossFadeFrom(current,.65,true);else current.stop();}current=next;if(!motion)mixer!.update(0);};changePose(group);mixer.update(.01);model.updateMatrixWorld(true);
   

  },undefined,()=>{if(!disposed)failed=true;});
  let previous=performance.now();renderer.setAnimationLoop(()=>{const now=performance.now();const delta=Math.min((now-previous)/1000,.05);previous=now;if(motion)mixer?.update(delta);const blend=motion?1-Math.exp(-delta*8):1;camera.position.lerp(destination.position,blend);camera.quaternion.slerp(destination.quaternion,blend);renderer.render(scene,camera);});
  return()=>{disposed=true;changePose=undefined;observer.disconnect();renderer.setAnimationLoop(null);scene.traverse(o=>{if(o instanceof THREE.Mesh){o.geometry.dispose();(o.material as THREE.Material).dispose();}});for(const t of [face,body,eye])t.dispose();renderer.dispose();renderer.domElement.remove();};
 });
</script>
<div class="menu-character" bind:this={host} aria-label="Animated Persona menu character">{#if failed}<p>Character animation could not load. Refresh to retry.</p>{/if}</div>
<style>.menu-character{position:absolute;left:850px;top:70px;width:1070px;height:780px;z-index:2;pointer-events:none}.menu-character :global(canvas){display:block;width:100%;height:100%}.menu-character p{color:#69faff;padding:80px;font-size:26px}</style>
