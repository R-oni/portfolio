// Variáveis globais para o mundo
let globeRenderer, globeScene, globeAnimationId, resizeHandler;
let systemAnimationId, systemResizeHandler;

// Variáveis para controle de gestos e estado
let touchStartY = 0;
let swipeEnabled = false;
let debounce = false;
let appState = 'intro'; // 'intro', 'system', 'globe', 'gallery', 'texto'
let currentGalleryIndex = -1;
let handleTouchStart, handleTouchEnd, handleWheel, handleClick;
let introTimeouts = [];

// ==========================================
// ARQUIVOS (GALERIA)
// ==========================================
// Imagem de exemplo no swipe
const galleryImages = [
  'mundos/himpis/imagens/cap1/cena1.webp',
  'mundos/himpis/imagens/cap1/cena2.png'
];

// NOME DESTE MUNDO PARA O BANCO DE DADOS
const NOME_DO_MUNDO = 'himpis';

// ==========================================
// FIREBASE (armazenamento do texto)
// ==========================================
async function carregarTexto() {
  const textoEl = document.getElementById('texto-conteudo');
  if (!textoEl) return;
  
  if (!window.db) {
    console.warn('Banco de dados ainda não inicializado no index.html!');
    return;
  }

  try {
    const { doc, getDoc } = await import('https://www.gstatic.com/firebasejs/10.13.2/firebase-firestore.js');
    const ref = doc(window.db, 'textos', NOME_DO_MUNDO);
    const snap = await getDoc(ref);
    
    if (snap.exists()) {
      const dados = snap.data();
      textoEl.innerHTML = dados.conteudo || '';
    }
  } catch (err) {
    console.error('Erro ao carregar texto:', err);
  }
}

