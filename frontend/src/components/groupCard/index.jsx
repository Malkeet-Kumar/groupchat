import { message } from 'antd'
import serverUrl from '../../utils/urls'
import style from './style.module.css'
import { FaShareAltSquare } from 'react-icons/fa'

export default function GroupCard({data, onclick}){
    return (
        <div className={style.card} onClick={()=>onclick(data.g_id)}>
            <div className={style.profile}>
                <img src={serverUrl+data.image} alt={data.image} />
            </div>
            <div className={style.gpname}>
                <p className={style.name}>{data.name}</p>
                <p className={style.msg}>{data.lastmsg}</p>
            </div>
            <div className={style.linkIcon}>
                <p>{data.timestamp}akjshdkj</p>
            </div>
        </div>
    )
}