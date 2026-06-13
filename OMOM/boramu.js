// Variáveis globais para o mundo2
let globeRenderer, globeScene, globeAnimationId, resizeHandler;
let systemAnimationId, systemResizeHandler;

window.initFlipbook = function(wrapperSelector) {
  const wrap = document.querySelector(wrapperSelector);
  
  // Cor específica para este mundo (você pode alterar para a cor desejada)
  const corMundo = "#ff0090"; // Exemplo: azul claro
  
  // Configurações de altura para as diferentes seções
  const alturaGradiente = 200; // Altura de cada gradiente em pixels
  const alturaPretaMinima = 1200; // Altura mínima aumentada para acomodar dois globos
  
  // Calcula a altura ideal para a área preta com base no tamanho da tela
  const alturaViewport = window.innerHeight;
  const alturaAjustada = Math.max(alturaPretaMinima, alturaViewport * 1.2); // 120% da altura da janela, no mínimo alturaPretaMinima
  
  // Criamos apenas um slide para este mundo
  const slideEl = document.createElement('div');
  slideEl.className = 'flipbook-slide';
  
  // Verificamos se estamos em desktop (> 768px) para aplicar o fundo branco
  const isMobile = window.innerWidth < 768;
  
  // Aplicar estilos específicos para desktop se necessário
  if (!isMobile) {
    // Adicionamos estilo inline para garantir fundo branco em desktop
    const flipbookEl = document.getElementById('flipbook');
    if (flipbookEl) {
      flipbookEl.style.background = '#ff0090';
    }
  }
  
  // Estrutura completa com logo, espaço, imagem de menu, texto e globo no gradiente
  slideEl.innerHTML = `
    <div style="display: flex; flex-direction: column; align-items: center; width: 100%; background-color: ${corMundo};">
      <!-- Logo inicial centralizado -->
      <div style="margin-top: 40px; margin-bottom: 80px; width: 100%; display: flex; justify-content: center;">
        <img src="assets/omomstudios.webp" style="max-width: 300px; width: 30%;" draggable="false">
      </div>
      
      <!-- Espaço considerável -->
      <div style="height: 100px;"></div>
      
      <!-- Imagem de menu -->
      <div style="width: 100%; display: flex; justify-content: center; margin-bottom: 20px;">
        <img src="mundos/boramu/imagens/boramumenu_dark.webp" style="max-width: 500px; width: 30%;" draggable="false">
      </div>
      
      <!-- Texto na fonte Press Start 2P com largura correspondente à imagem de menu -->
      <div style="width: 100%; display: flex; justify-content: center; margin-bottom: 40px;">
        <div id="mundoTitle" style="font-family: 'Press Start 2P', monospace; font-size: 14px; color: #333; text-align: center; max-width: 500px; width: 30%;">
          Bora-mu
        </div>
      </div>

      <!-- Espaço considerável -->
      <div style="height: 300px;"></div>
      
      <!-- Primeiro gradiente: da cor do mundo para preto (com sobreposição para evitar linha) -->
      <div style="width: 100%; 
                  height: ${alturaGradiente}px;
                  background: linear-gradient(to bottom, ${corMundo} 0%, #000 99.5%, #000 100%);
                  margin-bottom: -1px;">
      </div>
      
      <!-- Área preta intermediária onde ficará o sistema orbital e o globo -->
      <div class="area-preta-globo" style="width: 100%;
                  background-color: #000;
                  min-height: ${alturaAjustada}px;
                  display: flex;
                  flex-direction: column;
                  align-items: center;
                  justify-content: center;
                  padding: 80px 0;
                  margin-top: -1px;
                  margin-bottom: -1px;">
                  
        <!-- Sistema orbital 2D -->
        <div style="width: 100%; max-width: 700px; height: 350px; margin-bottom: 80px; position: relative;">
          <canvas id="systemCanvas" style="width: 100%; height: 100%; display: block;"></canvas>
        </div>
        
        <!-- Seção do globo - Bora-mu -->
        <div class="globo-section" style="width: 100%; position: relative; display: flex; flex-direction: column; align-items: center;">
          <!-- Container do globo (Bora-mu) -->
          <div id="globeContainer" style="width: 90%; max-width: 650px; aspect-ratio: 1; position: relative; margin: auto;">
            <canvas id="globeCanvas" style="width: 100%; height: 100%; display: block;"></canvas>
          </div>
          
          <!-- Container para o texto do globo (abaixo do globo) -->
          <div class="globo-label" id="label-boramu" style="opacity: 0; background-color: rgba(0, 0, 0, 0.5); border-radius: 10px; padding: 10px; border: 1px solid #00ffe7; margin-top: 20px; text-align: center;">
            <div style="font-family: 'Press Start 2P', monospace; color: #00ffe7; font-size: 14px; padding: 10px; text-shadow: 0 0 10px rgba(0, 255, 231, 0.7); letter-spacing: 1px;">BORA-MU</div>
            <div style="font-family: 'Press Start 2P', monospace; color: #fff; font-size: 12px; padding: 5px 10px; margin-top: 8px; text-align: center;">Planeta Habitável</div>
          </div>
        </div>
      </div>
      
      <!-- Segundo gradiente: de preto de volta para a cor do mundo -->
      <div style="width: 100%; 
                  height: ${alturaGradiente}px;
                  background: linear-gradient(to bottom, #000, ${corMundo});">
      </div>
      

      <div style="width: 100%; 
                  display: flex;
                  flex-direction: column;
                  align-items: center;
                  background-color: ${corMundo};
                  padding: 40px 0;">
        
       
        <div style="width: 100%; max-width: 800px; margin-bottom: 60px;">
          <img src="mundos/boramu/imagens/boromes.webp" 
               style="width: 100%; height: auto; display: block; border-radius: 8px; box-shadow: 0 10px 30px rgba(0,0,0,0.2);" 
               draggable="false">
        </div>

        <div style="width: 100%; max-width: 800px; margin-bottom: 60px;">
          <img src="mundos/boramu/imagens/fauna.webp" 
               style="width: 100%; height: auto; display: block; border-radius: 8px; box-shadow: 0 10px 30px rgba(0,0,0,0.2);" 
               draggable="false">
        </div>
      
        
        
      </div>
      
      <!-- Área final com a cor do mundo para fechar a composição -->
      <div style="width: 100%;
                  height: 100px;
                  background-color: ${corMundo};">
      </div>
    </div>
  `;
  
  // Adicionar o slide ao wrapper
  wrap.appendChild(slideEl);
  
  // Verificar e carregar fonte Press Start 2P se não estiver disponível
  if (!document.getElementById('press-start-2p-font')) {
    const fontLink = document.createElement('link');
    fontLink.id = 'press-start-2p-font';
    fontLink.rel = 'stylesheet';
    fontLink.href = 'https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap';
    document.head.appendChild(fontLink);
  }
  
  // Nenhum estilo adicional necessário
  
  // Função para garantir o background correto e ajustar alturas baseado no tamanho da tela
  function atualizarEstilosResponsivos() {
    if (window.innerWidth <= 600) {
      document.body.style.backgroundColor = "#0C1A3C";
      document.documentElement.style.backgroundColor = "#0C1A3C";
    } else {
      document.body.style.backgroundColor = "#fff";
      document.documentElement.style.backgroundColor = "#fff";
    }
    
    // Atualizar a altura ajustada com base na nova largura da tela
    const novaAlturaAjustada = Math.max(alturaPretaMinima, window.innerWidth * 0.4);
    
    // Atualizar a altura da área preta
    const areasPretasGlobo = document.querySelectorAll('.area-preta-globo');
    if (areasPretasGlobo.length > 0) {
      areasPretasGlobo.forEach(area => {
        area.style.minHeight = `${novaAlturaAjustada}px`;
      });
    }
    
    // Ajustar o tamanho do container do globo proporcionalmente
    const globeContainer = document.getElementById('globeContainer');
    
    // Aumentar o tamanho máximo para telas desktop e manter proporcional para mobile
    let maxSize;
    if (window.innerWidth >= 1024) {
      // Para desktop, aumentamos o tamanho máximo para 650px
      const containerSize = Math.min(novaAlturaAjustada * 0.5, window.innerWidth * 0.9);
      maxSize = Math.min(700, containerSize); // Tamanho para desktop
    } else if (window.innerWidth >= 768) {
      // Para tablets
      const containerSize = Math.min(novaAlturaAjustada * 0.45, window.innerWidth * 0.9);
      maxSize = Math.min(600, containerSize); // Tamanho intermediário para tablets
    } else {
      // Para mobile
      const containerSize = Math.min(novaAlturaAjustada * 0.4, window.innerWidth * 0.9);
      maxSize = Math.min(500, containerSize); // Tamanho para mobile
    }
    
    if (globeContainer) {
      globeContainer.style.width = `${maxSize}px`;
      globeContainer.style.height = `${maxSize}px`;
    }
    
    // Ajustar posicionamento do rótulo com base no tamanho da tela
    const labelBoramu = document.getElementById('label-boramu');
    
    if (labelBoramu) {
      // Centralizar o rótulo
      labelBoramu.style.marginTop = '20px';
    }
    
    // Ajustar o tamanho da fonte do título para corresponder à largura da imagem do menu
    const menuImage = document.querySelector('img[src="mundos/boramu/imagens/boramumenu.webp"]');
    const titleElement = document.getElementById('mundoTitle');
    
    if (menuImage && titleElement) {
      // Obter a largura atual da imagem do menu
      const menuWidth = menuImage.clientWidth;
      
      // Definir a largura do título para corresponder
      titleElement.style.width = menuImage.style.width;
      
      // Calcular o tamanho da fonte proporcional à largura
      // Entre 10px mínimo e 20px máximo
      const fontSize = Math.max(10, Math.min(20, menuWidth / 20));
      titleElement.style.fontSize = `${fontSize}px`;
    }
  }  // Adiciona listener para quando a janela for redimensionada
  window.addEventListener('resize', atualizarEstilosResponsivos);
  
  // Chama a função imediatamente
  atualizarEstilosResponsivos();
  
  // Inicializar o globo após criar os slides
  setTimeout(() => {
    // Espera o canvas ter tamanho > 0 antes de inicializar
    const waitForSize = (selector, initFn, params, maxAttempts = 20) => {
      const canvas = document.querySelector(selector);
      if (!canvas) return;
      
      let attempts = 0;
      
      const checkSize = () => {
        if (canvas.clientWidth > 0 && canvas.clientHeight > 0) {
          console.log(`Inicializando ${selector} após ${attempts} tentativas`);
          initFn(params);
          
          // Ativar a animação do label após a inicialização do globo
          const { labelId } = params;
          if (labelId) {
            setTimeout(() => {
              iniciarAnimacaoLabel(labelId);
            }, 500);
          }
        } else if (attempts++ < maxAttempts) {
          console.log(`Aguardando tamanho para ${selector}, tentativa ${attempts}`);
          setTimeout(checkSize, 100);
        } else {
          console.log(`Falha ao aguardar tamanho para ${selector}, inicializando mesmo assim`);
          initFn(params);
        }
      };
      
      checkSize();
    };

    // Inicializar o sistema orbital
    initOrbitalSystem();
    
    // Inicializar o globo Bora-mu
    waitForSize('#globeCanvas', initGlobe, {
      canvasId: 'globeCanvas',
      containerId: 'globeContainer',
      planetTexture: 'mundos/boramu/imagens/mapaboramu.webp',
      hasNuvem: true,
      nuvemTexture: 'mundos/boramu/imagens/nuvemboramu.webp',
      labelId: 'label-boramu'
    });
  }, 100);
  
  // Função simplificada para mostrar os labels
  function iniciarAnimacaoLabel(labelId) {
    const labelContainer = document.querySelector(`#${labelId}`);
    
    if (!labelContainer) return;
    
    // Reset da animação para garantir que comece corretamente
    labelContainer.style.opacity = '0';
    
    // Inicia a animação do label com um pequeno atraso
    setTimeout(() => {
      // Adicionar animação de entrada
      labelContainer.style.transition = 'opacity 1.2s ease-in-out, transform 1s ease-in-out';
      labelContainer.style.transform = 'translateY(0)';
      labelContainer.style.opacity = '1';
      
      // Adicionar sombra estática sem animação
      labelContainer.style.boxShadow = "0 0 8px 5px rgba(0, 255, 231, 0.5)";
    }, 800);
  }
};

