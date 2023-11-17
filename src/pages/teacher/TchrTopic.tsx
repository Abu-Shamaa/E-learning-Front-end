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
    TextField,
    Tooltip,
} from '@mui/material';
import { Delete, RemoveRedEye, Add } from '@mui/icons-material';
import baseUrl, { api } from '../../pages/Urls';
import { IonContent, IonItem, IonLabel } from '@ionic/react';
import { Link } from 'react-router-dom';
import { useForm } from "react-hook-form";
import swal from 'sweetalert';
type topicData = {

    id: string;
    topic_name: string;


};


const TchrTopic: FC<{

    topic: any
    course_name: string
    courseId: string
    fetchShowCourse: () => void;
}> = (props) => {

    const [modalOpen, setModalOpen] = useState(false);


    const columns = useMemo<MRT_ColumnDef<topicData>[]>(
        () => [


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

                        props.fetchShowCourse();
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

        <div className="container mt-2">
            <IonItem>
                <IonLabel color="primary">
                    <h1>{props.course_name}</h1>
                </IonLabel>
            </IonItem>
            <h1 className='text-center mb-2'>List of Topics</h1>
            <MaterialReactTable
                columns={columns}
                data={props.topic}
                getRowId={(row => `${row.id}`)}
                enableRowActions
                enableRowNumbers
                renderRowActions={({ row, table }) => (
                    <Box sx={{ display: 'flex', gap: '1rem' }}>
                        <Tooltip arrow placement="left" title="View">
                            <IconButton>
                                <Link className='text-decoration-none' to={`/dashboard/mycourse/${props.courseId}/topic/${row.id}`}>  <RemoveRedEye /></Link>
                            </IconButton>

                        </Tooltip>
                        <Tooltip arrow placement="right" title="Delete">
                            <IconButton color="error" onClick={() => deleteTopic(row.id)}>
                                <Delete />
                            </IconButton>
                        </Tooltip>
                    </Box>
                )}
                renderTopToolbarCustomActions={() => (
                    <Tooltip title="Add-Course">
                        <IconButton onClick={() => setModalOpen(true)}>
                            Create <Add />
                        </IconButton>
                    </Tooltip>
                )}
            />
            <CreateTopic
                open={modalOpen}
                onClose={() => {
                    setModalOpen(false)

                }}
                fetchShowCourse={() => props.fetchShowCourse()}
                course_name={props.course_name}
            />
        </div>


    );

};

const CreateTopic: FC<{
    onClose: () => void;
    fetchShowCourse: () => void;
    open: boolean;
    course_name: string
}> = (props) => {

    const {
        handleSubmit,
        register,
        formState: { errors },
        reset,

    } = useForm({
        defaultValues: {
            course_name: props.course_name,
            topic_name: '',

        }
    });
    const addTopic = (e: any) => {


        fetch(`${baseUrl}${api.addTopic}`, {
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
                    //console.log(response.status.message)
                    props.fetchShowCourse();
                    props.onClose();
                    reset(
                        {
                            course_name: props.course_name,
                            topic_name: '',

                        }

                    )
                    swal({
                        title: "Success!",
                        text: "Topic Created successfully",
                        icon: "success",
                    });
                }
                else {
                    throw Error([response.status, response.statusText].join(' '));
                }
            })


    }

    return (
        <Dialog open={props.open}>
            <form onSubmit={handleSubmit(addTopic)}>
                <DialogTitle textAlign="center">Create Topic</DialogTitle>
                <DialogContent>
                    <Stack
                        sx={{
                            width: '100%',
                            minWidth: { xs: '300px', sm: '360px', md: '400px' },

                        }}
                    >

                        <TextField sx={{ mt: 3 }}
                            type="text"
                            label="Toppic Name"
                            variant="filled"
                            focused
                            {...register("topic_name", { required: "Topic Name Is Required" })} />
                        <p style={{ color: "red" }}>
                            {errors?.topic_name && errors.topic_name.message}
                        </p>

                    </Stack>

                </DialogContent>
                <DialogActions sx={{ p: '1.25rem' }}>
                    <Button onClick={props.onClose}>Cancel</Button>
                    <Button color="secondary" variant="contained" type="submit">
                        Create
                    </Button>
                </DialogActions>
            </form>
        </Dialog >
    );
}

export default TchrTopic;