import * as THREE from '../../../lib/three.module.js'
import PARAM from '../param/visualizer.particle.param.js'

export default class{
    constructor({group, gpuCompute}){
        this.gpuCompute = gpuCompute

        this.init(group)
    }


    // init
    init(group){
        
    }


    // add
    add(group){

    }


    // create
    create(){

    }
    createMesh(){

    }
    createGeometry(){
        const geometry = new THREE.BufferGeometry()

        geometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(), 3))
    }
    createMaterial(){
        return new THREE.ShaderMaterial({
            vertexShader: ``,
            fragmentShader: ``,
            transparent: true,
            uniforms: {

            }
        })
    }


    // resize
    resize(){

    }


    // animate
    animate(){

    }
}