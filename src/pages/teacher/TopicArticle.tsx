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


} from "@ionic/react";
import React, { FC, useMemo, useState, useEffect } from 'react';
import { useForm, Controller } from "react-hook-form";
import { ErrorMessage } from "@hookform/error-message";
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
import { Collapse } from 'react-bootstrap'
import { Editor } from '@tinymce/tinymce-react';
import swal from 'sweetalert';
type articleData = {
    id: string;
    name: string;
    slug: string;

};

const TopicArticle: FC<{
    fetchViewTopic: () => void;
    topicArticle: any
    topic_name: string
}> = (props) => {
    const [articleData, setArticleData] = useState({});
    const [collapse, setCollapse] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);
    const [error, setError] = useState('');
    const [tAid, setTAId] = useState('');
    const type = tAid ? "E" : "C";
    const {
        handleSubmit,
        register,
        formState: { errors },
        reset,
        control,
        setValue,
        clearErrors
    } = useForm({
        defaultValues: {
            id: '',
            topic_name: localStorage.getItem("topic_name"),
            name: '',
            content: '',
            slug: '',

        }
    });

    const columns = useMemo<MRT_ColumnDef<articleData>[]>(
        () => [


            {
                accessorKey: 'name',
                header: 'Article Name',

            },
            {
                accessorKey: 'slug',
                header: 'Article Slug',

            },


        ],
        [],
    );

    const makeSlug = (e: any) => {

        let data = {
            'name': e.target.value,
        }
        fetch(`${baseUrl}${api.topicArticleSlug}`, {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem("token")}`
            },
            body: JSON.stringify(data),
        }).then(res => res.json())
            .then((res) => {
                setValue('slug', res)
            })



    }
    const handleChange = (e: any) => {

        const slg = e.target.value;

        if (slg) {
            fetch(`${baseUrl}${api.slugChecking}${slg}`, {
                method: 'GET',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem("token")}`
                },
            })
                .then(resp => resp.json())
                .then(res => {
                    if (Object.keys(res).length != 0) {
                        setError('Slug already exists')
                    } else {
                        setError('');
                    }
                })
        }



    }

    const editTopicArticle = (id: any) => {
        setTAId(id)
        fetch(`${baseUrl}${api.showTopicArticle}${id}`, {
            method: 'GET',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem("token")}`

            }
        })
            .then(res => res.json())
            .then(result => {
                setValue('name', result.topicAticle.name);
                setValue('content', result.topicAticle.content);
                setValue('id', result.topicAticle.id);

            })
            .catch(function (error) {
                console.log(error);
            })


    }
    const addTopicArticle = (e: any) => {
        {

            fetch(`${baseUrl}${api.addTopicArticle}`, {
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
                        props.fetchViewTopic();
                        setCollapse(false)
                        swal({
                            title: "Success!",
                            text: "Topic Article Created successfully",
                            icon: "success",
                        });

                    } else {
                        swal({
                            title: "Error!",
                            text: response.status + ' ' + response.statusText + " - Topic Article not Created",
                            icon: "error",
                        });
                    }

                })

                .catch(error => console.log('error', error));

        }

    }
    const updateTopicArticle = (e: any) => {

        fetch(`${baseUrl}${api.updateTopicArticle}${e.id}`, {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem("token")}`
            },
            body: JSON.stringify(e),

        })

            .then(res => {
                if (res.status === 200) {
                    props.fetchViewTopic();
                    setCollapse(false)
                    swal({
                        title: "Success!",
                        text: "Topic Article updated successfully",
                        icon: "success",
                    });
                } else {
                    swal({
                        title: "Error!",
                        text: res.status + ' ' + res.statusText +
                            " - Topic Article not updated",
                        icon: "error",
                    });
                }
            })

            .catch(error => console.log('error', error));



    }
    const onSubmit = (e: any) => {
        type === "C" ? addTopicArticle(e) : updateTopicArticle(e);
    }
    const deleteTopicArticle = (id: any) => {
        if (window.confirm('Are you sure?')) {
            fetch(`${baseUrl}${api.deleteTopicArticle}${id}`, {
                method: 'DELETE',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem("token")}`

                }

            })

                .then(res => {
                    if (res.status === 200) {
                        props.fetchViewTopic();
                        swal({
                            title: "Success!",
                            text: "Topic Article deleted successfully",
                            icon: "success",
                        });
                    } else {
                        swal({
                            title: "Error!",
                            text: res.status + ' ' + res.statusText +
                                " - Topic Article not deleted",
                            icon: "error",
                        });
                    }

                })
                .catch(error => console.log('error', error));
        }
    }
    return (
        <>
            <div className="container mt-5">
                <Collapse in={collapse}>

                    <div>
                        <IonCard>
                            <IonCardHeader>
                                <IonCardTitle>
                                    <IonToolbar>
                                        <IonTitle><h1 className="text-center display-6">{type === "C" ? "Create" : "Edit"} Topic Article</h1></IonTitle>
                                    </IonToolbar>
                                </IonCardTitle>
                            </IonCardHeader>

                            <IonCardContent>

                                <form onSubmit={handleSubmit(onSubmit)}>
                                    {type === 'C' ?
                                        <>
                                            <IonItem>
                                                <IonLabel position="stacked">Title</IonLabel>
                                                <IonInput placeholder="name"
                                                    type="text"
                                                    {...register("name", { required: "Name Is Required" })}
                                                    onBlur={(e: any) => {

                                                        setValue('name', e.target.value)
                                                        makeSlug(e)
                                                    }}
                                                >
                                                </IonInput>
                                            </IonItem>
                                            <p style={{ color: "red" }}>
                                                <ErrorMessage errors={errors} name="name" />
                                            </p>
                                            <IonItem>
                                                <IonLabel position="stacked">Slug</IonLabel>
                                                <IonInput placeholder="slug"
                                                    type="text"

                                                    {...register("slug", { required: "Slug Is Required" })}
                                                    onIonChange={(e: any) => handleChange(e)}
                                                >
                                                </IonInput>
                                            </IonItem>
                                            <p style={{ color: "red" }}>
                                                <ErrorMessage errors={errors} name="slug" />
                                            </p>
                                            <p style={{ color: "red" }}>
                                                {error ? error : ''}
                                            </p>
                                        </>
                                        :
                                        <>
                                            <IonItem>
                                                <IonLabel position="stacked">Title</IonLabel>
                                                <IonInput placeholder="name"
                                                    type="text"
                                                    {...register("name", { required: "Name Is Required" })}
                                                    onBlur={(e: any) => {

                                                        setValue('name', e.target.value)
                                                        makeSlug(e)
                                                    }}
                                                >
                                                </IonInput>
                                            </IonItem>
                                            <p style={{ color: "red" }}>
                                                <ErrorMessage errors={errors} name="name" />
                                            </p>
                                        </>
                                    }
                                    <IonItem>
                                        <IonLabel position="stacked" >Content</IonLabel>
                                        <div style={{ marginTop: "3%", marginBottom: "3%" }}>
                                            <Controller
                                                name="content"
                                                control={control}
                                                rules={{
                                                    required: 'Content is required',
                                                }}
                                                render={({ field: { ...rest } }) => (
                                                    <Editor
                                                        apiKey={tinyMceKey}
                                                        textareaName="content"
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
                                                            setValue('content', e)
                                                        }}
                                                    />

                                                )}
                                            />
                                        </div>

                                    </IonItem>
                                    <p style={{ color: "red" }}>
                                        <ErrorMessage errors={errors} name="content" />
                                    </p>

                                    <div style={{ marginTop: "3%" }} className="text-center mb-5">
                                        <IonButton color="danger" onClick={() => setCollapse(false)}>Cancel</IonButton>
                                        <IonButton color="primary" type="submit">
                                            {type === "C" ? "Create" : "Save"}
                                        </IonButton>

                                    </div>
                                </form>
                            </IonCardContent>
                        </IonCard>
                    </div>

                </Collapse>

                <h1 className='text-center mb-2'>List of Topic Articles</h1>
                <MaterialReactTable
                    columns={columns}
                    data={props.topicArticle}
                    getRowId={(row => `${row.id}`)}

                    enableRowActions
                    enableRowNumbers
                    renderRowActions={({ row, table }) => (
                        <Box sx={{ display: 'flex', gap: '1rem' }}>
                            <Tooltip arrow placement="left" title="Edit">
                                <IconButton aria-expanded={collapse} onClick={() => {
                                    editTopicArticle(row.id)
                                    setCollapse(!collapse);
                                    clearErrors([
                                        'name',
                                        'content',
                                        'slug'

                                    ])
                                }}>
                                    <Edit />
                                </IconButton>
                            </Tooltip>
                            <Tooltip arrow placement="left" title="View" >
                                <IconButton onClick={() => {

                                    setModalOpen(true);
                                    setArticleData(row.original)
                                }}>

                                    <Visibility />
                                </IconButton>
                            </Tooltip>
                            <Tooltip arrow placement="right" title="Delete">
                                <IconButton color="error" onClick={() => deleteTopicArticle(row.id)}>
                                    <Delete />
                                </IconButton>
                            </Tooltip>
                        </Box>
                    )}
                    renderTopToolbarCustomActions={() => (
                        <Tooltip title="Add-Article">
                            <IconButton aria-expanded={collapse} onClick={() => {
                                setCollapse(!collapse)
                                setTAId('')
                                reset({
                                    name: '',
                                    slug: '',
                                    content: '',
                                    topic_name: localStorage.getItem("topic_name"),
                                })
                            }}>
                                Create <Add />
                            </IconButton>
                        </Tooltip>
                    )}
                />
                <ViewArticle
                    open={modalOpen}
                    onClose={() => {
                        setModalOpen(false)

                    }}

                    articleData={articleData}
                />
            </div>
        </>

    );


};


const ViewArticle: FC<{
    onClose: () => void;

    open: boolean;
    articleData: any;

}> = (props) => {

    return (
        <Dialog open={props.open}>
            <DialogTitle textAlign="center">View Article</DialogTitle>
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
                            <h2 className="mb-3 text-center">{props.articleData.name}</h2>

                        </IonLabel>
                    </IonItem>

                    <IonItem>
                        <IonLabel>

                            <p dangerouslySetInnerHTML={{ __html: props.articleData.content }}></p>
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

export default TopicArticle;