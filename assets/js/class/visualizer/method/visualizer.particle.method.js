export default {
    createAttribute({size, w, h, radius}){
        const coord = []
        const position = []
        const opacity = []
        
        const hh = h / 2
        const o = 1 / h
        
        const deg = 360 / w;

        for(let i = 0; i < w; i++){
            // const x = -wid / 2 + i * width
      

            for(let j = 0; j < h; j++){
                // const y = -hei / 2 + j * height
                const x = Math.cos(deg * i * RADIAN) * (radius + j * size) 
                const y = Math.sin(deg * i * RADIAN) * (radius + j * size)

                position.push(x, y, 0)
                coord.push(i, j)
                opacity.push(j < hh ? 1 - o * j : 1 - o * (hh - (j % hh + 1)))
                // opacity.push(j === 0 ? 1 : 0)
            }
        }

        return {position: new Float32Array(position), coord: new Float32Array(coord), opacity: new Float32Array(opacity)}
    },
    fillPositionTexture(texture, {smooth, radius, size, step}){
        const {data, width, height} = texture.image
        
        const hw = width / 2
        const hh = height / 2

        const deg = 360 / width

        for(let j = 0; j < height; j++){
            for(let i = 0; i < width; i++){
                const index = (j * width + i) * 4

                const x = Math.cos(deg * i * RADIAN) * (radius + j * size * step)
                const y = Math.sin(deg * i * RADIAN) * (radius + j * size * step)

                // position x
                data[index] = 0
                // position y
                data[index + 1] = 0
                // noise param x
                // data[index + 2] = (i < hw ? i : hw - (i % hw + 1)) * smooth
                data[index + 2] = x * smooth
                // noise param y
                // data[index + 3] = height - j
                data[index + 3] = y * smooth
            }
        }
    },
    fillVelocityTexture(texture){
        const {data, width, height} = texture.image

        for(let j = 0; j < height; j++){
            for(let i = 0; i < width; i++){
                const index = (j * width + i) * 4

                data[index] = 0
                data[index + 1] = 0
                data[index + 2] = 0
                data[index + 3] = 0
            }
        }
    },
    createAudioData(audioData, {strength}){
        if(!audioData) return strength * 0.01
        return [...audioData].map(e => e / 255 <= 0 ? strength * 0.001 : e / 255).reduce((a, b) => a + b) / audioData.length * strength
    }
}