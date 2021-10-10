import * as THREE from '../../lib/three.module.js'
import {GPUComputationRenderer} from '../../lib/GPUComputationRenderer.js'
import {EffectComposer} from '../../postprocess/EffectComposer.js'
import {RenderPass} from '../../postprocess/RenderPass.js'
import {ShaderPass} from '../../postprocess/ShaderPass.js'
import {HorizontalBlurShader} from '../../postprocess/HorizontalBlurShader.js'
import {VerticalBlurShader} from '../../postprocess/VerticalBlurShader.js'
import PUBLIC_METHOD from '../../method/method.js'
import PLANE from './build/visualizer.plane.build.js'
import PLANE_PARAM from './param/visualizer.plane.param.js'


export default class{
    constructor({app}){
        this.param = {
            fov: 60,
            near: 0.1,
            far: 10000,
            pos: 1000
        }

        this.modules = {
            plane: PLANE,
        }
        this.group = {}
        this.comp = {}
        this.build = new THREE.Group()

        this.init(app)
    }


    // init
    init(app){
        this.initGPGPU(app)
        this.initGroup()
        this.initRenderObject()
        // this.initComposer(app)
        this.create(app)
        this.add()
    }
    initGroup(){
        for(const module in this.modules){
            this.group[module] = new THREE.Group()
            this.comp[module] = null
        }
    }
    initRenderObject(){
        this.element = document.querySelector('.visualizer-object')

        const {width, height} = this.element.getBoundingClientRect()

        this.scene = new THREE.Scene()

        this.camera = new THREE.PerspectiveCamera(this.param.fov, width / height, this.param.near, this.param.far)
        this.camera.position.z = this.param.pos
        
        this.size = {
            el: {
                w: width,
                h: height
            },
            obj: {
                w: PUBLIC_METHOD.getVisibleWidth(this.camera, 0),
                h: PUBLIC_METHOD.getVisibleHeight(this.camera, 0)
            }
        }
    }
    initComposer({renderer}){
        this.bloom = this.param.bloom

        const {right, left, bottom, top} = this.element.getBoundingClientRect()
        const width = right - left
        const height = bottom - top
        
        this.composer = new EffectComposer(renderer)
        this.composer.setSize(width, height)

        const renderPass = new RenderPass(this.scene, this.camera)

        // this.fxaa = new THREE.ShaderPass(THREE.FXAAShader)
        // this.fxaa.uniforms['resolution'].value.set(1 / (width * RATIO), 1 / (height * RATIO))

        const hblur = new ShaderPass(HorizontalBlurShader)

        const vblur = new ShaderPass(VerticalBlurShader)
        vblur.renderToScreen = true

        this.composer.addPass(renderPass)
        this.composer.addPass(hblur)
        this.composer.addPass(vblur)

        // this.composer.addPass(this.fxaa)
    }
    initGPGPU({renderer}){
        this.gpuCompute = new GPUComputationRenderer(PLANE_PARAM.w, PLANE_PARAM.h, renderer)
    }


    // add
    add(){
        for(let i in this.group) this.build.add(this.group[i])
        
        this.scene.add(this.build)
    }


    // create
    create({renderer}){
        for(const module in this.modules){
            const instance = this.modules[module]
            const group = this.group[module]

            this.comp[module] = new instance({group, size: this.size, gpuCompute: this.gpuCompute})
        }

        this.gpuCompute.init()
    }


    // animate
    animate({app, audio}){
        this.gpuCompute.compute()

        this.render(app)
        this.animateObject(audio)
    }
    render(app){
        const rect = this.element.getBoundingClientRect()
        const width = rect.right - rect.left
        const height = rect.bottom - rect.top
        const left = rect.left
        const bottom = app.renderer.domElement.clientHeight - rect.bottom

        app.renderer.setScissor(left, bottom, width, height)
        app.renderer.setViewport(left, bottom, width, height)

        this.camera.lookAt(this.scene.position)
        app.renderer.render(this.scene, this.camera)

        // app.renderer.autoClear = false
        // app.renderer.clear()

        // this.camera.layers.set(PROCESS)
        // this.composer.render()

        // app.renderer.clearDepth()
        // this.camera.layers.set(NORMAL)
        // app.renderer.render(this.scene, this.camera)
    }
    animateObject(audio){
        for(let i in this.comp){
            if(!this.comp[i] || !this.comp[i].animate) continue
            this.comp[i].animate(audio)
        }
    }


    // resize
    resize(){
        const rect = this.element.getBoundingClientRect()
        const width = rect.right - rect.left
        const height = rect.bottom - rect.top

        this.camera.aspect = width / height
        this.camera.updateProjectionMatrix()

        this.size = {
            el: {
                w: width,
                h: height
            },
            obj: {
                w: PUBLIC_METHOD.getVisibleWidth(this.camera, 0),
                h: PUBLIC_METHOD.getVisibleHeight(this.camera, 0)
            }
        }

        this.resizeObject()
    }
    resizeObject(){
        for(let i in this.comp){
            if(!this.comp[i] || !this.comp[i].resize) continue
            this.comp[i].resize(this.size)
        }
    }
}