window.initFlipbook = function(wrapperSelector) {
  const wrap = document.querySelector(wrapperSelector);

  // Garantir que a página não tenha scroll nativo
  document.body.style.overflow = 'hidden';
  document.documentElement.style.overflow = 'hidden';
  document.body.style.backgroundColor = '#000';
  document.body.style.margin = '0';
  document.body.style.padding = '0';

  const slideEl = document.createElement('div');
  slideEl.className = 'flipbook-slide';
  slideEl.style.width = '100vw';
  slideEl.style.height = '100vh';
  slideEl.style.backgroundColor = '#000';
  slideEl.style.position = 'relative';
  slideEl.style.overflow = 'hidden';
  slideEl.style.display = 'flex';
  slideEl.style.justifyContent = 'center';
  slideEl.style.alignItems = 'center';

  const galleryHTML = galleryImages.map((src, i) => `
    <img id="layer-gallery-${i}" src="${src}" style="position: absolute; opacity: 0; transition: opacity 0.6s ease-in-out; max-width: 100%; max-height: 100%; border-radius: 0px; box-shadow: 0 10px 30px rgba(0,0,0,0.5); z-index: 5; pointer-events: none;" draggable="false">
  `).join('');

  slideEl.innerHTML = `
    <div id="layer-omom" style="position: absolute; opacity: 1; transition: opacity 1s ease-in-out; font-family: 'Press Start 2P', monospace; color: #fff; text-align: center; z-index: 10; display: flex; flex-direction: column; align-items: center; pointer-events: none;">
      <div style="font-size: 20px;">OMOM</div>
      <div style="font-size: 12px; margin-top: 4px;">estudio</div>
    </div>

    <div id="layer-menu" style="position: absolute; opacity: 0; transition: opacity 1s ease-in-out; z-index: 9; display: flex; flex-direction: column; align-items: center; justify-content: center; pointer-events: none;">
      <img src="mundos/himpis/himpismenu.webp" style="max-width: 40%; max-height: 40vh; pointer-events: none;" draggable="false">
      <div style="font-family: 'Press Start 2P', monospace; font-size: 10px; color: #fff; margin-top: 15px; letter-spacing: 2px;">HIMPIS</div>
    </div>

    <div id="layer-system" style="position: absolute; width: 100vw; height: 100vh; max-width: 800px; max-height: 800px; opacity: 0; transform: scale(0.01); transition: opacity 1.5s ease-out, transform 1.5s cubic-bezier(0.16, 1, 0.3, 1); z-index: 8; display: flex; justify-content: center; align-items: center; pointer-events: none;">
      <canvas id="systemCanvas" style="width: 100%; height: 100%; display: block;"></canvas>
    </div>

    <div id="layer-globe" style="position: absolute; width: 90%; max-width: 600px; aspect-ratio: 1; opacity: 0; transition: opacity 1.5s ease-in-out; z-index: 7; display: flex; flex-direction: column; align-items: center; justify-content: center; pointer-events: none;">
      <canvas id="globeCanvas" style="width: 100%; height: 100%; display: block; margin: auto;"></canvas>
      <div id="label-himpis" style="position: absolute; bottom: 0; opacity: 0; background-color: rgba(0, 0, 0, 0.7); border-radius: 10px; padding: 10px; border: 1px solid #00ffe7; text-align: center; transition: opacity 1.2s ease-in-out; transform: translateY(20px);">
        <div style="font-family: 'Press Start 2P', monospace; color: #00ffe7; font-size: 14px; padding: 10px; text-shadow: 0 0 10px rgba(0, 255, 231, 0.7); letter-spacing: 1px;">HIMPIS</div>
        <div style="font-family: 'Press Start 2P', monospace; color: #fff; font-size: 10px; padding: 5px 10px; margin-top: 5px; text-align: center;">Planeta Habitável</div>
      </div>
    </div>

    ${galleryHTML}

    <div id="layer-texto" style="position: absolute; top: 0; left: 0; width: 100vw; height: 100vh; opacity: 0; transition: opacity 0.6s ease-in-out; z-index: 6; pointer-events: none; background-color: #ffffff; overflow: hidden; display: flex; justify-content: center;">
      <div id="texto-pagina" style="width: 100%; max-width: 800px; height: 100%; display: flex; flex-direction: column;">
        <div id="texto-conteudo" style="flex: 1; overflow-y: auto; padding: 40px 20px; font-family: 'Literata', serif; font-size: 18px; line-height: 1.7; color: #2b2320; outline: none; -webkit-overflow-scrolling: touch;" contenteditable="false" spellcheck="false"></div>
      </div>
    </div>
  `;

  wrap.appendChild(slideEl);

  // Carregar fonte pixel (UI)
  if (!document.getElementById('press-start-2p-font')) {
    const fontLink = document.createElement('link');
    fontLink.id = 'press-start-2p-font';
    fontLink.rel = 'stylesheet';
    fontLink.href = 'https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap';
    document.head.appendChild(fontLink);
  }

  // Carregar fonte Literata
  if (!document.getElementById('literata-font')) {
    const literataLink = document.createElement('link');
    literataLink.id = 'literata-font';
    literataLink.rel = 'stylesheet';
    literataLink.href = 'https://fonts.googleapis.com/css2?family=Literata:ital,wght@0,400;0,600;1,400;1,600&display=swap';
    document.head.appendChild(literataLink);
  }

  // Estilos da página de texto puro
  if (!document.getElementById('texto-estilos')) {
    const styleTag = document.createElement('style');
    styleTag.id = 'texto-estilos';
    styleTag.textContent = `
      #layer-texto * { box-sizing: border-box; }
      #texto-conteudo::-webkit-scrollbar { width: 6px; }
      #texto-conteudo::-webkit-scrollbar-thumb { background: rgba(0,0,0,0.2); border-radius: 3px; }
    `;
    document.head.appendChild(styleTag);
  }

  initOrbitalSystem();
  initGlobe({
    canvasId: 'globeCanvas',
    planetTexture: 'mundos/himpis/mapahimpis.png',
    hasNuvem: true,
    nuvemTexture: 'mundos/himpis/nuvemhimpis.png'
  });

  // Easter Egg (Skip Intro)
  handleClick = function() {
    if (appState === 'intro') {
      introTimeouts.forEach(clearTimeout);
      introTimeouts = [];

      document.getElementById('layer-omom').style.opacity = '0';
      document.getElementById('layer-menu').style.opacity = '0';

      const layerSystem = document.getElementById('layer-system');
      layerSystem.style.transition = 'opacity 1.5s ease-out, transform 1.5s cubic-bezier(0.16, 1, 0.3, 1)';
      layerSystem.style.opacity = '1';
      layerSystem.style.transform = 'scale(1)';

      appState = 'system';
      swipeEnabled = true;
    }
  };
  window.addEventListener('click', handleClick);

  // Sequência Inicial
  introTimeouts.push(setTimeout(() => {
    document.getElementById('layer-omom').style.opacity = '0';
    introTimeouts.push(setTimeout(() => {
      document.getElementById('layer-menu').style.opacity = '1';
      introTimeouts.push(setTimeout(() => {
        document.getElementById('layer-menu').style.opacity = '0';
        introTimeouts.push(setTimeout(() => {
          const layerSystem = document.getElementById('layer-system');
          layerSystem.style.opacity = '1';
          layerSystem.style.transform = 'scale(1)';
          appState = 'system';
          swipeEnabled = true;
        }, 1000));
      }, 2000));
    }, 1000));
  }, 2000));

  // ==========================================
  // CONTROLE DE GESTOS
  // ==========================================
  handleTouchStart = function(e) {
    touchStartY = e.touches[0].clientY;
  };

  handleTouchEnd = function(e) {
    if (!swipeEnabled) return;
    const touchEndY = e.changedTouches[0].clientY;
    const diff = touchStartY - touchEndY;

    // Se estiver no leitor de texto e puxar para baixo no topo, voltar
    if (appState === 'texto') {
      const textoEl = document.getElementById('texto-conteudo');
      if (diff < -50 && textoEl.scrollTop <= 0) voltarCena();
      return;
    }

    if (diff > 50) avancarCena();
    else if (diff < -50) voltarCena();
  };

  handleWheel = function(e) {
    if (!swipeEnabled) return;

    // Se estiver no leitor de texto e rolar para cima no topo, voltar
    if (appState === 'texto') {
      const textoEl = document.getElementById('texto-conteudo');
      if (e.deltaY < 0 && textoEl.scrollTop <= 0) voltarCena();
      return;
    }

    if (e.deltaY > 0) avancarCena();
    else if (e.deltaY < 0) voltarCena();
  };

  window.addEventListener('touchstart', handleTouchStart, { passive: true });
  window.addEventListener('touchend', handleTouchEnd, { passive: true });
  window.addEventListener('wheel', handleWheel, { passive: true });

  // ==========================================
  // MÁQUINA DE ESTADOS: AVANÇAR
  // ==========================================
  function avancarCena() {
    if (debounce) return;
    debounce = true;
    swipeEnabled = false;

    if (appState === 'system') {
      const layerSystem = document.getElementById('layer-system');
      layerSystem.style.transition = 'opacity 1s ease-in, transform 1s cubic-bezier(0.5, 0, 0.2, 1)';
      layerSystem.style.transform = 'scale(4)';
      layerSystem.style.opacity = '0';

      setTimeout(() => {
        const layerGlobe = document.getElementById('layer-globe');
        const label = document.getElementById('label-himpis');
        layerGlobe.style.opacity = '1';
        setTimeout(() => {
          label.style.opacity = '1';
          label.style.transform = 'translateY(0)';
          label.style.boxShadow = "0 0 8px 5px rgba(0, 255, 231, 0.5)";
        }, 500);

        appState = 'globe';
        swipeEnabled = true;
        debounce = false;
      }, 800);

    } else if (appState === 'globe') {
      if (galleryImages.length === 0) { swipeEnabled = true; debounce = false; return; }

      const layerGlobe = document.getElementById('layer-globe');
      const label = document.getElementById('label-himpis');
      layerGlobe.style.opacity = '0';
      label.style.opacity = '0';
      label.style.transform = 'translateY(20px)';
      label.style.boxShadow = "none";

      setTimeout(() => {
        currentGalleryIndex = 0;
        const firstImg = document.getElementById(`layer-gallery-${currentGalleryIndex}`);
        if(firstImg) firstImg.style.opacity = '1';

        appState = 'gallery';
        swipeEnabled = true;
        debounce = false;
      }, 1000);

    } else if (appState === 'gallery') {
      if (currentGalleryIndex < galleryImages.length - 1) {
        const currentImg = document.getElementById(`layer-gallery-${currentGalleryIndex}`);
        const nextImg = document.getElementById(`layer-gallery-${currentGalleryIndex + 1}`);

        if(currentImg) currentImg.style.opacity = '0';
        if(nextImg) nextImg.style.opacity = '1';

        currentGalleryIndex++;
        setTimeout(() => { swipeEnabled = true; debounce = false; }, 600);
      } else {
        const currentImg = document.getElementById(`layer-gallery-${currentGalleryIndex}`);
        if(currentImg) currentImg.style.opacity = '0';

        const layerTexto = document.getElementById('layer-texto');
        layerTexto.style.opacity = '1';
        layerTexto.style.pointerEvents = 'auto'; 

        appState = 'texto';
        carregarTexto();
        setTimeout(() => { swipeEnabled = true; debounce = false; }, 600);
      }
    } else {
      debounce = false;
      swipeEnabled = true;
    }
  }

  // ==========================================
  // MÁQUINA DE ESTADOS: VOLTAR
  // ==========================================
  function voltarCena() {
    if (debounce) return;
    debounce = true;
    swipeEnabled = false;

    if (appState === 'system') {
      swipeEnabled = true; debounce = false;

    } else if (appState === 'globe') {
      const layerGlobe = document.getElementById('layer-globe');
      const label = document.getElementById('label-himpis');
      layerGlobe.style.opacity = '0';
      label.style.opacity = '0';
      label.style.transform = 'translateY(20px)';
      label.style.boxShadow = "none";

      setTimeout(() => {
        const layerSystem = document.getElementById('layer-system');
        layerSystem.style.transition = 'opacity 1.5s ease-out, transform 1.5s cubic-bezier(0.16, 1, 0.3, 1)';
        layerSystem.style.transform = 'scale(1)';
        layerSystem.style.opacity = '1';

        appState = 'system';
        swipeEnabled = true;
        debounce = false;
      }, 1000);

    } else if (appState === 'texto') {
      const layerTexto = document.getElementById('layer-texto');
      layerTexto.style.opacity = '0';
      layerTexto.style.pointerEvents = 'none';

      const lastImg = document.getElementById(`layer-gallery-${galleryImages.length - 1}`);
      if(lastImg) lastImg.style.opacity = '1';

      setTimeout(() => {
        appState = 'gallery';
        currentGalleryIndex = galleryImages.length - 1;
        swipeEnabled = true;
        debounce = false;
      }, 600);

    } else if (appState === 'gallery') {
      if (currentGalleryIndex > 0) {
        const currentImg = document.getElementById(`layer-gallery-${currentGalleryIndex}`);
        const prevImg = document.getElementById(`layer-gallery-${currentGalleryIndex - 1}`);

        if(currentImg) currentImg.style.opacity = '0';
        if(prevImg) prevImg.style.opacity = '1';

        currentGalleryIndex--;
        setTimeout(() => { swipeEnabled = true; debounce = false; }, 600);

      } else {
        const firstImg = document.getElementById(`layer-gallery-0`);
        if(firstImg) firstImg.style.opacity = '0';

        setTimeout(() => {
          const layerGlobe = document.getElementById('layer-globe');
          const label = document.getElementById('label-himpis');
          layerGlobe.style.opacity = '1';
          setTimeout(() => {
            label.style.opacity = '1';
            label.style.transform = 'translateY(0)';
            label.style.boxShadow = "0 0 8px 5px rgba(0, 255, 231, 0.5)";
          }, 500);

          appState = 'globe';
          currentGalleryIndex = -1;
          swipeEnabled = true;
          debounce = false;
        }, 600);
      }
    }
  }
};

