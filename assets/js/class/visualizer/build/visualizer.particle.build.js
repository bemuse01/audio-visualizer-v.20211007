import * as THREE from '../../../lib/three.module.js'
import PARAM from '../param/visualizer.particle.param.js'
import SHADER from '../shader/visualizer.particle.shader.js'
import METHOD from '../method/visualizer.particle.method.js'

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

        METHOD.fillVelocityTexture(velocity)

        this.velocityVariable = this.gpuCompute.addVariable('tVelocity', SHADER.velocity, velocity)
    }
    initVelocityTexture(){
        this.gpuCompute.setVariableDependencies(this.velocityVariable, [this.velocityVariable, this.positionVariable])

        this.velocityUniforms = this.velocityVariable.material.uniforms

        // this.velocityUniforms['uTime'] = {value: null}
        // this.velocityUniforms['uTrd'] = {value: PARAM.tRd}
        // this.velocityUniforms['uNrd'] = {value: PARAM.nRd}
        this.velocityUniforms['uRange'] = {value: PARAM.range}
        this.velocityUniforms['uStrength'] = {value: PARAM.strength}
    }

    // position texture
    createPositionTexture(){
        const position = this.gpuCompute.createTexture()

        METHOD.fillPositionTexture(position, PARAM)

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
        this.mesh = new THREE.Points(geometry, material)
        console.log(geometry, material)
    }
    createGeometry(){
        const geometry = new THREE.BufferGeometry()

        const {position, coord, opacity} = METHOD.createAttribute(PARAM)

        geometry.setAttribute('position', new THREE.BufferAttribute(position, 3))
        geometry.setAttribute('aCoord', new THREE.BufferAttribute(coord, 2))
        geometry.setAttribute('aOpacity', new THREE.BufferAttribute(opacity, 1))

        return geometry
    }
    createMaterial(){
        return new THREE.ShaderMaterial({
            vertexShader: SHADER.draw.vertex,
            fragmentShader: SHADER.draw.fragment,
            transparent: true,
            uniforms: {
                uColor: {value: new THREE.Color(PARAM.color)},
                uSize: {value: PARAM.size},
                uPosition: {value: null},
                uVelocity: {value: null},
                uOpacity: {value: PARAM.opacity},
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

        // this.velocityUniforms['uTime'].value = time

        this.mesh.material.uniforms['uPosition'].value = this.gpuCompute.getCurrentRenderTarget(this.positionVariable).texture
    }
}