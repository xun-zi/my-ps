import React, { Key, useEffect, useRef, useState } from 'react';
import PropBar from '../PropBar/PropBar';
import ToolBar from '../ToolBar/ToolBar';
import './Canvas.scss';


type CanvasProps = {
    imgUrl: string
}

type State = 'null' | 'draw' | 'drag' | 'rect' | 'download' | 'straw' | 'filter' | 'magic' | 'mirror';
let drawPre = {
    x: 0,
    y: 0
}
let fillstate = false;


export default function Canvas({ imgUrl }: CanvasProps) {
    const cav = useRef<HTMLCanvasElement>(null);
    const [width, setWidth] = useState(0);
    const [height, setHeight] = useState(0);
    const mouseIsDown = useRef(false);
    const [reset, setReset] = useState<ImageData[]>([]);
    const [resetS, setResetS] = useState(0);
    const [state, setState] = useState<State>('null');
    const [size, setSize] = useState(3);
    const [picSize,setPicSize] = useState(100);
    const [color, setColor] = useState<string>('#000000');
    const [mColor,setMColor] = useState({
        r:0,
        g:0,
        b:0
    })
    const [mLimit,setMLimit] = useState(200)
    const [fColorVal, setFColorVal] = useState({
        r: 'r',
        g: 'g',
        b: 'b'
    })
    function onreset() {
        const val = cav.current?.getContext('2d')?.getImageData(0, 0, width, height);
        if (!val) {
            console.error(val);
            return
        }
        const arr = [...reset].slice(0, resetS + 1);
        arr.push(val);
        setReset(arr);
        setResetS((pre) => pre + 1);
    }
    function ImageDataShow(num: number) {
        const data = reset[num];
        cav.current?.getContext('2d')?.putImageData(data, 0, 0)
    }
    function reback() {
        if (resetS) {
            setResetS(resetS - 1)
            ImageDataShow(resetS - 1)
        }
    }
    function redo() {
        if (resetS + 1 < reset.length) {
            setResetS(resetS + 1);
            ImageDataShow(resetS + 1)
        }
    }
    useEffect(() => {
        if (state == 'download') {
            cav.current?.toBlob((blob) => {
                if (!(blob instanceof Blob)) {
                    console.error('blob不存在');
                    return;
                }
                const a = document.createElement('a');
                a.href = window.URL.createObjectURL(blob);
                a.download = 'img.jpg'
                a.click();
                a.remove();
            })
        }
    }, [state])
    function setCav() {
        const img = new Image();
        img.src = imgUrl;
        img.onload = function () {
            setWidth(img.width);
            setHeight(img.height);
            const ctx = cav.current?.getContext('2d');
            if (!ctx) {
                console.log('ctx没有加载')
            }
            setTimeout(() => {
                if (!ctx) {
                    console.error('没有ctx')
                    return;
                }
                ctx.drawImage(img, 0, 0, img.width, img.height);
                const arr = [...reset];
                arr.push(ctx.getImageData(0, 0, img.width, img.height));
                setReset(arr);
                setDragCavPos(pre => {
                    return {...pre,x:(document.body.clientWidth - img.width)/2,y:(document.body.clientHeight - img.width)/2}
                })
            }, 0)
        }
    }
    useEffect(() => {
        setCav();
        document.addEventListener('mousedown', () => {
            mouseIsDown.current = true;
        })
        document.addEventListener('mouseup', () => {
            mouseIsDown.current = false;
        })
        document.onkeydown = (e) => {
            if (e.key == 'Alt') setState('drag')
        }
        document.onkeyup = (e) => {
            console.log(e.key);
            if(e.key == 'ArrowUp')setPicSize(p => p + 5);
            else if(e.key == 'ArrowDown')setPicSize(p => p -5);
            else if (e.key == 'Alt') setState('null')
        }
    }, [])
    const [dragCavPos, setDragCavPos] = useState({
        isDown: false,
        x: 10,
        y: 10,
    })
    const mouseDistCav = useRef({
        x: 0,
        y: 0,
    })
    const cavStyle: React.CSSProperties = {
        left:`${dragCavPos.x}px`,
        top: `${dragCavPos.y}px`,
        transform:`scale(${picSize/100})`
    }
    const [cavIsDown, setCavIsDown] = useState(false);
    const getColor = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        const [x, y] = [e.nativeEvent.offsetX, e.nativeEvent.offsetY];
        const onePx: any = cav.current?.getContext('2d')?.getImageData(x, y, 1, 1).data
        let val = 0;
        for (let i = 0; i < 3; i++) {
            val = val * 256 + onePx[i];
        }
        return '#' + val.toString(16)
    }
    function magic(e: React.MouseEvent<HTMLDivElement, MouseEvent>){
        const time = new Date().getTime();
        const ctx = cav.current?.getContext('2d');
        if(!ctx){
            console.log('ctx不存在');
            return;
        }
        const [x,y] = [e.nativeEvent.offsetX,e.nativeEvent.offsetY];
        const st = new Array(width + 1).fill([]).map(() => {
            return new Array(height + 1).fill(false);
        })
        const dx = [-1,0,1,0],dy = [0,1,0,-1];
        const targetPx = ctx.getImageData(x,y,1,1).data;
        const q = [[x,y]];
        while(q.length){
            const [x,y]:[number,number] = q.shift() as any;
            if(st[x][y])continue;
            st[x][y] = true;
            let curData = ctx.getImageData(x, y, 1, 1);
            let data = curData.data;
            const s = Math.pow(targetPx[0] - data[0],2) + Math.pow(targetPx[1] - data[1],2) + Math.pow(targetPx[2] - data[2],2);
            if(s/3 < mLimit){
                data[0] = data[0] + mColor.r;
                data[1] = data[1] + mColor.g;
                data[1] = data[2] + mColor.b;
                ctx.putImageData(curData,x,y);
                for (let i = 0; i < 4; i++) {
                    const x1 = x + dx[i], y1 = y + dy[i];
                    if (x1 < 1 || x1 > width || y1 < 1 || y1 > height) continue;
                    q.push([x1, y1]);
                }
            }
        }
        onreset();
        console.log('runtime',new Date().getTime() - time);
    }
    const cavMouseEvent: Record<string, any> = {
        ['drag']: {
            down: function (e: React.MouseEvent<HTMLDivElement, MouseEvent>) {
                setDragCavPos(state => { return { ...state, isDown: true } });
                mouseDistCav.current = {
                    x: e.nativeEvent.offsetX,
                    y: e.nativeEvent.offsetY
                }
            },
            move: function (e: React.MouseEvent<HTMLDivElement, MouseEvent>) {
                if (!dragCavPos.isDown || state != 'drag') return;

                const { x, y } = mouseDistCav.current;
                setDragCavPos((state) => {
                    return { ...state, x: e.pageX - x, y: e.pageY - y, }
                })
            },
            up: function (e: React.MouseEvent<HTMLDivElement, MouseEvent>) {
                setDragCavPos(state => { return { ...state, isDown: false } });
            }
        },
        ['draw']: {
            down: function (e: React.MouseEvent<HTMLDivElement, MouseEvent>) {
                drawPre = {
                    x: e.nativeEvent.offsetX,
                    y: e.nativeEvent.offsetY
                }
                const ctx = cav.current?.getContext('2d');
                if (!ctx) {
                    console.error('ctx不存在')
                    return
                }
                ctx.strokeStyle = color;
                ctx.lineCap = 'round';
                ctx.lineWidth = size * 2;
                ctx.beginPath()
                setCavIsDown(true);
            },
            move: function (e: React.MouseEvent<HTMLDivElement, MouseEvent>) {
                if (!cavIsDown || state !== 'draw') return;
                const ctx = cav.current?.getContext('2d');
                if (!ctx) return;
                const { x, y } = drawPre;
                ctx.moveTo(x, y);
                // ctx.arc(x, y, size, 0, Math.PI * 2);
                const [x2, y2] = [e.nativeEvent.offsetX, e.nativeEvent.offsetY];
                // ctx.arc(x2, y2, size, 0, Math.PI * 2);
                ctx.lineTo(x2, y2);
                ctx.stroke();
                // console.log(cav === cavc)
                drawPre = {
                    x: x2,
                    y: y2
                }
            },
            up: function (e: React.MouseEvent<HTMLDivElement, MouseEvent>) {
                setCavIsDown(false)
                onreset();
            }
        },
        ['rect']: {
            down: function (e: React.MouseEvent<HTMLDivElement, MouseEvent>) {
                drawPre = {
                    x: e.nativeEvent.offsetX,
                    y: e.nativeEvent.offsetY
                }
                const ctx = cav.current?.getContext('2d');
                if (!ctx) {
                    console.error('ctx不存在')
                    return
                }
                ctx.strokeStyle = color
                ctx.lineWidth = size * 2;
                ctx.beginPath()
                setCavIsDown(true);
            },
            move: function (e: React.MouseEvent<HTMLDivElement, MouseEvent>) {
                if (!cavIsDown) return;
                const ctx = cav.current?.getContext('2d');
                if (!ctx) return;
                ctx.putImageData(reset[resetS], 0, 0);
                const { x, y } = drawPre;
                const [x2, y2] = [e.nativeEvent.offsetX, e.nativeEvent.offsetY];
                ctx.strokeRect(x, y, x2 - x, y2 - y);

            },
            up: function (e: React.MouseEvent<HTMLDivElement, MouseEvent>) {
                setCavIsDown(false)
                onreset();
            }
        },
        ['straw']: {
            down: function (e: React.MouseEvent<HTMLDivElement, MouseEvent>) {
                setColor(getColor(e));
            },
            move: function (e: React.MouseEvent<HTMLDivElement, MouseEvent>) { },
            up: function (e: React.MouseEvent<HTMLDivElement, MouseEvent>) { }
        },
        ['fill']: {
            down: function (e: React.MouseEvent<HTMLDivElement, MouseEvent>) {
                console.log('down')
                if (fillstate) return;
                fillstate = true;
                let time = new Date().getTime();
                const ctx = cav.current?.getContext('2d') as CanvasRenderingContext2D;
                const onePx = [parseInt(color.slice(1, 3), 16), parseInt(color.slice(3, 5), 16), parseInt(color.slice(5, 7), 16)]
                let [x, y] = [e.nativeEvent.offsetX, e.nativeEvent.offsetY];
                const curOnePx = ctx.getImageData(x, y, 1, 1).data;

                const dx = [0, 1, 0, -1];
                const dy = [-1, 0, 1, 0];
                const queue: any = [[x, y]];
                const arr: boolean[][] = new Array(width + 1).fill([]).map(() => {
                    return new Array(height + 1).fill(false);
                })
                if (curOnePx[0] === onePx[0] && curOnePx[1] === onePx[1] && curOnePx[2] === onePx[2]) queue.shift();
                while (queue.length) {
                    const [x, y] = queue.shift();
                    if (arr[x][y]) continue;
                    arr[x][y] = true;
                    const Imgdata = ctx.getImageData(x, y, 1, 1);
                    const data = Imgdata.data;
                    if (curOnePx[0] === data[0] && curOnePx[1] === data[1] && curOnePx[2] === data[2]) {
                        data[0] = onePx[0], data[1] = onePx[1], data[2] = onePx[2];
                        ctx.putImageData(Imgdata, x, y);
                        for (let i = 0; i < 4; i++) {
                            const x1 = x + dx[i], y1 = y + dy[i];
                            if (x1 < 1 || x1 > width || y1 < 1 || y1 > height) continue;
                            queue.push([x1, y1]);
                        }
                    }
                }
                onreset();
                console.log('fillTime', new Date().getTime() - time);
                fillstate = false
            },
            move: function (e: React.MouseEvent<HTMLDivElement, MouseEvent>) { },
            up: function (e: React.MouseEvent<HTMLDivElement, MouseEvent>) { }
        },
        ['mirror']: {
            down: function (e: React.MouseEvent<HTMLDivElement, MouseEvent>) { },
            move: function (e: React.MouseEvent<HTMLDivElement, MouseEvent>) { },
            up: function (e: React.MouseEvent<HTMLDivElement, MouseEvent>) { }
        },
        ['null']: {
            down: function (e: React.MouseEvent<HTMLDivElement, MouseEvent>) { },
            move: function (e: React.MouseEvent<HTMLDivElement, MouseEvent>) { },
            up: function (e: React.MouseEvent<HTMLDivElement, MouseEvent>) { }
        },
        ['filter']: {
            down: function (e: React.MouseEvent<HTMLDivElement, MouseEvent>) { },
            move: function (e: React.MouseEvent<HTMLDivElement, MouseEvent>) { },
            up: function (e: React.MouseEvent<HTMLDivElement, MouseEvent>) { }
        },
        ['magic']: {
            down: function (e: React.MouseEvent<HTMLDivElement, MouseEvent>) {
                magic(e);
                console.log('魔')
            },
            move: function (e: React.MouseEvent<HTMLDivElement, MouseEvent>) { },
            up: function (e: React.MouseEvent<HTMLDivElement, MouseEvent>) { }
        }
    }
    function filter() {
        console.log('filter')
        let time = new Date().getTime();
        let { r, g, b } = fColorVal;
        const ctx = cav.current?.getContext('2d');
        if (!ctx) throw new Error('ctx为空');
        const ImgData = ctx.getImageData(0, 0, width, height);
        const data = ImgData.data;

        r = r.replace(/r/g, 'data[i]')
        r = r.replace(/g/g, 'data[i + 1]')
        r = r.replace(/b/g, 'data[i + 2]')
        g = g.replace(/r/g, 'data[i]')
        g = g.replace(/g/g, 'data[i + 1]')
        g = g.replace(/b/g, 'data[i + 2]')
        b = b.replace(/r/g, 'data[i]')
        b = b.replace(/g/g, 'data[i + 1]')
        b = b.replace(/b/g, 'data[i + 2]')
        let exeErr:Error|undefined
        const exe = `for (let i = 0; i < data.length; i += 4) {
            try {
                data[i] = ${r};
                data[i + 1] = ${g};
                data[i + 2] = ${b};
            } catch (e) {
                exeErr = e
                console.log('你的输入有问题');
                break;
            }
        }`
        eval(exe);
        ctx.putImageData(ImgData, 0, 0);
        onreset();
        console.log('filterTime',new Date().getTime() - time);
    }
    return (<div>
        <div className='Canvas'>
            <canvas ref={cav} width={width} height={height} style={cavStyle} className="canvas"
                onMouseDown={function (e) {
                    if (!(state in cavMouseEvent)) setState('null')
                    setCavIsDown(true);
                    cavMouseEvent[state]?.down(e);
                }}
                onMouseMove={function (e) {
                    if (!(state in cavMouseEvent)) setState('null')
                    cavMouseEvent[state]?.move(e);
                }}
                onMouseUp={function (e) {
                    if (!(state in cavMouseEvent)) setState('null')
                    setCavIsDown(false);
                    cavMouseEvent[state]?.up(e);
                }}
            ></canvas>
        </div>
        <ToolBar reback={reback} redo={redo} setFnKey={setState} />
        <PropBar
            setSize={setSize}
            size={size}
            color={color}
            setColor={setColor}
            state={state}
            fColorVal={fColorVal}
            setFColorVal={setFColorVal}
            filter={filter}
            mLimit={mLimit}
            setMLimit={setMLimit}
            mColor={mColor}
            setMColor={setMColor}
        />
    </div>)
}