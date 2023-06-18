varying vec2 vUv;

uniform float time;
uniform sampler2D uTexture;

void main() {
    vUv = uv;

    vec3 newPos = position;
    vec4 color = texture2D(uTexture, vUv);
    newPos.xy = color.xy;
    // newPos.z += sin( time + position.x * 10.0) * 0.5;

    vec4 mvPosition = modelViewMatrix * vec4(newPos, 1.0);

    gl_PointSize = ( 15.0 / -mvPosition.z );

    gl_Position = projectionMatrix * mvPosition;
}