// Função para inicializar o globo
function initGlobe(params) {
  const {
    canvasId,
    containerId,
    planetTexture, 
    hasNuvem = false, 
    nuvemTexture = '', 
    labelId
  } = params;

  const container = document.querySelector(`#${containerId}`);
  const canvas = document.querySelector(`#${canvasId}`);
  
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(75, canvas.clientWidth / canvas.clientHeight, 0.1, 1000);
  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  
  renderer.setSize(canvas.clientWidth, canvas.clientHeight);
  
  // Adicionar luzes
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
  scene.add(ambientLight);
  
  const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
  directionalLight.position.set(5, 5, 5);
  scene.add(directionalLight);
  
  // Criar o globo com textura
  const geometry = new THREE.SphereGeometry(2, 64, 64);
  const textureLoader = new THREE.TextureLoader();
  const texture = textureLoader.load(planetTexture);
  const material = new THREE.MeshStandardMaterial({ map: texture });
  const globe = new THREE.Mesh(geometry, material);
  scene.add(globe);

  // Adicionar camada de nuvem se especificado
  let nuvem;
  if (hasNuvem && nuvemTexture) {
    const nuvemGeometry = new THREE.SphereGeometry(2.01, 64, 64);
    const nuvemTextura = textureLoader.load(nuvemTexture);
    const nuvemMaterial = new THREE.MeshStandardMaterial({
      map: nuvemTextura,
      transparent: true,
      opacity: 1
    });
    nuvem = new THREE.Mesh(nuvemGeometry, nuvemMaterial);
    scene.add(nuvem);
  }

  // Ajustar a câmera
  camera.position.z = 4;
  
  // Adicionar controles de órbita
  const controls = new THREE.OrbitControls(camera, renderer.domElement);
  controls.enableZoom = false;  // Desativar zoom
  controls.enablePan = false;   // Desativar pan
  controls.rotateSpeed = 0.5;   // Velocidade de rotação mais lenta
  controls.autoRotate = true;   // Rotação automática
  
  // Ajustar velocidade de rotação para Bora-mu (planeta habitável)
  controls.autoRotateSpeed = 0.8;
  
  // Inclinar o eixo do planeta para dar um efeito mais realista
  globe.rotation.x = THREE.MathUtils.degToRad(23.5); // Inclinação do eixo para planeta habitável
  
  // Sem interatividade de clique ou toque
  // Não há necessidade de raycaster ou detector de cliques
  
  // Animação
  function animate() {
    requestAnimationFrame(animate);
    controls.update();
    
    // Rotação independente para a camada de nuvem
    if (nuvem) {
      nuvem.rotation.y += 0.001;
    }
    
    renderer.render(scene, camera);
    
    // Mostrar o label
    if (labelId) {
      const labelContainer = document.querySelector(`#${labelId}`);
      if (labelContainer && labelContainer.style.opacity === '0') {
        setTimeout(() => {
          labelContainer.style.transition = 'opacity 1.2s ease-in-out';
          labelContainer.style.opacity = '1';
        }, 800);
      }
    }
  }
  
  animate();
  
  // Ajustar tamanho ao redimensionar a janela
  function resizeGlobe() {
    if (!canvas) return;
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    
    if (renderer && camera) {
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    }
  }
  
  window.addEventListener('resize', resizeGlobe);
  
  // Ajustar tamanho inicial
  resizeGlobe();
}

