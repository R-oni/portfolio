window.initFlipbook = function(wrapperSelector) {
  const wrap = document.querySelector(wrapperSelector);
  const slides = [
    'mundos/botychera/imagens/cap1/pagina1.webp', // slide 3 - Lorem Ipsum
    'mundos/botychera/imagens/cap1/pagina2.webp', // slide 3                                // slide 2 - Lorem Ipsum  
    'mundos/botychera/imagens/cap1/pagina3.webp', // slide 4
    'mundos/botychera/imagens/cap1/pagina4.webp', // slide 5
    'GLOBO', 
    'LOREM_1', // slide 6
    'LOREM_2', // slide 6                                 // slide 8: globo
    'LOREM_30', // slide 6
    'LOREM_60', // slide 6
    'LOREM_90', // slide 6
    'LOREM_120', // slide 6
    'LOREM_150', // slide 6


  ];

  // Textos Lorem Ipsum para as duas primeiras páginas
  const loremTexts = {
    'LOREM_1': `
      <div class="lorem-page" style="color:#FFFFFF;">
        <p>Oceano sem beira te forma.</p>
        <p>O turquesa de sua superfície</p>
        <p>esconde o fundo negro</p>
        <p>de suas entranhas.</p>
        <p>Os bichos d'água que moram aqui</p>
        <p>nunca sentiram a luz de Caicona,</p>
        <p> a estrela-mãe que sopra teus ventos</p>
        <p>e aquece sua vida.</p>
        <p>Correntes profundas arrastam nutrientes,</p>
        <p>erguem cardumes e levam migrações,</p>
        <p>sustentando Botychera</p>
        <p>em seu respirar salgado.</p>
      </div>
    `,
    'LOREM_2': `
      <div class="lorem-page">
        <h2>CAPÍTULO I: Zona Eufótica</h2>
        <p>Botychera é um mundo oceânico.</p>
        <p>Não há montanhas, nem ilhas.</p>
        <p>A água cobre tudo, do equador</p>
        <p>aos polos</p>
        <p>Os bichos d'água que moram aqui</p>
        <p>nunca sentiram a luz de Caicona,</p>
        <p> a estrela-mãe que sopra teus ventos</p>
        <p>e aquece sua vida.</p>
        <p>Correntes profundas arrastam nutrientes,</p>
        <p>erguem cardumes e levam migrações,</p>
        <p>sustentando Botychera</p>
        <p>em seu respirar salgado.</p>

      </div>
    `,
    'LOREM_30': `
      <div class="lorem-page">
        <h2>CAPÍTULO II: Zona Mesopelágica</h2>
        <p>Botychera é um mundo oceânico.</p>


      </div>
    `,
      'LOREM_60': `
      <div class="lorem-page" style="color:#FFFFFF;">
        <h2 style="color:#FFFFFF;">CAPÍTULO III: Zona Batipelágica</h2>
        <p>Botychera é um mundo oceânico.</p>


      </div>
    `,
      'LOREM_90': `
      <div class="lorem-page" style="color:#FFFFFF;">
        <h2 style="color:#FFFFFF;">CAPÍTULO IV: Zona Abissopelágica</h2>
        <p>Botychera é um mundo oceânico.</p>


      </div>
    `,
      'LOREM_120': `
      <div class="lorem-page" style="color:#FFFFFF;">
        <h2 style="color:#FFFFFF;">CAPÍTULO V: Zona Hadopelágica</h2>
        <p>Botychera é um mundo oceânico.</p>


      </div>
    `,
      'LOREM_150': `
      <div class="lorem-page" style="color:#FFFFFF;">
        <h2 style="color:#FFFFFF;">CAPÍTULO VI: Zona Ultraabissal</h2>


      </div>
    `,
  };

  slides.forEach(src => {
    const slideEl = document.createElement('div');
    slideEl.className = 'swiper-slide';
    
    if (src === 'GLOBO') {
      // canvas para o globo
      slideEl.innerHTML = `<canvas id="globeCanvas" style="width:100%;height:100%"></canvas>`;
    } else if (loremTexts[src]) {
      // Corrigido: agora aceita qualquer LOREM_X
      slideEl.innerHTML = loremTexts[src];
    } else {
      // imagens normais
      slideEl.innerHTML = `<img src="${src}" style="max-width:100%;max-height:100%" draggable="false">`;
    }
    wrap.appendChild(slideEl);
  });
};

// Three.js globe init (completamente sem sombras e reflexos)
window.initGlobe = function(selector) {
  const canvas = document.querySelector(selector);
  if (!canvas) return;

  // Ajusta o tamanho do canvas para a resolução real da tela (HiDPI)
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

  // Cena com fundo branco
  const scene = new THREE.Scene();
  scene.background = null;

  const camera = new THREE.PerspectiveCamera(
    60,
    canvas.clientWidth / canvas.clientHeight,
    0.1,
    1000
  );
  camera.position.z = 4;

  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
    alpha: true,
    preserveDrawingBuffer: false
  });
  renderer.setSize(canvas.clientWidth, canvas.clientHeight, false);
  renderer.setPixelRatio(window.devicePixelRatio || 1);

  // IMPORTANTE: Desabilitar completamente o sistema de sombras
  renderer.shadowMap.enabled = false;

  const controls = new THREE.OrbitControls(camera, canvas);
  controls.enableDamping = true;

  const loader = new THREE.TextureLoader();

  // Globo com material básico (sem reflexos nem sombras)
  const earth = new THREE.Mesh(
    new THREE.SphereGeometry(1, 64, 64), // Aumenta a resolução da esfera
    new THREE.MeshBasicMaterial({
      map: loader.load('mundos/botychera/mapabotychera.png'),
      transparent: false,
      opacity: 1,
    })
  );

  scene.add(earth);

  // Iluminação mínima (apenas para caso seja necessária)
  const ambientLight = new THREE.AmbientLight(0xffffff, 1);
  scene.add(ambientLight);

  // Animação
  (function animate() {
    requestAnimationFrame(animate);
    earth.rotation.y += 0.002;
    controls.update();
    resizeRendererToDisplaySize(renderer, camera); // Garante alta resolução sempre
    renderer.render(scene, camera);
  })();

  // Redimensionamento responsivo
  window.addEventListener('resize', () => {
    resizeRendererToDisplaySize(renderer, camera);
  });
};
