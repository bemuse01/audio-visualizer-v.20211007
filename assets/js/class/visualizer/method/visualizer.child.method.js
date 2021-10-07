export default {
    createAttribute({width, height, w, h, radius}){
        const coord = []
        const position = []
        
        const wid = w * width
        const hei = h * height
        
        const deg = 360 / w;

        for(let i = 0; i < w; i++){
            // const x = -wid / 2 + i * width
      

            for(let j = 0; j < h; j++){
                // const y = -hei / 2 + j * height
                const x = Math.cos(deg * i * RADIAN) * (radius + j) 
                const y = Math.sin(deg * i * RADIAN) * (radius + j)

                position.push(x, y, 0)
                coord.push(i, j)
            }
        }

        return {position: new Float32Array(position), coord: new Float32Array(coord)}
    },
    fillPositionTexture(texture){
        const {data, width, height} = texture.image
        
        const deg = 360 / width;

        for(let j = 0; j < height; j++){
            for(let i = 0; i < width; i++){
                const index = (j * width + i) * 4

                // const x = Math.cos(deg * i * RADIAN) * (300 + j)
                // const y = Math.sin(deg * i * RADIAN) * (300 + j)

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

                data[index] = Math.random() * vel - vel / 2
                data[index + 1] = Math.random() * vel - vel / 2
                data[index + 2] = Math.random()
                data[index + 3] = 0.015
            }
        }
    }
}