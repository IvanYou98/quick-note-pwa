import {
    IonContent,
    IonHeader,
    IonList,
    IonPage,
    IonTitle,
    IonToolbar,
    IonIcon,
    IonButton,
    IonInput,
    IonItem,
    IonLabel,
    IonTextarea,
    IonFabButton,
} from "@ionic/react";
import "./Create.css";
import { home } from "ionicons/icons";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

const Create = () => {
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem("user"));
    if (user === null) navigate("/");

    const homeBtnClickHandler = () => {
        navigate("/");
    };

    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");

    const handleCreate = async () => {
        console.log("title", title);
        console.log("content", content);
        const res = await fetch("https://quick-note--backend.herokuapp.com/notes", {
            method: "POST",

            body: JSON.stringify({
                title: title,
                content: content,
                userId: user.uid
            }),

            headers: {
                "Content-type": "application/json; charset=UTF-8"
            }
        })

        console.log(res);
        navigate("/");
    };

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar color="primary">
                    <IonTitle>New</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent class="ion-padding">
                <IonList>
                    <IonItem>
                        <IonLabel position="stacked" color="dark">
                            <h2>Title</h2>
                        </IonLabel>
                        <IonInput
                            value={title}
                            onIonChange={(e) => setTitle(e.target.value)}
                        ></IonInput>
                    </IonItem>
                    <IonItem>
                        <IonLabel position="stacked">
                            <h2>Content</h2>
                        </IonLabel>
                        <IonTextarea
                            autoGrow={true}
                            onIonChange={(e) => setContent(e.target.value)}
                        ></IonTextarea>
                    </IonItem>
                </IonList>

                <div className="create-btn-container">
                    <IonButton onClick={handleCreate}>Create</IonButton>
                </div>

                <div className="home-btn-container">
                    <IonFabButton onClick={homeBtnClickHandler}>
                        <IonIcon icon={home}></IonIcon>
                    </IonFabButton>
                </div>
            </IonContent>
        </IonPage>
    );
};

export default Create;
