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
    IonNote
} from "@ionic/react";
import React, { useState, useEffect } from "react";
import { Link, Redirect } from 'react-router-dom';
import { useHistory } from "react-router";
import './Style.css';
import baseUrl, { api } from "./Urls";

const Login: React.FC<{
    onLogin: () => void;
}> = (props) => {
    const history = useHistory();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loginState, setLogin] = useState(false);
    const [invalidState, setValidState] = useState(false);
    useEffect(() => {
        const token = localStorage.getItem("token");
        token !== null && history.replace("/dashboard");
    }, []);


    const login = () => {
        setLogin(true);
        let data = {
            email: email,
            password: password,
        };
        fetch(`${baseUrl}${api.login}`, {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',

            },
            body: JSON.stringify(data),
        })

            .then((response) => {
                // Fail Login
                if (response.status !== 200) {
                    setLogin(false);
                    setValidState(true);
                    throw new Error("Status code: " + response.status);
                }
                return response.json();
            })
            .then(result => {
                localStorage.setItem('token', result.token);
                localStorage.setItem('role', result.role);
                localStorage.setItem('username', result.username);
                props.onLogin();
                history.replace("/dashboard");

            })


            .catch(error => {
                console.log('error', error)

            });

    }


    const keyDownHandler = (event: any) => {


        if (event.key === 'Enter') {

            login();

        }
    };


    return (
        <IonContent>
            <div className="contain">
                <IonCard>
                    <IonCardHeader>
                        <IonHeader>
                            <IonToolbar>
                                <IonTitle>Login</IonTitle>
                            </IonToolbar>
                        </IonHeader>
                    </IonCardHeader>

                    <IonCardContent>

                        <IonItem
                            className={`${invalidState && "ion-invalid"}`}>
                            <IonLabel position="stacked">Email</IonLabel>
                            <IonInput type="text"
                                name="email"
                                value={email}
                                placeholder="enter email"
                                required
                                clearInput
                                onIonChange={(e: any) => setEmail(e.target.value)}
                                onKeyDown={(event) => keyDownHandler(event)}
                            >
                            </IonInput>
                            <IonNote slot="error">Invalid username or password</IonNote>
                        </IonItem>
                        <IonItem>
                            <IonLabel position="stacked">Password</IonLabel>
                            <IonInput type="password"
                                name="password"
                                value={password}
                                placeholder="password"
                                required
                                clearInput
                                onIonChange={(e: any) => setPassword(e.target.value)}
                                onKeyDown={keyDownHandler}
                            >
                            </IonInput>
                        </IonItem>
                        <div style={{ marginTop: "3%" }}>
                            <IonButton color="primary" onClick={login}>Login</IonButton>
                            <Link to='/signup' ><p className="text-end">Create Account</p></Link>

                        </div>

                    </IonCardContent>
                </IonCard>
            </div>
        </IonContent>
    );
};

export default Login;