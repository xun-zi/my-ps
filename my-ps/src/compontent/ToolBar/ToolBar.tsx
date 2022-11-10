import { BgColorsOutlined, BorderOutlined, DownloadOutlined, HighlightOutlined, LeftOutlined, PauseOutlined, RightOutlined } from '@ant-design/icons'
import './ToolBar.scss'

type ToolBar = {
    reback: Function,
    redo: Function,
    setFnKey: Function,
}

export default function ToolBar({ reback, redo, setFnKey }: ToolBar) {

    return (<div className='ToolBar'>
        <div className='El'>
            <HighlightOutlined onClick={() => setFnKey('draw')} />
        </div>
        <div className='El'>
            <BorderOutlined onClick={() => { setFnKey('rect') }} />
        </div>
        <div className='El'>
            <LeftOutlined onClick={() => {
                reback()
            }} />
        </div >
        <div className='El'>
            <RightOutlined onClick={() => {
                redo()
            }} />
        </div>
        <div className='El'>
            <BgColorsOutlined onClick={() => {
                setFnKey('fill');
            }} />
        </div>
        <div className='El'>
            <div onClick={() => {
                setFnKey('straw');
            }}>
                吸
            </div>
        </div>
        <div className='El'>
            <div onClick={() => {
                setFnKey('filter');
            }}>
                滤
            </div>
        </div>
        <div className='El'>
            <div onClick={() => {
                setFnKey('magic');
            }}>
                魔
            </div>
        </div>
        <div className='El'>
            <DownloadOutlined onClick={() => setFnKey('download')} />
            
        </div>
    </div>)
}