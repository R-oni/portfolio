window.initFlipbook = function(wrapperSelector) {
  const wrap = document.querySelector(wrapperSelector);
  const slides = [
    'mundos/himpis/imagens/cap1/pagina1.webp',     // slide 1
    'mundos/himpis/imagens/cap1/pagina2.webp',     // slide 1
    'mundos/himpis/imagens/cap1/pagina3.webp', // slide 2
    'mundos/himpis/imagens/cap1/pagina4.webp', // slide 3
    'GLOBO',
    'mundos/himpis/imagens/cap1/pagina5.webp', // slide 5
    'mundos/himpis/imagens/cap1/pagina7.webp', // slide 5
    'mundos/himpis/imagens/cap1/cena1.webp', // slide 5

    'mundos/himpis/imagens/cap1/cena1_1.webp', // slide 5
    'mundos/himpis/imagens/cap1/cena1_2.webp', // slide 5
    'mundos/himpis/imagens/cap1/cena1_3*.webp', // slide 5
    'mundos/himpis/imagens/cap1/pagina8.webp',     // slide 1
    'mundos/himpis/imagens/cap1/pagina9.webp', // slide 2
    'mundos/himpis/imagens/cap1/cena2.webp', // slide 3
    'mundos/himpis/imagens/cap1/pagina10.webp', // slide 2
    'mundos/himpis/imagens/cap1/pagina11_1.webp', // slide 5
    'mundos/himpis/imagens/cap1/pagina11.webp', // slide 5
    'mundos/himpis/imagens/cap1/pagina12.webp', // slide 5                                  // slide 4: globo

  
  ];
  slides.forEach(src => {
    const slideEl = document.createElement('div');
    slideEl.className = 'swiper-slide';
    if (src === 'GLOBO') {
      // canvas para o globo
      slideEl.innerHTML = `<canvas id="globeCanvas" style="width:100%;height:100%"></canvas>`;
    } else {
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
  scene.background = new THREE.Color('#fbffd2');
  
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
      map: loader.load('mundos/himpis/mapahimpis.png'),
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
      map: loader.load('mundos/himpis/nuvemhimpis.png'),
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
    clouds.rotation.y += 0.0038; // Nuvens rotacionam mais rápido
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
