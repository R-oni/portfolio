window.initFlipbook = function(wrapperSelector) {
  const wrap = document.querySelector(wrapperSelector);
  const slides = [
    'mundos/araporu/imagens/cap1/pagina1.webp', // slide 3 - Lorem Ipsum
    'mundos/araporu/imagens/cap1/pagina2.webp', // slide 3                                // slide 2 - Lorem Ipsum  
    'mundos/araporu/imagens/cap1/pagina3.webp', // slide 4
    'mundos/araporu/imagens/cap1/pagina4.webp', // slide 5
    'GLOBO',  
    'LOREM_1', // slide 6
    'LOREM_2', // slide 6
    'mundos/araporu/imagens/cap1/cena1.webp', // slide 5
    'LOREM_3', // slide 6
    'LOREM_4', // slide 6'
    'mundos/araporu/imagens/cap1/cena2.webp', // slide 5
    'LOREM_5', // slide 6
    'mundos/araporu/imagens/cap1/cena3.webp', // slide
    'LOREM_6', // slide 6
    'mundos/araporu/imagens/cap1/cena4.webp', // slide
    'LOREM_7', // slide 6
    'LOREM_8', // slide 6
    'LOREM_9', // slide 6
    'mundos/araporu/imagens/cap1/pagina5.webp', // slide

  ];

  // Textos Lorem Ipsum para as páginas
  const loremTexts = {
    'LOREM_1': `
      <div class="lorem-page" style="color:#4B2E19;">
        <p>A fome move os Araporus</p>
        <p>para uma nova morada. Pelas cores,</p>
        <p>têm seu nome. Pelas cores,</p>
        <p>expressam-se.</p>
        <p>As planícies gélidas de Araroy não são</p>
        <p>convidativas à vida.</p>
        <p>As formas d'água devem seguir caminho</p>
        <p>junto aos Rolodoborões se quiserem chegar</p>
        <p>em casa.</p>
      </div>
    `,
    'LOREM_2': `
      <div class="lorem-page">
        <h2>CAPÍTULO I</h2>
        <p>Um grupo abandona o lago congelado.</p>
        <p>Sem alimento nas águas, procuram agora</p>
        <p>sobre o gelo, onde nunca buscaram comida.</p>
        <p>As cores acesas no peito indicam o ritmo</p>
        <p>da caminhada, quem lidera, quem segue.</p>
        <p>Entram numa caverna para se abrigarem</p>
        <p>do frio.</p>
      </div>
    `,
    'LOREM_3': `
      <div class="lorem-page">
        <p>Reunidos na caverna, aproximadamente</p>
        <p>quinze indivíduos preparam uma migração.</p>
        <p>As cores do peito piscam devagar,</p>
        <p>trocando informações silenciosas,</p>
        <p>receosos com o caminho desconhecido</p>
        <p>que os aguarda.</p>
      </div>
    `,
    'LOREM_4': `
      <div class="lorem-page">
        <p>Possuem quatro membros delgados,</p>
        <p>sendo os traseiros adaptados à natação.</p>
        <p>se comunicam por um órgão localizado</p>
        <p>em seu tórax, o Wamnaripe, que</p>
        <p>é composto por seis módulos de cor.</p>
      </div>
    `,
    'LOREM_5': `
      <div class="lorem-page">
        <p>Cada módulo pode representar apenas</p>
        <p>uma cor, com exceção dos</p>
        <p>módulos E-F e do Cromotebum.</p>
        <p>Ao todo, são seis cores que,</p>
        <p>quando combinadas,</p>
        <p>representam um estado interno, conceito</p>
        <p>ou ação.</p>
      </div>
    `,
      'LOREM_6': `
      <div class="lorem-page">
        <p>O cromotebum funciona como uma</p>
        <p>proto-retina. É o único módulo</p>
        <p>que abarca as seis cores concentradas</p>
        <p>numa pequena região e mais um sensor:</p>
        <p>o nível de intensidade de luz.</p>
      </div>
    `,
    'LOREM_7': `
      <div class="lorem-page">
        <p>Decidem então, sair pela manhã,</p>
        <p>quando o vento ainda está calmo.</p>
        <p>Alguns minutos de caminhada já denunciam</p>
        <p>o árduo e ventanoso trajeto.</p>
        <p>caminham lentamente se firmando como podem,</p>
        <p>dados momentos, chegam a unir suas caudas,</p>
        <p>para se sustentarem juntos.</p>
        <p>Caminham lentamente se firmando como podem.</p>
      </div>
    `,
    'LOREM_8': `
      <div class="lorem-page">
        <p>O grupo se dispersa,</p>
        <p>cada um seguindo seu caminho.</p>
        <p>Alguns se perdem, outros se machucam com o</p>
        <p>forte vento que os arremessam nas rochas;</p>
        <p>mas todos seguem em frente,</p>
        <p>em busca de um novo lar.</p>
      </div>
    `,
    'LOREM_9': `
      <div class="lorem-page">
        <p>Um indivíduo (o batizei de Arapuá,</p>
        <p>por caminhar rapidamente na neve)</p>
        <p>para e se comunica com os demais.</p>
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
    new THREE.SphereGeometry(1, 64, 64),
    new THREE.MeshBasicMaterial({
      map: loader.load('mundos/araporu/imagens/mapaaraporu.png'),
      transparent: false,
      opacity: 1,
    })
  );
  scene.add(earth);

  // Camada de nuvem (igual veleywei)
  const clouds = new THREE.Mesh(
    new THREE.SphereGeometry(1.02, 64, 64),
    new THREE.MeshBasicMaterial({
      map: loader.load('mundos/araporu/imagens/nuvemaraporu.png'),
      transparent: true,
      opacity: 0.6,
    })
  );
  scene.add(clouds);

  // Iluminação mínima (apenas para caso seja necessária)
  const ambientLight = new THREE.AmbientLight(0xffffff, 1);
  scene.add(ambientLight);

  // Animação
  (function animate() {
    requestAnimationFrame(animate);
    earth.rotation.y += 0.002;
    clouds.rotation.y += 0.003; // nuvem gira um pouco mais rápido
    controls.update();
    resizeRendererToDisplaySize(renderer, camera);
    renderer.render(scene, camera);
  })();

  // Redimensionamento responsivo
  window.addEventListener('resize', () => {
    resizeRendererToDisplaySize(renderer, camera);
  });
};
