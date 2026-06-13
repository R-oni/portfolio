let globeRenderer1, globeRenderer2, globeScene1, globeScene2;
let orbitAnimationId, globe1AnimationId, globe2AnimationId;
let resizeHandler1, resizeHandler2, orbitResizeHandler;

window.initFlipbook = function(wrapperSelector) {
  const wrap = document.querySelector(wrapperSelector);
  const slides = [
    'mundos/veleywei/imagens/cap1/pagina1.webp',
    'mundos/veleywei/imagens/cap1/pagina2.webp',
    'ORBITA',
    'mundos/veleywei/imagens/cap1/pagina3.webp',
    'mundos/veleywei/imagens/cap1/galaxia.webp',
    'mundos/veleywei/imagens/cap1/pagina4.webp',
    'mundos/veleywei/imagens/cap1/pagina5.webp', // ← Esta é a página 5 com os globos
    'mundos/veleywei/imagens/cap1/pagina6.webp',
    'mundos/veleywei/imagens/cap1/pagina7.webp',
    'mundos/veleywei/imagens/cap1/pagina8.webp',
    'mundos/veleywei/imagens/cap1/pagina9.webp',
    'mundos/veleywei/imagens/cap1/pagina10.webp',
    'mundos/veleywei/imagens/cap1/pagina11.webp',
    'mundos/veleywei/imagens/cap1/pagina12.webp',
    'mundos/veleywei/imagens/cap1/pagina13.webp',
    'mundos/veleywei/imagens/cap1/pagina14.webp',
    'mundos/veleywei/imagens/cap1/pagina15.webp',
    'mundos/veleywei/imagens/cap1/pagina16.webp',
    'mundos/veleywei/imagens/cap1/yeroben.webp',
    'mundos/veleywei/imagens/cap1/bureo.webp',
  ];

  const loremTexts = {};

  slides.forEach(src => {
    const slideEl = document.createElement('div');
    slideEl.className = 'flipbook-slide';

    if (src === 'mundos/veleywei/imagens/cap1/pagina4.webp') {
      // Página 5 especial com dois globos sobrepostos
      slideEl.innerHTML = `
        <div style="display: flex; align-items: center; justify-content: center; width: 100%; height: 100%;">
          <!-- Container da imagem com canvas sobreposto -->
          <div style="position: relative; width: 100%; height: auto; max-width: 100%; display: inline-block;">
            <!-- Canvas do primeiro globo (TokTok) em cima -->
            <canvas id="globeCanvas1" style="
              position: absolute;
              top: 77%;
              left: 71%;
              transform: translate(-50%, -50%);
              width: 57%;
              aspect-ratio: 1;
              z-index: 0;
            "></canvas>
          
            
            <!-- Imagem da página 5 NA FRENTE -->
            <img src="mundos/veleywei/imagens/cap1/pagina4.webp" 
                 style="
                   width: 100%;
                   height: auto;
                   display: block;
                   position: relative;
                   z-index: 2;
                 " 
                 draggable="false">
          </div>
        </div>
      `;
    } else if (src === 'GLOBO') {
      slideEl.innerHTML = `<div style="width:100%; height:80vh; min-height:400px;">
                            <canvas id="globeCanvas" style="width:100%;height:100%"></canvas>
                            </div>`;
    } else if (src === 'ORBITA') {
      // Imagem de fundo + canvas sobreposto (sem borda)
      slideEl.innerHTML = `
        <div style="position:relative; width:100%; max-width:100%;">
          <img id="orbitBg" src="mundos/veleywei/imagens/cap1/orbita.webp"
               style="display:block; width:100%; height:auto;" draggable="false" />
          <canvas id="orbitCanvas" style="
               position:absolute; inset:0; width:100%; height:100%;
               display:block;"></canvas>
        </div>`;
    } else if (loremTexts[src]) {
      slideEl.innerHTML = loremTexts[src];
    } else {
      slideEl.innerHTML = `<img src="${src}" style="width:100%; height:auto; display:block;" draggable="false">`;
    }
    wrap.appendChild(slideEl);
  });
  
  // Inicializar os globos após criar os slides
  setTimeout(() => {
    // Espera o canvas ter tamanho > 0 antes de inicializar
    const waitForSize = (selector, initFn, maxAttempts = 20) => {
      const canvas = document.querySelector(selector);
      if (!canvas) return;
      
      let attempts = 0;
      
      const checkSize = () => {
        if (canvas.clientWidth > 0 && canvas.clientHeight > 0) {
          console.log(`Inicializando ${selector} após ${attempts} tentativas`);
          initFn(selector);
        } else if (attempts++ < maxAttempts) {
          console.log(`Aguardando tamanho para ${selector}, tentativa ${attempts}`);
          setTimeout(checkSize, 100);
        } else {
          console.log(`Falha ao aguardar tamanho para ${selector}, inicializando mesmo assim`);
          initFn(selector);
        }
      };
      
      checkSize();
    };

    waitForSize('#globeCanvas1', initGlobe1);

    const startOrbit = () => initOrbit('#orbitCanvas');
    const orbitImg = document.getElementById('orbitBg');
    if (orbitImg && !orbitImg.complete) {
      orbitImg.addEventListener('load', startOrbit, { once: true });
    } else {
      startOrbit();
    }
  }, 100);
  
  // Adicionar estilos CSS para o popup
  if (!document.getElementById('popup-styles')) {
    const styleEl = document.createElement('style');
    styleEl.id = 'popup-styles';
    styleEl.innerHTML = `
      .info-popup {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        background-color: rgba(0, 0, 0, 0.85);
        z-index: 10000;
        opacity: 0;
        transition: opacity 0.3s ease;
      }
      .info-popup-content {
        background: white;
        padding: 20px;
        border-radius: 12px;
        max-width: 90%;
        max-height: 90%;
        display: flex;
        flex-direction: column;
        align-items: center;
        box-shadow: 0 4px 20px rgba(0,0,0,0.25);
      }
      .info-popup-image {
        max-width: 100%;
        max-height: 70vh;
        border-radius: 8px;
        margin-bottom: 15px;
      }
      .info-popup-text {
        font-family: 'VT323', monospace;
        font-size: 24px;
        color: #333;
        text-align: center;
        margin-top: 15px;
      }
      .clickable-word {
        position: relative;
        display: inline-block;
        animation: pulse 2s infinite;
      }
      @keyframes pulse {
        0% { transform: scale(1); }
        50% { transform: scale(1.15); }
        100% { transform: scale(1); }
      }
    `;
    document.head.appendChild(styleEl);
  }
  
  // Configurar evento após a criação dos slides
  setTimeout(() => {
    document.querySelectorAll('.clickable-word').forEach(word => {
      word.addEventListener('click', function() {
        const imageSrc = this.getAttribute('data-image');
        showInfoPopup(imageSrc); // ← REMOVER O PARÂMETRO 'text'
      });
    });
  }, 1000);
  
  // Função para mostrar o popup (sem texto)
  window.showInfoPopup = function(imageSrc) {
    const existingPopup = document.querySelector('.info-popup');
    if (existingPopup) {
      document.body.removeChild(existingPopup);
    }
    
    const popup = document.createElement('div');
    popup.className = 'info-popup';
    
    const content = document.createElement('div');
    content.className = 'info-popup-content';
    
    const img = document.createElement('img');
    img.src = imageSrc;
    img.className = 'info-popup-image';
    img.alt = '';
    
    // REMOVER A PARTE DO TEXTO
    content.appendChild(img);
    popup.appendChild(content);
    document.body.appendChild(popup);
    
    setTimeout(() => {
      popup.style.opacity = '1';
    }, 10);
    
    popup.addEventListener('click', function() {
      popup.style.opacity = '0';
      setTimeout(() => {
        document.body.removeChild(popup);
      }, 300);
    });
  };
};



