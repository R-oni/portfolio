window.initFlipbook = function(wrapperSelector) {
  const wrap = document.querySelector(wrapperSelector);
  const slides = [
    'mundos/cbdaf/imagens/cap1/pagina1.webp',     // slide 1
    'mundos/cbdaf/imagens/cap1/pagina2.webp',     // slide 2
    'mundos/cbdaf/imagens/cap1/pagina3.webp',     // slide 3
    'mundos/cbdaf/imagens/cap1/pagina4.webp',
    'GLOBO',      // slide 4
    'LOREM_1',
    'mundos/cbdaf/imagens/cap1/abertura.webp',
    'mundos/cbdaf/imagens/cap1/pagina5.webp',                               // slide 5: lorem ipsum 1
  
    'LOREM_2',
    'LOREM_3',
    'LOREM_4',
    'LOREM_5',                                    // slide 6: globo
  ];

  // Textos Lorem Ipsum
  const loremTexts = {
    'LOREM_1': `
      <div class="lorem-page" style="color:#5A3E36;">
        <p>Do respiro sai tua voz</p>
        <p>da tua voz emana sua música.</p>
        <p>Guerreiros de longa vida fazem da arena</p>
        <p>de areia, seu tabuleiro.</p>
        <p>No jogo, contam-se gemas e pelas gemas,</p>
        <p>definem suas moradas.</p>
        <p>É necessário, porém, transporem-se,</p>
        <p>transformando teu mundo, no tabuleiro,</p>
        <p>para que joguem também, com seus irmãos.</p>
      </div>
    `,
    'LOREM_2': `
      <div class="lorem-page"">
        <h2>CAPÍTULO I</h2>
        <p>Dois grandes continentes definem (F_2).</p>
        <p>Do alto logo se vê cabanas montadas com</p>
        <p>formas completas, separadas entre si</p>
        <p>pelo deserto.</p>
        <p>Hexápodes se ajeitam pelo espaço levando</p>
        <p>lanças e instrumentos musicais.</p>
        <p>Do outro lado, outros também se preparam</p>
        <p>carregando o mesmo.</p>
      </div>
    `,
      'LOREM_3': `
      <div class="lorem-page">
        <p>Por baixo da cacofonia indecifrável à</p>
        <p>primeira vista, se comunicam.</p>
        <p>Possuem seis membros, sendo dois pares</p>
        <p>para locomoção e um para manipulação.</p>
        <p>Dois pares de olhos;</p>
        <p>Dois pares de respiradores;</p>
        <p>e uma boca, os definem.</p>
      </div>
    `,
      'LOREM_4': `
      <div class="lorem-page">
        <p>Fazem uso dos respiradores para falar.</p>
        <p>Funcionam como instrumentos de sopro,</p>
        <p>emitindo sons em várias frequências.</p>
        <p>Quatro notas podem ser individuais</p>
        <p>ou conjuntas, formando um acorde.</p>
        <p>Este, é o quadrífono, sua linguagem falada.</p>
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
  
  // Cena com fundo branco
  const scene = new THREE.Scene();
  scene.background = new THREE.Color('#FFFFFF');
  
  const camera = new THREE.PerspectiveCamera(
    60,
    canvas.clientWidth / canvas.clientHeight,
    0.1,
    1000
  );
  camera.position.z = 4;
  
  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true
  });
  renderer.setSize(canvas.clientWidth, canvas.clientHeight);
  renderer.setPixelRatio(window.devicePixelRatio);
  
  // IMPORTANTE: Desabilitar completamente o sistema de sombras
  renderer.shadowMap.enabled = false;
  
  const controls = new THREE.OrbitControls(camera, canvas);
  controls.enableDamping = true;
  
  const loader = new THREE.TextureLoader();
  
  // Globo com material básico (sem reflexos nem sombras)
  const earth = new THREE.Mesh(
    new THREE.SphereGeometry(1, 32, 32),
    new THREE.MeshBasicMaterial({
      map: loader.load('mundos/cbdaf/mapacbdaf.png'),
      // Configurações para eliminar qualquer reflexo
      transparent: false,
      opacity: 1,
      // MeshBasicMaterial não reage à luz, eliminando reflexos
    })
  );
  
  scene.add(earth);
  
  // Camada de nuvens transparente
  const clouds = new THREE.Mesh(
    new THREE.SphereGeometry(1.01, 32, 32), // 1% maior que o globo (aproximadamente 10px)
    new THREE.MeshBasicMaterial({
      map: loader.load('mundos/cbdaf/nuvemcbdaf.png'),
      transparent: true,
      opacity: 0.7, // Ajuste a transparência conforme necessário
      alphaTest: 0.1 // Remove pixels muito transparentes
    })
  );

  scene.add(clouds);
  
  // Iluminação mínima (apenas para caso seja necessária)
  // Como usamos MeshBasicMaterial, a luz não afeta o objeto
  const ambientLight = new THREE.AmbientLight(0xffffff, 1);
  scene.add(ambientLight);
  
  // Animação
  (function animate() {
    requestAnimationFrame(animate);
    earth.rotation.y += 0.002;
    clouds.rotation.y += 0.0038; // Nuvens rotacionam um pouco mais devagar
    controls.update();
    renderer.render(scene, camera);
  })();
  
  // Redimensionamento responsivo
  window.addEventListener('resize', () => {
    const w = canvas.clientWidth, h = canvas.clientHeight;
    renderer.setSize(w, h);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  });
};