// A função animateLinha foi removida pois não é mais necessária

// Função para inicializar o sistema orbital
function initOrbitalSystem() {
  const canvas = document.getElementById('systemCanvas');
  if (!canvas) return;
  
  // Configurar o canvas
  const ctx = canvas.getContext('2d');
  
  // Ajustar o tamanho do canvas para corresponder ao seu contêiner
  function resizeCanvas() {
    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;
  }
  
  // Inicializar tamanho do canvas
  resizeCanvas();
  systemResizeHandler = resizeCanvas;
  window.addEventListener('resize', systemResizeHandler);
  
  // Obter dimensões do canvas
  const width = canvas.width;
  const height = canvas.height;
  const centerX = width / 2;
  const centerY = height / 2;
  
  // Tamanhos e distâncias dos corpos celestes
  const starSize = 20;
  const planet1Size = 4; // Reduzido de 6
  const planet2Size = 6; // Reduzido de 8
  const planet3Size = 10; // Reduzido de 14
  
  const orbit1Radius = 60;
  const orbit2Radius = 100;
  const orbit3Radius = 160;
  
  // Velocidades angulares (radianos por frame)
  const planet1Speed = 0.008;
  const planet2Speed = 0.005;
  const planet3Speed = 0.002;
  
  // Posições angulares iniciais (radianos)
  let planet1Angle = 0;
  let planet2Angle = 2;
  let planet3Angle = 4;
  
  // Função para desenhar uma estrela de 8 pontas com círculo central
  function drawStar(x, y, size) {
    ctx.fillStyle = '#fff';
    
    // Desenhar o círculo central
    ctx.beginPath();
    ctx.arc(x, y, size * 0.35, 0, Math.PI * 2);
    ctx.fill();
    
    // Desenhar as 8 pontas da estrela
    for (let i = 0; i < 8; i++) {
      const angle = i * Math.PI / 4;
      // Pontas em cruz (0, 90, 180, 270 graus) são maiores
      const pointSize = (i % 2 === 0) ? size : size * 0.6;
      
      ctx.beginPath();
      // Começar do círculo central
      const startRadius = size * 0.35;
      const startX = x + startRadius * Math.cos(angle);
      const startY = y + startRadius * Math.sin(angle);
      
      // Ir até a ponta
      const endX = x + pointSize * Math.cos(angle);
      const endY = y + pointSize * Math.sin(angle);
      
      // Largura da ponta
      const width = size * 0.12;
      
      // Desenhar um triângulo para cada ponta
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
  
  // Função para desenhar um planeta
  function drawPlanet(x, y, size, name, nameOffsetY = 15) {
    // Desenhar o planeta
    ctx.beginPath();
    ctx.fillStyle = '#fff';
    ctx.arc(x, y, size, 0, Math.PI * 2);
    ctx.fill();
    
    // Detectar se é dispositivo móvel
    const isMobile = window.innerWidth < 768;
    
    // Adicionar o nome com tamanho ajustado para mobile
    ctx.fillStyle = '#fff';
    // Fonte menor para mobile e para desktop
    const fontSize = isMobile ? 8 : 10;
    ctx.font = `${fontSize}px "Press Start 2P", monospace`;
    ctx.textAlign = 'center';
    ctx.fillText(name, x, y + size + nameOffsetY);
  }
  
  // Desenhar órbita
  function drawOrbit(radius) {
    ctx.beginPath();
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)'; // Cor branca transparente como em batedores.js
    ctx.lineWidth = 1;
    // Sem linha pontilhada, usando linha contínua
    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
    ctx.stroke();
  }
  
  // Função de animação
  function animate() {
    // Limpar o canvas
    ctx.clearRect(0, 0, width, height);
    
    // Recalcular o centro se o tamanho mudar
    const currentWidth = canvas.width;
    const currentHeight = canvas.height;
    const centerX = currentWidth / 2;
    const centerY = currentHeight / 2;
    
    // Detectar se é dispositivo móvel para ajustar a escala
    const isMobile = window.innerWidth < 768;
    
    // Escala maior para mobile para compensar telas menores, normal para desktop
    const SYSTEM_SCALE = isMobile ? 0.90 : 0.68;
    
    // Calcular escala com base no tamanho do canvas e no tipo de dispositivo
    const scale = (Math.min(currentWidth, currentHeight) / 350) * SYSTEM_SCALE;
    
    // Desenhar órbitas
    drawOrbit(orbit1Radius * scale);
    drawOrbit(orbit2Radius * scale);
    drawOrbit(orbit3Radius * scale);
    
    // Desenhar estrela central
    drawStar(centerX, centerY, starSize * scale);
    ctx.font = '12px "Press Start 2P", monospace';
    ctx.textAlign = 'center';
    ctx.fillStyle = '#fff';
    ctx.fillText('ORATOM', centerX, centerY + starSize * scale + 25);
    
    // Calcular posições dos planetas
    const planet1X = centerX + orbit1Radius * scale * Math.cos(planet1Angle);
    const planet1Y = centerY + orbit1Radius * scale * Math.sin(planet1Angle);
    
    const planet2X = centerX + orbit2Radius * scale * Math.cos(planet2Angle);
    const planet2Y = centerY + orbit2Radius * scale * Math.sin(planet2Angle);
    
    const planet3X = centerX + orbit3Radius * scale * Math.cos(planet3Angle);
    const planet3Y = centerY + orbit3Radius * scale * Math.sin(planet3Angle);
    
    // Desenhar planetas
    drawPlanet(planet1X, planet1Y, planet1Size * scale, 'CAINOU');
    drawPlanet(planet2X, planet2Y, planet2Size * scale, 'BORA-MU');
    drawPlanet(planet3X, planet3Y, planet3Size * scale, 'OTASUMA');
    
    // Atualizar posições para o próximo frame
    planet1Angle += planet1Speed;
    planet2Angle += planet2Speed;
    planet3Angle += planet3Speed;
    
    // Continuar animação
    systemAnimationId = requestAnimationFrame(animate);
  }
  
  // Iniciar animação
  animate();
}

// Função para parar todas as animações e liberar recursos
// Funções de galeria e zoom foram removidas

window.stopAllAnimations = function() {
  // Parar animação do globo
  if (globeAnimationId) {
    cancelAnimationFrame(globeAnimationId);
    globeAnimationId = null;
  }
  
  // Parar animação do sistema orbital
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
  
  // Remover event listeners
  if (resizeHandler) {
    window.removeEventListener('resize', resizeHandler);
  }
  
  if (systemResizeHandler) {
    window.removeEventListener('resize', systemResizeHandler);
  }
  
  // Remover o listener responsivo
  window.removeEventListener('resize', atualizarEstilosResponsivos);
};