// Função para inicializar o primeiro globo (TokTok)
window.initGlobe1 = function(selector) {
  const canvas = document.querySelector(selector);
  if (!canvas) return;

  function resizeRendererToDisplaySize(renderer, camera) {
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    const pixelRatio = window.devicePixelRatio || 1;
    const displayWidth = Math.floor(width * pixelRatio);
    const displayHeight = Math.floor(height * pixelRatio);

    if (canvas.width !== displayWidth || canvas.height !== displayHeight) {
      renderer.setSize(width, height, false);
      renderer.setPixelRatio(pixelRatio);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    }
  }

  globeScene1 = new THREE.Scene();
  globeScene1.background = new THREE.Color('#000000'); // fundo preto ou cor desejada

  const camera = new THREE.PerspectiveCamera(
    60,
    canvas.clientWidth / canvas.clientHeight,
    0.1,
    1000
  );
  camera.position.z = 2.5;

  globeRenderer1 = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
    alpha: false,
    preserveDrawingBuffer: false
  });
  globeRenderer1.setSize(canvas.clientWidth, canvas.clientHeight, false);
  globeRenderer1.setPixelRatio(window.devicePixelRatio || 1);
  globeRenderer1.shadowMap.enabled = false;

  const controls = new THREE.OrbitControls(camera, canvas);
  controls.enableDamping = true;

  const loader = new THREE.TextureLoader();

  // Primeiro globo (TokTok)
  const earth1 = new THREE.Mesh(
    new THREE.SphereGeometry(1, 64, 64),
    new THREE.MeshBasicMaterial({
      map: loader.load('mundos/veleywei/imagens/mapaveleywei.webp'),
      transparent: false,
      opacity: 1,
    })
  );
  
  // Adicionar camada de nuvens
  const cloudsMesh = new THREE.Mesh(
    new THREE.SphereGeometry(1.02, 64, 64), // Ligeiramente maior que o planeta
    new THREE.MeshBasicMaterial({
      map: loader.load('mundos/veleywei/imagens/nuvemveleywei.webp'),
      transparent: true,
      opacity: 0.8,
    })
  );
  
  earth1.rotation.y = Math.PI / 4;
  globeScene1.add(earth1);
  globeScene1.add(cloudsMesh); // Adiciona a camada de nuvens à cena

  // Animação
  (function animate() {
    if (!globeScene1 || !globeRenderer1) return;
    
    globe1AnimationId = requestAnimationFrame(animate);
    
    earth1.rotation.y += 0.001; // Rotação do planeta
    cloudsMesh.rotation.y += 0.0012; // Rotação um pouco mais rápida para as nuvens
    
    controls.update();
    resizeRendererToDisplaySize(globeRenderer1, camera);
    globeRenderer1.render(globeScene1, camera);
  })();

  resizeHandler1 = () => resizeRendererToDisplaySize(globeRenderer1, camera);
  window.addEventListener('resize', resizeHandler1);
};

