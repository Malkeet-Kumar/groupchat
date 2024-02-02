import { Modal, Button } from 'antd'
import style from './style.module.css'
import { useState } from 'react';
import serverUrl from '../../utils/urls';
import { IoSearch } from 'react-icons/io5';
import { FaCross } from 'react-icons/fa';
import { RiDeleteBack2Fill } from 'react-icons/ri';

const ListItem = ({p,mark}) => {
    return (
        <div className={style.person} onClick={e=>mark(p)}>
            <img src={serverUrl+p.image} alt={p.name} />
            <p>{p.name}</p>
            <p>{p.email}</p>
        </div>
    )
}

export default function CModal({ addUser,isModalOpen, setIsModalOpen, users, setUsers, onSearch, search, setSearch, selected, setSelected }){

    const handleOk = () => {
        setIsModalOpen(false)
        setSearch("")
        setUsers([])
        addUser()
    };

    const handleCancel = () => {
        setSelected([])
        setSearch("")
        setUsers([])
        setIsModalOpen(false);
    };

    const selectUser = (user)=>{
        setSelected(p=>{
            const index = p.findIndex(item=>item.u_id==user.u_id)
            if(index<0){
                return [...p,user]
            } else {
                return p
            }
        })
    }

    return (
        <>
            <Modal title={<h2>Add User</h2>} open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
                <div className={style.inpGroup}>
                    <input type="text" value={search} onInput={e=>setSearch(e.target.value)} placeholder='Search for someone...' />
                    <button onClick={() => {onSearch()}}><IoSearch/></button>
                </div>
                <div className={style.selected}>
                    {selected.map(op=><span>{op.name}<div onClick={()=>{setSelected(p=>p.filter(item=>item.u_id!=op.u_id))}}><RiDeleteBack2Fill/></div></span>)}
                </div>
                <div className={style.sub}>
                    {users.map(person=><ListItem p={person} mark={selectUser}/>)}
                </div>
            </Modal>
        </>
    );
}