// Seleciona o elemento canvas do HTML
const canvas = document.getElementById('bg');
// Cria uma nova cena Three.js
const scene = new THREE.Scene();
// Cria uma câmera perspectiva
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
// Cria um renderizador WebGL, associando-o ao canvas e permitindo transparência
const renderer = new THREE.WebGLRenderer({ canvas, alpha: true });

// Define o tamanho do renderizador para preencher a janela
renderer.setSize(window.innerWidth, window.innerHeight);
// Define a posição Z da câmera (distância da cena)
camera.position.z = 30;

// BACKGROUND DE PARTÍCULAS INTERATIVO E OTIMIZADO
// Cria uma geometria de buffer para as partículas (mais eficiente)
const particlesGeometry = new THREE.BufferGeometry();
// Número de partículas
const particlesCount = 3000;
// Array para armazenar as posições (x, y, z) de cada partícula
const posArray = new Float32Array(particlesCount * 3);
// Array para armazenar as velocidades (vx, vy, vz) de cada partícula
const velocities = new Float32Array(particlesCount * 3);

// Inicializa as posições e velocidades aleatórias para cada partícula
for (let i = 0; i < particlesCount * 3; i++) {
  // Posição aleatória entre -50 e 50 em cada eixo
  posArray[i] = (Math.random() - 0.5) * 100;
  // Velocidade aleatória pequena
  velocities[i] = (Math.random() - 0.5) * 0.015;
}

// Define o atributo 'position' da geometria das partículas
particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
// Cria um material para as partículas
const particlesMaterial = new THREE.PointsMaterial({
  size: 0.08, // Tamanho das partículas
  color: 0x00f0ff, // Cor das partículas (neon azul)
  transparent: true, // Permite transparência
  opacity: 0.9 // Nível de opacidade
});

// Cria a malha de pontos (partículas) com a geometria e o material
const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
// Adiciona as partículas à cena
scene.add(particlesMesh);

// Variáveis para armazenar a posição normalizada do mouse (entre -1 e 1)
let mouseX = 0, mouseY = 0;
// Adiciona um ouvinte de evento para o movimento do mouse
document.addEventListener('mousemove', (e) => {
  // Atualiza mouseX e mouseY com base na posição do cursor
  mouseX = (e.clientX / window.innerWidth) * 2 - 1;
  mouseY = -(e.clientY / window.innerHeight) * 2 + 1;
});

// Função para animar as partículas
function animateParticles() {
  // Obtém o array de posições das partículas
  const positions = particlesGeometry.attributes.position.array;
  // Itera sobre cada partícula (de 3 em 3 coordenadas: x, y, z)
  for (let i = 0; i < particlesCount * 3; i += 3) {
    // Atualiza a posição da partícula com base na sua velocidade
    positions[i] += velocities[i];
    positions[i + 1] += velocities[i + 1];
    positions[i + 2] += velocities[i + 2]; // Movimento no eixo Z, se desejado

    // Interação com o mouse: calcula a distância da partícula ao cursor
    const dx = mouseX * 50 - positions[i]; // 50 é um fator de sensibilidade
    const dy = mouseY * 50 - positions[i + 1];
    const dist = Math.sqrt(dx * dx + dy * dy);

    // Se a partícula estiver perto do mouse, move-a um pouco
    if (dist < 15) { // 15 é o raio de influência
      positions[i] += dx * 0.008; // 0.008 é a força da interação
      positions[i + 1] += dy * 0.008;
    }

    // Reposiciona as partículas quando elas saem dos limites (efeito de loop)
    if (positions[i] > 50) positions[i] = -50;
    if (positions[i] < -50) positions[i] = 50;
    if (positions[i + 1] > 50) positions[i + 1] = -50;
    if (positions[i + 1] < -50) positions[i + 1] = 50;
    // Poderia adicionar o mesmo para positions[i+2] se as partículas se moverem muito no eixo Z
  }
  // Informa ao Three.js que o atributo de posição precisa ser atualizado na GPU
  particlesGeometry.attributes.position.needsUpdate = true;
  // Rotaciona levemente a malha de partículas
  particlesMesh.rotation.y += 0.0005;
  // Renderiza a cena com a câmera
  renderer.render(scene, camera);
  // Solicita o próximo quadro de animação
  requestAnimationFrame(animateParticles);
}
// Inicia a animação das partículas
animateParticles();

