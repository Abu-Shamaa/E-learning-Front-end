import {

    IonButton,
    IonInput,
    IonItem,
    IonLabel,
    IonCardContent,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonToolbar,
    IonTitle,
    IonText,

} from "@ionic/react";
import React, { FC, useMemo, useState } from 'react';
import MaterialReactTable, {
    MRT_ColumnDef,

} from 'material-react-table';
import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    IconButton,
    Stack,
    Tooltip,
} from '@mui/material';
import { Delete, Edit, Add, Visibility } from '@mui/icons-material';
import baseUrl, { api, tinyMceKey } from '../../pages/Urls';
import { Editor } from '@tinymce/tinymce-react';
import { Collapse } from 'react-bootstrap'
import AddQuestion from './AddQuestion';
import swal from 'sweetalert';

type questionData = {
    id: string;
    title: string;
    question_type: string;
    answer: string;
    topic_name: string;
    level_name: string;

};


const TchrQuestion: FC<{
    level: any,
    question: any
    course_name: string
    fetchShowCourse: () => void
}> = (props) => {

    const [question, setQuestion] = useState('');
    const [q_content, setQContent] = useState('');
    const [questionType, setQuestionType] = useState('');
    const [answer, setAnswer] = useState('');
    const [id, setId] = useState('');
    const [error, setError] = useState("");
    const [open, setOpen] = useState(false);
    const [collapse, setCollapse] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);
    const [questionData, setQuestionData] = useState({});
    const [inputList, setinputList] = useState([{ option: '' }]);
    const handleinputchange = (e: any, index: any) => {
        const { name, value } = e.target;
        const list: any[] = [...inputList];
        list[index][name] = value;
        setinputList(list);


    }
    const handleaddclick = () => {

        const abc = [...inputList, { option: '' }]

        setinputList(abc);
    }
    const handleremove = (index: any) => {
        const list = [...inputList];
        list.splice(index, 1);
        setinputList(list);
    }

    const columns = useMemo<MRT_ColumnDef<questionData>[]>(
        () => [


            {
                accessorKey: 'topic_name',
                header: 'Topic Name',

            },
            {
                accessorKey: 'level_name',
                header: 'Level Name',

            },
            {
                accessorKey: 'title',
                header: 'Question',

            },

            {
                accessorKey: 'question_type',
                header: 'Question Type',

            },

            {
                accessorKey: 'answer',
                header: 'Question Answer',

            },

        ],
        [],
    );


    const editQuestion = (id: any) => {

        fetch(`${baseUrl}${api.showQuestion}${id}`, {
            method: 'GET',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem("token")}`

            }
        })
            .then(res => res.json())
            .then(result => {
                setQuestion(result.qstn.title);
                setQContent(result.qstn.q_content);
                setQuestionType(result.qstn.question_type);
                setAnswer(result.qstn.answer);
                let levelList: any[] = [];
                {
                    result.qstn.option.map((item: any, i: any) =>
                        levelList.push({
                            option: item.option,

                        })
                    )
                }
                setinputList([...levelList]);

                setId(result.qstn.id);
            })
            .catch(function (error) {
                console.log(error);
            })


    }
    const updateQuestion = () => {
        let data = {
            'title': question,
            'q_content': q_content,
            'option': inputList,
            'answer': answer,
        }
        fetch(`${baseUrl}${api.updateQuestion}${id}`, {
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
                    props.fetchShowCourse();
                    setOpen(false)
                    swal({
                        title: "Success!",
                        text: "Question updated successfully",
                        icon: "success",
                    });
                } else {
                    swal({
                        title: "Error!",
                        text: res.status + ' ' + res.statusText +
                            " - Question not updated",
                        icon: "error",
                    });
                }

            })
            .catch(error => console.log('error', error));


    }
    const deleteQuestion = (id: any) => {
        if (window.confirm('Are you sure?')) {
            fetch(`${baseUrl}${api.deleteQuestion}${id}`, {
                method: 'DELETE',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem("token")}`

                }

            })
                .then(res => {
                    if (res.status === 200) {

                        props.fetchShowCourse();
                        swal({
                            title: "Success!",
                            text: "Question deleted successfully",
                            icon: "success",
                        });
                    } else {
                        swal({
                            title: "Error!",
                            text: res.status + ' ' + res.statusText +
                                " - Question not deleted",
                            icon: "error",
                        });
                    }

                })
                .catch(error => console.log('error', error));
        }
    }
    return (

        <div className="container mt-2">
            <IonItem>
                <IonLabel color="primary">
                    <h1>{props.course_name}</h1>
                </IonLabel>
            </IonItem>
            <Collapse in={open}>
                <div id="collapseID">
                    <div className="container mt-5 mb-5 ">

                        <IonCard>
                            <IonCardHeader>
                                <IonCardTitle>
                                    <IonToolbar>
                                        <IonTitle><h1 className="text-center display-6">Edit Question</h1></IonTitle>
                                    </IonToolbar>
                                </IonCardTitle>
                            </IonCardHeader>
                            <hr />
                            <IonCardContent>
                                <IonItem>
                                    <IonLabel position="stacked">Question</IonLabel>
                                    <IonInput type="text"
                                        name="title"
                                        value={question}
                                        onIonChange={(e: any) => setQuestion(e.target.value)}
                                    ></IonInput>
                                </IonItem>
                                <IonItem>
                                    <IonLabel position="stacked" >Content</IonLabel>
                                    <div style={{ marginTop: "3%", marginBottom: "3%" }}>
                                        <Editor
                                            apiKey={tinyMceKey}
                                            textareaName="content"
                                            value={q_content}
                                            onEditorChange={(content: any, editor: any) => setQContent(content)}
                                            init={{
                                                height: 500,
                                                width: 1030,
                                                menubar: true,
                                                plugins: [

                                                    'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
                                                    'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
                                                    'insertdatetime', 'media', 'table', 'code', 'help', 'wordcount'

                                                ],

                                                toolbar: 'undo redo | blocks | ' +
                                                    'bold italic forecolor | alignleft aligncenter ' +
                                                    'alignright alignjustify | bullist numlist outdent indent | ' +
                                                    'removeformat | help',
                                                content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }'
                                            }}
                                        />
                                    </div>

                                </IonItem>

                                {questionType === 'MCQ' ?
                                    <>
                                        <IonItem>
                                            <IonText color="primary">
                                                <h2 className="mt-3 mb-3">Add Question Option</h2>
                                            </IonText>

                                        </IonItem>
                                        <IonItem>

                                            <div>

                                                {
                                                    inputList.map((x, i) => {

                                                        return (
                                                            <div key={i.toString()} className="row mb-3 mt-3">
                                                                <div className=" col-md-1">
                                                                    <input className="mx-2 mt-4"
                                                                        type="radio"
                                                                        name="is_answer"
                                                                        value={x.option}
                                                                        checked={x.option === answer}
                                                                        onChange={(e: any) => {
                                                                            setAnswer(e.target.value)

                                                                        }}
                                                                    />
                                                                </div>
                                                                <div className=" col-md-6">
                                                                    <IonItem>
                                                                        <IonLabel position="stacked">Option</IonLabel>
                                                                        <IonInput type="text"
                                                                            name="option"
                                                                            value={x.option}

                                                                            required
                                                                            clearInput
                                                                            onIonChange={(e: any) => handleinputchange(e, i)}
                                                                        >
                                                                        </IonInput>
                                                                    </IonItem>
                                                                </div>
                                                                <div className="col-md-3 mt-4">
                                                                    {
                                                                        inputList.length !== 1 &&
                                                                        <button onClick={() => handleremove(i)}>X</button>
                                                                    }
                                                                    {
                                                                        inputList.length - 1 === i &&
                                                                        <button onClick={() => handleaddclick()} className="mx-3 ">
                                                                            <i className="bi bi-plus-circle-fill" title="add-option"></i>
                                                                        </button>
                                                                    }

                                                                </div>



                                                            </div>
                                                        );
                                                    })}

                                            </div>

                                        </IonItem>
                                    </>
                                    :
                                    <IonItem>
                                        <IonLabel position="stacked">Answer</IonLabel>
                                        <IonInput type="text"
                                            name="answer"
                                            placeholder="ans..."
                                            value={answer}
                                            onIonChange={(e: any) => setAnswer(e.target.value)}
                                        ></IonInput>
                                    </IonItem>
                                }
                                <hr />
                                <div style={{ marginTop: "3%" }} className="text-center mb-5">
                                    <IonButton color="danger" onClick={() => setOpen(false)}>
                                        Cancel
                                    </IonButton>
                                    <IonButton color="primary" onClick={updateQuestion}>
                                        Save
                                    </IonButton>

                                </div>
                            </IonCardContent>
                        </IonCard>

                    </div>

                </div>
            </Collapse>
            <AddQuestion collapse={collapse} level={props.level} course_name={props.course_name} onClose={() => setCollapse(false)} fetchShowCourse={() => props.fetchShowCourse()} />
            <h1 className='text-center mb-2'>List of Questions</h1>
            <MaterialReactTable
                columns={columns}
                data={props.question}
                getRowId={(row => `${row.id}`)}
                enableRowActions
                enableRowNumbers
                enableColumnOrdering
                renderRowActions={({ row, table }) => (
                    <Box sx={{ display: 'flex', gap: '1rem' }}>
                        <Tooltip arrow placement="left" title="Edit" >
                            <IconButton aria-expanded={open} aria-controls="collapseID" onClick={() => {
                                editQuestion(row.id)
                                setOpen(!open)

                            }}>

                                <Edit />
                            </IconButton>
                        </Tooltip>
                        <Tooltip arrow placement="left" title="View" >
                            <IconButton onClick={() => {
                                editQuestion(row.id)
                                setModalOpen(true);
                                setQuestionData(row.original)
                            }}>

                                <Visibility />
                            </IconButton>
                        </Tooltip>
                        <Tooltip arrow placement="right" title="Delete">
                            <IconButton color="error" onClick={() => deleteQuestion(row.id)}>
                                <Delete />
                            </IconButton>
                        </Tooltip>
                    </Box>
                )}
                renderTopToolbarCustomActions={() => (
                    <Tooltip title="Add-Question">
                        <IconButton aria-expanded={collapse} onClick={() => {
                            setCollapse(!collapse)

                        }}>
                            Create <Add />
                        </IconButton>
                    </Tooltip>
                )}

            />
            <ViewQuestion
                open={modalOpen}
                onClose={() => {
                    setModalOpen(false)

                }}
                option={inputList}
                questionData={questionData}
            />
        </div>


    );

};


