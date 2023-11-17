import {
    IonCard,
    IonCardContent,
    IonCardHeader,
    IonButton,
    IonToolbar,
    IonTitle,
    IonInput,
    IonItem,
    IonLabel,
    IonHeader,
    IonContent,
} from "@ionic/react";
import React, { useState } from "react";
import './Style.css';
import baseUrl, { api } from "./Urls";
import swal from 'sweetalert';
const ChangePassword: React.FC = () => {
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [error, setError] = useState("");

    const update = () => {
        let data = {
            'password': password,
            'email': email,
            'token': localStorage.getItem("token"),
        }
        fetch(`${baseUrl}${api.changePassword}`, {
            method: 'PUT',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem("token")}`
            },
            body: JSON.stringify(data),
        })

            .then(res => {
                if (res.status === 200) {
                    swal({
                        title: "Success!",
                        text: "Password Changed Successfully",
                        icon: "success",
                    });
                    window.location.href = '/login';
                    localStorage.removeItem("token");

                } else {
                    swal({
                        title: "Error!",
                        text: res.status + ' ' + res.statusText +
                            " - Password not Changed",
                        icon: "error",
                    });
                }

            })
            .catch(error => console.log('error', error));


    }
    return (
        <IonContent>

            <IonCard>
                <IonCardHeader>
                    <IonHeader>
                        <IonToolbar>
                            <div className="text-center">
                                <IonTitle>Change Password</IonTitle>
                            </div>

                        </IonToolbar>
                    </IonHeader>
                </IonCardHeader>

                <IonCardContent>

                    <IonItem
                    >
                        <IonLabel position="stacked">Email</IonLabel>
                        <IonInput type="text"
                            name="email"
                            value={email}
                            placeholder="enter email"
                            required
                            clearInput
                            onIonChange={(e: any) => setEmail(e.target.value)}

                        >
                        </IonInput>

                    </IonItem>
                    <IonItem>
                        <IonLabel position="stacked">New Password</IonLabel>
                        <IonInput type="password"
                            name="password"
                            value={password}
                            placeholder="password"
                            required
                            clearInput
                            onIonChange={(e: any) => setPassword(e.target.value)}

                        >
                        </IonInput>
                    </IonItem>
                    <div style={{ marginTop: "3%" }} className='text-center'>
                        <IonButton color="primary" onClick={update}>Save</IonButton>
                    </div>

                </IonCardContent>
            </IonCard>

        </IonContent>
    );
}
export default ChangePassword;