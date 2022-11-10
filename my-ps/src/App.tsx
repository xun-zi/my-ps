import { useState } from 'react'
import reactLogo from './assets/react.svg'
import './App.scss'
import { Button } from 'antd'
import Upload from './compontent/Upload/Upload'
import Canvas from './compontent/Canvas/Canvas'
import ToolBar from './compontent/ToolBar/ToolBar'

function App() {
  const [imgUrl, setImgUrl] = useState('');
  const [isUpload, setIsUpload] = useState(false);
  return (
    <div className="App">
      {
        isUpload ?
          <Canvas imgUrl={imgUrl} />
          :
          <div className='upload'><Upload setImgUrl={setImgUrl} setIsUpload={setIsUpload}></Upload></div>
      }
      
    </div>
  )
}

export default App