// ==========================================
// Módulos Auxiliares (Globo e Sistema)
// ==========================================
function initGlobe(params) {
  const { canvasId, planetTexture, hasNuvem, nuvemTexture } = params;
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;

  globeScene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(75, canvas.clientWidth / canvas.clientHeight, 0.1, 1000);
  
  // Renderer transparente
  globeRenderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  globeRenderer.shadowMap.enabled = false;

  const initSize = Math.min(window.innerWidth * 0.9, 600);
  globeRenderer.setSize(initSize, initSize);

  const geometry = new THREE.SphereGeometry(2, 64, 64);
  const textureLoader = new THREE.TextureLoader();
  const texture = textureLoader.load(planetTexture);
  
  // Utilizando MeshBasicMaterial para manter o visual original de himpis.js sem interações de luz/sombra
  const material = new THREE.MeshBasicMaterial({ 
    map: texture,
    transparent: false,
    opacity: 1
  });
  const globe = new THREE.Mesh(geometry, material);

  globe.rotation.x = THREE.MathUtils.degToRad(23.5);
  globeScene.add(globe);

  let nuvem;
  if (hasNuvem && nuvemTexture) {
    const nuvemGeometry = new THREE.SphereGeometry(2.02, 64, 64);
    const nuvemTextura = textureLoader.load(nuvemTexture);
    
    // Parâmetros de transparência idênticos ao script original de Himpis
    const nuvemMaterial = new THREE.MeshBasicMaterial({
      map: nuvemTextura, 
      transparent: true, 
      opacity: 0.7, 
      alphaTest: 0.1
    });
    nuvem = new THREE.Mesh(nuvemGeometry, nuvemMaterial);
    globeScene.add(nuvem);
  }

  camera.position.z = 4.5;

  function animate() {
    globeAnimationId = requestAnimationFrame(animate);
    globe.rotation.y += 0.002;
    if (nuvem) nuvem.rotation.y += 0.0038;
    globeRenderer.render(globeScene, camera);
  }

  animate();

  resizeHandler = function() {
    const layer = document.getElementById('layer-globe');
    if (!layer || !canvas) return;
    const width = layer.clientWidth;
    const height = layer.clientHeight;

    if (globeRenderer && camera && width > 0) {
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      globeRenderer.setSize(width, height);
    }
  };

  window.addEventListener('resize', resizeHandler);
}

