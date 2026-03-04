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
    // Softer wave deformation for a calmer effect
    pos.z += wave * 0.12 + sin(pos.x * 2.0) * uSpeed * 0.18;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
`;

// ── Fragment Shader ─────────────────────────────────────────────────
// Ripple hover, desaturation, grain/noise, vignette, and scanlines.
export const FRAGMENT_SHADER = /* glsl */ `
  uniform sampler2D uTexture;
  uniform float uTime;
  uniform float uHover;
  uniform float uPlaneAspect;
  uniform float uTextureAspect;
  varying vec2 vUv;

  float rnd(vec2 st) {
    return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
  }

  void main() {
    vec2 uv = vUv;

    // Cover-style UV mapping (like CSS object-fit: cover)
    // Ensures the texture fills the plane while preserving aspect ratio.
    float planeAspect = max(uPlaneAspect, 0.0001);
    float texAspect = max(uTextureAspect, 0.0001);

    vec2 coverUv = uv;
    if (texAspect > planeAspect) {
      // Texture is wider than the plane: crop horizontally
      float scale = planeAspect / texAspect;
      coverUv.x = (coverUv.x - 0.5) * scale + 0.5;
    } else {
      // Texture is taller than the plane: crop vertically
      float scale = texAspect / planeAspect;
      coverUv.y = (coverUv.y - 0.5) * scale + 0.5;
    }

    // Ripple distortion on hover (slightly reduced)
    float ripple = sin(coverUv.x * 10.0 + uTime * 2.0) * 0.003 * uHover;
    vec4 tex = texture2D(uTexture, coverUv + ripple);

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