// Adiciona um ouvinte de evento para redimensionamento da janela
window.addEventListener('resize', () => {
  // Atualiza a proporção da câmera
  camera.aspect = window.innerWidth / window.innerHeight;
  // Atualiza a matriz de projeção da câmera
  camera.updateProjectionMatrix();
  // Redimensiona o renderizador
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// DIVISÃO DE TEXTO PARA ANIMAÇÕES (SPLIT TEXT)
// Seleciona todos os elementos com a classe 'animated-text'
// Nota: Esta classe não está sendo usada no HTML fornecido.
// Se for usar, adicione a classe 'animated-text' aos h1, h2 que deseja animar caractere por caractere.
document.querySelectorAll('.animated-text').forEach(text => {
  // Envolve cada caractere em um span para animação individual
  text.innerHTML = text.textContent
    .split('')
    .map(char => `<span>${char}</span>`)
    .join('');
});

// ANIMAÇÃO DO H1 DO CABEÇALHO (ONDA VERTICAL)
// Adiciona a classe 'animated-text' ao h1 no HTML ou seleciona diretamente os spans se já existirem
// Para que esta animação funcione, o H1 precisa ter seus caracteres dentro de spans.
// Exemplo no HTML: <h1 class="main-title"><span>M</span><span>A</span><span>R</span>...</h1>
// Se não for usar a classe 'animated-text' globalmente, você pode adicionar os spans manualmente
// ou usar um script para dividir o texto do h1 específico.

// Se o h1 não tiver a classe 'animated-text', essa seleção pode não funcionar como esperado.
// Assumindo que o .main-title é o alvo e precisa ter seus caracteres em spans:
const mainTitle = document.querySelector('header h1.main-title');
if (mainTitle) { // Verifica se o elemento existe
    // Divide o texto do título em spans, se ainda não estiver
    if (!mainTitle.querySelector('span')) {
        mainTitle.innerHTML = mainTitle.textContent.split('').map(char => `<span>${char === ' ' ? '&nbsp;' : char}</span>`).join('');
    }
    const headerSpans = mainTitle.querySelectorAll('span');
    headerSpans.forEach((span, i) => {
      gsap.to(span, {
        y: () => Math.sin(i * 0.5 + Date.now() * 0.001) * 10 + mouseY * 10, // Movimento senoidal + influência do mouse
        duration: 0.5,
        ease: 'sine.inOut',
        repeat: -1, // Repete infinitamente
        yoyo: true, // Alterna a animação (vai e volta)
        delay: i * 0.05 // Atraso para efeito cascata
      });
    });
}


// Função para dividir texto de um elemento em spans
function splitTextIntoSpans(selector) {
    const element = document.querySelector(selector);
    if (element && !element.querySelector('span')) { // Verifica se o elemento existe e ainda não foi dividido
        element.innerHTML = element.textContent.split('').map(char => `<span>${char === ' ' ? '&nbsp;' : char}</span>`).join('');
    }
    return element ? element.querySelectorAll('span') : [];
}

// ANIMAÇÃO DO H2 DA SEÇÃO SOBRE (EXPLOSÃO RADIAL)
const aboutSpans = splitTextIntoSpans('#about h2.section-title');
if (aboutSpans.length > 0) {
    gsap.from(aboutSpans, {
      x: () => (Math.random() - 0.5) * 300, // Posição X aleatória
      y: () => (Math.random() - 0.5) * 300, // Posição Y aleatória
      opacity: 0, // Começa transparente
      scale: 0, // Começa pequeno
      duration: 0.8,
      stagger: 0.03, // Atraso entre a animação de cada span
      ease: 'power3.out',
      scrollTrigger: { // Ativa a animação com base no scroll
        trigger: '#about', // Elemento gatilho
        start: 'top 80%' // Inicia quando o topo de #about estiver a 80% da viewport
      }
    });
}

// ANIMAÇÃO DO H2 DA SEÇÃO PROJETOS (GLITCH)
const projectSpans = splitTextIntoSpans('#projects h2.section-title');
if (projectSpans.length > 0) {
    gsap.from(projectSpans, {
      x: () => (Math.random() - 0.5) * 20, // Pequeno deslocamento X aleatório
      opacity: () => Math.random(), // Opacidade aleatória
      duration: 0.1,
      repeat: 3, // Repete o glitch algumas vezes
      stagger: 0.02,
      ease: 'none',
      scrollTrigger: {
        trigger: '#projects',
        start: 'top 80%',
        onEnter: () => { // Quando entra na viewport, reseta para o estado normal
          gsap.to(projectSpans, { x: 0, opacity: 1, duration: 0.2, stagger: 0.01 });
        }
      }
    });
}

// ANIMAÇÃO DO H2 DA SEÇÃO CONTATO (ROTAÇÃO 3D)
const contactSpans = splitTextIntoSpans('#contact h2.section-title');
if (contactSpans.length > 0) {
    gsap.from(contactSpans, {
      rotationX: 90, // Rotação no eixo X
      rotationY: 90, // Rotação no eixo Y
      opacity: 0,
      duration: 0.6,
      stagger: 0.04,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: '#contact',
        start: 'top 80%'
      }
    });
}

// ANIMAÇÃO DAS HABILIDADES (SKILLS)
const skills = document.querySelectorAll('.skills li');
skills.forEach((skill, i) => {
  gsap.from(skill, {
    scale: 0, // Começa pequeno
    opacity: 0, // Começa transparente
    duration: 0.4,
    delay: i * 0.08, // Atraso para efeito cascata
    ease: 'elastic.out(1, 0.3)', // Efeito elástico
    scrollTrigger: {
      trigger: '#about', // Pode ser melhor usar '.skills' como trigger
      start: 'top 80%' // Ou 'top bottom-=100px' para iniciar um pouco antes
    }
  });
});

// CARROSSEL DE SCROLL HORIZONTAL COM GSAP SCROLLTRIGGER
gsap.registerPlugin(ScrollTrigger); // Registra o plugin ScrollTrigger
const carousel = document.querySelector('.carousel');
const projectCards = document.querySelectorAll('.project-card');

if (carousel && projectCards.length > 0) { // Verifica se os elementos existem
    gsap.to(carousel, {
      x: () => -(carousel.scrollWidth - window.innerWidth), // Move o carrossel horizontalmente
      ease: 'none', // Sem easing para um scroll direto
      scrollTrigger: {
        trigger: '#projects', // A seção de projetos como gatilho
        start: 'top top', // Inicia quando o topo de #projects atinge o topo da viewport
        end: () => `+=${carousel.scrollWidth - window.innerWidth}`, // Termina quando todo o carrossel foi scrollado
        scrub: 1, // Efeito de "esfregar" (scroll suave)
        pin: true, // Fixa a seção #projects durante o scroll do carrossel
        anticipatePin: 1, // Ajuda a evitar saltos no início do pin
        invalidateOnRefresh: true // Recalcula em redimensionamento
      }
    });

    projectCards.forEach(card => {
      gsap.from(card, {
        scale: 0.9, // Começa um pouco menor
        opacity: 0.7, // Começa um pouco transparente
        duration: 0.5,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: card, // O próprio cartão como gatilho
          containerAnimation: gsap.getTweensOf(carousel)[0], // Sincroniza com a animação do carrossel
          start: 'left 80%', // Inicia quando a esquerda do cartão está a 80% da largura do container
          end: 'left 20%', // Termina quando a esquerda do cartão está a 20%
          scrub: 1
        }
      });
    });
}