// Função para inicializar o segundo globo (TTok)
window.initGlobe2 = function(selector) {
  const canvas = document.querySelector(selector);
  if (!canvas) return;

  function resizeRendererToDisplaySize(renderer, camera) {
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    const pixelRatio = window.devicePixelRatio || 1;
    const displayWidth = Math.floor(width * pixelRatio);
    const displayHeight = Math.floor(height * pixelRatio);

    if (canvas.width !== displayWidth || canvas.height !== displayHeight) {
      renderer.setSize(width, height, false);
      renderer.setPixelRatio(pixelRatio);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    }
  }

  globeScene2 = new THREE.Scene();
  globeScene2.background = new THREE.Color('#000000'); // fundo preto ou cor desejada

  const camera = new THREE.PerspectiveCamera(
    60,
    canvas.clientWidth / canvas.clientHeight,
    0.1,
    1000
  );
  camera.position.z = 2.5;

  globeRenderer2 = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
    alpha: false,
    preserveDrawingBuffer: false
  });
  globeRenderer2.setSize(canvas.clientWidth, canvas.clientHeight, false);
  globeRenderer2.setPixelRatio(window.devicePixelRatio || 1);
  globeRenderer2.shadowMap.enabled = false;

  const controls = new THREE.OrbitControls(camera, canvas);
  controls.enableDamping = true;

  const loader = new THREE.TextureLoader();

  // Segundo globo (TTok)
  const earth2 = new THREE.Mesh(
    new THREE.SphereGeometry(1, 64, 64),
    new THREE.MeshBasicMaterial({
      map: loader.load('mundos/ttok/imagens/mapattok.png'),
      transparent: false,
      opacity: 1,
    })
  );

  globeScene2.add(earth2);

  // Animação
  function animate() {
    if (!globeScene2 || !globeRenderer2) return;
    
    globe2AnimationId = requestAnimationFrame(animate);
    
    earth2.rotation.y += 0.01;
    
    controls.update();
    resizeRendererToDisplaySize(globeRenderer2, camera);
    globeRenderer2.render(globeScene2, camera);
  }

  resizeHandler2 = () => resizeRendererToDisplaySize(globeRenderer2, camera);
  window.addEventListener('resize', resizeHandler2);

  // Iniciar animação
  animate();
};



// ===================================================================
// SISTEMA ORBITAL 2D - VERSÃO FLAT SEM THREE.JS
// ===================================================================

