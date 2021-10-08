import * as THREE from '../../../lib/three.module.js'
import PARAM from '../param/visualizer.child.param.js'
import SHADER from '../shader/visualizer.child.shader.js'
import METHOD from '../method/visualizer.child.method.js'

export default class{
    constructor({group, gpuCompute}){
        this.gpuCompute = gpuCompute

        this.init(group)
    }


    // init
    init(group){
        this.initGPGPU()
        this.create()
        this.add(group)

        // const curve = new THREE.SplineCurve([
        //     new THREE.Vector2(-100, -100),
        //     new THREE.Vector2(0, 0),
        //     new THREE.Vector2(100, -100)
        // ])

        // const points = curve.getPoints(100)

        // console.log(points)
    }

    // gpgpu
    initGPGPU(){
        this.createTexture()
        this.initTexture()
    }

    // set texutre
    createTexture(){
        // this.createVelocityTexture()
        this.createPositionTexture()
    }
    initTexture(){
        // this.initVelocityTexture()
        this.initPositionTexture()
    }

    // velocity texture
    createVelocityTexture(){
        const velocity = this.gpuCompute.createTexture()

        METHOD.fillVelocityTexture(velocity, PARAM)

        this.velocityVariable = this.gpuCompute.addVariable('tVelocity', SHADER.velocity, velocity)
    }
    initVelocityTexture(){
        this.gpuCompute.setVariableDependencies(this.velocityVariable, [this.velocityVariable, this.positionVariable])

        // this.velocityUniforms = this.velocityVariable.material.uniforms
    }

    // position texture
    createPositionTexture(){
        const position = this.gpuCompute.createTexture()

        METHOD.fillPositionTexture(position)

        this.positionVariable = this.gpuCompute.addVariable('tPosition', SHADER.position, position)
    }
    initPositionTexture(){
        this.gpuCompute.setVariableDependencies(this.positionVariable, [this.positionVariable])

        this.positionUniforms = this.positionVariable.material.uniforms
        
        this.positionUniforms['uTime'] = {value: null}
        this.positionUniforms['uTrd'] = {value: PARAM.tRd}
        this.positionUniforms['uNrd'] = {value: PARAM.nRd}
        this.positionUniforms['uAudio'] = {value: null}
        this.positionUniforms['uRange'] = {value: PARAM.range}
    }
    

    // add
    add(group){
        group.add(this.mesh)
    }

    
    // create
    create(){
        this.createMesh()
    }
    createMesh(){
        const geometry = this.createGeometry()
        const material = this.createMaterial()
        this.mesh = new THREE.InstancedMesh(geometry, material, PARAM.w * PARAM.h)

        // this.mesh.layers.set(PROCESS)

        // const width = PARAM.w * PARAM.width
        // const height = PARAM.h * PARAM.height

        // for(let i = 0; i < PARAM.h; i++){
        //     const x = -width / 2 + i * PARAM.width

        //     for(let j = 0; j < PARAM.w; j++){
        //         const idx = i * PARAM.w + j

        //         const y = -height / 2 + j * PARAM.height

        //         const matrix = new THREE.Matrix4()
        //         matrix.setPosition(x, y, 0)
                
        //         this.mesh.setMatrixAt(idx, matrix)
        //     }
        // }
    }
    createGeometry(){
        const geometry = new THREE.PlaneGeometry(PARAM.width, PARAM.height)

        const {position, coord, opacity} = METHOD.createAttribute(PARAM)

        geometry.setAttribute('aPosition', new THREE.InstancedBufferAttribute(position, 3))
        geometry.setAttribute('aCoord', new THREE.InstancedBufferAttribute(coord, 2))
        geometry.setAttribute('aOpacity', new THREE.InstancedBufferAttribute(opacity, 1))

        return geometry
    }
    createMaterial(){
        // return new THREE.MeshBasicMaterial({
        //     color: PARAM.color,
        //     transparent: true
        // })
        return new THREE.ShaderMaterial({
            vertexShader: SHADER.draw.vertex,
            fragmentShader: SHADER.draw.fragment,
            transparent: true,
            uniforms: {
                uColor: {value: new THREE.Color(PARAM.color)},
                uPosition: {value: null},
                uOpacity: {value: PARAM.opacity}
            }
        })
    }


    // resize
    resize(){

    }


    // animate
    animate({audioData}){
        const time = window.performance.now()
        const avg = METHOD.createAudioData(audioData, PARAM)

        this.positionUniforms['uTime'].value = time
        this.positionUniforms['uAudio'].value = avg

        this.mesh.material.uniforms['uPosition'].value = this.gpuCompute.getCurrentRenderTarget(this.positionVariable).texture
    }
}