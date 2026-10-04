<script lang="ts">
  import { onMount } from 'svelte';
  import { Howl } from 'howler';
  import { fly } from 'svelte/transition';
  import { skills } from './skills';
  import Option from './components/Option.svelte';
  import type { OptionValue } from './types';
  import './portfolio.css';
  import './refinement.css';

  type Screen = 'title'|'main'|'projects'|'about'|'skills'|'contact'|'config'|'detail';
  let screen = $state<Screen>('title');
  let returnTo = $state<Screen>('title');
  let selected = $state(0), projectSelected = $state(0), configSelected = $state(0), titleSelected = $state(0);
  let transitioning = $state(false), motion = $state(true), sfx = $state(true), music = $state(false), volume = $state(35);
  let video: HTMLVideoElement;
  let navigation: Howl | undefined, track: Howl | undefined;
  let scale = $state(1), viewportWidth = $state(1920), viewportHeight = $state(1080);
  let timer: ReturnType<typeof setTimeout>;
  let skillSelected = $state(0), skillGroup = $state('All'), resetNotice = $state('');
  const filteredSkills = $derived(skills.map((skill,index)=>({...skill,index})).filter(s=>skillGroup==='All'||s.group===skillGroup));
  const activeSkill = $derived(skills[skillSelected]);
  function selectSkill(i:number){if(skillSelected!==i){skillSelected=i;play();}}
  function filterSkills(group:string){skillGroup=group;skillSelected=skills.findIndex(s=>group==='All'||s.group===group);play();}
  const mainLabels = ['ABOUT','PROJECTS','SKILLS','CONTACT','CONFIG'];
  const mainDescriptions = ['Meet Henryk','Explore my projects','Tools I work with','Find me on GitHub','Change portfolio settings'];
  const rotations = [-25,-15,-20,-12,6];
  const titleOptions: OptionValue[] = [{name:'ENTER',description:'Enter the portfolio',rotation:-15,zIndex:1,offsetX:0,offsetY:10},{name:'CONFIG',description:'Change settings',rotation:-8,zIndex:0,offsetX:20,offsetY:0}];
  const options: OptionValue[] = mainLabels.map((name,i)=>({name,description:mainDescriptions[i],rotation:rotations[i],zIndex:i%3,offsetX:[-70,-10,-60,-40,10][i],offsetY:[55,30,35,25,0][i]}));
  type Project = {name:string;title:string;description:string;repo:string;tags:string;demo?:string;shots?:{src:string;label:string}[]};
  let lightbox = $state(-1);
  const projects: Project[] = [
    {name:'HEADCANON', title:'Headcanon', description:'A fictional-first marketplace and licensing platform I founded: an Etsy-style storefront where makers sell objects from original worlds, with fandom search, rights review and a seller workspace. TypeScript, Vite, Cloudflare Workers and D1.', repo:'', demo:'https://www.loom.com/share/540d6dbd1be54ce28ee9439d2786e891', tags:'FOUNDER / TYPESCRIPT / MARKETPLACE', shots:[{src:'/headcanon/home.jpg',label:'Storefront home'},{src:'/headcanon/discover.jpg',label:'Discover'},{src:'/headcanon/listing.jpg',label:'Listing page'},{src:'/headcanon/maker.jpg',label:'Maker studio'}]},
    {name:'CUSTOMER ZERO', title:'Customer Zero', description:'An AI customer that finds cross-system SaaS bugs with real Stripe, Supabase, and GitHub evidence.', repo:'https://github.com/TacoGod900/customer-zero', tags:'AI / SAAS TESTING'},
    {name:'CODRONE', title:'CoDrone EDU Controller', description:'Webcam hand tracking with OpenCV and MediaPipe turns fingertip movements into drone controls. Includes a simulation mode for testing without a connected drone.', repo:'https://github.com/TacoGod900/codrone-edu-controller',tags:'PYTHON / COMPUTER VISION'},
    {name:'KAGGLE', title:'Kaggle', description:'A mathematical-reasoning notebook using PyTorch and Transformers to run Qwen2.5-Math and prepare competition submissions.',repo:'https://github.com/TacoGod900/kaggle',tags:'PYTHON / MACHINE LEARNING'},
    {name:'CS50', title:'CS50', description:'A public learning repository containing a Scratch project.',repo:'https://github.com/TacoGod900/cs50',tags:'SCRATCH / LEARNING'}
  ];
  const projectOptions: OptionValue[] = projects.map((p,i)=>({name:p.name,description:p.title,rotation:[-12,-8,-16,-5,6][i],zIndex:i%3,offsetX:[-30,-65,-15,-25,0][i],offsetY:[20,10,20,10,0][i]}));
  const settings = ['Sound effects','Music','Motion','Music volume','Reset settings'];
  const description = $derived(screen==='main'?mainDescriptions[selected]:screen==='projects'?projects[projectSelected].title:screen==='title'?'Enter the portfolio':screen==='config'?'Make yourself comfortable':screen==='detail'?'Explore this project':screen==='skills'?'Which skill do you want to view?':'A little more about me');

  function play(){if(sfx)navigation?.play();}
  function save(){try{localStorage.setItem('hg-settings',JSON.stringify({sfx,music,motion,volume}));}catch{}}
  function applySettings(){if(video){if(motion)void video.play().catch(()=>{});else video.pause();}if(track){track.volume(volume/100);if(music&&!track.playing())track.play();if(!music)track.pause();}save();}
  function go(next:Screen){if(transitioning)return;play();transitioning=true;clearTimeout(timer);timer=setTimeout(()=>{screen=next;selected=0;lightbox=-1;transitioning=false;},180);}
  function openConfig(){returnTo=screen;configSelected=0;go('config');}
  function activate(){if(screen==='title'){titleSelected===0?go('main'):openConfig();}else if(screen==='main'){if(selected===4)openConfig();else go(['about','projects','skills','contact'][selected] as Screen);}else if(screen==='projects'){go('detail');}else if(screen==='config'){changeSetting(configSelected);}}
  function back(){if(screen==='title')return;go(screen==='config'?returnTo:screen==='main'?'title':screen==='detail'?'projects':'main');}
  function changeSetting(i:number,dir=1){play();resetNotice='';if(i===0)sfx=!sfx;if(i===1)music=!music;if(i===2)motion=!motion;if(i===3)volume=Math.max(0,Math.min(100,volume+dir*5));if(i===4){sfx=true;music=false;motion=!matchMedia('(prefers-reduced-motion: reduce)').matches;volume=35;resetNotice='Default settings restored';}applySettings();}
  function select(i:number){if(selected!==i){selected=i;play();}}
  function selectProject(i:number){if(projectSelected!==i){projectSelected=i;play();}}
  function keydown(e:KeyboardEvent){
    if(e.key==='Escape'){e.preventDefault();if(lightbox>=0){lightbox=-1;return;}back();return;}
    if(lightbox>=0&&['ArrowLeft','ArrowRight'].includes(e.key)){e.preventDefault();const n=projects[projectSelected].shots?.length??0;if(n)lightbox=(lightbox+(e.key==='ArrowRight'?1:n-1))%n;return;}
    if((e.target as HTMLElement).matches('input'))return;
    if(screen==='skills'&&['ArrowLeft','ArrowRight'].includes(e.key)){e.preventDefault();const groups=['All','Code','Data','Tools'];filterSkills(groups[(groups.indexOf(skillGroup)+(e.key==='ArrowRight'?1:3))%4]);return;}
    if(screen==='skills'&&['ArrowDown','ArrowUp'].includes(e.key)){e.preventDefault();const pos=filteredSkills.findIndex(s=>s.index===skillSelected);selectSkill(filteredSkills[(pos+(e.key==='ArrowDown'?1:-1)+filteredSkills.length)%filteredSkills.length].index);document.querySelector(`[data-skill="${skillSelected}"]`)?.scrollIntoView({block:'nearest'});return;}
    if(e.key==='Enter'&&['title','main','projects'].includes(screen)&&!(e.target as HTMLElement).closest('a')){e.preventDefault();activate();return;}
    if(e.key==='Enter'&&!(e.target as HTMLElement).closest('button,a')){e.preventDefault();activate();return;}
    if(['ArrowDown','ArrowUp'].includes(e.key)){e.preventDefault();const d=e.key==='ArrowDown'?1:-1;if(screen==='main')select((selected+d+5)%5);if(screen==='projects')selectProject((projectSelected+d+projects.length)%projects.length);if(screen==='title')titleSelected=(titleSelected+1)%2;if(screen==='config'){configSelected=(configSelected+d+5)%5;play();}}
    if(screen==='config'&&['ArrowLeft','ArrowRight'].includes(e.key)){e.preventDefault();changeSetting(configSelected,e.key==='ArrowRight'?1:-1);}
  }
  onMount(()=>{
    const resize=()=>{viewportWidth=innerWidth;viewportHeight=innerHeight;scale=Math.min(innerWidth/1920,innerHeight/1080);};resize();window.addEventListener('resize',resize);
    motion=!matchMedia('(prefers-reduced-motion: reduce)').matches;
    try{const stored=JSON.parse(localStorage.getItem('hg-settings')||'null');if(stored){sfx=stored.sfx??true;music=stored.music??false;motion=motion&&(stored.motion??true);volume=Number.isFinite(stored.volume)?Math.max(0,Math.min(100,stored.volume)):35;}}catch{}
    navigation=new Howl({src:['/sfx/navigation.wav'],volume:.25});track=new Howl({src:['/music/Color Your Night.mp3'],loop:true,volume:volume/100});applySettings();
    return()=>{clearTimeout(timer);window.removeEventListener('resize',resize);navigation?.unload();track?.unload();};
  });
