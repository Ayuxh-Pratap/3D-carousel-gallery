// ── Vertex Shader ───────────────────────────────────────────────────
// Wave deformation driven by uTime, uOffset, and uSpeed.
export const VERTEX_SHADER = /* glsl */ `
  varying vec2 vUv;
  uniform float uTime;
  uniform float uSpeed;
  uniform float uOffset;

  void main() {
    vUv = uv;
    vec3 pos = position;

    float wave = sin(pos.x * 1.5 + uTime * 2.0 + uOffset * 2.0)
               * cos(pos.y * 1.5 + uTime * 1.5);
    pos.z += wave * 0.25 + sin(pos.x * 2.0) * uSpeed * 0.3;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
`;

// ── Fragment Shader ─────────────────────────────────────────────────
// Ripple hover, desaturation, grain/noise, vignette, and scanlines.
export const FRAGMENT_SHADER = /* glsl */ `
  uniform sampler2D uTexture;
  uniform float uTime;
  uniform float uHover;
  varying vec2 vUv;

  float rnd(vec2 st) {
    return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
  }

  void main() {
    vec2 uv = vUv;

    // Ripple distortion on hover
    float ripple = sin(uv.x * 10.0 + uTime * 2.0) * 0.005 * uHover;
    vec4 tex = texture2D(uTexture, uv + ripple);

    // Desaturation → partial color on hover
    float gray = dot(tex.rgb, vec3(0.299, 0.587, 0.114));
    vec3 col = mix(vec3(gray), tex.rgb, 0.3 + (uHover * 0.7));

    // Film grain
    col += rnd(uv * uTime) * 0.12;

    // Vignette
    col *= smoothstep(0.9, 0.2, distance(uv, vec2(0.5)));

    // Scanlines
    col -= sin(uv.y * 600.0 + uTime * 10.0) * 0.02;

    gl_FragColor = vec4(col, 1.0);
  }
`;
