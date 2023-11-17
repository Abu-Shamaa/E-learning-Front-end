import {
    IonContent,
    IonItem,
    IonButton,
    IonCardContent,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonLabel, IonList, IonRadio, IonRadioGroup, IonInput, IonCheckbox, IonItemGroup, IonItemDivider
} from '@ionic/react';
import React, { useState, useEffect, useMemo } from 'react';
import { useHistory, useParams, useLocation } from 'react-router-dom';
import { format } from 'date-fns'
import baseUrl, { api } from '../../Urls';
import '../../../pages/Style.css';
import ReactPaginate from "react-paginate";


const QuizQuestion: React.FC<{
    courseId: string,

}> = (props) => {
    type QuizQuestion = {
        id: string;
    };
    const { id } = useParams<QuizQuestion>();
    const history = useHistory();
    const [question, setQuestion] = useState([]);
    const [isAns, setIsAns]: any[] = useState([]);
    const [test_end, setTest_end] = useState(format(new Date(), 'yyyy-MM-dd HH:mm:ss'));
    const [quizId, setQuizId] = useState('');
    const [isAttempt, setIsAttempt] = useState('');





    ////
    useEffect(() => {
        return history.listen(() => { // listen
            if (history.action === "POP") {
                history.replace(`/dashboard/mycourse/${localStorage.getItem("course_id")}/quiz/${localStorage.getItem("quiz_id")}`);
            }
        });
    }, [history]);

    useEffect(() => {


        fetch(`${baseUrl}${api.viewQuiz}${id}`, {
            method: 'GET',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem("token")}`

            }
        })
            .then(resp => resp.json())
            .then(result => {
                setQuestion(result.question)
                setTest_end(result.question[0].test_end)
                setQuizId(result.question.map((item: any) => (item.quiz_id)))
                setIsAttempt(result.quiz.map((item: any) => (item.is_attempt)))
                //localStorage.setItem('quiz_id', result.question[0].quiz_id)
                //localStorage.setItem('test_end', result.question[0].test_end)
                //history.replace(`/dashboard/mycourse/${props.courseId}/quiz/${localStorage.getItem("quiz_id")}`)
            })


    }, []);

    //console.log(question)
    let attempt = {};
    question.map((q: any, i) => {
        attempt = { ...attempt, [q.id]: isAns[i] }
    })
    const handleChange = (e: any, i: any) => {
        const inputdata = [...isAns];
        inputdata[i] = e.target.value;
        setIsAns(inputdata)

    };


    const submit = () => {
        if (quizId && attempt) {
            let data = {

                'attemptans': attempt,
                'quiz_id': quizId,

            }

            fetch(`${baseUrl}${api.quizAttempt}`, {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem("token")}`
                },
                body: JSON.stringify(data),
            })

                .then(response => {
                    if (response.status === 200) {
                        //window.confirm('Want to submit?')
                        window.location.href = `/dashboard/mycourse/${props.courseId}/quiz/result`;

                    }
                    else {
                        throw Error([response.status, response.statusText].join(' '));
                    }
                })

                .catch(error => console.log('error', error));


        }

    };



    ///////////////////////////

    const st = format(new Date(), 'yyyy-MM-dd HH:mm:ss');
    const etm: any = localStorage.getItem("test_end");
    const et = format(new Date(etm), 'yyyy-MM-dd HH:mm:ss');
    const end = new Date(et).getTime();
    const start = new Date(st).getTime();
    const ddd = end - start;
    const [deadline] = useState(new Date(Date.now() + ddd));

    const useCountdown = (deadline: Date) => {
        // Time is in seconds
        const [time, setTime] = useState(
            Math.max(0, Math.floor((deadline.getTime() - Date.now()) / 1000))
        );

        const decrement = () =>
            setTime((prevTime) => {
                return prevTime === 0 ? 0 : prevTime - 1;
            });

        useEffect(() => {
            //const ids = setInterval(decrement, 1000);
            const ids = setInterval(() => {
                decrement()
                if (time == 0) {
                    submit()
                }

            }, 1000);
            return () => clearInterval(ids);
        }, [time]);

        const format = (num: number): string => {
            return num < 10 ? '0' + num : num.toString();
        };

        return {
            //days: format(Math.floor(time / (3600 * 24))),
            hours: format(Math.floor((time / 3600) % 24)),
            minutes: format(Math.floor((time / 60) % 60)),
            seconds: format(time % 60),
        };
    };

    const timer = useCountdown(deadline);

    return (

        <>
            <IonContent>
                {isAttempt != '1' ?
                    <IonItemGroup>
                        <IonItemDivider color="light" sticky>
                            <IonLabel>
                                <h1>Total Question -- {question.length}</h1>
                                <h1 className='mt-2'><i className="bi bi-alarm mx-2"></i>
                                    {timer.hours}:{timer.minutes}:{timer.seconds}
                                </h1>

                            </IonLabel>

                        </IonItemDivider>
                        {question
                            .map((qstn: any, i: any) =>

                                <IonCard key={i.toString()}>
                                    <IonCardHeader>
                                        <IonCardTitle>
                                            <div className='mb-2'>
                                                {i + 1} / {question.length} -- {qstn.title}
                                            </div>


                                            <h2 dangerouslySetInnerHTML={{ __html: qstn.q_content }}></h2>

                                            <>
                                                {
                                                    (qstn.question_type != 'MCQ') ?
                                                        <>
                                                            <IonItem>
                                                                <IonInput name='isAns'
                                                                    value={isAns[i]}
                                                                    placeholder="enter answer"
                                                                    onIonChange={(e) => handleChange(e, i)}

                                                                >

                                                                </IonInput>

                                                            </IonItem>
                                                        </> :
                                                        <>
                                                            <IonList>

                                                                <IonRadioGroup name='isAns'
                                                                    value={isAns[i]}
                                                                    onIonChange={(e) => handleChange(e, i)}

                                                                >
                                                                    {qstn.option.map((op: any, index: any) => {
                                                                        return (

                                                                            <IonItem key={`option-${index}`}>
                                                                                <IonLabel >{op.option}</IonLabel>
                                                                                <IonRadio slot="start" value={op.option} >
                                                                                </IonRadio>

                                                                            </IonItem>

                                                                        );
                                                                    })}
                                                                </IonRadioGroup>
                                                            </IonList>
                                                        </>
                                                }


                                            </>
                                        </IonCardTitle>
                                    </IonCardHeader>
                                </IonCard>


                            )}


                        <div className='text-center mt-3 mb-5'>
                            <IonButton id="quiz_submit" fill="outline" onClick={submit}>submit</IonButton>
                        </div>
                    </IonItemGroup>
                    :
                    <IonCard>
                        <IonCardHeader>
                            <IonCardTitle>
                                <div className='text-center mt-3 mb-5'>
                                    You Already Finished your Quiz
                                </div>
                            </IonCardTitle>
                        </IonCardHeader>

                        <IonCardContent>
                            <div className='text-center mt-3 mb-5'>
                                <IonButton fill="outline" href={`/dashboard/mycourse/${props.courseId}`}>Back to Course</IonButton>
                            </div>
                        </IonCardContent>
                    </IonCard>
                }

            </IonContent>

        </>
    );
};


export default QuizQuestion;