
import {
    IonContent,
    IonRouterOutlet,
} from '@ionic/react';
import React, { useState, useEffect } from 'react';
import { Route, useParams, useLocation } from "react-router";
import ViewUserCourse from './ViewUserCourse';
import baseUrl, { api } from '../../Urls';
import QuizQuestion from './QuizQuestion';
import QuizResult from './QuizResult';
import ViewTopicArticle from './ViewTopicArticle';
const UserCourse: React.FC = () => {
    type UserCourse = {
        id: string;
    };
    const { id } = useParams<UserCourse>();
    const [course_name, setCourse_name] = useState('');
    const [courseId, setCourseId] = useState('');
    const [quiz, setQuiz] = useState([]);
    const [topic, setTopic] = useState([]);
    useEffect(() => {
        fetch(`${baseUrl}${api.viewCourse}${id}`, {
            method: 'GET',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem("token")}`

            }
        })
            .then(resp => resp.json())
            .then(result => {
                setCourse_name(result.course_name)
                setCourseId(result.id)
                setQuiz(result.quiz)
                setTopic(result.topic)
                localStorage.setItem('course_id', result.id)
            })

    }, []);
    return (
        <IonContent >
            <IonRouterOutlet >

                <Route path="/dashboard/mycourse/:id" exact>
                    <ViewUserCourse quiz={quiz} topic={topic} course_name={course_name} courseId={courseId} />

                </Route>

                <Route path={`/dashboard/mycourse/${localStorage.getItem("course_id")}/quiz/:id`} exact >
                    <QuizQuestion courseId={courseId} />

                </Route>
                <Route path={`/dashboard/mycourse/${localStorage.getItem("course_id")}/topic/:slug`} exact >
                    <ViewTopicArticle />
                </Route>
                <Route path="/dashboard/mycourse/:id/quiz/result" exact>
                    <QuizResult courseId={courseId} />

                </Route>


            </IonRouterOutlet>
        </IonContent>
    )
}
export default UserCourse;