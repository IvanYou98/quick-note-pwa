import {
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonContent,
  IonList,
  IonPage,
  IonIcon,
  IonFabButton,
  IonFab,
  IonTitle,
  IonItemDivider
} from "@ionic/react";
import "./List.css";
import { addOutline, trashBin } from "ionicons/icons";
import { useNavigate } from "react-router-dom";
import { Fragment, useEffect, useState } from "react";
import { openDB } from 'idb';
import { BACKEND_HOST } from "../../constants";
import PublicPost from "../PublicPost/PublicPost";
import Header from "../Header/Header";


const List = ({ socket }) => {
  const currentUser = JSON.parse(localStorage.getItem("user"));

  const navigate = useNavigate();
  const [notes, setNotes] = useState([]);
  const [mode, setMode] = useState('online');


  const createIndexDB = async () => {
    const BASE_NAME = 'backgroundSync';
    const STORE_NAME = 'messages';
    const VERSION = 1;

    // create database and store
    openDB(BASE_NAME, VERSION, {
      upgrade(db) {
        db.createObjectStore(STORE_NAME);
      },
    });
  }

  useEffect(() => {
    createIndexDB();
    fetch(`${BACKEND_HOST}/notes/${currentUser.uid}`)
      .then(reponse => {
        reponse.json()
          .then(result => {
            console.log('notes:', result);
            localStorage.setItem("data", JSON.stringify(result));
            setNotes(result);
          })
      })
      .catch(err => {
        if (!window.navigator.onLine) {
          let collection = localStorage.getItem("data");
          setNotes(JSON.parse(collection));
          setMode('offline');
        }
      })
  }, []);


  const btnClickHandler = () => {
    navigate("/create");
  };

  const btnRemoveHandler = async (noteId) => {
    console.log(noteId);
    const response = await fetch(`${BACKEND_HOST}/notes/${noteId}`, {
      method: 'DELETE', headers: {
        "Content-type": "application/json; charset=UTF-8"
      }
    })
    const deletedNote = await response.json();

    console.log(deletedNote);
    setNotes(notes.filter(note => note._id !== deletedNote._id))
  };

  return (
    <Fragment>
      <Header socket={socket} />
      <IonPage className="list-container">
        <div>
          {
            mode === 'offline' ? <div className="alertMessageContainer">
              <h1>You are in offline mode</h1>
            </div> : null
          }
        </div>
        {
          <IonContent class="ion-padding">
            <IonTitle>Personal Post</IonTitle>
            <IonList>
              {notes.map((note) => (
                <IonCard key={note._id}>
                  <IonCardHeader>
                    <IonFab vertical="top" horizontal="end">
                      <IonFabButton
                        color="red"
                        onClick={() => btnRemoveHandler(note._id)}
                        size="small"
                        className="close-btn">
                        <IonIcon icon={trashBin}></IonIcon>
                      </IonFabButton>
                    </IonFab>
                    <IonCardTitle>{note.title}</IonCardTitle>
                  </IonCardHeader>
                  <IonCardContent>{note.content}</IonCardContent>
                </IonCard>
              ))}
            </IonList>
            <IonItemDivider />
            <PublicPost socket={socket} />
            <div className="add-btn-container" >
              <IonFab slot="fixed">
                <IonFabButton onClick={btnClickHandler}>
                  <IonIcon icon={addOutline}></IonIcon>
                </IonFabButton>
              </IonFab>
            </div>
          </IonContent>
        }
      </ IonPage>
    </Fragment>

  );
};

export default List;