function initOrbitalSystem() {
  const canvas = document.getElementById('systemCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  function resizeCanvas() {
    const parent = canvas.parentElement;
    if (parent && parent.clientWidth > 0) {
      canvas.width = parent.clientWidth;
      canvas.height = parent.clientHeight;
    } else {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }
  }

  resizeCanvas();
  systemResizeHandler = resizeCanvas;
  window.addEventListener('resize', systemResizeHandler);

  const starSize = 15;
  const planet1Size = 3, planet2Size = 5, planet3Size = 8;
  const orbit1Radius = 50, orbit2Radius = 85, orbit3Radius = 130;
  const planet1Speed = 0.008, planet2Speed = 0.005, planet3Speed = 0.002;

  let planet1Angle = 0, planet2Angle = 2, planet3Angle = 4;

  function drawStar(x, y, size) {
    ctx.fillStyle = '#fff';
    ctx.beginPath();
    ctx.arc(x, y, size * 0.35, 0, Math.PI * 2);
    ctx.fill();
    for (let i = 0; i < 8; i++) {
      const angle = i * Math.PI / 4;
      const pointSize = (i % 2 === 0) ? size : size * 0.6;
      ctx.beginPath();
      const startRadius = size * 0.35;
      const startX = x + startRadius * Math.cos(angle);
      const startY = y + startRadius * Math.sin(angle);
      const endX = x + pointSize * Math.cos(angle);
      const endY = y + pointSize * Math.sin(angle);
      const width = size * 0.12;
      const perpAngle = angle + Math.PI / 2;
      const offsetX = Math.cos(perpAngle) * width;
      const offsetY = Math.sin(perpAngle) * width;

      ctx.moveTo(startX + offsetX/2, startY + offsetY/2);
      ctx.lineTo(endX, endY);
      ctx.lineTo(startX - offsetX/2, startY - offsetY/2);
      ctx.closePath();
      ctx.fill();
    }
  }

  function drawPlanet(x, y, size, name) {
    ctx.beginPath();
    ctx.fillStyle = '#fff';
    ctx.arc(x, y, size, 0, Math.PI * 2);
    ctx.fill();

    const isMobile = window.innerWidth < 768;
    ctx.font = `${isMobile ? 8 : 10}px "Press Start 2P", monospace`;
    ctx.textAlign = 'center';
    ctx.fillText(name, x, y + size + 15);
  }

  function drawOrbit(centerX, centerY, radius) {
    ctx.beginPath();
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
    ctx.lineWidth = 1;
    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
    ctx.stroke();
  }

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const isMobile = window.innerWidth < 768;
    const SYSTEM_SCALE = isMobile ? 1.2 : 1.5;

    const scale = (Math.min(canvas.width, canvas.height) / 350) * SYSTEM_SCALE;

    drawOrbit(centerX, centerY, orbit1Radius * scale);
    drawOrbit(centerX, centerY, orbit2Radius * scale);
    drawOrbit(centerX, centerY, orbit3Radius * scale);

    drawStar(centerX, centerY, starSize * scale);
    ctx.font = '12px "Press Start 2P", monospace';
    ctx.textAlign = 'center';
    ctx.fillStyle = '#fff';
    ctx.fillText('ORATOM', centerX, centerY + starSize * scale + 25);

    const planet1X = centerX + orbit1Radius * scale * Math.cos(planet1Angle);
    const planet1Y = centerY + orbit1Radius * scale * Math.sin(planet1Angle);

    const planet2X = centerX + orbit2Radius * scale * Math.cos(planet2Angle);
    const planet2Y = centerY + orbit2Radius * scale * Math.sin(planet2Angle);

    const planet3X = centerX + orbit3Radius * scale * Math.cos(planet3Angle);
    const planet3Y = centerY + orbit3Radius * scale * Math.sin(planet3Angle);

    drawPlanet(planet1X, planet1Y, planet1Size * scale, 'CAINOU');
    drawPlanet(planet2X, planet2Y, planet2Size * scale, 'HIMPIS');
    drawPlanet(planet3X, planet3Y, planet3Size * scale, 'OTASUMA');

    planet1Angle += planet1Speed;
    planet2Angle += planet2Speed;
    planet3Angle += planet3Speed;

    systemAnimationId = requestAnimationFrame(animate);
  }

  animate();
}

