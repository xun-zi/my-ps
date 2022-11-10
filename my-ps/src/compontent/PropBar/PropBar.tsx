import { Button, Input, Slider } from 'antd'
import Sider from 'antd/lib/layout/Sider'
import React from 'react'
import './PropBar.scss'


type PropBar = {
    setSize: React.Dispatch<React.SetStateAction<number>>
    size: number
    color: string,
    setColor: React.Dispatch<React.SetStateAction<string>>,
    state: string,
    fColorVal: { r: string, g: string, b: string },
    setFColorVal: React.Dispatch<React.SetStateAction<{ r: string, g: string, b: string }>>
    filter: Function,
    mColor: { r: number, g: number, b: number },
    setMColor: React.Dispatch<React.SetStateAction<{ r: number, g: number, b: number }>>
    mLimit: number,
    setMLimit: React.Dispatch<React.SetStateAction<number>>
}

const mp: Record<string, string> = {
    'rect': '矩形',
    'draw': '画',
    'fill': '填充',
    'filter': '过滤',
    'magic': '魔棒'
}

let name: string = '画'
let pre = 'draw'

type MyInput = {
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => any
    value: string
    prefix: string
}
function MyInput({ onChange, value, prefix }: MyInput) {
    return (<div style={{ fontSize: '20px', marginTop: '10px' }}>
        <div style={{ paddingRight: '10px' }}>{prefix}</div><Input value={value} size="large" onChange={onChange}></Input>
    </div>)
}

export default function PropBar({ color, setColor, size, setSize, state, fColorVal, setFColorVal, filter, mLimit, setMLimit, mColor, setMColor }: PropBar) {
    const { r, g, b } = fColorVal;
    return (<div className='PropBar'>
        <h4 style={{ fontSize: '20px' }}>{name = mp[state] || name}</h4>
        <Slider value={size} min={1} max={20} onChange={val => setSize(val)}></Slider>
        <input type='color' value={color} onChange={(e) => setColor(e.target.value)}></input>
        {
            state == 'magic' && (<div style={{ marginTop: '15px' }}>
                <div style={{ fontSize: '20px', marginTop: '10px' }}>
                    <div style={{ paddingRight: '10px' }}>容差</div>
                    <Slider min={0} max={400} value={mLimit} onChange={value => setMLimit(value)}></Slider>
                </div>
                <div style={{ fontSize: '20px', marginTop: '10px' }}>
                    <div style={{ paddingRight: '10px' }}>r</div>
                    <Slider min={-255} max={255} value={mColor.r} onChange={val => setMColor({ ...mColor, r: val })}></Slider>
                </div>
                <div style={{ fontSize: '20px', marginTop: '10px' }}>
                    <div style={{ paddingRight: '10px' }}>g</div>
                    <Slider min={-255} max={255} value={mColor.g} onChange={val => setMColor({ ...mColor, g: val })}></Slider>
                </div>
                <div style={{ fontSize: '20px', marginTop: '10px' }}>
                    <div style={{ paddingRight: '10px' }}>b</div>
                    <Slider min={-255} max={255} value={mColor.b} onChange={val => setMColor({ ...mColor, b: val })}></Slider>
                </div>
                <Button type='primary'size='large' style={{marginTop:'20px'}}>确认</Button>
            </div>)
        }

        {
            state == 'draw' && (<div className='show'>
                <div className='circle' style={{ width: size * 3, height: size * 3, backgroundColor: color }}></div>
            </div>)
        }

        {
            state == 'filter' && ((<div>
                <br />
                <Button type='default' size='large' onClick={() => setFColorVal({ r: '255 - r', g: '255 - g', b: '255 - b' })}>反色</Button>
                <Button type='default' size='large' onClick={() => setFColorVal({ r: '(r + g + b) / 3', g: '(r + g + b) / 3', b: '(r + g + b) / 3' })}>灰色调</Button>
                <h4 style={{ fontSize: '20px', marginTop: '20px' }}>自定义:</h4>
                <MyInput prefix='r:' value={fColorVal.r} onChange={e => setFColorVal({ ...fColorVal, r: e.target.value })} />
                <MyInput prefix='g:' value={fColorVal.g} onChange={e => setFColorVal({ ...fColorVal, g: e.target.value })} />
                <MyInput prefix='b:' value={fColorVal.b} onChange={e => setFColorVal({ ...fColorVal, b: e.target.value })} />

                <Button type='primary' size='large' style={{ marginTop: '20px' }} onClick={() => filter()}>确认</Button>
            </div>))
        }
    </div>)
}