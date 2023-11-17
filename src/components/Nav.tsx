import {
    IonButton, IonButtons, IonHeader, IonTitle, IonToolbar,

} from '@ionic/react';

import '../pages/Style.css';
import React from 'react';
import { useHistory, useLocation } from "react-router";
import HeaderButton from './HeaderButton';
const Nav: React.FC<{
    isAuth: boolean;
}> = (props) => {

    const location = useLocation()
    const history = useHistory();
    const loginPage = (e: any) => {
        history.push("/login");
    };
    const signUpPage = (e: any) => {
        history.push("/signup");
    };
    const homePage = (e: any) => {
        history.push("/");
    };
    return (

        <IonHeader>
            <IonToolbar>
                <IonTitle>E-learning</IonTitle>
                {!props.isAuth ?
                    <IonButtons slot="secondary">
                        <IonButton
                            className={location.pathname === '/' ? "selected" : ''}
                            onClick={homePage} >Home</IonButton>
                        <IonButton
                            className={location.pathname === '/login' ? "selected" : ''}
                            onClick={loginPage}>Sign-In</IonButton>
                        <IonButton
                            className={location.pathname === '/signup' ? "selected" : ''}
                            onClick={signUpPage}>Sign-Up</IonButton>
                    </IonButtons> :
                    <HeaderButton />}
            </IonToolbar>
        </IonHeader >

    );
};

export default Nav;
