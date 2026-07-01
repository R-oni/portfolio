window.initFlipbook = function(wrapperSelector) {
  const wrap = document.querySelector(wrapperSelector);
  const slides = [
    'mundos/sapador/imagens/cap1/pagina1.webp',
    // slide 1
    'mundos/sapador/imagens/cap1/pagina2.webp',     // slide 2
    'mundos/sapador/imagens/cap1/pagina3.webp',     // slide 3
    'mundos/sapador/imagens/cap1/pagina4.webp', 
    'GLOBO',   // slide 4
    'LOREM_1',
    'LOREM_2', // slide 5: lorem ipsum 1
    'LOREM_3', // slide 5: lorem ipsum 1
    'mundos/sapador/imagens/cap1/cena1.webp',
    'LOREM_4', // slide 5: lorem ipsum 1
    'LOREM_5', // slide 5: lorem ipsum 1
    'LOREM_6', // slide 5: lorem ipsum 1
    'LOREM_7', // slide 5: lorem ipsum 1
    'LOREM_8', // slide 5: lorem ipsum 1
    'LOREM_9', // slide 5: lorem ipsum 1
    'LOREM_10', // slide 5: lorem ipsum 1
    'LOREM_11', // slide 5: lorem ipsum 1
    'mundos/sapador/imagens/cap1/cena2.webp',
    'LOREM_12', // slide 5: lorem ipsum 1
    'mundos/sapador/imagens/cap1/cena3.webp',
    'LOREM_13', // slide 5: lorem ipsum 1
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
    'LOREM_3': `
      <div class="lorem-page">
        <p>Ambos então, manipulam uma chave de ativação</p>
        <p>dupla de formato quadrado. Cada lado possui</p>
        <p>um padrão que é conhecido apenas por um deles.</p>
        <p>Parece-me um sistema de segurança.</p>
      </div>
    `,
    'LOREM_4': `
      <div class="lorem-page">
        <p>Assim, às 9:50 AM dá-se partida a </p>
        <p>Krloi-Vuntey-p-[Ksoi],</p>
        <p>o maior sistema de automação e logística</p>
        <p>de Kr-nto-p, o planeta que os abriga.</p>
      </div>
    `,
    'LOREM_5': `
      <div class="lorem-page">
        <p>O Okê traduziu o nome como "Rede Central".</p>
        <p>Após a partida, a rede aquece por dez minutos</p>
        <p>como de costume, pois é periodicamente desligada,</p>
        <p>para eivitar sobreaquecimento.</p>
        <p>a Rede Central é uma combinação de laboratório</p>
        <p>físico-químico com um sistema automático</p>
        <p>inteligente, tipo IA.</p>
      </div>
    `,
    'LOREM_6': `
      <div class="lorem-page">
        <p>Parece fazer uso de nanites (colóides inteligentes)</p>
        <p>para detecção de anomalias e falhas em sistemas</p>
        <p>públicos.</p>
        <p>Lida com distribuição de alimentos, conserto de</p>
        <p>cabos elétricos, trilhos de transporte etc.</p>
        <p>De fato, é o coração logístico de Kr-nto-p.</p>
      </div>
    `,
    'LOREM_7': `
      <div class="lorem-page">
        <p>O Okê traduziu o nome como "Rede Central".</p>
        <p>Após a partida, a rede aquece por dez minutos</p>
        <p>como de costume, pois é periodicamente desligada,</p>
        <p>para eivitar sobreaquecimento.</p>
        <p>a Rede Central é uma combinação de laboratório</p>
        <p>físico-químico com um sistema automático</p>
        <p>inteligente.</p>
      </div>
    `,
    'LOREM_8': `
      <div class="lorem-page">
        <p>O Okê traduziu o nome como "Sistema Central".</p>
        <p>Após a partida, a rede aquece por dez minutos</p>
        <p>como de costume, pois é periodicamente desligada,</p>
        <p>para eivitar sobreaquecimento.</p>
        <p>a Rede Central é uma combinação de laboratório</p>
        <p>físico-químico com um sistema automático</p>
        <p>inteligente.</p>
      </div>
    `,
    'LOREM_9': `
      <div class="lorem-page">
        <p>Às 10:00 AM o Sistema Central está pronto</p>
        <p>para operar.</p>
        <p>A rede substitutiva — que fica ligada quando</p>
        <p>o Sistema Central está resfriando — desliga</p>
        <p>e o SC toma lugar.</p>
      </div>
    `,
    'LOREM_10': `
      <div class="lorem-page">
        <p>Ouve-se um grito no corredor.</p>
        <p>Quando os dois operários se viram para olhar,</p>
        <p>Fitam a tragédia: </p>
        <p>o núcleo de Krloi-Vuntey-p-[Ksoi] emite</p>
        <p>um intenso clarão, seguido de uma implosão</p>
        <p>que parece distorcer o espaço ao redor</p>
        <p>como uma lente gravitacional, atraindo parte</p>
      </div>
    `,
    'LOREM_11': `
      <div class="lorem-page">
        <p>das paredes, que se desprenderam.</p>
        <p>Diversos servidores se aproximam do núcleo para</p>
        <p>averiguar. O que antes era um conjunto de</p>
        <p>tubos, processadores e cabos, transforma-se</p>
        <p>numa estrutura geométrica de cubos que parecem</p>
        <p>dobrar e oscilar sobre si mesmos ao redor de</p>
        <p>uma singularidade.</p>
      </div>
    `,
    'LOREM_12': `
      <div class="lorem-page">
        <p>A coisa parece ter múltiplas dimensões</p>
        <p>oscilantes.</p>
        <p>Todos ali então, evacuam a torre.</p>
        <p>No lado externo, vários ainda tentam</p>
        <p>entender o que se passa enquanto</p>
        <p>observam o antigo sistema, ineptos</p>
        <p>o vendo parecer crescer cada vez mais.</p>
      </div>
    `,
    'LOREM_13': `
      <div class="lorem-page">
        <p>Assim, nasce o que mais tarde chamarão de</p>
        <p>Krloi-TvmE[PayTonTon], ou, pela tradução do</p>
        <p>Okê: "Rede Sapadora Singular".</p>
        <p>Chamo de Omnívoro Sistema Sapador.</p>
      </div>
    `,
      'LOREM_14': `
      <div class="lorem-page">
        <h2>Kr-nto-p</h2>
        <p>Seu mundo é banhado pela luz de uma</p>
        <p>anã vermelha, tipo M, Kry-nto-k</p>
        <p>É o segundo planeta da órbita e os sinais de</p>
        <p>seu povo podem ser vistos do espaço.</p>
      </div>
    `,
      'LOREM_15': `
      <div class="lorem-page">
        <p>Constroem suas cidades em padrões circulares</p>
        <p>que se conectam ecifientemente, formando</p>
        <p>cidades, complexos, bairros, ruas e avenidas</p>
        <p>interligadas por uma rede de anéis e tubos</p>
        <p>de transporte.</p>
      </div>
    `,
      'LOREM_16': `
      <div class="lorem-page">
        <p>Assim, nasce o que mais tarde chamarão de</p>
        <p>Krloi-TvmE[PayTonTon], ou, pela tradução do</p>
        <p>Okê: "Rede Sapadora Singular".</p>
        <p>Chamo de Omnívoro Sistema Sapador.</p>
      </div>
    `,
      'LOREM_13': `
      <div class="lorem-page">
        <p>Assim, nasce o que mais tarde chamarão de</p>
        <p>Krloi-TvmE[PayTonTon], ou, pela tradução do</p>
        <p>Okê: "Rede Sapadora Singular".</p>
        <p>Chamo de Omnívoro Sistema Sapador.</p>
      </div>
    `,
      'LOREM_13': `
      <div class="lorem-page">
        <p>Assim, nasce o que mais tarde chamarão de</p>
        <p>Krloi-TvmE[PayTonTon], ou, pela tradução do</p>
        <p>Okê: "Rede Sapadora Singular".</p>
        <p>Chamo de Omnívoro Sistema Sapador.</p>
      </div>
    `,
      'LOREM_13': `
      <div class="lorem-page">
        <p>Assim, nasce o que mais tarde chamarão de</p>
        <p>Krloi-TvmE[PayTonTon], ou, pela tradução do</p>
        <p>Okê: "Rede Sapadora Singular".</p>
        <p>Chamo de Omnívoro Sistema Sapador.</p>
      </div>
    `,
      'LOREM_13': `
      <div class="lorem-page">
        <p>Assim, nasce o que mais tarde chamarão de</p>
        <p>Krloi-TvmE[PayTonTon], ou, pela tradução do</p>
        <p>Okê: "Rede Sapadora Singular".</p>
        <p>Chamo de Omnívoro Sistema Sapador.</p>
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
  scene.background = new THREE.Color('#ffd2b4');

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
      map: loader.load('mundos/sapador/imagens/mapasapador.png'),
      transparent: false,
      opacity: 1,
    })
  );

  scene.add(earth);

  // Nuvens como no alouepoura
  const clouds = new THREE.Mesh(
    new THREE.SphereGeometry(1.02, 64, 64),
    new THREE.MeshBasicMaterial({
      map: loader.load('mundos/sapador/imagens/nuvemsapador.png'),
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
