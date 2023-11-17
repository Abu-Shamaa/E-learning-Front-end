import {
    IonButton, IonButtons, IonContent,
    IonIcon,
    IonItem,
    IonLabel,
    IonPopover,
} from '@ionic/react';

import {
    exitOutline,
    personCircle,
    keypadOutline,
    laptopOutline
} from "ionicons/icons";
import { Link } from 'react-router-dom';
import React from "react";
const HeaderButton: React.FC = () => {

    const logout = () => {
        localStorage.removeItem("token");
    };
    return (
        <>


            <IonButtons slot="secondary">

                <IonButton id="profile-trigger">
                    <IonIcon slot="icon-only" icon={personCircle}></IonIcon>
                </IonButton>
                <IonPopover
                    trigger="profile-trigger"
                    triggerAction="click"
                    showBackdrop={false}
                >
                    <IonContent>
                        <IonItem>
                            <IonIcon slot="end" icon={personCircle}></IonIcon>
                            <IonLabel>{localStorage.getItem("username")}</IonLabel>
                        </IonItem>
                        <IonItem routerLink="/dashboard" routerDirection="none">
                            <IonIcon slot="end" icon={laptopOutline}></IonIcon>
                            <IonLabel>Dashboard</IonLabel>
                        </IonItem>
                        <IonItem >
                            <IonIcon slot="end" icon={keypadOutline}></IonIcon>
                            <Link className='text-decoration-none' to={`/dashboard/change`} style={{ color: 'black' }}> Change Password</Link>

                        </IonItem>

                        <IonItem href="" onClick={logout} >
                            <IonIcon slot="end" icon={exitOutline}></IonIcon>
                            <IonLabel>Logout</IonLabel>
                        </IonItem>
                    </IonContent>
                </IonPopover>

            </IonButtons>


        </>
    );
};

export default HeaderButton;