// ==========================================
// Desalocação e Limpeza
// ==========================================
window.stopAllAnimations = function() {
  introTimeouts.forEach(clearTimeout);
  introTimeouts = [];

  if (globeAnimationId) {
    cancelAnimationFrame(globeAnimationId);
    globeAnimationId = null;
  }

  if (systemAnimationId) {
    cancelAnimationFrame(systemAnimationId);
    systemAnimationId = null;
  }

  if (globeRenderer) {
    globeRenderer.dispose();
    globeRenderer = null;
  }

  if (globeScene) {
    globeScene.traverse(child => {
      if (child.geometry) child.geometry.dispose();
      if (child.material) {
        if (child.material.map) child.material.map.dispose();
        child.material.dispose();
      }
    });
    globeScene.clear();
    globeScene = null;
  }

  if (resizeHandler) window.removeEventListener('resize', resizeHandler);
  if (systemResizeHandler) window.removeEventListener('resize', systemResizeHandler);

  if (handleClick) window.removeEventListener('click', handleClick);
  if (handleTouchStart) window.removeEventListener('touchstart', handleTouchStart);
  if (handleTouchEnd) window.removeEventListener('touchend', handleTouchEnd);
  if (handleWheel) window.removeEventListener('wheel', handleWheel);

  document.body.style.overflow = '';
  document.documentElement.style.overflow = '';
};