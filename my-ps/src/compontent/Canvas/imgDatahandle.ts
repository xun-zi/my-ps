
class imgDataHandle{
    imgData
    width
    height
    constructor(imgData:ImageData){
        this.imgData = imgData
        this.width = imgData.width
        this.height = imgData.height
    }
    //以1为起点
    getPosXY(x:number,y:number){
        let pos = x + (y - 1) * this.width - 1;
        return pos * 4;
    }
}