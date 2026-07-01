window.initFlipbook = function(wrapperSelector) {
  const wrap = document.querySelector(wrapperSelector);
  
  // Adicionar elemento de áudio para a música
  const music = document.createElement('audio');
  music.src = 'mundos/ofcmapaonei/radiacao.mp3';
  music.id = 'radiacao-music';
  music.preload = 'auto';
  music.loop = true; // Adiciona o loop para tocar continuamente
  document.body.appendChild(music);
  
  const slides = [
    'mundos/ofcmapaonei/imagens/cap1/tira1.webp',     // slide 1
    'mundos/ofcmapaonei/imagens/cap1/tira2.webp',     // slide 2
    'mundos/ofcmapaonei/imagens/cap1/tira3.webp',     // slide 3
    'mundos/ofcmapaonei/imagens/cap1/tira4.webp',     // slide 4
    'mundos/ofcmapaonei/imagens/cap1/tira5.webp',     // slide 5
    'mundos/ofcmapaonei/imagens/cap1/tira6.webp',     // slide 6
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
        <p>O Okê traduziu o nome como "Rede Central".</p>
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
        <p>O Okê traduziu o nome como "Rede Central".</p>
        <p>Após a partida, a rede aquece por dez minutos</p>
        <p>como de costume, pois é periodicamente desligada,</p>
        <p>para eivitar sobreaquecimento.</p>
        <p>a Rede Central é uma combinação de laboratório</p>
        <p>físico-químico com um sistema automático</p>
        <p>inteligente.</p>
      </div>
    `,
  };
  
  let musicStarted = false;
  
  slides.forEach((src, index) => {
    const slideEl = document.createElement('div');
    slideEl.className = 'flipbook-slide';
    
    if (src === 'GLOBO') {
      // canvas para o globo
      slideEl.innerHTML = `<canvas id="globeCanvas" style="width:100%;height:100%"></canvas>`;
    } else if (loremTexts[src]) {
      // textos lorem ipsum
      slideEl.innerHTML = loremTexts[src];
    } else {
      // imagens normais
      if (index === 0) {
        // Para a primeira imagem, adicionar um marcador na metade
        slideEl.innerHTML = `
          <div style="position:relative;width:100%;">
            <img src="${src}" style="width:100%;height:auto;display:block;" draggable="false">
            <div id="music-trigger" style="position:absolute;top:50%;left:0;width:100%;height:2px;"></div>
          </div>
        `;
      } else {
        slideEl.innerHTML = `<img src="${src}" style="width:100%;height:auto;display:block;" draggable="false">`;
      }
    }
    wrap.appendChild(slideEl);
  });
  
  // Configurar o Intersection Observer para detectar quando chegamos na metade da primeira imagem
  setTimeout(() => {
    const musicTrigger = document.getElementById('music-trigger');
    if (musicTrigger) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting && !musicStarted) {
            const music = document.getElementById('radiacao-music');
            if (music) {
              musicStarted = true;
              if (window.allowSound !== false) { // Respeita configuração global de som
                music.volume = 0;
                music.play().catch(e => console.log('Erro ao tocar música:', e));
                
                // Fade in suave
                let fadeVolume = setInterval(() => {
                  if (music.volume < 0.7) {
                    music.volume += 0.01;
                  } else {
                    music.volume = 0.5;
                    clearInterval(fadeVolume);
                  }
                }, 200);
              }
            }
          }
        });
      }, { threshold: 0.5 });
      
      observer.observe(musicTrigger);
      
      // Parar música quando sair da página
      document.getElementById('btnVoltar').addEventListener('click', function() {
        const music = document.getElementById('radiacao-music');
        if (music) {
          let fadeOut = setInterval(() => {
            if (music.volume > 0.05) {
              music.volume -= 0.05;
            } else {
              music.pause();
              music.currentTime = 0;
              clearInterval(fadeOut);
            }
          }, 100);
        }
      }, { once: true });
    }
  }, 500); // Pequeno delay para garantir que o DOM esteja pronto
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
      map: loader.load('mundos/denbou/mapabaikapei.png'),
      // Configurações para eliminar qualquer reflexo
      transparent: false,
      opacity: 1,
      // MeshBasicMaterial não reage à luz, eliminando reflexos
    })
  );
  
  scene.add(earth);
  
  // Iluminação mínima (apenas para caso seja necessária)
  // Como usamos MeshBasicMaterial, a luz não afeta o objeto
  const ambientLight = new THREE.AmbientLight(0xffffff, 1);
  scene.add(ambientLight);
  
  // Animação
  (function animate() {
    requestAnimationFrame(animate);
    earth.rotation.y += 0.002;
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

// Adicione este método para limpar o áudio quando sair do mundo
window.stopAllAnimations = window.stopAllAnimations || function() {};
const originalStopAllAnimations = window.stopAllAnimations;
window.stopAllAnimations = function() {
  originalStopAllAnimations();
  
  // Parar a música ao sair do mundo
  const music = document.getElementById('radiacao-music');
  if (music) {
    music.pause();
    music.currentTime = 0;
    music.remove();
  }
};
