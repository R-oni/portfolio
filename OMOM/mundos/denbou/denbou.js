window.initFlipbook = function(wrapperSelector) {
  const wrap = document.querySelector(wrapperSelector);
  const slides = [
    'mundos/denbou/imagens/cap1/pagina1.webp',     // slide 1
    'mundos/denbou/imagens/cap1/pagina2.webp',     // slide 2
    'mundos/denbou/imagens/cap1/pagina3.webp',     // slide 3
    'mundos/denbou/imagens/cap1/pagina4.webp',
    'GLOBO',      // slide 4
    'LOREM_1',

    'mundos/denbou/imagens/cap1/abertura.webp',
    'mundos/denbou/imagens/cap1/pagina5.webp',       
    'mundos/denbou/imagens/cap1/cena2.webp',
    'mundos/denbou/imagens/cap1/cena3.webp',
    'mundos/denbou/imagens/cap1/cena4.webp',     // slide 10
    'LOREM_2',
    'LOREM_3',
    'LOREM_4',
    'LOREM_5',
    'LOREM_6',
    'LOREM_7',
  ];

  // Pré-carrega o áudio do Denbou
  const borikoSound = new Audio('mundos/denbou/SFX/boriko.mp3');
  borikoSound.preload = 'auto';
  borikoSound.volume = 0.7; // Ajuste o volume se necessário
  window.denbouAudio = borikoSound;

  // Textos Lorem Ipsum
  const loremTexts = {
    'LOREM_1': `
      <div class="lorem-page" style="color:#5A3E36;">
        <p>Suas diferenças se mantêm no tempo</p>
        <p>e seus corpos só se tocam</p>
        <p>para a morte. Apesar de</p>
        <p>suas notáveis semelhanças, seus fluidos</p>
        <p>vitais não se missturam.</p>
        <p>Dobram e desdobram seu mundo ao</p>
        <p>bel-prazer, em um cabo de</p>
        <p>guerra milenar.</p>
        <p>Pois, assim como dobraram seu</p>
        <p>mundo, serão dobrados também.</p>
      </div>
    `,
    'LOREM_2': `
      <div class="lorem-page" style="color:#5A3E36;">
        <p>Este mundo tem me chamado</p>
        <p>atenção. Quanta desgraça ocorre aqui.</p>
        <p>O Okê ainda está avaliando</p>
        <p>mas se trata de milênios.</p>
        <p>As zonas de conflito se</p>
        <p>estendem por todo seu sistema</p>
        <p>estelar.</p>
      </div>
    `,
    'LOREM_3': `
      <div class="lorem-page" style="color:#5A3E36;">
        <p>São duas espécies distintas mas</p>
        <p>bem similares fisicamente. Eles geram</p>
        <p>filhos saudáveis mas o cruzamento</p>
        <p>é estritamente proibido. A pena</p>
        <p>é a morte de ambos</p>
        <p>e família. Os separei em</p>
        <p>dois povos: DenDen e BouBou.</p>
        <p>Os chamo juntos de DenBou.</p>
        <p>Há duas grandes linguagens, uma</p>
        <p>de cada espécie.</p>
      </div>
    `,
    'LOREM_4': `
      <div class="lorem-page" style="color:#5A3E36;">
        <p>Há alta atividade em seu</p>
        <p>mundo, BaiKapei. A rotação é</p>
        <p>de aproximadamente 30 horas. Mesmo</p>
        <p>com noites de quinze horas</p>
        <p>a atividade não para; são</p>
        <p>seres polifásicos por natureza.</p>
      </div>
    `,
    'LOREM_5': `
      <div class="lorem-page" style="color:#5A3E36;">
        <p>Todo o planeta é militarizado,</p>
        <p>com equipamentos bélicos aéreos, marinhos,</p>
        <p>terrestres, subterrâneos e espaciais. Os</p>
        <p>dois povos são separados pelo</p>
        <p>grande mar equatorial Baben Bobodou.</p>
        <p>Os DenDen vivem ao norte</p>
        <p>e os BouBou, no hemisfério</p>
        <p>sul.</p>
      </div>
    `,
    'LOREM_6': `
      <div class="lorem-page" style="color:#5A3E36;">
        <p>DEN DEN</p>
        <p>Criaturas voadoras e muito ágeis,</p>
        <p>possuem quatro tipo-corações e seis</p>
        <p>membros, com dois voltados ao</p>
        <p>voo. São bem adaptados ao</p>
        <p>deserto e aos extremos períodos</p>
        <p>de inverno. Suas construções arquitetônicas</p>
        <p>têm um formato esférico que</p>
        <p>refletem</p>
      </div>
    `,
    'LOREM_7': `
      <div class="lorem-page" style="color:#5A3E36;">
        <p>Voadores de olhos marcantes, dominam</p>
        <p>os céus com maestria; suas</p>
        <p>máquinas voadoras são extensões de</p>
        <p>seus corpos. Antagônicos aos DenDen,</p>
        <p>são especialistas em bunkers e</p>
        <p>infantaria subterrânea.</p>
      </div>
    `,
  };
  
  slides.forEach((src, index) => {
    const slideEl = document.createElement('div');
    slideEl.className = 'swiper-slide';
    slideEl.dataset.slideIndex = index;
    slideEl.dataset.slideSrc = src;
    
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

  // Função para detectar mudança de slide e tocar áudio
  function handleSlideChange(swiper) {
    const activeSlide = swiper.slides[swiper.activeIndex];
    const slideSrc = activeSlide.dataset.slideSrc;
    
    // Toca o som quando chega na cena4
    if (slideSrc === 'mundos/denbou/imagens/cap1/cena4.webp') {
      borikoSound.currentTime = 0;
      borikoSound.play().catch(e => console.log('Erro ao tocar áudio:', e));
    }
  }

  // Adiciona o event listener automaticamente no swiper
  setTimeout(() => {
    const swiper = document.querySelector('.swiper-container').swiper;
    if (swiper) {
      swiper.on('slideChange', handleSlideChange);
    }
  }, 100);
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

  // Cena com fundo roxo claro
  const scene = new THREE.Scene();
  scene.background = new THREE.Color('#f4e8ff');

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
      map: loader.load('mundos/denbou/imagens/mapabaikapei.webp'),
      transparent: false,
      opacity: 1,
    })
  );

  scene.add(earth);

  // Nuvens como no alouepoura
  const clouds = new THREE.Mesh(
    new THREE.SphereGeometry(1.02, 64, 64),
    new THREE.MeshBasicMaterial({
      map: loader.load('mundos/denbou/imagens/nuvembaikapei.webp'),
      transparent: true,
      opacity: 1,
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

// Função global para desvanecer o áudio do Denbou
window.fadeOutDenbouAudio = function() {
  if (window.denbouAudio && !window.denbouAudio.paused) {
    const audio = window.denbouAudio;
    const startVolume = audio.volume;
    const fadeStep = startVolume / 20; // 20 steps para fade mais rápido
    
    const fadeInterval = setInterval(() => {
      if (audio.volume > fadeStep) {
        audio.volume -= fadeStep;
      } else {
        audio.volume = 0;
        audio.pause();
        audio.currentTime = 0;
        clearInterval(fadeInterval);
      }
    }, 50);
  }
};
