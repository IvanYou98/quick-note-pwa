import {
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonContent,
  IonHeader,
  IonList,
  IonPage,
  IonTitle,
  IonToolbar,
  IonIcon,
  IonFabButton,
  IonFab,
  IonBadge,
  IonItem,
  IonButton,
} from "@ionic/react";
import "./List.css";
import { addOutline, trashBin, paperPlane, notifications } from "ionicons/icons";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { openDB } from 'idb';


const List = ({ socket }) => {
  const currentUser = JSON.parse(localStorage.getItem("user"));

  const navigate = useNavigate();
  const [notes, setNotes] = useState([]);
  const [mode, setMode] = useState('online');
  const [isOpen, setIsOpen] = useState(false);
  const [notificationQueue, setNotificationQueue] = useState([]);

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

  // listen to getNotification event from socket server
  useEffect(() => {
    socket && socket.on("getNotification", (notification) => {
      console.log(notification);
      setNotificationQueue(prev => [...prev, notification])
    })
  }, [socket])

  useEffect(() => {
    if (!currentUser) {
      navigate("/login");
      return;
    }

    createIndexDB();
    fetch(`https://quick-note--backend.herokuapp.com/notes/${currentUser.uid}`)
      .then(reponse => {
        reponse.json()
          .then(result => {
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

  const broadcastClickHandler = () => {
    socket.emit("sendNotification", {
      sender: currentUser.email
    })
  }


  const btnClickHandler = () => {
    navigate("/create");
  };

  const btnRemoveHandler = async (noteId) => {
    console.log(noteId);
    const response = await fetch(`https://quick-note--backend.herokuapp.com/notes/${noteId}`, {
      method: 'DELETE', headers: {
        "Content-type": "application/json; charset=UTF-8"
      }
    })
    const deletedNote = await response.json();

    console.log(deletedNote);
    setNotes(notes.filter(note => note._id !== deletedNote._id))
  };

  return (
    <IonPage>
      <div>
        {
          mode === 'offline' ? <div className="alertMessageContainer">
            <h1>You are in offline mode</h1>
          </div> : null
        }
      </div>
      <IonHeader>
        <IonToolbar color="primary" className="nav-bar">
          <IonTitle>Notes</IonTitle>
          <IonIcon icon={paperPlane} id="send-notification" className="megaphone-icon" onClick={broadcastClickHandler} />
          <IonIcon icon={notifications} className="notifications-icon" onClick={() => setIsOpen(prev => !prev)} />
          {
            notificationQueue.length === 0 ? null :
              <IonBadge color="danger" className="notification-badge">{notificationQueue.length}</IonBadge>
          }
        </IonToolbar>
        {
          isOpen && notificationQueue.length > 0 &&
          (<div className="notification-list">
            {
              notificationQueue.map(n =>
                <IonItem>{n.sender}</IonItem>
              )
            }
            <IonButton className="clear-btn" onClick={() => {
              setIsOpen(false);
              setNotificationQueue([])
            }} >CLEAR</IonButton>
          </div>)
        }

      </IonHeader>
      <IonContent class="ion-padding">
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

        <div className="add-btn-container" >
          <IonFab slot="fixed">
            <IonFabButton onClick={btnClickHandler}>
              <IonIcon icon={addOutline}></IonIcon>
            </IonFabButton>
          </IonFab>
        </div>
      </IonContent>
    </IonPage >
  );
};

export default List;
