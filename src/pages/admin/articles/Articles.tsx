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
    IonContent,

} from "@ionic/react";
import React, { FC, useMemo, useState, useEffect, useRef } from 'react';
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
    FormControl,
    NativeSelect,
    Stack,
    Tooltip,
    InputLabel,
} from '@mui/material';
import { Delete, Edit, Add, Visibility } from '@mui/icons-material';
import baseUrl, { api, tinyMceKey } from '../../../pages/Urls';
import { Editor } from '@tinymce/tinymce-react';
import { Collapse } from 'react-bootstrap'
import { format } from "date-fns";
import swal from 'sweetalert';
import Select from 'react-select';
import { useForm, Controller } from "react-hook-form";
import { ErrorMessage } from "@hookform/error-message";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { TextField } from "@mui/material";
import { DesktopDatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import "../../user/blog/ViewBlog.css";
type article_Data = {
    id: string;
    user: {
        name: string;
    };
    title: string;
    slug: string;
    date: string;
    status: string;


};

const Articles: FC = () => {
    const [article, setArticle] = useState([]);
    const [collapse, setCollapse] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);
    const [articleData, setArticleData] = useState({});
    const [showArtGroup, setShowArtGroup] = useState([]);
    const [showArtCategory, setShowArtCategory] = useState([]);
    const [groupOptions, setGroupOptions] = useState([{}]);
    const [categoryOptions, setCategoryOptions] = useState([{}]);
    const [error, setError] = useState('');
    const [artID, setArtId] = useState('');
    const type = artID ? "E" : "C";
    //console.log(getValues('id'))
    // const editorRef = useRef<TinyMCEEditor | null>(null);
    const {
        handleSubmit,
        register,
        formState: { errors },
        reset,
        control,
        setValue,
        clearErrors,
        getValues
    } = useForm({
        defaultValues: {
            id: '',
            title: '',
            slug: '',
            content: '',
            status: '',
            category: [{}],
            gname: [{}],
            date: format(new Date(), "yyyy-MM-dd"),

        },

    });
    const fetchArticle = () => {
        fetch(`${baseUrl}${api.allArticle}`, {
            method: 'GET',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem("token")}`

            }
        })
            .then(resp => resp.json())
            .then(resp => {
                setArticle(resp.reverse())
            })
    }
    const fetchGroup = () => {
        fetch(`${baseUrl}${api.allGroup}`, {
            method: 'GET',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem("token")}`

            }
        })
            .then(resp => resp.json())
            .then(resp => {
                setGroupOptions(resp.map((item: any) => ({
                    label: item.name,
                    value: item.name
                })));
            })
    }
    const fetchCategory = () => {
        fetch(`${baseUrl}${api.allCategory}`, {
            method: 'GET',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem("token")}`

            }
        })
            .then(resp => resp.json())
            .then(resp => {
                setCategoryOptions(resp.map((item: any) => ({
                    label: item.name,
                    value: item.name
                })))
            })
    }
    useEffect(() => {
        fetchArticle();
        fetchGroup();
        fetchCategory();
    }, [])
    const columns = useMemo<MRT_ColumnDef<article_Data>[]>(
        () => [


            {
                accessorKey: 'user.name',
                header: 'Created By',

            },
            {
                accessorKey: 'title',
                header: 'Title',

            },
            {
                accessorKey: 'slug',
                header: 'Slug',

            },
            {
                accessorKey: 'status',
                header: 'Status',
                Cell: ({ cell }) => (
                    cell.getValue<string>() === "P" && 'Publish' ||
                    cell.getValue<string>() === "D" && 'Draft' ||
                    cell.getValue<string>() === "R" && 'Review'

                ),

            },
            {
                accessorFn: (row) => format(new Date(row.date), "yyyy-MM-dd"),
                accessorKey: 'date',
                header: 'Date',

            },




        ],
        [],
    );
    const handleChange = (e: any) => {

        const slg = e.target.value;

        if (slg) {
            fetch(`${baseUrl}${api.checkSlug}${slg}`, {
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



    const makeSlug = (e: any) => {

        let data = {
            'title': e.target.value,
        }
        fetch(`${baseUrl}${api.createSlug}`, {
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


    //console.log(artID);
    const editArticle = (id: any) => {
        setArtId(id)
        fetch(`${baseUrl}${api.editArticle}${id}`, {
            method: 'GET',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem("token")}`

            }
        })
            .then(res => res.json())
            .then(result => {
                setValue('title', result.article.title);
                //setSlug(result.article.slug);
                setValue('content', result.article.content);
                setValue('status', result.article.status);
                setValue('date', result.article.date);
                setValue('id', result.article.id);
                setShowArtGroup(result.article.group);
                setShowArtCategory(result.article.category);
                setValue('gname',

                    result.article.group.map((item: any) => ({
                        label: item.name,
                        value: item.name
                    }))


                );
                setValue('category',

                    result.article.category.map((item: any) => ({
                        label: item.name,
                        value: item.name
                    }))

                );
            })
            .catch(function (error) {
                console.log(error);
            })


    }

    const addArticle = (e: any) => {
        {
            fetch(`${baseUrl}${api.createArticle}`, {
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
                        fetchArticle();
                        setCollapse(false)
                        swal({
                            title: "Success!",
                            text: "Article Created successfully",
                            icon: "success",
                        });
                    } else {
                        swal({
                            title: "Error!",
                            text: response.status + ' ' + response.statusText + " - Article not Created",
                            icon: "error",
                        });
                    }


                })

                .catch(errors => console.log(errors.response.data.errors));
        }
    }

    const updateArticle = (e: any) => {

        fetch(`${baseUrl}${api.updatetArticle}${e.id}`, {
            method: 'PUT',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem("token")}`
            },
            body: JSON.stringify(e),
        })

            .then(res => {
                if (res.status === 200) {
                    fetchArticle();
                    setCollapse(false)
                    swal({
                        title: "Success!",
                        text: "Article Updated successfully",
                        icon: "success",
                    });

                } else {
                    swal({
                        title: "Error!",
                        text: res.status + ' ' + res.statusText + " - Article not updated",
                        icon: "error",
                    });
                }

            })
            .catch(error => console.log('error', error));


    }
    const deleteArticle = (id: any) => {
        if (window.confirm('Are you sure?')) {
            fetch(`${baseUrl}${api.deleteArticle}${id}`, {
                method: 'DELETE',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem("token")}`

                }

            })

                .then(res => {
                    if (res.status === 200) {
                        fetchArticle();

                        swal({
                            title: "Success!",
                            text: "Article move to trash successfully",
                            icon: "success",
                        });
                    } else {
                        swal({
                            title: "Error!",
                            text: res.status + ' ' + res.statusText +
                                " - Article not move to trash",
                            icon: "error",
                        });
                    }

                })
                .catch(error => console.log('error', error));
        }
    }
    const onSubmit = (e: any) => {
        type === "C" ? addArticle(e) : updateArticle(e);
    }




    return (
        <IonContent>
            <div className="container mt-5">

                <Collapse in={collapse}>
                    <div id="collapseID">
                        <div className="container mt-5 mb-5 ">

                            <IonCard>
                                <IonCardHeader>
                                    <IonCardTitle>
                                        <IonToolbar>
                                            <IonTitle><h1 className="text-center display-6">{type === "C" ? "Create" : "Edit"} Article</h1></IonTitle>
                                        </IonToolbar>
                                    </IonCardTitle>
                                </IonCardHeader>
                                <hr />
                                <IonCardContent>
                                    <form onSubmit={handleSubmit(onSubmit)}>
                                        {type === 'C' ?
                                            <>
                                                <IonItem>
                                                    <IonLabel position="stacked">Title</IonLabel>
                                                    <IonInput placeholder="Title"
                                                        type="text"
                                                        {...register("title", { required: "Title Is Required" })}
                                                        onBlur={(e: any) => {
                                                            ///setTitle(e.target.value)
                                                            setValue('title', e.target.value)
                                                            makeSlug(e)
                                                        }}
                                                    >
                                                    </IonInput>
                                                </IonItem>
                                                <p style={{ color: "red" }}>
                                                    <ErrorMessage errors={errors} name="title" />
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
                                                    <IonInput placeholder="Title"
                                                        type="text"
                                                        {...register("title", { required: "Title Is Required" })}
                                                        onIonChange={(e: any) => setValue('title', e.target.value)}
                                                    >
                                                    </IonInput>
                                                </IonItem>
                                                <p style={{ color: "red" }}>
                                                    <ErrorMessage errors={errors} name="title" />
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
                                                        <>
                                                            <input
                                                                id="my-file"
                                                                type="file"
                                                                name="my-file"
                                                                style={{ display: "none" }}
                                                            />
                                                            <Editor
                                                                apiKey={tinyMceKey}
                                                                textareaName="content"
                                                                value={rest.value}
                                                                //onInit={(evt, editor) => editorRef.current = editor}
                                                                init={{
                                                                    height: 500,
                                                                    width: 830,
                                                                    menubar: true,
                                                                    plugins: [
                                                                        'a11ychecker', 'advlist', 'advcode', 'advtable', 'autolink', 'checklist', 'export',
                                                                        'lists', 'link', 'image', 'charmap', 'preview', 'anchor', 'searchreplace', 'visualblocks',
                                                                        'powerpaste', 'fullscreen', 'formatpainter', 'insertdatetime', 'media', 'table', 'help', 'wordcount'
                                                                    ],
                                                                    toolbar: 'undo redo | casechange blocks | bold italic backcolor | ' +
                                                                        'alignleft aligncenter alignright alignjustify | ' +
                                                                        'bullist numlist checklist outdent indent | removeformat | a11ycheck code table help',
                                                                    image_title: true,
                                                                    automatic_uploads: true,
                                                                    file_picker_types: 'image',

                                                                    content_style: 'body {font - family:Helvetica,Arial,sans-serif; font-size:14px }'



                                                                }}

                                                                onEditorChange={(e) => {
                                                                    setValue('content', e)
                                                                }}
                                                            />
                                                        </>


                                                    )}
                                                />
                                            </div>

                                        </IonItem>
                                        <p style={{ color: "red" }}>
                                            <ErrorMessage errors={errors} name="content" />
                                        </p>
                                        <IonItem>
                                            <IonLabel position="stacked">Category</IonLabel>
                                            <div className="mt-2" style={{ width: '100%' }}>

                                                <Controller
                                                    control={control}
                                                    name="category"
                                                    rules={{
                                                        required: 'Category is required',
                                                    }}
                                                    render={() => (
                                                        <Select

                                                            menuPortalTarget={document.body}
                                                            options={categoryOptions}
                                                            placeholder={<i className="bi bi-search"> Select Category</i>}
                                                            value={getValues('category')}
                                                            onChange={(e: any) => setValue('category', e)}
                                                            isMulti

                                                        />

                                                    )}

                                                />
                                            </div>

                                        </IonItem>

                                        <p style={{ color: "red" }}>
                                            <ErrorMessage errors={errors} name="category" />
                                        </p>
                                        <IonItem>
                                            <IonLabel position="stacked">Group</IonLabel>
                                            <div className="mt-2" style={{ width: '100%' }}>

                                                <Controller
                                                    control={control}
                                                    name="gname"
                                                    render={() => (
                                                        <Select
                                                            menuPortalTarget={document.body}
                                                            options={groupOptions}
                                                            placeholder={<i className="bi bi-search"> Select Group</i>}
                                                            value={getValues('gname')}
                                                            onChange={(e: any) => setValue('gname', e)}
                                                            isMulti

                                                        />

                                                    )}

                                                />
                                            </div>

                                        </IonItem>
                                        <IonItem>
                                            <IonLabel position="stacked">Status</IonLabel>


                                            <Box sx={{ width: '100%' }}>
                                                <FormControl fullWidth sx={{ mt: 1 }}>

                                                    <NativeSelect
                                                        {...register("status", { required: "Status Is Required" })}

                                                    >

                                                        {(localStorage.getItem('role') == 'ar_staff1') ?

                                                            <option value='R'>Review</option> :
                                                            <>
                                                                <option value='P'>Publish</option>
                                                                <option value='D'>Draft</option>
                                                                <option value='R'>Review</option>

                                                            </>
                                                        }

                                                    </NativeSelect>
                                                </FormControl>
                                            </Box>



                                        </IonItem>
                                        <p style={{ color: "red" }}>
                                            <ErrorMessage errors={errors} name="status" />
                                        </p>

                                        <IonItem>
                                            <IonLabel position="stacked">Date</IonLabel>

                                            <Controller
                                                name="date"
                                                control={control}
                                                rules={{
                                                    required: 'Date is required',
                                                }}
                                                defaultValue={format(new Date(), "yyyy-MM-dd")}
                                                render={({ field: { ...rest } }) => (
                                                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                                                        <DesktopDatePicker

                                                            inputFormat="yyyy-MM-dd"

                                                            value={rest.value}
                                                            onChange={(e: any) => {
                                                                setValue("date", format(e, "yyyy-MM-dd"));

                                                            }}
                                                            renderInput={(params) => (
                                                                <TextField {...params} sx={{ mt: 1, width: '100%' }} />
                                                            )}
                                                        />
                                                    </LocalizationProvider>
                                                )}
                                            />

                                        </IonItem>

                                        <p style={{ color: "red" }}>
                                            <ErrorMessage errors={errors} name="date" />
                                        </p>
                                        <div style={{ marginTop: "3%" }} className="text-center mb-5">
                                            <IonButton color="danger" onClick={() => setCollapse(false)}>
                                                Cancel
                                            </IonButton>
                                            <IonButton color="primary" type="submit">
                                                {type === "C" ? "Create" : "Save"}
                                            </IonButton>

                                        </div>
                                    </form>
                                </IonCardContent>
                            </IonCard>

                        </div>

                    </div>
                </Collapse>

                <h1 className='text-center mb-2'>List of Articles</h1>
                <MaterialReactTable
                    columns={columns}
                    data={article}
                    getRowId={(row => `${row.id}`)}
                    enableRowActions
                    positionActionsColumn="last"
                    enableRowNumbers
                    enableColumnOrdering
                    renderRowActions={({ row, table }) => (
                        <Box sx={{ display: 'flex', gap: '1rem' }}>
                            {(localStorage.getItem('role') == 'ar_staff2') ? '' :
                                <Tooltip arrow placement="left" title="Edit" >
                                    <IconButton aria-expanded={collapse} aria-controls="collapseID" onClick={() => {
                                        editArticle(row.id)
                                        setCollapse(!collapse)
                                        clearErrors([
                                            'title',
                                            'content',
                                            'category',
                                            'status'
                                        ])
                                    }}>

                                        <Edit />
                                    </IconButton>
                                </Tooltip>
                            }
                            <Tooltip arrow placement="left" title="View" >
                                <IconButton onClick={() => {
                                    editArticle(row.id)
                                    setModalOpen(true);
                                    setArticleData(row.original)
                                }}>

                                    <Visibility />
                                </IconButton>
                            </Tooltip>
                            <Tooltip arrow placement="right" title="Trash">
                                <IconButton style={{ color: "green" }} onClick={() => deleteArticle(row.id)}>
                                    <Delete />
                                </IconButton>
                            </Tooltip>
                        </Box>
                    )}
                    renderTopToolbarCustomActions={() => (
                        <>
                            {(localStorage.getItem('role') == 'ar_staff2') ? '' :
                                <Tooltip title="Add-Article">
                                    <IconButton aria-expanded={collapse} onClick={() => {
                                        setCollapse(!collapse)
                                        setArtId('')
                                        reset({
                                            id: '',
                                            title: '',
                                            slug: '',
                                            content: '',
                                            status: 'D',
                                            gname: [],
                                            category: categoryOptions?.slice(0, 1),

                                        })
                                    }}>
                                        Create <Add />
                                    </IconButton>
                                </Tooltip>
                            }
                        </>
                    )}

                />
                <ViewArticle
                    open={modalOpen}
                    onClose={() => {
                        setModalOpen(false)

                    }}
                    showArtGroup={showArtGroup}
                    showArtCategory={showArtCategory}
                    articleData={articleData}
                    fetchArticle={() => fetchArticle()}
                />
            </div>
        </IonContent>

    );

};

