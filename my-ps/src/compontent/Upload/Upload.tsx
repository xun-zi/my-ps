import { Button } from 'antd'
import './Upload.scss'
import { UploadOutlined } from '@ant-design/icons'
import { useRef } from 'react'

type Upload = {
    setImgUrl: (s: string) => any,
    setIsUpload:(b:boolean) => any,
}



export default function Upload({ setImgUrl,setIsUpload}: Upload) {
    const inp = useRef<HTMLInputElement>(null);

    function fileHande(files:FileList|null) {
        if (!files) {
            console.log('files有问题');
            return;
        }
        setImgUrl(window.URL.createObjectURL(files[0]));
        setIsUpload(true);
    }
    return (<div className='Upload'
        onDragEnter={(e) => { e.preventDefault(), e.stopPropagation() }}
        onDragOver={(e) => { e.preventDefault(), e.stopPropagation() }}
        onDrop={e => {e.preventDefault(); fileHande(e.dataTransfer.files)}}
    >
        <Button type='primary' size='large' icon={<UploadOutlined />} onClick={() => inp.current?.click()}>上传图片</Button>
        <input type='file' style={{ display: 'none' }} ref={inp} onChange={(e) => {
            fileHande(e.target.files);
        }}></input>
    </div>)
}