window.initOrbit = function(selector) {
  const canvas = document.querySelector(selector);
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let animationId = null;

  // Configuração do canvas
  let centerX = 0, centerY = 0, scale = 1;
  function resizeCanvas() {
    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;
    centerX = canvas.width / 2;
    centerY = canvas.height / 2;
    scale = Math.min(canvas.width, canvas.height) / 400;

    // Detectar se é dispositivo móvel (tela pequena)
    const isMobile = window.innerWidth < 768;
    
    // Escala maior para mobile, normal para desktop
    const SYSTEM_SCALE = isMobile ? 0.75 : 0.68;
    
    scale = (Math.min(canvas.width, canvas.height) / 400) * SYSTEM_SCALE;

  }
  resizeCanvas();
  orbitResizeHandler = resizeCanvas;
  window.addEventListener('resize', orbitResizeHandler);

  // Configuração do sistema orbital
  // const centerX = canvas.width / 2;
  // const centerY = canvas.height / 2;
  // const scale = Math.min(canvas.width, canvas.height) / 400; // Escala responsiva

  // Objetos do sistema
  const objects = {
    star:       { radius: 20 * scale,                 angle: 0,         speed: 0,      name: 'Baruetã',    color: '#000' },
    pde:        { radius:  3 * scale, orbitRadius:  40 * scale, angle: 0,         speed: 0.01,  name: 'Purô-de',    color: '#000' },
    pve:        { radius:  4 * scale, orbitRadius:  60 * scale, angle: Math.PI/3, speed: 0.005,  name: 'Purô-ve',    color: '#000' },
    vw:         { radius:  5 * scale, orbitRadius: 180 * scale, angle: Math.PI/1.5, speed: 0.001, name: 'Veley-wei',  color: '#000' },
    parosibni:  { radius:  1 * scale, orbitRadius:  15 * scale, angle: 0,         speed: 0.03,  name: 'Parosibni',  parent: 'vw', color: '#000' },
    pupei:      { radius:  1.2 * scale, orbitRadius:  25 * scale, angle: 1,         speed: 0.02,  name: 'Pupei',      parent: 'vw', color: '#000' },
    oba:        { radius:  0.7 * scale, orbitRadius:  35 * scale, angle: 2,         speed: 0.01,  name: 'Ob-a',       parent: 'vw', color: '#000' }
  };

  // Função para desenhar círculos preenchidos
  function drawFilledCircle(x, y, radius, color = '#000') {
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fillStyle = color;
    ctx.fill();
  }

  // Função para desenhar órbitas (círculos vazios sutis)
  function drawOrbit(centerX, centerY, radius) {
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(0, 0, 0, 0.2)';
    ctx.lineWidth = 1;
    ctx.stroke();
  }

  // Função para desenhar texto
  function drawLabel(x, y, text) {
    ctx.fillStyle = '#000';
    ctx.font = `${Math.max(5, 8 * scale)}px 'Press Start 2P', monospace`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(text, x, y);
  }

  // Função para desenhar estrela de 8 pontas
  function drawStar(x, y, radius, color = '#000') {
    ctx.fillStyle = color;
    ctx.beginPath();
    
    // Desenhar a esfera central primeiro
    ctx.arc(x, y, radius * 0.4, 0, Math.PI * 2);
    ctx.fill();
    
    // Configurar as pontas
    const largeLength = radius * 1.2; // Pontas grandes
    const smallLength = radius * 0.8; // Pontas pequenas
    const thickness = radius * 0.09;  // Espessura das pontas
    
    // Array com os ângulos e tamanhos das pontas
    const spikes = [
      { angle: 0, length: largeLength },           // Direita
      { angle: Math.PI / 4, length: smallLength }, // Nordeste
      { angle: Math.PI / 2, length: largeLength }, // Cima
      { angle: 3 * Math.PI / 4, length: smallLength }, // Noroeste
      { angle: Math.PI, length: largeLength },     // Esquerda
      { angle: 5 * Math.PI / 4, length: smallLength }, // Sudoeste
      { angle: 3 * Math.PI / 2, length: largeLength }, // Baixo
      { angle: 7 * Math.PI / 4, length: smallLength }  // Sudeste
    ];
    
    // Desenhar cada ponta
    spikes.forEach(spike => {
      ctx.beginPath();
      
      // Ponto inicial (centro da estrela)
      const startX = x + Math.cos(spike.angle) * (radius * 0.4);
      const startY = y + Math.sin(spike.angle) * (radius * 0.4);
      
      // Ponto final da ponta
      const endX = x + Math.cos(spike.angle) * spike.length;
      const endY = y + Math.sin(spike.angle) * spike.length;
      
      // Pontos laterais para dar espessura
      const perpAngle1 = spike.angle + Math.PI / 2;
      const perpAngle2 = spike.angle - Math.PI / 2;
      
      const side1X = startX + Math.cos(perpAngle1) * thickness;
      const side1Y = startY + Math.sin(perpAngle1) * thickness;
      const side2X = startX + Math.cos(perpAngle2) * thickness;
      const side2Y = startY + Math.sin(perpAngle2) * thickness;
      
      // Desenhar a ponta como um triângulo
      ctx.moveTo(side1X, side1Y);
      ctx.lineTo(side2X, side2Y);
      ctx.lineTo(endX, endY);
      ctx.closePath();
      ctx.fill();
    });
  }

  // Função principal de animação
  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Órbitas dos três planetas
    ['pde','pve','vw'].forEach(key =>
      drawOrbit(centerX, centerY, objects[key].orbitRadius)
    );

    // Estrela central com pontas
    drawStar(centerX, centerY, objects.star.radius);
    drawLabel(centerX, centerY - objects.star.radius - 10, objects.star.name);

    // Posições temporárias
    const positions = {};

    // Planetas
    ['pde','pve','vw'].forEach(key => {
      const o = objects[key];
      const x = centerX + Math.cos(o.angle) * o.orbitRadius;
      const y = centerY + Math.sin(o.angle) * o.orbitRadius;
      drawFilledCircle(x, y, o.radius, o.color);
      drawLabel(x, y - o.radius - 10, o.name);
      positions[key] = { x, y };
      o.angle += o.speed;
    });

    // Luas de Veley-wei
    ['parosibni','pupei','oba'].forEach(key => {
      const m = objects[key];
      const parent = positions[m.parent];
      drawOrbit(parent.x, parent.y, m.orbitRadius);
      const x = parent.x + Math.cos(m.angle) * m.orbitRadius;
      const y = parent.y + Math.sin(m.angle) * m.orbitRadius;
      drawFilledCircle(x, y, m.radius, m.color);
      drawLabel(x, y - m.radius - 5, m.name);
      m.angle += m.speed;
    });

    animationId = requestAnimationFrame(animate);
  }

  // Iniciar animação
  animate();

  // Função de limpeza (para ser chamada quando sair do slide)
  return function cleanup() {
    if (animationId) {
      cancelAnimationFrame(animationId);
      animationId = null;
    }
    window.removeEventListener('resize', resizeCanvas);
  };
};

