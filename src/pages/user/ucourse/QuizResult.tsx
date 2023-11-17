
import {
    IonContent,
    IonButton,
    IonCardContent,
    IonText,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardSubtitle,

} from '@ionic/react';
import React, { useState, useEffect } from 'react';
import baseUrl, { api } from '../../Urls';
import { useHistory } from 'react-router-dom';
const QuizResult: React.FC<{
    courseId: string,

}> = (props) => {


    const [point, setPoint] = useState('');
    const [total_question, setTotalQuestion] = useState('');
    const [quiz_name, setQuiz_name] = useState('');
    const [user, setUser] = useState('');
    const history = useHistory();

    useEffect(() => {
        fetch(`${baseUrl}${api.quizResult}${localStorage.getItem('quiz_id')}`, {
            method: 'GET',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem("token")}`

            }
        })
            .then(resp => resp.json())
            .then(result => {
                // setResult(result)
                setPoint(result.map((item: any) => (item.total_point)))
                setTotalQuestion(result.map((item: any) => (item.total_question)))
                setQuiz_name(result.map((item: any) => (item.quiz_name)))
                setUser(result.map((item: any) => (item.name)))

            })


    }, []);


    return (

        <IonContent >
            <IonCard>
                <IonCardHeader>
                    <div className='text-center mb-3'>
                        <IonCardTitle>
                            <IonText color="primary">
                                <h1>Congratulations!</h1>

                            </IonText>
                            <IonText color="dark">
                                <h1>{user}</h1>

                            </IonText>

                        </IonCardTitle>
                        <IonCardSubtitle>You have finished <strong>{quiz_name}</strong> Successfully  </IonCardSubtitle>
                    </div>

                </IonCardHeader>

                <IonCardContent>
                    <div className='text-center'>
                        <h1>Correct answer: {point} / {total_question}</h1>

                    </div>
                </IonCardContent>
                <div className='text-center mt-3 mb-5'>
                    <IonButton fill="outline" href={`/dashboard/mycourse/${props.courseId}`}>Back to Course</IonButton>
                </div>
            </IonCard>
        </IonContent>
    )
}
export default QuizResult;