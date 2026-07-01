window.initFlipbook = function(wrapperSelector) {
  const wrap = document.querySelector(wrapperSelector);
  const slides = [
    'mundos/telome/imagens/cap1/pagina1.webp',     // slide 1
    'mundos/telome/imagens/cap1/pagina2.webp',     // slide 2
    'mundos/telome/imagens/cap1/pagina3.webp',     // slide 3
    'mundos/telome/imagens/cap1/pagina4.webp', 
    'GLOBO',   // slide 4
    'mundos/telome/imagens/cap1/cena1.webp',
    'mundos/telome/imagens/cap1/cena2.webp',
    'LOREM_1',
    'LOREM_2', // slide 5: lorem ipsum 1
    'LOREM_3', // slide 5: lorem ipsum 1
    'LOREM_4', // slide 5: lorem ipsum 1
    'LOREM_5', // slide 5: lorem ipsum 1
    'LOREM_6', // slide 5: lorem ipsum 1
                             // slide 5: lorem ipsum 1
                                       // slide 6: globo
  ];

  // Textos Lorem Ipsum
  const loremTexts = {
    'LOREM_1': `
      <div class="lorem-page" style="color:#5A3E36;">
        <p>Exímios inventores, arquitetos de</p>
        <p>seus mundos. Por milênios transformaram</p>
        <p>barro e ferro em facilitadores</p>
        <p>de suas vontades.</p>
        <p>A eficiência é o núcleo de seus pensamentos</p>
        <p>e com base neles, projetou-se.</p>
        <p>Em um colapso, nasce o automador insaciável</p>
        <p>cujo objetivo único é subtrair o que há.</p>
        <p>Nada mais.</p>
      </div>
    `,
    'LOREM_2': `
      <div class="lorem-page">
        <h2>CAPÍTULO I</h2>
        <p>9:45 AM.</p>
        <p>Dois operários dividem o que parece ser</p>
        <p>algum tipo de bolo ou torta.</p>
        <p>Um usa dois de quatro tentáculos manipuladores</p>
        <p>reparte um pedaço e oferece ao colega.</p>
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
      // textos lorem ipsum
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
  scene.background = new THREE.Color('#e6ffc2');

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
    alpha: false,
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
      map: loader.load('mundos/telome/imagens/mapatelome.webp'),
      transparent: false,
      opacity: 1,
    })
  );

  scene.add(earth);

  // Nuvens como no alouepoura
  const clouds = new THREE.Mesh(
    new THREE.SphereGeometry(1.02, 64, 64),
    new THREE.MeshBasicMaterial({
      map: loader.load('mundos/telome/imagens/nuvemtelome.webp'),
      transparent: true,
      opacity: 0.6,
    })
  );

  scene.add(clouds);

  // Animação
  (function animate() {
    requestAnimationFrame(animate);
    
    // Rotação do planeta
    earth.rotation.y += 0.002;
    
    // Rotação das nuvens (um pouco mais rápida)
    clouds.rotation.y += 0.003;
    
    controls.update();
    resizeRendererToDisplaySize(renderer, camera); // Garante alta resolução sempre
    renderer.render(scene, camera);
  })();

  // Redimensionamento responsivo
  window.addEventListener('resize', () => {
    resizeRendererToDisplaySize(renderer, camera);
  });
};
