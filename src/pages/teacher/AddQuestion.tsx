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
import {
    Box,
    FormControl,
    NativeSelect,
} from '@mui/material';
import React, { useState, useEffect } from 'react';
import { Editor } from '@tinymce/tinymce-react';
import { Collapse } from 'react-bootstrap'
import baseUrl, { api } from '../../pages/Urls';
import Select from 'react-select';
import swal from 'sweetalert';
import { useForm, Controller, useFieldArray } from "react-hook-form";
import { ErrorMessage } from "@hookform/error-message";
const AddQuestion: React.FC<{

    level: any[]
    collapse: boolean
    onClose: () => void;
    course_name: string
    fetchShowCourse: () => void
}> = (props) => {
    const [qType, setQType] = useState('');
    const [error, setError] = useState('');
    const [topic, setTopic] = useState([]);
    const [levelOptions, setLevelOptions] = useState([{}]);

    const {
        handleSubmit,
        register,
        formState: { errors },
        reset,
        control,
        setValue,
        watch,
        getValues
    } = useForm({
        defaultValues: {

            level_name: {},
            topic_name: {},
            title: '',
            q_content: '',
            question_type: '',
            answer: '',
            option: [{ data: '' }, { data: '' }]


        }

    });
    const { fields, remove, append } = useFieldArray({
        name: 'option',
        control,
    });

    useEffect(() => {
        setLevelOptions(props.level.map((item: any) => ({
            label: item.level_name,
            value: item.level_name,

        })))
    }, [props.level])
    useEffect(() => {
        setQType('');
        setError('')
        reset({
            level_name: '',
            topic_name: '',
            title: '',
            q_content: '',
            question_type: '',
            answer: '',
            option: [{ data: '' }, { data: '' }]
        })
    }, [props.collapse])

    const handleSelectChange = (e: any) => {
        let data = {
            'level_name': e.value,
        }

        fetch(`${baseUrl}${api.LevelTopic}`, {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem("token")}`

            },
            body: JSON.stringify(data),
        })
            .then(resp => resp.json())
            .then(resp => {
                setTopic(resp.map((item: any) => ({
                    label: item.topic_name,
                    value: item.topic_name
                })))
            })


    }

    const addQuestion = (e: any) => {

        {

            fetch(`${baseUrl}${api.addQuestion}`, {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem("token")}`
                },
                body: JSON.stringify(e),
            })

                .then(response => {
                    if (response.status === 200) {
                        props.fetchShowCourse();
                        props.onClose();
                        swal({
                            title: "Success!",
                            text: "Question Created successfully",
                            icon: "success",
                        });

                    } else if (response.status === 406) {
                        setError('At least two option is required')
                    }
                    else {

                        throw Error([response.status, response.statusText].join(' '));
                    }
                })

                .catch(error => console.log('error', error));

        }
    }

    return (
        <Collapse in={props.collapse}>
            <div className="container mt-5 mb-5 ">

                <IonCard>
                    <IonCardHeader>
                        <IonCardTitle>
                            <IonToolbar>
                                <IonTitle><h1 className="text-center display-6">add Question</h1></IonTitle>
                            </IonToolbar>
                        </IonCardTitle>
                    </IonCardHeader>
                    <hr />
                    <IonCardContent>
                        <form onSubmit={handleSubmit(addQuestion)}>
                            <IonItem>
                                <IonLabel position="stacked">Level</IonLabel>
                                <div className="mt-2" style={{ width: '100%' }}>

                                    <Controller
                                        control={control}
                                        name="level_name"
                                        rules={{
                                            required: 'Level name is required',
                                        }}

                                        render={() => (
                                            <Select

                                                menuPortalTarget={document.body}
                                                options={levelOptions}
                                                value={getValues('level_name')}
                                                placeholder={<i className="bi bi-search"> Select Level</i>}
                                                onChange={(e: any) => {
                                                    setValue('level_name', e)
                                                    handleSelectChange(e)
                                                }}


                                            />

                                        )}

                                    />


                                </div>

                            </IonItem>
                            <p style={{ color: "red" }}>
                                <ErrorMessage errors={errors} name='level_id' />
                            </p>
                            <IonItem>
                                <IonLabel position="stacked">Topic</IonLabel>
                                <div className="mt-2" style={{ width: '100%' }}>

                                    <Controller
                                        control={control}
                                        name="topic_name"
                                        rules={{
                                            required: 'Topic name is required',
                                        }}
                                        render={() => (
                                            <Select

                                                menuPortalTarget={document.body}
                                                options={topic}
                                                value={getValues('topic_name')}
                                                placeholder={<i className="bi bi-search"> Select Topic</i>}
                                                onChange={(e: any) => setValue('topic_name', e)}

                                            />

                                        )}

                                    />
                                </div>

                            </IonItem>
                            <p style={{ color: "red" }}>
                                <ErrorMessage errors={errors} name='topic_name' />
                            </p>
                            <IonItem>
                                <IonLabel position="stacked">Question Type</IonLabel>
                                <Box sx={{ width: '100%' }}>
                                    <FormControl fullWidth sx={{ mt: 1 }}>
                                        <NativeSelect
                                            {...register("question_type", { required: "Question type Is Required" })}
                                            onChange={(e: any) => setQType(e.target.value)}
                                        >
                                            <option value='MCQ'>MCQ</option>
                                            <option value='SQ'>Short Question</option>


                                        </NativeSelect>
                                    </FormControl>
                                </Box>


                            </IonItem>
                            <p style={{ color: "red" }}>
                                <ErrorMessage errors={errors} name='question_type' />
                            </p>
                            <IonItem>
                                <IonLabel position="stacked">Question</IonLabel>
                                <IonInput type="text"

                                    {...register("title", { required: "Question Title Is Required" })}></IonInput>
                            </IonItem>
                            <p style={{ color: "red" }}>
                                <ErrorMessage errors={errors} name='title' />
                            </p>
                            <IonItem>
                                <IonLabel position="stacked" >Content</IonLabel>
                                <div style={{ marginTop: "3%", marginBottom: "3%" }}>
                                    <Controller
                                        name="q_content"
                                        control={control}

                                        render={({ field: { ...rest } }) => (
                                            <Editor
                                                textareaName="q_content"
                                                value={rest.value}

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
                                                onEditorChange={(e) => {
                                                    setValue('q_content', e)
                                                }}
                                            />

                                        )}
                                    />
                                </div>

                            </IonItem>
                            {qType === 'MCQ' ?
                                <>
                                    <IonItem>
                                        <IonText color="primary">
                                            <h2 className="mt-3 mb-3">Add Question Option</h2>
                                        </IonText>

                                    </IonItem>
                                    <IonItem>
                                        <input type='hidden'
                                            {...register('answer', { required: "Select one Answer" })}
                                        >
                                        </input>

                                        <div>

                                            {

                                                fields.map((x, i) => {

                                                    return (
                                                        <div key={x.id} className="row mb-3 mt-3">
                                                            <div className=" col-md-1">

                                                                <input className="mx-2 mt-4"
                                                                    type="radio"
                                                                    name="answer"
                                                                    onChange={(e: any) => {
                                                                        setValue('answer', watch(`option.${i}.data`))
                                                                    }}
                                                                />

                                                            </div>
                                                            <div className=" col-md-6">

                                                                <IonItem>
                                                                    <IonLabel position="stacked">Option</IonLabel>
                                                                    <IonInput type="text"

                                                                        {...register(`option.${i}.data` as const, { required: "Option Is Required" })}

                                                                    >
                                                                    </IonInput>
                                                                </IonItem>

                                                                <p style={{ color: "red" }}>
                                                                    <ErrorMessage errors={errors} name={`option.${i}.data`} />
                                                                </p>

                                                            </div>
                                                            <div className="col-md-3 mt-4">
                                                                {
                                                                    fields.length !== 1 &&
                                                                    <button onClick={() => remove(i)}>X</button>
                                                                }
                                                                {
                                                                    fields.length - 1 == i &&
                                                                    <button onClick={() => append({ data: '' })}>
                                                                        <i className="bi bi-plus-circle-fill" title="add-option"></i>
                                                                    </button>
                                                                }


                                                            </div>



                                                        </div>
                                                    );
                                                })}

                                        </div>

                                    </IonItem>
                                    <p style={{ color: "red" }}>
                                        <ErrorMessage errors={errors} name='answer' />
                                        <br />
                                        {error ? error : ''}
                                    </p>

                                </>
                                :
                                <>
                                    <IonItem>
                                        <IonLabel position="stacked">Answer</IonLabel>
                                        <IonInput type="text"

                                            {...register('answer', { required: "Answer Is Required" })}></IonInput>
                                    </IonItem>
                                    <p style={{ color: "red" }}>
                                        <ErrorMessage errors={errors} name='answer' />
                                    </p>
                                </>
                            }
                            <hr />
                            <div style={{ marginTop: "3%" }} className="text-center mb-5">
                                <IonButton color="danger" onClick={() => {
                                    props.onClose();

                                }}>
                                    Cancel
                                </IonButton>
                                <IonButton color="primary" type="submit">
                                    Create
                                </IonButton>

                            </div>
                        </form>
                    </IonCardContent>
                </IonCard>

            </div>

        </Collapse >
    )
}
export default AddQuestion;