// Adicionar esta função após as variáveis globais
window.stopAllAnimations = function() {
  // Parar animações
  if (orbitAnimationId) {
    cancelAnimationFrame(orbitAnimationId);
    orbitAnimationId = null;
  }
  if (globe1AnimationId) {
    cancelAnimationFrame(globe1AnimationId);
    globe1AnimationId = null;
  }
  if (globe2AnimationId) {
    cancelAnimationFrame(globe2AnimationId);
    globe2AnimationId = null;
  }
  
  // Limpar renderers
  if (globeRenderer1) {
    globeRenderer1.dispose();
    globeRenderer1 = null;
  }
  if (globeRenderer2) {
    globeRenderer2.dispose();
    globeRenderer2 = null;
  }
  
  // Limpar cenas
  if (globeScene1) {
    globeScene1.traverse(child => {
      if (child.geometry) child.geometry.dispose();
      if (child.material) {
        if (child.material.map) child.material.map.dispose();
        child.material.dispose();
      }
    });
    globeScene1.clear();
    globeScene1 = null;
  }
  
  if (globeScene2) {
    globeScene2.traverse(child => {
      if (child.geometry) child.geometry.dispose();
      if (child.material) {
        if (child.material.map) child.material.map.dispose();
        child.material.dispose();
      }
    });
    globeScene2.clear();
    globeScene2 = null;
  }
  
  // Remover event listeners
  if (resizeHandler1) window.removeEventListener('resize', resizeHandler1);
  if (resizeHandler2) window.removeEventListener('resize', resizeHandler2);
  if (orbitResizeHandler) window.removeEventListener('resize', orbitResizeHandler);
};
