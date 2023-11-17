import {
    IonContent,
    IonItem,
    IonLabel,
    IonRouterOutlet,
    IonCard,
    IonAccordion,
    IonAccordionGroup,

} from '@ionic/react';

import { Grid, Box, Tabs, Tab, Typography } from "@mui/material";
import { useState, useEffect } from "react";
import baseUrl, { api } from '../../pages/Urls';
import { useHistory, useParams, useLocation } from "react-router";
import TchrTopic from './TchrTopic';
import TchrLevel from './TchrLevel';
import TchrQuiz from './TchrQuiz';
import TchrQuestion from './TchrQuestion';
import QuizAttemptedList from './QuizAttemptedList';
import { Route } from 'react-router-dom';
import ViewTopic from './ViewTopic';


const ViewCourseLayout: React.FC = () => {
    type ViewCourse = {
        id: string;
    };
    const history = useHistory()
    const { id } = useParams<ViewCourse>();
    const [course_name, setCourse_name] = useState('');
    const [courseId, setCourseId] = useState('');
    const [quiz, setQuiz] = useState([]);
    const [topic, setTopic] = useState([]);
    const [level, setLevel] = useState([]);
    const [question, setQuestion] = useState([]);
    const fetchShowCourse = () => {
        fetch(`${baseUrl}${api.showCourse}${id}`, {
            method: 'GET',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem("token")}`

            }
        })
            .then(resp => resp.json())
            .then(result => {
                setCourse_name(result.course.course_name)
                setCourseId(result.course.id)
                setQuiz(result.course.quiz)
                setTopic(result.course.topic)
                setLevel(result.course.level)
                setQuestion(result.course.question)
            })
    }
    useEffect(() => {
        fetchShowCourse()

    }, []);

    return (
        <IonContent>

            <IonRouterOutlet >
                <Route exact path="/dashboard/mycourse/:id">

                    <CourseTab
                        quiz={quiz} topic={topic}
                        course_name={course_name} courseId={courseId}
                        level={level} question={question} fetchShowCourse={() => fetchShowCourse()}
                    />

                </Route >
                <Route exact path="/dashboard/mycourse/:id/topic/:id">
                    <ViewTopic courseId={courseId} />
                </Route >
            </IonRouterOutlet>
        </IonContent>
    );
};

const CourseTab: React.FC<{
    quiz: any[],
    topic: any[],
    level: any[],
    question: any[],
    course_name: string,
    courseId: string,
    fetchShowCourse: () => void;
}> = (props) => {
    // Tab State
    const [view, setView] = useState<number>(0);
    const [activateTab, setActivateTab] = useState(false);
    const location = useLocation();
    useEffect(() => {
        setActivateTab(true);
    }, []);


    return (
        <IonContent>
            <Grid p={2} container spacing={2}>

                <Grid item xs={true}>
                    <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                        {activateTab && (
                            <Tabs value={view} onChange={(e, f) => setView(f)} variant="scrollable"
                                scrollButtons="auto" aria-label="scrollable auto tabs example" >
                                <Tab value={0} label="Course" />
                                <Tab value={1} label="Topic" />
                                <Tab value={2} label="Level" />
                                <Tab value={3} label="Question" />
                                <Tab value={4} label="Quiz" />
                                <Tab value={5} label="Attempt-List" />
                            </Tabs>
                        )}
                    </Box>
                    {activateTab && view === 0 && <List quiz={props.quiz} topic={props.topic} course_name={props.course_name} />}
                    {view === 1 && <TchrTopic topic={props.topic} course_name={props.course_name} fetchShowCourse={() => props.fetchShowCourse()} courseId={props.courseId} />}
                    {view === 2 && <TchrLevel topic={props.topic} course_name={props.course_name} level={props.level} fetchShowCourse={() => props.fetchShowCourse()} />}
                    {view === 3 && <TchrQuestion question={props.question} course_name={props.course_name} level={props.level} fetchShowCourse={() => props.fetchShowCourse()} />}
                    {view === 4 && <TchrQuiz quiz={props.quiz} course_name={props.course_name} level={props.level} fetchShowCourse={() => props.fetchShowCourse()} />}

                    {view === 5 && <QuizAttemptedList courseId={props.courseId} course_name={props.course_name} />}


                </Grid>
            </Grid>
        </IonContent>
    );
};
const List: React.FC<{
    quiz: any[],
    topic: any[]
    course_name: string,
}> = (props) => {

    return (

        <div className='mt-2'>

            <IonItem>
                <IonLabel color="primary">
                    <h1>{props.course_name}</h1>
                </IonLabel>
            </IonItem>

            <IonCard >

                <IonAccordionGroup>
                    <IonAccordion value="first">
                        <IonItem slot="header" color="light">
                            <IonLabel>Quiz</IonLabel>
                        </IonItem>
                        <IonItem slot="header" color="light">
                            <IonLabel>Totaal Quiz : {props.quiz.length}</IonLabel>
                        </IonItem>
                        <div className="ion-padding" slot="content">
                            {props.quiz.map((item: any, i: any) =>
                                <p key={i.toString()}>{i + 1}. {item.quiz_name}</p>
                            )}
                        </div>
                    </IonAccordion>
                </IonAccordionGroup>

            </IonCard>
            <IonCard >

                <IonAccordionGroup>
                    <IonAccordion value="first">
                        <IonItem slot="header" color="light">
                            <IonLabel>Topic</IonLabel>
                        </IonItem>
                        <IonItem slot="header" color="light">

                            <IonLabel>Totaal Topic : {props.topic.length}</IonLabel>
                        </IonItem>
                        <div className="ion-padding" slot="content">
                            {props.topic.map((item: any, i: any) =>
                                <p key={i.toString()}>{i + 1}. {item.topic_name}</p>
                            )}
                        </div>
                    </IonAccordion>
                </IonAccordionGroup>

            </IonCard>

        </div>


    );
};
export default ViewCourseLayout;