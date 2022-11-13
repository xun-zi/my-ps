import { BgColorsOutlined, BorderOutlined, DownloadOutlined, HighlightOutlined, LeftOutlined, PauseOutlined, RightOutlined } from '@ant-design/icons'
import './ToolBar.scss'

type ToolBar = {
    reback: Function,
    redo: Function,
    setFnKey: Function,
}

export default function ToolBar({ reback, redo, setFnKey }: ToolBar) {

    return (<div className='ToolBar'>
        <div className='El' onClick={() => setFnKey('draw')}>
            <HighlightOutlined />
        </div>
        <div className='El' onClick={() => { setFnKey('rect') }}>
            <BorderOutlined />
        </div>
        <div className='El' onClick={() => {
            reback()
        }} >
            <LeftOutlined />
        </div >
        <div className='El' onClick={() => {
            redo()
        }} >
            <RightOutlined />
        </div>
        <div className='El' onClick={() => {
            setFnKey('fill');
        }} >
            <BgColorsOutlined />
        </div>
        <div className='El' onClick={() => {
            setFnKey('straw');
        }}>
            <div >
                吸
            </div>
        </div>
        <div className='El' onClick={() => {
            setFnKey('filter');
        }}>
            <div >
                滤
            </div>
        </div>
        <div className='El' onClick={() => {
            setFnKey('magic');
        }}>
            <div >
                魔
            </div>
        </div>
        <div className='El'>
            <DownloadOutlined onClick={() => setFnKey('download')} />

        </div>
    </div>)
}