const ViewArticle: FC<{
    onClose: () => void;
    fetchArticle: () => void;

    open: boolean;
    articleData: any;
    showArtGroup: any;
    showArtCategory: any;

}> = (props) => {

    const approveArticle = () => {

        fetch(`${baseUrl}${api.approveArticle}${props.articleData.id}`, {
            method: 'PUT',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem("token")}`

            }

        })

            .then(res => res.json())
            .then(res => {
                if (res) {
                    props.fetchArticle();
                    props.onClose();

                }

            })
            .catch(error => console.log('error', error));
    }

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

                            <h3 className="text-center">{
                                props.articleData.status === 'P' && 'Publish' ||
                                props.articleData.status === 'D' && 'Draft' ||
                                props.articleData.status === 'R' && 'Review'

                            }</h3>
                        </IonLabel>
                    </IonItem>
                    <IonItem>
                        <h1 style={{
                            fontWeight: 'bold',
                            fontSize: '2rem',
                        }}>{props.articleData.title}</h1>
                    </IonItem>
                    <IonItem>
                        <h4 style={{
                            color: '#666',
                        }}>
                            Posted on {props.articleData.date ? format(new Date(props.articleData.date), "yyyy-MM-dd") : format(new Date(), "yyyy-MM-dd")} by {props.articleData?.user?.name}<br />
                            <b>Categories: </b>
                            {props.showArtCategory && props.showArtCategory.map((category: any, i: any) => <span className="text-primary">

                                {category.name}
                            </span>)}
                        </h4>
                    </IonItem>
                    <IonItem>
                        <div
                            id="article-content"
                            dangerouslySetInnerHTML={{ __html: props.articleData ? props.articleData.content : '' }}
                        />
                    </IonItem>
                    {props.showArtGroup.length > 0 ?
                        <IonItem>
                            <h4 style={{
                                color: '#666',
                            }}>

                                <b>Groups: </b>
                                {props.showArtGroup && props.showArtGroup.map((gr: any, i: any) => <span className="text-info">

                                    {gr.name}
                                </span>)}
                            </h4>
                        </IonItem> : ''
                    }

                </Stack>

            </DialogContent>
            <DialogActions sx={{ p: '1.25rem' }}>
                <Button onClick={props.onClose}>Cancel</Button>
                {(localStorage.getItem('role') == 'ar_mgmt') &&
                    props.articleData.status === 'R'
                    ? <Button onClick={approveArticle}>Publish</Button>
                    : ''

                }

            </DialogActions>
        </Dialog>
    );
}
export default Articles;