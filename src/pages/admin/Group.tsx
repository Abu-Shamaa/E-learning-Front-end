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
type GroupTable = {
    id: string;
    name: string;

};



const GroupComponent: FC = () => {
    const [group, setGroup] = useState([]);
    const [groupData, setGroupData] = useState({});
    const [modalOpen, setModalOpen] = useState(false);
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
                setGroup(resp.reverse())
            })
    }
    useEffect(() => {
        fetchGroup();
    }, [])

    const columns = useMemo<MRT_ColumnDef<GroupTable>[]>(
        () => [

            {
                accessorKey: 'name',
                header: 'Name',

            },

        ],
        [],
    );

    const deleteGroup = (id: any) => {
        if (window.confirm('Are you sure?')) {
            fetch(`${baseUrl}${api.deleteGroup}${id}`, {
                method: 'DELETE',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem("token")}`

                }

            })

                .then(res => {
                    if (res.status === 200) {
                        fetchGroup();
                        swal({
                            title: "Success!",
                            text: "Group deleted successfully",
                            icon: "success",
                        });
                    } else {
                        swal({
                            title: "Error!",
                            text: res.status + ' ' + res.statusText +
                                " - Group not deleted",
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
                <h1 className='text-center mb-2'>List of Groups</h1>
                <MaterialReactTable
                    columns={columns}
                    data={group}
                    getRowId={(row => `${row.id}`)}
                    enableRowActions
                    positionActionsColumn="last"
                    enableRowNumbers
                    renderRowActions={({ row, table }) => (
                        <Box sx={{ display: 'flex', gap: '1rem' }}>
                            <Tooltip arrow placement="left" title="Edit">
                                <IconButton onClick={() => {
                                    setGroupData(row.original)
                                    setModalOpen(true);

                                }}>
                                    <Edit />
                                </IconButton>
                            </Tooltip>
                            <Tooltip arrow placement="right" title="Delete">
                                <IconButton color="error" onClick={() => deleteGroup(row.id)}>
                                    <Delete />
                                </IconButton>
                            </Tooltip>
                        </Box>
                    )}
                    renderTopToolbarCustomActions={() => (
                        <Tooltip title="Add-group">
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
                        setGroupData({})

                    }}
                    fetchGroup={() => fetchGroup()}
                    groupData={groupData}

                />
            </div>
        </IonContent>

    );

};

const CreateOrEdit: FC<{
    onClose: () => void;
    fetchGroup: () => void;
    open: boolean;
    groupData: any
}> = (props) => {
    const [error, setError] = useState('');
    const type = Object.keys(props.groupData).length == 0 ? "C" : "E";
    const formRef = useRef<HTMLFormElement>(null);
    const {
        register,
        reset,
        handleSubmit,
        formState: { errors },
    } = useForm({
        criteriaMode: "all",

    });
    const addGroup = (e: any) => {
        {


            fetch(`${baseUrl}${api.addGroup}`, {
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
                        props.fetchGroup();
                        props.onClose();
                        swal({
                            title: "Success!",
                            text: "Group Created successfully",
                            icon: "success",
                        });
                    } else if (response.status === 422) {
                        setError('The name has already been taken ')
                    }
                    else {
                        swal({
                            title: "Error!",
                            text: response.status + ' ' + response.statusText + " - Group not Created",
                            icon: "error",
                        });
                    }
                })
                .catch(res => {
                    if (res.status === 422) {
                        setError(res.error)
                    }
                })
            // .catch(error => console.log('error', error));

        }
    }

    const updateGroup = (e: any) => {

        fetch(`${baseUrl}${api.updateGroup}${e.id}`, {
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
                    props.fetchGroup();
                    props.onClose();
                    swal({
                        title: "Success!",
                        text: "Group updated successfully",
                        icon: "success",
                    });

                } else {
                    swal({
                        title: "Error!",
                        text: res.status + ' ' + res.statusText + " - Group not Updated",
                        icon: "error",
                    });
                }

            })
            .catch(error => console.log('error', error));


    }
    const onSubmit = (e: any) => {

        type === "C" ? addGroup(e) : updateGroup(e);
    };
    useEffect(() => {
        setError('');
        {
            type === "E" ?
                reset({
                    id: props.groupData.id,
                    name: props.groupData.name,

                }) : reset({
                    id: '',
                    name: ''
                })
        };
    }, [props.groupData]);

    return (
        <Dialog open={props.open}>
            <DialogTitle textAlign="center">{type === "C" ? "Create" : "Edit"} Group</DialogTitle>
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
                            label="Group Name"
                            variant="filled"
                            focused

                            {...register("name", { required: "Group Name Is Required" })}
                        />
                        <p style={{ color: "red" }}>
                            <ErrorMessage errors={errors} name="name" />
                            {error ? error : ''}
                        </p>

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

export default GroupComponent;