</script>

<svelte:head><title>HG Portfolio — Henryk</title><meta name="description" content="Henryk / TacoGod900 — projects, experiments and a Persona-inspired portfolio." /></svelte:head>
<svelte:window onkeydown={keydown}/>
<div class="hg-shell" class:still={!motion}>
 <div class="hg-stage" class:has-project-plate={screen==='projects'} class:has-about-plate={['about','contact','detail'].includes(screen)||(screen==='config'&&returnTo!=='title')} style:transform={`translate(${(viewportWidth-1920*scale)/2}px,${(viewportHeight-1080*scale)/2}px) scale(${scale})`}>
  <div class="classroom" class:visible={screen==='title'||(screen==='config'&&returnTo==='title')}></div>
  <!-- svelte-ignore a11y_media_has_caption -->
  <video bind:this={video} muted loop playsinline autoplay src="/background.mp4" class="menu-video" class:submerged={['about','contact','config','detail'].includes(screen)} class:skills-video={screen==='skills'} class:project-video={screen==='projects'}></video>
  {#if screen==='projects'}<div class="reference-plate project-plate"></div>{:else if ['about','contact','detail'].includes(screen)||(screen==='config'&&returnTo!=='title')}<div class="reference-plate about-plate"></div>{/if}
  {#if screen==='title'||(screen==='config'&&returnTo==='title')}
   <img class="hg-logo" src="/hg-logo.svg" alt="HG Portfolio" />
  {/if}
  {#if screen==='main'}
   <div class="name-mask"><span>HENRYK</span></div><div class="chapter-number">{#key selected}<span in:fly={{y:140,duration:motion?280:0}} out:fly={{y:-140,duration:motion?180:0}}>0{selected+1}</span>{/key}</div>
   <div class="main-options" aria-label="Portfolio menu">
    {#each options as option,i}<Option {motion} index={i} {option} isSelected={selected===i} onSelect={()=>select(i)} onActivate={()=>{selected=i;activate();}}/>{/each}
   </div>
  {:else if screen==='title'}
   <nav class="title-options" aria-label="Title menu">
    {#each titleOptions as option,i}<Option {motion} index={i+30} {option} isSelected={titleSelected===i} onSelect={()=>{titleSelected=i;}} onActivate={()=>{titleSelected=i;activate();}}/>{/each}
   </nav>
   <a class="credit" href="https://github.com/deltea/p3r-pause-menu" target="_blank" rel="noreferrer">Menu foundation by deltea</a>
  {:else if screen==='projects'}
   <div class="project-white"><span>PROJECTS</span></div><div class="project-ring"></div><div class="project-number">{#key projectSelected}<span in:fly={{y:180,duration:motion?300:0}} out:fly={{y:-180,duration:motion?180:0}}>{projectSelected+1}</span>{/key}</div>
   <div class="project-options" aria-label="Projects">
    {#each projectOptions as option,i}<Option {motion} index={i+10} {option} isSelected={projectSelected===i} onSelect={()=>selectProject(i)} onActivate={()=>{projectSelected=i;go('detail');}}/>{/each}
   </div>
  {:else if screen==='skills'}
   <!-- Use the supplied game reference without generating or deforming the character. -->
   <div class="skill-reference" aria-hidden="true"></div>
   {#await import('./MenuCharacter.svelte') then module}<module.default {motion} group={activeSkill.group}/>{/await}
   <div class="skill-wash"></div><h1 class="inventory-title">SKILLS</h1>
   <div class="inventory-tabs" aria-label="Skill categories">{#each ['All','Code','Data','Tools'] as group}<button class:active={skillGroup===group} aria-pressed={skillGroup===group} onclick={()=>filterSkills(group)}>{group}</button>{/each}</div>
   <div class="skill-list" aria-label="Skill inventory">
    <div class="inventory-cursor" aria-hidden="true" style:transform={`translateY(${filteredSkills.findIndex(s=>s.index===skillSelected)*48}px) skew(-5deg)`}></div>
    {#each filteredSkills as skill,i}<button style={`--row:${i}`} data-skill={skill.index} class:active={skillSelected===skill.index} aria-pressed={skillSelected===skill.index} onmouseenter={()=>selectSkill(skill.index)} onfocus={()=>selectSkill(skill.index)} onclick={()=>selectSkill(skill.index)}><span class="skill-icon">{skill.icon}</span><strong>{skill.name}</strong><small>{skill.type}</small><span class="skill-quantity">× {skill.projects.length}</span></button>{/each}
   </div>
   <section class="skill-detail" aria-live="polite" aria-atomic="true">
    {#key skillSelected}<div in:fly={{x:24,duration:motion?200:0}}><header><span class="skill-type">{activeSkill.type}</span><h2>{activeSkill.name}</h2><span class="skill-index">{String(skillSelected+1).padStart(2,'0')} / {skills.length}</span></header><p class="skill-description">{activeSkill.description}</p><div class="skill-usage"><h3>USED IN</h3><p class="skill-use">{activeSkill.use}</p><div class="skill-projects">{#each activeSkill.projects as project}{#if project.url}<a href={project.url} target="_blank" rel="noreferrer">{project.name} ↗</a>{:else}<span>{project.name}</span>{/if}{/each}</div></div></div>{/key}
   </section><div class="inventory-hint">↑ ↓ Select skill <span>← → Change category</span></div>
  {:else}
   <div class="angled-panel"></div>
   <div class="info-line"><b>Info</b><span>{screen==='config'?'Change the portfolio’s settings':screen==='detail'?projects[projectSelected].tags:screen==='about'?'Meet the person behind the projects':'Find me on the internet'}</span></div>
   {#if screen==='config'}
    <div class="config-rows">
     {#each settings as label,i}
      <div class="config-row" class:active={configSelected===i}>
       <button onmouseenter={()=>configSelected=i} onfocus={()=>configSelected=i} onclick={()=>changeSetting(i)}>{label}</button>
       {#if i===3}<div class="setting-pill"><input aria-label="Music volume" type="range" min="0" max="100" bind:value={volume} oninput={applySettings} onfocus={()=>configSelected=3}/><span>{volume}%</span></div>
       {:else if i<3}<button class="setting-pill" aria-label={`Toggle ${label}`} onfocus={()=>configSelected=i} onclick={()=>changeSetting(i)}>{(i===0?sfx:i===1?music:motion)?'ON':'OFF'}</button>
       {:else}<button class="setting-pill" aria-label="Restore default settings" onmouseenter={()=>configSelected=4} onfocus={()=>configSelected=4} onclick={()=>changeSetting(4)}>DEFAULTS</button>{/if}
      </div>
     {/each}
     <p class="reset-notice" role="status">{resetNotice}</p>
    </div>
   {:else if screen==='about'}
    <div class="about-content"><div class="profile-row active"><span>Name</span><strong>Henryk</strong></div><div class="profile-row"><span>Online</span><strong>TacoGod900</strong></div><div class="profile-row"><span>Interests</span><strong>Code · AI · Experiments</strong></div><div class="bio"><h1>A little about me.</h1><p>I’m Henryk. I like making things, exploring ideas, and learning through projects.</p><p>From computer vision to machine-learning notebooks, this is a place for the things I’m working on.</p></div></div>
   {:else if screen==='contact'}
    <div class="about-content"><div class="profile-row active"><span>GitHub</span><strong>TacoGod900</strong></div><div class="bio"><h1>Let’s connect.</h1><p>Find my public code and follow what I’m building.</p><a class="repo-link" href="https://github.com/TacoGod900" target="_blank" rel="noreferrer">Open GitHub profile</a></div></div>
   {:else if screen==='detail'}
    {@const project=projects[projectSelected]}
    <div class="about-content"><div class="profile-row active"><strong>{project.title}</strong></div><div class="bio"><p>{project.description}</p>
     <div class="project-links">{#if project.demo}<a class="repo-link demo-link" href={project.demo} target="_blank" rel="noreferrer">▶ Watch demo</a>{/if}{#if project.repo}<a class="repo-link" href={project.repo} target="_blank" rel="noreferrer">View repository</a>{/if}{#if !project.demo&&!project.repo}<p class="up-next">Private source — demo coming next.</p>{/if}</div>
     {#if project.shots?.length}<div class="shot-strip" aria-label="Screenshots">{#each project.shots as shot,i}<button class="shot" style={`--i:${i}`} onclick={()=>{lightbox=i;play();}} aria-label={`Open screenshot: ${shot.label}`}><img src={shot.src} alt={shot.label} loading="lazy" /><span>{shot.label}</span></button>{/each}</div>{/if}
    </div></div>
    {#if lightbox>=0&&project.shots}
     {@const shot=project.shots[lightbox]}
     <div class="lightbox" role="dialog" aria-modal="true" aria-label={shot.label}>
      <button class="lightbox-close" onclick={()=>lightbox=-1} aria-label="Close screenshot">Esc</button>
      <img src={shot.src} alt={shot.label} />
      <div class="lightbox-bar"><span class="lightbox-label">{shot.label}</span><span class="lightbox-count">{lightbox+1} / {project.shots.length}</span><span class="lightbox-hint">← → Next screenshot</span></div>
      <button class="lightbox-nav prev" onclick={()=>{lightbox=(lightbox+project.shots!.length-1)%project.shots!.length;play();}} aria-label="Previous screenshot">‹</button>
      <button class="lightbox-nav next" onclick={()=>{lightbox=(lightbox+1)%project.shots!.length;play();}} aria-label="Next screenshot">›</button>
     </div>
    {/if}
   {/if}
   <div class="page-word">{screen==='detail'?'PROJECT':screen.toUpperCase()}</div>
  {/if}
  {#if screen!=='title'}
   <div class="hg-controls"><p>{description}</p><div class="guide">Guide<span></span></div><div class="control-buttons">{#if screen==='main'||screen==='projects'}<button onclick={activate}><b>↵</b>Confirm</button>{/if}<button onclick={back}><b>Esc</b>Back</button></div></div>
  {/if}
  <div class="transition-wipe" class:cover={transitioning}></div>
 </div>
</div>


