import * as THREE from '../../../lib/three.module.js'

export default {
    createAttribute({width, height, w, h, radius}){
        const coord = []
        const position = []
        const opacity = []
        
        const wid = w * width
        const hei = h * height
        
        const hh = h / 2
        const o = 1 / h
        
        const deg = 360 / w;

        for(let i = 0; i < w; i++){
            // const x = -wid / 2 + i * width
      

            for(let j = 0; j < h; j++){
                // const y = -hei / 2 + j * height
                const x = Math.cos(deg * i * RADIAN) * (radius + j * height) 
                const y = Math.sin(deg * i * RADIAN) * (radius + j * height)

                position.push(x, y, 0)
                coord.push(i, j)
                opacity.push(j < hh ? 1 - o * j : 1 - o * (hh - (j % hh + 1)))
                // opacity.push(j === 0 ? 1 : 0)
            }
        }

        return {position: new Float32Array(position), coord: new Float32Array(coord), opacity: new Float32Array(opacity)}
    },
    fillPositionTexture(texture){
        const {data, width, height} = texture.image
        
        const hw = width / 2
        const hh = height / 2

        const deg = 360 / width

        for(let j = 0; j < height; j++){
            for(let i = 0; i < width; i++){
                const index = (j * width + i) * 4

                // const x = Math.cos(deg * i * RADIAN) * (300 + j)
                // const y = Math.sin(deg * i * RADIAN) * (300 + j)

                // position x
                data[index] = 0
                // position y
                data[index + 1] = 0
                // noise param x
                data[index + 2] = i < hw ? i : hw - (i % hw + 1)
                // noise param y
                data[index + 3] = j
            }
        }
    },
    fillVelocityTexture(texture, {vel}){
        const {data, width, height} = texture.image

        for(let j = 0; j < height; j++){
            for(let i = 0; i < width; i++){
                const index = (j * width + i) * 4

                data[index] = Math.random() * vel - vel / 2
                data[index + 1] = Math.random() * vel - vel / 2
                data[index + 2] = Math.random()
                data[index + 3] = 0.015
            }
        }
    },
    createAudioData(audioData, {strength}){
        if(!audioData) return strength * 0.01
        return [...audioData].map(e => e / 255 <= 0 ? strength * 0.001 : e / 255).reduce((a, b) => a + b) / audioData.length * strength
    }
}