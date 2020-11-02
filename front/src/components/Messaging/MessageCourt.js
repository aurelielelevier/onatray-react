import React, { useState, useEffect } from 'react';
import 'antd/dist/antd.less';
import '../../App.less';
import {Link} from 'react-router-dom';
import {Avatar,  Comment, Tooltip} from 'antd';
import { UserOutlined } from '@ant-design/icons';
import moment from 'moment';

function MessageCourt(props){

    const [color, setColor] = useState('#ffffff')

    if(props.avatar){
        var avatar = <Avatar style={{marginLeft:'15px'}}
        size='large'
        src={props.avatar}
        alt={props.nom}
        />
    } else {
        var avatar = <Avatar style={{marginLeft:'15px'}} icon={<UserOutlined />} />
    }
    
   return(

    <Link to={'/messageRoom'}>
    
    <Comment
        onMouseEnter={()=> setColor("#fed330")}
        onMouseLeave={()=> setColor("#ffffff")} 
        style={{border:'1px solid #4b6584', textAlign:'left', backgroundColor:color, borderRadius:10, margin:'20px', color:'black'}}
        // actions={[<span key="comment-basic-reply-to">Répondre</span>]}
        author={<a style={{color:'#4B6584'}}>{props.nom}</a>}
        avatar={avatar}
        content={
            <p >
            {props.contenu}
            </p>
        }
        datetime={
            <Tooltip title={moment().format('YYYY-MM-DD HH:mm:ss')}>
            <span style={{color:'#4B6584'}}>{props.date}</span>
            {/* <span>{moment().fromNow()}</span> */}
            </Tooltip>
        }
    />
    </Link>
)}

export default MessageCourt
