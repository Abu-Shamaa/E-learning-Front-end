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
import {
    IonCard,
    IonCardContent,
    IonCardHeader,
    IonButton,
    IonToolbar,
    IonTitle,
    IonInput,
    IonItem,
    IonLabel,
    IonHeader,
    IonContent,

} from "@ionic/react";
import { Delete, Edit, Add } from '@mui/icons-material';
import baseUrl, { api } from '../../../pages/Urls';

import { ErrorMessage } from '@hookform/error-message';
import swal from 'sweetalert';
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

type InstructorTable = {
    id: string;
    name: string;
    email: string;

};


const Instructor: FC = () => {
    const [instructor, setInstructor] = useState([]);
    const [modalOpen, setModalOpen] = useState(false);
    const [instructorData, setInstructorData] = useState({});
    const fetchInstructor = () => {
        fetch(`${baseUrl}${api.allInstructor}`, {
            method: 'GET',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem("token")}`

            }
        })
            .then(resp => resp.json())
            .then(resp => {
                setInstructor(resp.reverse())
            })
    }
    useEffect(() => {
        fetchInstructor();
    }, [])

    const columns = useMemo<MRT_ColumnDef<InstructorTable>[]>(
        () => [


            {
                accessorKey: 'name',
                header: 'Instructor Name',

            },
            {
                accessorKey: 'email',
                header: 'Instructor Email',

            },

        ],
        [],
    );

    const deleteInstructor = (id: any) => {
        if (window.confirm('Are you sure?')) {
            fetch(`${baseUrl}${api.deleteInstructor}${id}`, {
                method: 'DELETE',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem("token")}`

                }

            })
                .then(res => {
                    if (res.status === 200) {
                        fetchInstructor();
                        swal({
                            title: "Success!",
                            text: "Instructor deleted successfully",
                            icon: "success",
                        });
                    } else {
                        swal({
                            title: "Error!",
                            text: res.status + ' ' + res.statusText +
                                " - Instructor not deleted",
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
                <h1 className='text-center mb-2'>List of Instructors</h1>
                <MaterialReactTable
                    columns={columns}
                    data={instructor}
                    getRowId={(row => `${row.id}`)}
                    enableRowActions
                    enableRowNumbers
                    positionActionsColumn="last"
                    enableColumnOrdering
                    renderRowActions={({ row, table }) => (
                        <Box sx={{ display: 'flex', gap: '1rem' }}>
                            <Tooltip arrow placement="left" title="Edit">
                                <IconButton onClick={() => {
                                    setInstructorData(row.original)
                                    setModalOpen(true);
                                }}>
                                    <Edit />
                                </IconButton>
                            </Tooltip>
                            <Tooltip arrow placement="right" title="Delete">
                                <IconButton color="error" onClick={() => deleteInstructor(row.id)}>
                                    <Delete />
                                </IconButton>
                            </Tooltip>
                        </Box>
                    )}
                    renderTopToolbarCustomActions={() => (
                        <Tooltip title="Add-Instructor">
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
                        setInstructorData({})
                    }}
                    fetchInstructor={() => fetchInstructor()}
                    instructorData={instructorData}

                />
            </div>
        </IonContent>

    );

};

const CreateOrEdit: FC<{
    onClose: () => void;
    fetchInstructor: () => void;
    open: boolean;
    instructorData: any
}> = (props) => {
    const [error, setError] = useState('');
    const type = Object.keys(props.instructorData).length == 0 ? "C" : "E";
    const formRef = useRef<HTMLFormElement>(null);
    const {
        register,
        reset,
        handleSubmit,
        formState: { errors },
    } = useForm({
        criteriaMode: "all",

    });
    const handleChange = (e: any) => {

        const eml = e.target.value;

        if (eml) {
            fetch(`${baseUrl}${api.checkUser}${eml}`, {
                method: 'GET',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',

                },
            })
                .then(resp => resp.json())
                .then(res => {
                    if (Object.keys(res).length != 0) {
                        setError('Email already exists')
                    } else {
                        setError('');
                    }
                })
        }

    }
    const addInstructor = (e: any) => {
        {

            fetch(`${baseUrl}${api.addInstructor}`, {
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
                        props.fetchInstructor();
                        props.onClose();
                        swal({
                            title: "Success!",
                            text: "Instructor Created successfully",
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
    const updateInstructor = (e: any) => {

        fetch(`${baseUrl}${api.updateInstructor}${e.id}`, {
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
                    props.fetchInstructor();
                    props.onClose();
                    swal({
                        title: "Success!",
                        text: "Instructor updated successfully",
                        icon: "success",
                    });
                } else {
                    swal({
                        title: "Error!",
                        text: res.status + ' ' + res.statusText + " - Instructor not Updated",
                        icon: "error",
                    });
                }

            })
            .catch(error => console.log('error', error));


    }
    const onSubmit = (e: any) => {

        type === "C" ? addInstructor(e) : updateInstructor(e);
    };
    useEffect(() => {
        setError('');
        {
            type === "E" ?
                reset({
                    id: props.instructorData.id,
                    name: props.instructorData.name,

                }) : reset({
                    id: '',
                    name: '',
                    email: ''
                })
        };
    }, [props.instructorData]);

    return (
        <Dialog open={props.open}>
            <DialogTitle textAlign="center">{type === "C" ? "Create" : "Edit"} Instructor</DialogTitle>
            <DialogContent>
                <form ref={formRef} onSubmit={handleSubmit(onSubmit)}>
                    <Stack
                        sx={{
                            width: '100%',
                            minWidth: { xs: '300px', sm: '360px', md: '400px' },

                        }}
                    >

                        <TextField sx={{ mt: 3 }}
                            type="text"
                            label="Instructor Name"
                            variant="filled"
                            focused

                            {...register("name", { required: "Instructor Name Is Required" })}
                        />
                        <p style={{ color: "red" }}>
                            <ErrorMessage errors={errors} name="name" />
                        </p>
                        {type === "E" ? '' :
                            <>
                                <TextField sx={{ mt: 3 }}
                                    type="email"
                                    label="Instructor Email"
                                    variant="filled"
                                    focused

                                    {...register("email", { required: "Email Is Required" })}
                                    onChange={(e: any) => handleChange(e)}
                                />

                                <p style={{ color: "red" }}>
                                    <ErrorMessage errors={errors} name="email" />
                                    {error ? error : ''}
                                </p>
                            </>
                        }

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

export default Instructor;