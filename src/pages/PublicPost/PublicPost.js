import { IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonList, IonTitle } from '@ionic/react'
import React from 'react'
import { useState } from 'react'
import { useEffect } from 'react'
import { BACKEND_HOST } from '../../constants'

import './PublicPost.css'
const PublicPost = ({ socket }) => {
    const [notes, setNotes] = useState([]);

    useEffect(() => {
        fetch(`${BACKEND_HOST}/public/`).then(
            res => {
                res.json().then(data => {
                    console.log('public', data);
                    setNotes(data)
                })
            })
    }, [])

    useEffect(() => {
        socket && socket.on("getPublicPost", (creater) => {
            console.log(`Wow, I received a post from ${creater}`)
            fetch(`${BACKEND_HOST}/public/`).then(
                res => {
                    res.json().then(data => {
                        console.log('public', data);
                        setNotes(data)
                    })
                })
        })
    }, [socket])
    return (
        <div className='public-post-container'>
            <IonTitle className='public-post-title'>PUBLIC</IonTitle>
            <IonList>
                {
                    notes.map(note => (
                        <IonCard key={note._id}>
                            <IonCardHeader>
                                <IonCardTitle>
                                    {note.title}
                                </IonCardTitle>
                            </IonCardHeader>
                            <IonCardContent>
                                {note.content}
                            </IonCardContent>
                        </IonCard>
                    ))
                }
            </IonList>
        </div>

    )
}

export default PublicPost