const ViewQuestion: FC<{
    onClose: () => void;

    open: boolean;
    questionData: any;
    option: any

}> = (props) => {
    return (
        <Dialog open={props.open}>
            <DialogTitle textAlign="center">View Question</DialogTitle>
            <DialogContent>
                <Stack
                    sx={{
                        width: '100%',
                        minWidth: { xs: '300px', sm: '360px', md: '400px' },
                        //gap: '1.5rem',
                    }}
                >
                    <IonItem>
                        <IonLabel>
                            <h2 className="mb-3">Question Type</h2>
                            <p>
                                {props.questionData.question_type === 'SQ' && 'Short Question' ||
                                    props.questionData.question_type === 'MCQ' && 'MCQ'
                                }
                            </p>
                        </IonLabel>
                    </IonItem>
                    <IonItem>
                        <IonLabel>
                            <h2 className="mb-3">Question</h2>
                            <p>{props.questionData.title}</p>
                        </IonLabel>
                    </IonItem>
                    {props.questionData.q_content === null ? '' :
                        <IonItem>
                            <IonLabel>
                                <h2 className="mb-3">Question Content</h2>

                                <p dangerouslySetInnerHTML={{ __html: props.questionData.q_content }}></p>

                            </IonLabel>
                        </IonItem>
                    }
                    {props.questionData.question_type === 'SQ' ? '' :
                        <IonItem >
                            <IonLabel>
                                <h2 className="mb-3">Question options</h2>
                                {props.option.map((item: any, i: any) =>
                                    <p className="mt-3" key={i}> {i + 1}. {item.option}</p>
                                )}
                            </IonLabel>
                        </IonItem>
                    }
                    <IonItem>
                        <IonLabel>
                            <h2 className="mb-3">Answer</h2>
                            <p>{props.questionData.answer}</p>
                        </IonLabel>
                    </IonItem>
                </Stack>

            </DialogContent>
            <DialogActions sx={{ p: '1.25rem' }}>
                <Button onClick={props.onClose}>Cancel</Button>

            </DialogActions>
        </Dialog>
    );
}
export default TchrQuestion;