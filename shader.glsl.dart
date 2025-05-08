// Vertex Shader
// varying permite passar dados do Vertex Shader para o Fragment Shader.
// vUv é convencionalmente usado para coordenadas de textura (UV).
varying vec2 vUv;
// uniform são variáveis globais passadas do código JavaScript (CPU) para o shader (GPU).
// 'time' é frequentemente usado para animações.
uniform float time;

void main() {
  // Passa as coordenadas de textura (uv) para o Fragment Shader.
  // 'uv' é um atributo de vértice predefinido em Three.js para geometrias com mapeamento UV.
  vUv = uv;
  // 'position' é um atributo de vértice predefinido contendo a posição do vértice no espaço do modelo.
  vec3 pos = position;

  // Adiciona uma distorção de onda à posição do vértice.
  // A posição x é deslocada por uma função seno baseada na posição y e no tempo.
  pos.x += sin(pos.y * 5.0 + time * 2.0) * 0.1;
  // A posição y é deslocada por uma função cosseno baseada na posição x e no tempo.
  pos.y += cos(pos.x * 3.0 + time * 1.5) * 0.1;

  // gl_Position é uma variável especial de saída do Vertex Shader.
  // Define a posição final do vértice no espaço de clipe (coordenadas normalizadas do dispositivo).
  // projectionMatrix e modelViewMatrix são uniforms predefinidos pelo Three.js
  // que transformam o vértice do espaço do modelo para o espaço de clipe.
  gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
}

// Fragment Shader
// 'time' e 'resolution' (resolução da tela/canvas) são uniforms.
uniform float time;
uniform vec2 resolution; // Nota: 'resolution' não está sendo usada neste shader.
// 'vUv' são as coordenadas de textura interpoladas recebidas do Vertex Shader.
varying vec2 vUv;

void main() {
  // Copia as coordenadas UV interpoladas.
  vec2 uv = vUv;

  // Adiciona um efeito de distorção às coordenadas UV.
  // 'distortX' e 'distortY' são calculados usando funções seno e cosseno baseadas nas coordenadas UV e no tempo.
  float distortX = sin(uv.y * 10.0 + time) * 0.02;
  float distortY = cos(uv.x * 8.0 + time * 1.2) * 0.02;
  // Aplica a distorção às coordenadas UV.
  uv.x += distortX;
  uv.y += distortY;

  // Cria um gradiente de cor.
  // 'color1' e 'color2' são as cores inicial e final do gradiente.
  vec3 color1 = vec3(0.0, 0.8, 1.0); // Azul ciano
  vec3 color2 = vec3(1.0, 0.0, 0.8); // Rosa/Magenta
  // 'mix' interpola linearmente entre color1 e color2 com base na coordenada x de uv.
  vec3 color = mix(color1, color2, uv.x);

  // Adiciona um efeito de pulsação à cor.
  // 'pulse' varia entre ~0.8 e ~1.0 com base no tempo.
  float pulse = sin(time * 2.0) * 0.1 + 0.9;
  // Multiplica a cor pelo fator de pulsação para alterar sua intensidade.
  color *= pulse;

  // gl_FragColor é uma variável especial de saída do Fragment Shader.
  // Define a cor final do fragmento (pixel). O quarto componente é o alfa (opacidade).
  gl_FragColor = vec4(color, 1.0);
}