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
} from "@ionic/react";
import "./List.css";
import { addOutline, trashOutline } from "ionicons/icons";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

const List = () => {
  const currentUser = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();
  const [notes, setNotes] = useState([]);
  const [mode, setMode] = useState('online');

  useEffect(() => {
    if (!currentUser) navigate("/login");

    fetch(`https://quick-note--backend.herokuapp.com/notes/${currentUser.uid}`)
      .then(reponse => {
        reponse.json()
          .then(result => {
            localStorage.setItem("data", JSON.stringify(result));
            setNotes(result);
          })
      })
      .catch(err => {
        setMode('offline');
        let collection = localStorage.getItem("data");
        setNotes(JSON.parse(collection));
      })
  }, []);


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
        <IonToolbar color="primary">
          <IonTitle>Notes</IonTitle>
        </IonToolbar>
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
                    className="close-btn"
                  >
                    <IonIcon icon={trashOutline}></IonIcon>
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
    </IonPage>
  );
};

export default List;