// SHADER WEBGL PARA IMAGENS DE PROJETO
// Código do Vertex Shader (define a posição dos vértices)
// Nota: Este shader é diferente do arquivo shader.glsl.dart.
// Se a intenção era usar o shader do arquivo .dart, ele precisaria ser carregado e usado aqui.
// O shader abaixo é o que estava no script.js original.
const vertexShader = `
  varying vec2 vUv; // Passa as coordenadas UV para o Fragment Shader
  uniform float time; // Uniform para o tempo (animação)
  void main() {
    vUv = uv; // uv é uma coordenada de textura padrão do Three.js
    vec3 pos = position; // position é a posição do vértice padrão
    // Adiciona uma ondulação baseada no seno, dependente da posição Y e do tempo
    pos.x += sin(pos.y * 3.0 + time) * 0.05;
    // gl_Position é a posição final do vértice na tela
    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
`;

// Código do Fragment Shader (define a cor de cada pixel)
const fragmentShader = `
  uniform float time; // Uniform para o tempo
  uniform vec2 resolution; // Uniform para a resolução (não usado neste shader específico)
  varying vec2 vUv; // Coordenadas UV recebidas do Vertex Shader
  void main() {
    vec2 uv = vUv;
    // Cria uma distorção baseada no seno, dependente da coordenada Y e do tempo
    float distort = sin(uv.y * 8.0 + time) * 0.03;
    uv.x += distort; // Aplica a distorção na coordenada X do UV
    // Interpola entre duas cores (ciano e magenta) com base na coordenada X do UV
    vec3 color = mix(vec3(0.0, 1.0, 1.0), vec3(1.0, 0.0, 1.0), uv.x);
    // gl_FragColor é a cor final do pixel
    gl_FragColor = vec4(color, 1.0);
  }
`;

