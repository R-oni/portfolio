// Variáveis globais para o mundo2
let globeRenderer, globeScene, globeAnimationId, resizeHandler;

window.initFlipbook = function(wrapperSelector) {
  const wrap = document.querySelector(wrapperSelector);
  
  // Cor específica para este mundo (você pode alterar para a cor desejada)
  const corMundo = "#a0e6ff"; // Exemplo: azul claro
  
  // Configurações de altura para as diferentes seções
  const alturaGradiente = 200; // Altura de cada gradiente em pixels
  const alturaPretaMinima = 600; // Altura mínima da área preta (ajuste conforme necessário)
  
  // Calcula a altura ideal para a área preta com base no tamanho da tela
  const alturaViewport = window.innerHeight;
  const alturaAjustada = Math.max(alturaPretaMinima, alturaViewport * 0.6); // 60% da altura da janela, no mínimo alturaPretaMinima
  
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
        <img src="mundos/ttok/ttokmenu.webp" style="max-width: 500px; width: 30%;" draggable="false">
      </div>
      
      <!-- Texto na fonte Press Start 2P com largura correspondente à imagem de menu -->
      <div style="width: 100%; display: flex; justify-content: center; margin-bottom: 40px;">
        <div id="mundoTitle" style="font-family: 'Press Start 2P', monospace; font-size: 14px; color: #333; text-align: center; max-width: 500px; width: 30%;">
          TT'TOK'TAK'TAK'T
        </div>
      </div>
      
      <!-- Primeiro gradiente: da cor do mundo para preto -->
      <div style="width: 100%; 
                  height: ${alturaGradiente}px;
                  background: linear-gradient(to bottom, ${corMundo}, #000);">
      </div>
      
      <!-- Área preta intermediária onde ficará o globo -->
      <div class="area-preta-globo" style="width: 100%;
                  background-color: #000;
                  min-height: ${alturaAjustada}px;
                  display: flex;
                  flex-direction: column;
                  align-items: center;
                  justify-content: center;
                  padding: 60px 0;">
        
        <!-- Container do globo -->
        <div id="globeContainer" style="width: 90%; max-width: 500px; aspect-ratio: 1; position: relative; margin: auto;">
          <canvas id="globeCanvas" style="width: 100%; height: 100%; display: block;"></canvas>
        </div>
      </div>
      
      <!-- Segundo gradiente: de preto de volta para a cor do mundo -->
      <div style="width: 100%; 
                  height: ${alturaGradiente}px;
                  background: linear-gradient(to bottom, #000, ${corMundo});">
      </div>
      
      <!-- Seção de imagens verticais -->
      <div style="width: 100%; 
                  display: flex;
                  flex-direction: column;
                  align-items: center;
                  background-color: ${corMundo};
                  padding: 40px 0;">
        
        <!-- Imagem 1 -->
        <div style="width: 100%; max-width: 800px; margin-bottom: 60px;">
          <img src="mundos/veleywei/imagens/cap1/yeroben.webp" 
               style="width: 100%; height: auto; display: block; border-radius: 8px; box-shadow: 0 10px 30px rgba(0,0,0,0.2);" 
               draggable="false">
        </div>
        
        <!-- Imagem 2 -->
        <div style="width: 100%; max-width: 800px; margin-bottom: 60px;">
          <img src="mundos/denbou/imagens/cap1/denden.webp" 
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
    if (globeContainer) {
      // Definir tamanho proporcional à altura da área preta, mas não maior que 90% da largura disponível
      const containerSize = Math.min(novaAlturaAjustada * 0.7, window.innerWidth * 0.9);
      const maxSize = Math.min(500, containerSize); // Limitar a 500px ou ao tamanho calculado
      
      globeContainer.style.width = `${maxSize}px`;
      globeContainer.style.height = `${maxSize}px`;
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
    const waitForSize = (selector, initFn, maxAttempts = 20) => {
      const canvas = document.querySelector(selector);
      if (!canvas) return;
      
      let attempts = 0;
      
      const checkSize = () => {
        if (canvas.clientWidth > 0 && canvas.clientHeight > 0) {
          console.log(`Inicializando ${selector} após ${attempts} tentativas`);
          initFn();
        } else if (attempts++ < maxAttempts) {
          console.log(`Aguardando tamanho para ${selector}, tentativa ${attempts}`);
          setTimeout(checkSize, 100);
        } else {
          console.log(`Falha ao aguardar tamanho para ${selector}, inicializando mesmo assim`);
          initFn();
        }
      };
      
      checkSize();
    };

    waitForSize('#globeCanvas', initGlobe);
  }, 100);
};

// Função para inicializar o globo
function initGlobe() {
  const canvas = document.getElementById('globeCanvas');
  if (!canvas) return;

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
      return true;
    }
    return false;
  }

  // Criando a cena
  globeScene = new THREE.Scene();
  globeScene.background = null; // Fundo transparente para integrar com o gradiente preto
  
  // Configurando a câmera
  const camera = new THREE.PerspectiveCamera(
    60,
    canvas.clientWidth / canvas.clientHeight,
    0.1,
    1000
  );
  camera.position.z = 2.2;  // Ajuste para uma distância fixa ideal, ligeiramente mais próxima

  // Configurando o renderer
  globeRenderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
    alpha: true, // Transparência ativada para combinar com o gradiente
    preserveDrawingBuffer: false
  });
  globeRenderer.setSize(canvas.clientWidth, canvas.clientHeight, false);
  globeRenderer.setPixelRatio(window.devicePixelRatio || 1);
  globeRenderer.shadowMap.enabled = false;

  // Controles de órbita - configuração para um efeito mais cinematográfico
  const controls = new THREE.OrbitControls(camera, canvas);
  controls.enableDamping = true;
  controls.dampingFactor = 0.08;
  controls.rotateSpeed = 0.4;
  controls.autoRotate = true;         // Rotação automática para efeito mais imersivo
  controls.autoRotateSpeed = 0.5;     // Velocidade lenta
  
  // Desabilitar zoom completamente
  controls.enableZoom = false;        // Impede qualquer zoom com scroll/pinça
  
  // Desabilitar pan (movimento lateral)
  controls.enablePan = false;         // Impede que o usuário mova o globo lateralmente

  // Carregador de texturas
  const loader = new THREE.TextureLoader();

  // Criando o planeta (usando textura do Veleywei como teste)
  const planetTexture = loader.load('mundos/veleywei/imagens/mapaveleywei.webp', undefined, undefined, function(err) {
    console.error('Erro ao carregar textura do planeta:', err);
  });
  
  // Adicionar iluminação ambiente para dar um efeito mais dramático
  const ambientLight = new THREE.AmbientLight(0x444444); // Luz ambiente suave
  globeScene.add(ambientLight);
  
  // Adicionar iluminação direcional para destacar as bordas do planeta
  const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
  directionalLight.position.set(5, 3, 5);
  globeScene.add(directionalLight);
  
  // Usar MeshPhongMaterial para que o planeta receba iluminação
  const planet = new THREE.Mesh(
    new THREE.SphereGeometry(1, 64, 64),
    new THREE.MeshPhongMaterial({
      map: planetTexture,
      shininess: 5,
      specular: 0x333333,
    })
  );
  
  // Criando a camada de nuvens (usando textura do Veleywei como teste)
  const cloudsTexture = loader.load('mundos/veleywei/imagens/nuvemveleywei.webp', undefined, undefined, function(err) {
    console.error('Erro ao carregar textura das nuvens:', err);
    cloudsMesh.material.opacity = 0;
    cloudsMesh.material.needsUpdate = true;
  });
  
  const cloudsMesh = new THREE.Mesh(
    new THREE.SphereGeometry(1.02, 64, 64), // Ligeiramente maior que o planeta
    new THREE.MeshBasicMaterial({
      map: cloudsTexture,
      transparent: true,
      opacity: 0.5, // Mais translúcido para o efeito noturno
      blending: THREE.AdditiveBlending, // Efeito de brilho nas nuvens
    })
  );
  
  // Ajuste inicial de rotação
  planet.rotation.y = Math.PI / 4;
  
  // Adicionando objetos à cena
  globeScene.add(planet);
  globeScene.add(cloudsMesh);

  // Função de animação - versão melhorada
  function animate() {
    if (!globeScene || !globeRenderer) return;
    
    globeAnimationId = requestAnimationFrame(animate);
    
    // Rotação lenta do planeta e nuvens
    planet.rotation.y += 0.0007; // Mais lento para efeito majestoso
    cloudsMesh.rotation.y += 0.0015; // Nuvens só um pouco mais rápidas
    
    // Pulsar suave na intensidade da luz para um efeito vivo
    const time = Date.now() * 0.001; // Tempo em segundos
    directionalLight.intensity = 0.8 + Math.sin(time * 0.3) * 0.2; // Oscila entre 0.6 e 1.0
    
    controls.update(); // Atualiza controles com damping e autorotate
    resizeRendererToDisplaySize(globeRenderer, camera);
    globeRenderer.render(globeScene, camera);
  }

  // Handler de redimensionamento mais completo
  resizeHandler = () => {
    if (globeRenderer && camera) {
      // Reajustar o renderer para o novo tamanho
      resizeRendererToDisplaySize(globeRenderer, camera);
      
      // Reajustar a câmera para manter as proporções
      const container = document.getElementById('globeContainer');
      if (container) {
        const width = container.clientWidth;
        const height = container.clientHeight;
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
      }
    }
  };
  window.addEventListener('resize', resizeHandler);

  // Previne zoom com gestos no trackpad ou eventos de pinça no mobile
  canvas.addEventListener('wheel', function(event) {
    event.preventDefault();  // Impede o comportamento padrão de wheel (zoom)
  }, { passive: false });
  
  canvas.addEventListener('touchstart', function(event) {
    if (event.touches.length > 1) {
      event.preventDefault();  // Impede o comportamento padrão de gestos com vários toques
    }
  }, { passive: false });
  
  // Iniciar animação
  animate();
}

// Função para parar todas as animações e liberar recursos
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