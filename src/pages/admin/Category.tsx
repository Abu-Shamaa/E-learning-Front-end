import React, { FC, useMemo, useState, useEffect, useRef } from 'react';
import { useForm } from "react-hook-form";
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
    TextField,
    Tooltip,
} from '@mui/material';
import { Delete, Edit, Add } from '@mui/icons-material';
import baseUrl, { api } from '../Urls';
import { IonContent } from '@ionic/react';
import { ErrorMessage } from '@hookform/error-message';
import swal from 'sweetalert';

type CategoryTable = {
    id: string;
    name: string;
    slug: string;
    description: string;

};

const Category: FC = () => {
    const [category, setCategory] = useState([]);
    const [categoryData, setCategoryData] = useState({});
    const [modalOpen, setModalOpen] = useState(false);
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
                setCategory(resp.reverse())
            })
    }
    useEffect(() => {
        fetchCategory();
    }, [])

    const columns = useMemo<MRT_ColumnDef<CategoryTable>[]>(
        () => [

            {
                accessorKey: 'name',
                header: 'Name',

            },
            {
                accessorKey: 'slug',
                header: 'Slug',

            },
            {
                accessorKey: 'description',
                header: 'Description',

            },

        ],
        [],
    );

    const deleteCategory = (id: any) => {
        if (window.confirm('Are you sure?')) {
            fetch(`${baseUrl}${api.deleteCategory}${id}`, {
                method: 'DELETE',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem("token")}`

                }

            })

                .then(res => {
                    if (res.status === 200) {
                        fetchCategory();
                        swal({
                            title: "Success!",
                            text: "Category deleted successfully",
                            icon: "success",
                        });
                    } else {
                        swal({
                            title: "Error!",
                            text: res.status + ' ' + res.statusText +
                                " - Category not deleted",
                            icon: "error",
                        });
                    }
                })
                .catch(error => console.log('error', error));
        }
    }
    return (
        <IonContent>
            <div className="container mt-5">
                <h1 className='text-center mb-2'>List of Categories</h1>
                <MaterialReactTable
                    columns={columns}
                    data={category}
                    getRowId={(row => `${row.id}`)}
                    enableRowActions
                    positionActionsColumn="last"
                    enableRowNumbers
                    renderRowActions={({ row, table }) => (
                        <Box sx={{ display: 'flex', gap: '1rem' }}>
                            <Tooltip arrow placement="left" title="Edit">
                                <IconButton onClick={() => {
                                    setCategoryData(row.original)
                                    setModalOpen(true);

                                }}>
                                    <Edit />
                                </IconButton>
                            </Tooltip>
                            <Tooltip arrow placement="right" title="Delete">
                                <IconButton color="error" onClick={() => deleteCategory(row.id)}>
                                    <Delete />
                                </IconButton>
                            </Tooltip>
                        </Box>
                    )}
                    renderTopToolbarCustomActions={() => (
                        <Tooltip title="Add-category">
                            <IconButton onClick={() => setModalOpen(true)}>
                                Create <Add />
                            </IconButton>
                        </Tooltip>
                    )}
                />
                <CreateOrEdit
                    open={modalOpen}
                    onClose={() => {
                        setModalOpen(false)
                        setCategoryData({})

                    }}
                    fetchCategory={() => fetchCategory()}
                    categoryData={categoryData}

                />
            </div>
        </IonContent>

    );

};

const CreateOrEdit: FC<{
    onClose: () => void;
    fetchCategory: () => void;
    open: boolean;
    categoryData: any
}> = (props) => {
    const [error, setError] = useState('');
    const type = Object.keys(props.categoryData).length == 0 ? "C" : "E";
    const formRef = useRef<HTMLFormElement>(null);
    const {
        register,
        reset,
        handleSubmit,
        formState: { errors },
        setValue,
        clearErrors,
    } = useForm({
        criteriaMode: "all",

    });
    const addCategory = (e: any) => {
        {


            fetch(`${baseUrl}${api.addCategory}`, {
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
                        props.fetchCategory();
                        props.onClose();
                        swal({
                            title: "Success!",
                            text: "Category Created successfully",
                            icon: "success",
                        });
                    }
                    else {
                        throw Error([response.status, response.statusText].join(' '));
                    }
                })

                .catch(error => console.log('error', error));

        }
    }
    const updateCategory = (e: any) => {

        fetch(`${baseUrl}${api.updateCategory}${e.id}`, {
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
                    props.fetchCategory();
                    props.onClose();
                    swal({
                        title: "Success!",
                        text: "Category updated successfully",
                        icon: "success",
                    });

                }

            })
            .catch(error => console.log('error', error));


    }

    const makeSlug = (e: any) => {

        let data = {
            'name': e.target.value,
        }
        fetch(`${baseUrl}${api.categorySlug}`, {
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
            fetch(`${baseUrl}${api.slugCheck}${slg}`, {
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
    const onSubmit = (e: any) => {

        type === "C" ? addCategory(e) : updateCategory(e);
    };
    useEffect(() => {

        {
            type === "E" ?
                reset({
                    id: props.categoryData.id,
                    name: props.categoryData.name,
                    description: props.categoryData.description,

                }) : reset({
                    id: '',
                    name: '',
                    description: '',
                    slug: '',
                })
        };
    }, [props.categoryData]);

    return (
        <Dialog open={props.open}>
            <DialogTitle textAlign="center">{type === "C" ? "Create" : "Edit"} Category</DialogTitle>
            <DialogContent>
                <form ref={formRef} onSubmit={handleSubmit(onSubmit)}>
                    <Stack
                        sx={{
                            width: '100%',
                            minWidth: { xs: '300px', sm: '360px', md: '400px' },

                        }}
                    >
                        {type === 'C' ?
                            <>
                                <TextField sx={{ mt: 3 }}
                                    type="text"
                                    label="Category Name"
                                    variant="filled"
                                    focused

                                    {...register("name", { required: "Category Name Is Required" })}
                                    onBlur={(e: any) => {

                                        setValue('name', e.target.value)
                                        makeSlug(e)
                                    }}
                                />
                                <p style={{ color: "red" }}>
                                    <ErrorMessage errors={errors} name="name" />
                                </p>
                                <TextField sx={{ mt: 3 }}
                                    type="text"
                                    label="Category Slug"
                                    variant="filled"
                                    focused

                                    {...register("slug", { required: "Slug Is Required" })}
                                    onChange={(e: any) => handleChange(e)}
                                />
                                <p style={{ color: "red" }}>
                                    <ErrorMessage errors={errors} name="slug" />
                                </p>
                                <p style={{ color: "red" }}>
                                    {error ? error : ''}
                                </p>
                            </>
                            : <>
                                <TextField sx={{ mt: 3 }}
                                    type="text"
                                    label="Category Name"
                                    variant="filled"
                                    focused

                                    {...register("name", { required: "Category Name Is Required" })}
                                />
                                <p style={{ color: "red" }}>
                                    <ErrorMessage errors={errors} name="name" />
                                </p>


                            </>}
                        <TextField sx={{ mt: 3 }}
                            type="text"
                            label="Description"
                            variant="filled"
                            focused
                            multiline
                            {...register("description")}
                        />

                    </Stack>
                    <DialogActions sx={{ p: '1.25rem' }}>
                        <Button onClick={props.onClose}>Cancel</Button>
                        <Button type="submit">{type === "C" ? "Create" : "Save"}</Button>
                    </DialogActions>
                </form>
            </DialogContent>

        </Dialog>
    );
}

export default Category;