// Aplica o shader aos elementos com a classe .project-image e o atributo data-shader="distort"
document.querySelectorAll('.project-image[data-shader="distort"]').forEach(el => {
  // Cria um novo material de shader
  const material = new THREE.ShaderMaterial({
    uniforms: {
      time: { value: 0 }, // Uniform de tempo, inicializado em 0
      // A resolução é passada, mas não usada no fragment shader acima.
      // Se for usar, adicione 'resolution' ao fragment shader.
      resolution: { value: new THREE.Vector2(el.offsetWidth, el.offsetHeight) }
    },
    vertexShader, // Código do Vertex Shader
    fragmentShader // Código do Fragment Shader
  });
  // Cria uma geometria plana para aplicar o shader
  const geometry = new THREE.PlaneGeometry(5, 3); // Ajuste as dimensões conforme necessário
  // Cria uma malha com a geometria e o material
  const mesh = new THREE.Mesh(geometry, material);
  // Cria uma cena e câmera separadas para cada instância do shader
  // Isso pode ser otimizado se muitos elementos usarem o mesmo shader.
  const shaderScene = new THREE.Scene(); // Renomeado para evitar conflito com a 'scene' global
  const shaderCamera = new THREE.PerspectiveCamera(75, el.offsetWidth / el.offsetHeight, 0.1, 1000);
  shaderCamera.position.z = 5; // Posição da câmera para a cena do shader
  shaderScene.add(mesh);

  // Cria um novo renderizador para cada elemento
  // Nota: Criar múltiplos renderizadores WebGL pode impactar a performance.
  // Considere usar um único renderizador e viewports diferentes, ou desenhar as texturas
  // em um canvas 2D se a complexidade for alta.
  const shaderRenderer = new THREE.WebGLRenderer({ canvas: el, alpha: true }); // Associa ao elemento 'el' como canvas
  shaderRenderer.setSize(el.offsetWidth, el.offsetHeight);
  shaderRenderer.setClearColor(0x000000, 0); // Fundo transparente

  // Função para animar o shader
  function animateShader() {
    material.uniforms.time.value += 0.03; // Incrementa o tempo para animar o shader
    shaderRenderer.render(shaderScene, shaderCamera); // Renderiza a cena do shader
    requestAnimationFrame(animateShader); // Loop de animação
  }
  // Inicia a animação do shader se o elemento estiver visível
  if (el.offsetWidth > 0 && el.offsetHeight > 0) {
      animateShader();
  }

  // Opcional: Recalcular em redimensionamento se as dimensões do elemento mudarem
  new ResizeObserver(() => {
    if (el.offsetWidth > 0 && el.offsetHeight > 0) {
        shaderRenderer.setSize(el.offsetWidth, el.offsetHeight);
        shaderCamera.aspect = el.offsetWidth / el.offsetHeight;
        shaderCamera.updateProjectionMatrix();
        material.uniforms.resolution.value.set(el.offsetWidth, el.offsetHeight);
    }
  }).observe(el);
});

// Funcionalidade para copiar e-mail
const copyEmailButton = document.querySelector('.copy-email');
if (copyEmailButton) {
    copyEmailButton.addEventListener('click', () => {
        const emailLink = document.querySelector('a[href^="mailto:"]');
        if (emailLink) {
            const email = emailLink.href.substring(7); // Remove "mailto:"
            navigator.clipboard.writeText(email).then(() => {
                copyEmailButton.textContent = 'E-mail Copiado!';
                setTimeout(() => {
                    copyEmailButton.textContent = 'Copiar E-mail';
                }, 2000); // Volta ao texto original após 2 segundos
            }).catch(err => {
                console.error('Erro ao copiar e-mail: ', err);
                // Poderia adicionar um feedback visual de erro aqui
            });
        }
    });
}