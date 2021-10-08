import SHADER_METHOD from '../../../method/method.shader.js'

export default {
    draw: {
        vertex: `
            attribute vec2 aCoord;
            attribute vec3 aPosition;
            attribute float aOpacity;

            uniform sampler2D uPosition;
            uniform sampler2D uVelocity;

            varying float vOpacity;

            void main(){
                vec4 pos = texelFetch(uPosition, ivec2(aCoord), 0);
                vec4 vel = texelFetch(uVelocity, ivec2(aCoord), 0);
                vec3 nPosition = position;

                nPosition.xy += aPosition.xy + pos.xy;

                // vOpacity = aOpacity;
                vOpacity = vel.x;

                gl_Position = projectionMatrix * modelViewMatrix * vec4(nPosition, 1.0);
            }
        `,
        fragment: `
            uniform vec3 uColor;
            uniform float uOpacity;

            varying float vOpacity;

            void main(){
                gl_FragColor = vec4(uColor, vOpacity);
                // gl_FragColor = vec4(uColor, uOpacity);
            }
        `
    },
    position: `
        uniform float uTime;
        uniform float uTrd;
        uniform float uNrd;
        uniform float uAudio;
        uniform float uRange;

        ${SHADER_METHOD.snoise3D()}

        void main(){
            vec2 uv = gl_FragCoord.xy / resolution.xy;

            vec4 pos = texture(tPosition, uv);

            float x = snoise3D(vec3(pos.zw * uNrd, uTime * uTrd)) * uRange * uAudio;
            float y = snoise3D(vec3(pos.zw * uNrd, uTime * uTrd)) * uRange * uAudio;

            pos.xy = vec2(x, y);

            gl_FragColor = pos;
        }
    `,
    velocity: `
        uniform float uRange;
        uniform float uStrength;

        ${SHADER_METHOD.executeNormalizing()}

        void main(){
            vec2 uv = gl_FragCoord.xy / resolution.xy;

            vec4 pos = texture(tPosition, uv);
            vec4 vel = texture(tVelocity, uv);

            float o = executeNormalizing(pos.x, 0.0, 1.0, -uRange * uStrength, uRange * uStrength);

            vel.x = o;

            gl_FragColor = vel;
        }
    `
}