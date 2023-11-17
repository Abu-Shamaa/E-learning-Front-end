
import {
    IonCardHeader,
    IonTitle,
    IonToolbar,
    IonButtons,
    IonButton,
    IonCardContent,
    IonCard,
    IonItem,
    IonContent,


} from '@ionic/react';
import React, { useState, useEffect } from 'react';
import { useHistory, useParams } from "react-router";
import baseUrl, { api } from '../../../pages/Urls';

const ViewTopicArticle: React.FC = () => {
    type ViewTopicArticleParams = {
        slug: string;
    };
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');


    const history = useHistory();
    const { slug } = useParams<ViewTopicArticleParams>();

    const viewTopicArticle = () => {
        fetch(`${baseUrl}${api.viewTopicArticle}${slug}`, {
            method: 'GET',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem("token")}`

            }
        })
            .then(resp => resp.json())
            .then(result => {
                setTitle(result.topicAticle.name);
                setContent(result.topicAticle.content);

            })
    }
    useEffect(() => {
        viewTopicArticle();

    }, [])

    return (
        <IonContent>

            <IonCard>

                <IonCardHeader>
                    <IonToolbar>
                        <div className="text-center">
                            <IonTitle >
                                {title}
                            </IonTitle>
                        </div>
                        {/* <IonButtons slot="start">
                            <IonButton onClick={() => history.goBack()} > <i className="bi bi-backspace"> Back</i> </IonButton>
                        </IonButtons> */}
                    </IonToolbar>
                </IonCardHeader>


                <IonCardContent>
                    <IonItem>
                        <h1 color="dark">{title}</h1>

                    </IonItem>
                    <IonItem>
                        <h2 dangerouslySetInnerHTML={{ __html: content }}></h2>
                    </IonItem>

                </IonCardContent>

            </IonCard>

        </IonContent>

    );
};
export default ViewTopicArticle;