import {
    IonContent,
    IonItem,
    IonLabel,
    IonCard,
    IonAccordion,
    IonAccordionGroup,
    IonText,

} from '@ionic/react';
import { IonButtons, IonButton, IonModal, IonHeader, IonTitle, IonToolbar } from '@ionic/react';
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    IconButton,
    Stack,
    Typography,
} from '@mui/material';
import { format } from 'date-fns'
import React, { useState, useEffect } from 'react';
import { useHistory } from "react-router";
import { Link } from "react-router-dom";
import baseUrl, { api } from '../../Urls';

const ViewUserCourse: React.FC<{
    quiz: any[],
    topic: any[],
    course_name: string,
    courseId: string,


}> = (props) => {
    const [modalOpen, setModalOpen] = useState(false);
    const history = useHistory();
    const current_date = format(new Date(), 'yyyy-MM-dd HH:mm');
    //console.log(current_date)
    const downloadFile = (id: any, file: any) => {
        fetch(`${baseUrl}${api.downloadTopicContent}${id}`, {
            method: 'GET',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem("token")}`

            },

        }).then(response => {
            response.blob().then(blob => {
                let url = window.URL.createObjectURL(blob);
                let a = document.createElement('a');
                a.href = url;
                a.download = `${file}`;
                a.click();
            });

        });
    }

    // const preAttemptQuiz = (id: any) => {
    //     let data = {
    //         'quiz_id': id,

    //     }

    //     fetch(`${baseUrl}${api.preAttempt}`, {
    //         method: 'POST',
    //         headers: {
    //             Accept: 'application/json',
    //             'Content-Type': 'application/json',
    //             'Authorization': `Bearer ${localStorage.getItem("token")}`
    //         },
    //         body: JSON.stringify(data),
    //     })



    // }


    return (
        <>
            <IonContent fullscreen={true}>

                <IonText color="primary">
                    <h1 className='mx-2'>{props.course_name}</h1>
                </IonText>

                <>

                    <IonCard >

                        <IonAccordionGroup>
                            <IonAccordion value="first">
                                <IonItem slot="header" color="light">
                                    <IonLabel>Quizzes</IonLabel>
                                </IonItem>

                                <div className="ion-padding" slot="content">
                                    {props.quiz.map((item: any, i: any) =>

                                        <IonItem key={i.toString()}>
                                            <IonLabel>
                                                <Link className='text-decoration-none'
                                                    onClick={() => {
                                                        localStorage.setItem('test_end', item.test_end)
                                                        localStorage.setItem('quiz_id', item.id)
                                                        //preAttemptQuiz(item.id)
                                                    }}

                                                    to={format(new Date(item.start_date), 'yyyy-MM-dd HH:mm') <= current_date &&
                                                        format(new Date(item.test_end), 'yyyy-MM-dd HH:mm') > current_date && item.ahistory.map((ah: any) => (ah.is_attempt)) != 1 ?
                                                        `/dashboard/mycourse/${props.courseId}/quiz/${item.id}` : `/dashboard/mycourse/${props.courseId}`} >
                                                    {item.quiz_name}

                                                </Link>

                                            </IonLabel>
                                            {format(new Date(item.start_date), 'yyyy-MM-dd HH:mm') <= current_date &&
                                                format(new Date(item.test_end), 'yyyy-MM-dd HH:mm') > current_date ?
                                                <p className='text-info'>
                                                    {item.ahistory.map((ah: any) => (ah.is_attempt)) == 1 ? "You are already attempted" : "Now open"}
                                                </p> : <>
                                                    {format(new Date(item.test_end), 'yyyy-MM-dd HH:mm') <= current_date &&
                                                        item.ahistory.map((ah: any) => (ah.is_attempt)) != 1
                                                        ? <p className='text-danger'>Expired</p> : <>
                                                            {format(new Date(item.start_date), 'yyyy-MM-dd HH:mm') >= current_date ? <p className='text-success'>will start {format(new Date(item.start_date), 'yyyy-MM-dd HH:mm')} </p> :
                                                                <p className='text-success'>You are already attempted</p>
                                                            }
                                                        </>}
                                                </>
                                            }

                                        </IonItem>
                                    )}
                                </div>
                            </IonAccordion>
                        </IonAccordionGroup>

                    </IonCard>
                    {props.topic.map((item: any, i: any) =>
                        <IonCard key={i.toString()}>

                            <IonAccordionGroup>
                                <IonAccordion value="first">
                                    <IonItem slot="header" color="light">
                                        <IonLabel>{item.topic_name}</IonLabel>
                                    </IonItem>

                                    <div className="ion-padding" slot="content">
                                        {item.topic_article.length == 0 && item.topic_content.length == 0 ? 'No data preview' :
                                            <>
                                                {item.topic_article.map((ta: any, i: any) =>
                                                    <IonItem key={i.toString()}>
                                                        <Link className='text-decoration-none'
                                                            to={`/dashboard/mycourse/${props.courseId}/topic/${ta.slug}`} >
                                                            {ta.name}</Link>
                                                        {/* <IconButton onClick={() => setModalOpen(true)}>
                                                            {ta.slug}
                                                        </IconButton> */}


                                                    </IonItem>



                                                )}

                                                {item.topic_content.map((tc: any, i: any) =>
                                                    <IonItem key={i.toString()}>
                                                        <IonLabel > <button onClick={() => downloadFile(tc.id, tc.file)}>
                                                            {tc.file} <i className="bi bi-download"></i>
                                                        </button></IonLabel>
                                                    </IonItem>

                                                )}
                                            </>

                                        }
                                    </div>
                                </IonAccordion>
                            </IonAccordionGroup>

                        </IonCard>
                    )}
                </>

            </ IonContent>

        </>
    );


}


// const ViewArticle: React.FC<{
//     onClose: () => void;
//     open: boolean;
//     title: string;
//     content: string;

// }> = (props) => {
//     return (
//         <IonModal isOpen={props.open}>
//             <IonHeader>
//                 <IonToolbar>
//                     <div className='text-center'>
//                         Topic Article
//                     </div>

//                 </IonToolbar>
//             </IonHeader>
//             <IonContent className="ion-padding">
//                 <IonItem >
//                     <h1 color="dark">{props.title}</h1>

//                 </IonItem>
//                 <IonItem>
//                     <p dangerouslySetInnerHTML={{ __html: props.content }}></p>
//                 </IonItem>
//             </IonContent>
//             <div className='mb-3 text-end'>
//                 <Button onClick={props.onClose}>Cancel</Button>
//             </div>
//         </IonModal>


//     );
// }

const ViewArticle: React.FC<{
    onClose: () => void;
    open: boolean;
    title: string;
    content: string;

}> = (props) => {
    return (
        <Dialog open={props.open}>
            <DialogTitle > {props.title}</DialogTitle>
            <DialogContent>
                <Stack
                    sx={{
                        width: '100%',
                        minWidth: { xs: '300px', sm: '360px', md: '400px' },
                        gap: '1.5rem',
                    }}
                >

                    <Typography gutterBottom dangerouslySetInnerHTML={{ __html: props.content }}>

                    </Typography>

                </Stack>
            </DialogContent>

            <DialogActions sx={{ p: '1.25rem' }}>
                <Button onClick={props.onClose}>Cancel</Button>

            </DialogActions>

        </Dialog>
    );
}
export default ViewUserCourse;