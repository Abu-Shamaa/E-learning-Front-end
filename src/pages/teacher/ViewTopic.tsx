import {
    IonButton,
    IonInput,
    IonItem,
    IonLabel,
    IonCard,
    IonAccordionGroup,
    IonAccordion,
    IonContent
} from "@ionic/react";
import React, { useState, useEffect } from 'react';
import { useParams } from "react-router";
import baseUrl, { api } from '../../pages/Urls';
import TopicArticle from "./TopicArticle";
import swal from 'sweetalert';
import { useForm } from 'react-hook-form';
import { ErrorMessage } from '@hookform/error-message';
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
const schema = yup.object().shape({
    file: yup.mixed()
        .test('required', "File is Required", (multipleFiles: any) => {
            return multipleFiles && multipleFiles.length
        })

        .test("fileSize", "File Size is too large >100mb", (value: any) => {
            if (value && value?.length > 0) {
                for (let i = 0; i < value.length; i++) {
                    if (value[i].size > 104857600) {
                        return false; //100 mb
                    }
                }
            }
            return true;
        })
        .test("fileType", "Invalid file !! only doc, docx, xlsx, xls, pdf, zip, png, jpg file are allowed", (value: any) => {
            if (value && value.length > 0) {
                for (let i = 0; i < value.length; i++) {
                    if (
                        value[i].type != "image/png" &&
                        value[i].type != "image/jpg" &&
                        value[i].type != "application/pdf" &&
                        value[i].type != "application/msword" &&
                        value[i].type != "application/vnd.openxmlformats-officedocument.wordprocessingml.document" &&
                        value[i].type != "application/vnd.ms-excel" &&
                        value[i].type != "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" &&
                        value[i].type != "application/zip"
                    ) {
                        return false;
                    }
                }
            }
            return true;
        }
        ),
});
const ViewTopic: React.FC<{
    courseId: string

}> = (props) => {
    type ViewTopic = {
        id: string;
    };

    const [topic_name, setTopic_name] = useState('');
    const [topic_article, setTopic_article] = useState([]);
    const [topic_content, setTopic_content] = useState([]);
    const [tid, setId] = useState('');
    const [multipleFiles, setMultipleFiles] = useState([]);
    const [tnerror, setTnError] = useState("");
    const { id } = useParams<ViewTopic>();


    const {
        register,
        handleSubmit,
        reset,
        formState,
        formState: { errors },
        setError,
    } = useForm({
        resolver: yupResolver(schema),
    });
    const fetchViewTopic = () => {
        fetch(`${baseUrl}${api.showTopic}${id}`, {
            method: 'GET',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem("token")}`

            }
        })
            .then(res => res.json())
            .then(result => {
                setTopic_name(result.topic.topic_name);
                setTopic_article(result.topic.topic_article);
                setTopic_content(result.topic.topic_content);
                localStorage.setItem('topic_name', result.topic.topic_name);
                setId(result.topic.id)

            })
            .catch(function (error) {
                console.log(error);
            })
    }
    useEffect(() => {
        fetchViewTopic();
    }, [])


    const changeMultipleFiles = (e: any) => {
        if (e.target.files) {
            const fileArray: any = Array.from(e.target.files).map((file: any) =>
                URL.createObjectURL(file)
            );
            setMultipleFiles((prevFiles) => prevFiles.concat(fileArray));
        }
    };


    const onSubmit = (data: any) => {
        var myHeaders = new Headers();
        myHeaders.append("Authorization", `Bearer ${localStorage.getItem("token")}`);
        const formData = new FormData();
        for (const key of Object.keys(multipleFiles)) {
            formData.append('files[]', data.file[key]);

        }
        formData.append('topic_name', topic_name)
        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: formData,

        };


        fetch(`${baseUrl}${api.addTopicContent}`, requestOptions)
            .then(response => response.json())
            .then(res => {
                if (res.status === true) {
                    fetchViewTopic();
                    setMultipleFiles([]);
                    reset({
                        file: ''
                    })
                    swal({
                        title: "Success!",
                        text: "File upload successfully",
                        icon: "success",
                    });
                }
            });





    };


    const updateTopic = () => {
        let data = {
            'topic_name': topic_name,

        }
        fetch(`${baseUrl}${api.updateTopic}${tid}`, {
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
                    setTnError('')
                    fetchViewTopic();
                    swal({
                        title: "Success!",
                        text: "Topic updated successfully",
                        icon: "success",
                    });

                }
                else if (!topic_name) {
                    setTnError("Topic name is Required");


                } else {
                    swal({
                        title: "Error!",
                        text: res.status + ' ' + res.statusText +
                            " - Topic not updated",
                        icon: "error",
                    });
                }

            })
            .catch(error => console.log('error', error));


    }
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

    const deleteTopicContent = (id: any) => {
        if (window.confirm('Are you sure?')) {
            fetch(`${baseUrl}${api.deleteTopicContent}${id}`, {
                method: 'DELETE',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem("token")}`

                }

            })
                .then(res => {
                    if (res.status === 200) {
                        fetchViewTopic();
                        swal({
                            title: "Success!",
                            text: "File deleted successfully",
                            icon: "success",
                        });
                    } else {
                        swal({
                            title: "Error!",
                            text: res.status + ' ' + res.statusText +
                                " - File not deleted",
                            icon: "error",
                        });
                    }

                })
                .catch(error => console.log('error', error));
        }
    }
    return (
        <IonContent>
            <IonCard>
                <IonAccordionGroup>
                    <IonAccordion value="first">
                        <IonItem slot="header" color="light">
                            <IonLabel>Update Topic</IonLabel>
                        </IonItem>

                        <div className="ion-padding" slot="content">

                            <IonItem>
                                <IonLabel position="stacked">Topic Name</IonLabel>
                                <IonInput type="text"
                                    name="topic_name"
                                    value={topic_name}
                                    onIonChange={(e: any) => setTopic_name(e.target.value)}
                                    clearInput

                                >
                                </IonInput>
                            </IonItem>
                            <p style={{ color: "red" }}>
                                {tnerror}
                            </p>
                            <hr />
                            <div style={{ marginTop: "3%" }} className="text-center mb-5">
                                <IonButton color="primary" onClick={updateTopic}>
                                    Save
                                </IonButton>

                            </div>

                        </div>
                    </IonAccordion>
                </IonAccordionGroup>

            </IonCard>
            <IonCard >

                <IonAccordionGroup>
                    <IonAccordion value="first">
                        <IonItem slot="header" color="light">
                            <IonLabel>Topic Content</IonLabel>
                        </IonItem>

                        <div className="ion-padding" slot="content">
                            <form onSubmit={handleSubmit(onSubmit)}>
                                <input
                                    type="file"
                                    multiple
                                    {...register('file')}
                                    onChange={changeMultipleFiles}

                                />

                                <p style={{ color: "red" }}>
                                    <ErrorMessage errors={errors} name='file' />
                                </p>


                                <IonButton color="primary" type="submit">
                                    Save
                                </IonButton>
                            </form>
                            {topic_content.map((item: any, i: any) => (
                                <IonItem key={i.toString()}>
                                    <IonLabel > <button onClick={() => downloadFile(item.id, item.file)}>
                                        {item.file} <i className="bi bi-download"></i>
                                    </button></IonLabel>

                                    <button onClick={() => deleteTopicContent(item.id)}>
                                        <i className="bi bi-trash" title="delete"></i>
                                    </button>
                                </IonItem>
                            ))}
                        </div>
                    </IonAccordion>
                </IonAccordionGroup>

            </IonCard>
            <IonCard >

                <IonAccordionGroup>
                    <IonAccordion value="first">
                        <IonItem slot="header" color="light">
                            <IonLabel>Topic Article</IonLabel>
                        </IonItem>

                        <div className="ion-padding" slot="content">
                            <TopicArticle topicArticle={topic_article} fetchViewTopic={() => fetchViewTopic()} topic_name={topic_name} />

                        </div>
                    </IonAccordion>
                </IonAccordionGroup>

            </IonCard>
        </IonContent>
    );
}


export default ViewTopic;