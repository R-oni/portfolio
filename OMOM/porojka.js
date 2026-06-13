// Variáveis globais para o mundo2
let globeRenderer, globeScene, globeAnimationId, resizeHandler;

window.initFlipbook = function(wrapperSelector) {
  const wrap = document.querySelector(wrapperSelector);
  
  // Cor específica para este mundo (você pode alterar para a cor desejada)
  const corMundo = "#dafdff"; // Exemplo: azul claro
  
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
      flipbookEl.style.background = '#fff';
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
        <img src="mundos/porojka/porojka_dark.webp" style="max-width: 500px; width: 30%;" draggable="false">
      </div>
      
      <!-- Texto na fonte Press Start 2P com largura correspondente à imagem de menu -->
      <div style="width: 100%; display: flex; justify-content: center; margin-bottom: 40px;">
        <div id="mundoTitle" style="font-family: 'Press Start 2P', monospace; font-size: 14px; color: #333; text-align: center; max-width: 500px; width: 30%;">
          Porojka
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
      
      <!-- Área preta intermediária onde ficarão os globos -->
      <div class="area-preta-globo" style="width: 100%;
                  background-color: #000;
                  min-height: ${alturaAjustada}px;
                  display: flex;
                  flex-direction: column;
                  align-items: center;
                  justify-content: space-around;
                  padding: 80px 0;
                  margin-top: -1px;
                  margin-bottom: -1px;">
        
        <!-- Seção do primeiro globo - Kora-Jskpa -->
        <div class="globo-section" style="width: 100%; position: relative; margin-bottom: 100px; display: flex; flex-direction: column; align-items: center;">
          <!-- Container do primeiro globo (Kora-Jskpa) -->
          <div id="globeContainer1" style="width: 90%; max-width: 500px; aspect-ratio: 1; position: relative; margin: auto;">
            <canvas id="globeCanvas1" style="width: 100%; height: 100%; display: block;"></canvas>
          </div>
          
          <!-- Container para o texto do primeiro globo (agora abaixo do globo) -->
          <div class="globo-label" id="label-kora-jskpa" style="opacity: 0; background-color: rgba(0, 0, 0, 0.5); border-radius: 10px; padding: 10px; border: 1px solid #00ffe7; margin-top: 20px; text-align: center;">
            <div style="font-family: 'Press Start 2P', monospace; color: #00ffe7; font-size: 14px; padding: 10px; text-shadow: 0 0 10px rgba(0, 255, 231, 0.7); letter-spacing: 1px;">KORA-JSKPA</div>
            <div style="font-family: 'Press Start 2P', monospace; color: #fff; font-size: 12px; padding: 5px 10px; margin-top: 8px; text-align: center;">Gigante Gasoso</div>
          </div>
        </div>
        
        <!-- Seção do segundo globo - Porojka -->
        <div class="globo-section" style="width: 100%; position: relative; margin-top: 100px; display: flex; flex-direction: column; align-items: center;">
          <!-- Container do segundo globo (Porojka) -->
          <div id="globeContainer2" style="width: 90%; max-width: 500px; aspect-ratio: 1; position: relative; margin: auto;">
            <canvas id="globeCanvas2" style="width: 100%; height: 100%; display: block;"></canvas>
          </div>
          
          <!-- Container para o texto do segundo globo (agora abaixo do globo) -->
          <div class="globo-label" id="label-porojka" style="opacity: 0; background-color: rgba(0, 0, 0, 0.5); border-radius: 10px; padding: 10px; border: 1px solid #00ffe7; margin-top: 20px; text-align: center;">
            <div style="font-family: 'Press Start 2P', monospace; color: #00ffe7; font-size: 14px; padding: 10px; text-shadow: 0 0 10px rgba(0, 255, 231, 0.7); letter-spacing: 1px;">POROJKA</div>
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
          <img src="mundos/porojka/imagens/brlejkaoe.webp" 
               style="width: 100%; height: auto; display: block; border-radius: 8px; box-shadow: 0 10px 30px rgba(0,0,0,0.2);" 
               draggable="false">
        </div>

        <div style="width: 100%; max-width: 800px; margin-bottom: 60px;">
          <img src="mundos/porojka/imagens/faunaflora.webp" 
               style="width: 100%; height: auto; display: block; border-radius: 8px; box-shadow: 0 10px 30px rgba(0,0,0,0.2);" 
               draggable="false">
        </div>

        
      </div>
      

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
    
    // Ajustar o tamanho dos containers dos globos proporcionalmente
    const globeContainer1 = document.getElementById('globeContainer1');
    const globeContainer2 = document.getElementById('globeContainer2');
    
    // Aumentar o tamanho máximo para telas desktop e manter proporcional para mobile
    let maxSize;
    if (window.innerWidth >= 1024) {
      // Para desktop, aumentamos o tamanho máximo para 650px
      const containerSize = Math.min(novaAlturaAjustada * 0.4, window.innerWidth * 0.9);
      maxSize = Math.min(650, containerSize); // Aumentamos de 500px para 650px em desktop
    } else if (window.innerWidth >= 768) {
      // Para tablets
      const containerSize = Math.min(novaAlturaAjustada * 0.38, window.innerWidth * 0.9);
      maxSize = Math.min(550, containerSize); // Tamanho intermediário para tablets
    } else {
      // Para mobile
      const containerSize = Math.min(novaAlturaAjustada * 0.35, window.innerWidth * 0.9);
      maxSize = Math.min(500, containerSize); // Mantém o mesmo tamanho para mobile
    }
    
    if (globeContainer1) {
      globeContainer1.style.width = `${maxSize}px`;
      globeContainer1.style.height = `${maxSize}px`;
    }
    
    if (globeContainer2) {
      globeContainer2.style.width = `${maxSize}px`;
      globeContainer2.style.height = `${maxSize}px`;
    }
    
    // Ajustar posicionamento dos rótulos com base no tamanho da tela
    const labelKora = document.getElementById('label-kora-jskpa');
    const labelPorojka = document.getElementById('label-porojka');
    
    if (labelKora && labelPorojka) {
      // Ajustar posição com base no tamanho da tela
      if (window.innerWidth < 768) {
        labelKora.style.right = '5%';
        labelPorojka.style.left = '5%';
      } else {
        labelKora.style.right = '15%';
        labelPorojka.style.left = '15%';
      }
    }
    
    // Ajustar o tamanho da fonte do título para corresponder à largura da imagem do menu
    const menuImage = document.querySelector('img[src="mundos/ttok/ttokmenu.webp"]');
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

    // Inicializar o primeiro globo (Kora-Jskpa)
    waitForSize('#globeCanvas1', initGlobe, {
      canvasId: 'globeCanvas1',
      containerId: 'globeContainer1',
      planetTexture: 'mundos/porojka/imagens/kora-jskpa.webp',
      hasNuvem: false,  // Gigante gasoso sem nuvens
      labelId: 'label-kora-jskpa'
    });
    
    // Inicializar o segundo globo (Porojka) após um pequeno atraso
    setTimeout(() => {
      waitForSize('#globeCanvas2', initGlobe, {
        canvasId: 'globeCanvas2',
        containerId: 'globeContainer2',
        planetTexture: 'mundos/porojka/imagens/mapaporojka.webp',
        hasNuvem: true,
        nuvemTexture: 'mundos/porojka/imagens/nuvemporojka.webp',
        labelId: 'label-porojka'
      });
    }, 1000); // Aumento do atraso para garantir que o primeiro globo carregue completamente
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
    const nuvemGeometry = new THREE.SphereGeometry(2.05, 64, 64);
    const nuvemTextura = textureLoader.load(nuvemTexture);
    const nuvemMaterial = new THREE.MeshStandardMaterial({
      map: nuvemTextura,
      transparent: true,
      opacity: 0.8
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
  
  // Ajustar velocidade de rotação com base em qual globo é
  if (canvasId === 'globeCanvas1') {
    // Kora-Jskpa gira mais rápido (gigante gasoso)
    controls.autoRotateSpeed = 1.5;
  } else {
    // Porojka gira mais devagar (planeta habitável)
    controls.autoRotateSpeed = 0.8;
  }
  
  // Inclinar o eixo do planeta para dar um efeito mais realista
  globe.rotation.x = THREE.MathUtils.degToRad(canvasId === 'globeCanvas1' ? 10 : 23.5); // Inclinação do eixo
  
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

// Função para parar todas as animações e liberar recursos
// Funções de galeria e zoom foram removidas

window.stopAllAnimations = function() {
  if (globeAnimationId) {
    cancelAnimationFrame(globeAnimationId);
    globeAnimationId = null;
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
  
  // Remover o listener responsivo
  window.removeEventListener('resize', atualizarEstilosResponsivos);
};