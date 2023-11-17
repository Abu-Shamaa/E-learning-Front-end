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
import baseUrl, { api } from '../../../pages/Urls';
import { IonContent } from '@ionic/react';
import swal from 'sweetalert';
import { ErrorMessage } from "@hookform/error-message";
type Group = {
    id: string;
    topic_name: string;
    course_name: string;

};


const Topic: FC = () => {
    const [topic, setTopic] = useState([]);
    const [topicData, setTopicData] = useState({});
    const [modalOpen, setModalOpen] = useState(false);
    const fetchTopic = () => {
        fetch(`${baseUrl}${api.allTopic}`, {
            method: 'GET',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem("token")}`

            }
        })
            .then(resp => resp.json())
            .then(resp => {
                setTopic(resp.reverse())
            })
    }
    useEffect(() => {
        fetchTopic();
    }, [])

    const columns = useMemo<MRT_ColumnDef<Group>[]>(
        () => [


            {
                accessorKey: 'course_name',
                header: 'Course Name',

            },
            {
                accessorKey: 'topic_name',
                header: 'Topic Name',

            },

        ],
        [],
    );

    const deleteTopic = (id: any) => {
        if (window.confirm('Are you sure?')) {
            fetch(`${baseUrl}${api.deleteTopic}${id}`, {
                method: 'DELETE',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem("token")}`

                }

            })

                .then(res => {
                    if (res.status === 200) {
                        fetchTopic();
                        swal({
                            title: "Success!",
                            text: "Topic deleted successfully",
                            icon: "success",
                        });
                    } else {
                        swal({
                            title: "Error!",
                            text: res.status + ' ' + res.statusText +
                                " - Topic not deleted",
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
                <h1 className='text-center mb-2'>List of Topics</h1>
                <MaterialReactTable
                    columns={columns}
                    data={topic}
                    getRowId={(row => `${row.id}`)}
                    enableRowActions
                    positionActionsColumn="last"
                    enableRowNumbers
                    enableColumnOrdering
                    renderRowActions={({ row, table }) => (
                        <Box sx={{ display: 'flex', gap: '1rem' }}>
                            <Tooltip arrow placement="left" title="Edit">
                                <IconButton onClick={() => {
                                    setTopicData(row.original)
                                    setModalOpen(true);
                                }}>
                                    <Edit />
                                </IconButton>
                            </Tooltip>

                            <Tooltip arrow placement="right" title="Delete">
                                <IconButton color="error" onClick={() => deleteTopic(row.id)}>
                                    <Delete />
                                </IconButton>
                            </Tooltip>
                        </Box>
                    )}

                />
                <EditTopic
                    open={modalOpen}
                    onClose={() => {
                        setModalOpen(false)

                    }}
                    fetchTopic={() => fetchTopic()}
                    topicData={topicData}
                />
            </div>
        </IonContent>

    );

};

const EditTopic: FC<{
    onClose: () => void;
    fetchTopic: () => void;
    open: boolean;
    topicData: any

}> = (props) => {
    const [topic_name, setTopic_name] = useState('');
    const [error, setError] = useState("");
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
            topic_name: '',


        },

    });

    useEffect(() => {
        setValue('topic_name', props.topicData.topic_name);
        setValue('id', props.topicData.id);
    }, [props.topicData])

    const updateTopic = (e: any) => {

        fetch(`${baseUrl}${api.updateTopic}${e.id}`, {
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
                    props.fetchTopic();
                    props.onClose();
                    swal({
                        title: "Success!",
                        text: "Topic updated successfully",
                        icon: "success",
                    });
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
    return (
        <Dialog open={props.open}>
            <form onSubmit={handleSubmit(updateTopic)}>
                <DialogTitle textAlign="center">Edit Topic</DialogTitle>
                <DialogContent>

                    <Stack
                        sx={{
                            width: '100%',
                            minWidth: { xs: '300px', sm: '360px', md: '400px' },
                            gap: '1.5rem',
                        }}
                    >

                        <TextField sx={{ mt: 3 }}
                            type="text"
                            label="Toppic Name"
                            variant="filled"
                            focused
                            {...register("topic_name", { required: 'Topic Name is required' })} />
                        <p style={{ color: "red" }}>
                            <ErrorMessage errors={errors} name="topic_name" />
                        </p>

                    </Stack>

                </DialogContent>
                <DialogActions sx={{ p: '1.25rem' }}>
                    <Button onClick={props.onClose}>Cancel</Button>
                    <Button color="secondary" variant="contained" type='submit'>
                        Save
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    );
}

export default Topic;