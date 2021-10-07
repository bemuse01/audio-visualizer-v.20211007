export default {
    createAttribute({width, height, w, h}){
        const coord = []
        const position = []
        
        const wid = w * width
        const hei = h * height

        for(let i = 0; i < h; i++){
            const x = -wid / 2 + i * width

            for(let j = 0; j < w; j++){
                const y = -hei / 2 + j * height

                position.push(x, y, 0)
                coord.push(i, j)
            }
        }

        return {position: new Float32Array(position), coord: new Float32Array(coord)}
    },
    fillPositionTexture(texture){
        const {data, width, height} = texture.image

        for(let j = 0; j < height; j++){
            for(let i = 0; i < width; i++){
                const index = (j * width + i) * 4

                // position x
                data[index] = 0
                // position y
                data[index + 1] = 0
                // position z
                data[index + 2] = 0
                data[index + 3] = 0
            }
        }
    },
    fillVelocityTexture(texture, {vel}){
        const {data, width, height} = texture.image

        for(let j = 0; j < height; j++){
            for(let i = 0; i < width; i++){
                const index = (j * width + i) * 4

                // x velocity
                data[index] = Math.random() * vel - vel / 2
                // y velocity
                data[index + 1] = Math.random() * vel - vel / 2
                // life (opacity)
                data[index + 2] = Math.random()
                // life velocity
                data[index + 3] = 0.015
            }
        }
    }
}