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
import { Add, Delete, Edit, Visibility } from '@mui/icons-material';
import baseUrl, { api } from '../../pages/Urls';
import { Collapse } from 'react-bootstrap';
import swal from 'sweetalert';
import Select from 'react-select';
import { useForm, Controller } from "react-hook-form";
import { ErrorMessage } from "@hookform/error-message";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
type levelData = {
    id: string;
    level_name: string;


};
const schema = yup.object().shape({
    level_name: yup.string()
        .required('Course Name is required'),
    ltopic: yup.array().required().min(1),

})

const TchrLevel: FC<{
    topic: any,
    level: any,
    course_name: string,
    fetchShowCourse: () => void
}> = (props) => {
    const [collapse, setCollapse] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);
    const [levelTopic, setLTopic] = useState([]);
    const [level_name, setLevel_name] = useState('');
    const [lvlId, setLvlId] = useState('');
    const [topicOptions, setTopicOptions] = useState([{}]);
    const type = lvlId ? "E" : "C";
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
            level_name: '',
            course_name: props.course_name,
            ltopic: [{}],

        },
        resolver: yupResolver(schema),
    });
    const columns = useMemo<MRT_ColumnDef<levelData>[]>(
        () => [


            {
                accessorKey: 'level_name',
                header: 'Level Name',

            },


        ],
        [],
    );
    useEffect(() => {
        setTopicOptions(props.topic.map((item: any) => ({
            label: item.topic_name,
            value: item.topic_name
        })))
    }, [props.topic])
    const editLevel = (id: any) => {
        setLvlId(id);
        fetch(`${baseUrl}${api.showLevel}${id}`, {
            method: 'GET',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem("token")}`

            }
        })
            .then(res => res.json())
            .then(result => {
                setValue('level_name', result.level.level_name);
                setValue('id', result.level.id);
                setValue('ltopic',

                    result.level.ltopic.map((lt: any) => ({
                        label: lt.topic_name,
                        value: lt.topic_name
                    }))

                );
                setLevel_name(result.level.level_name);
                setLTopic(

                    result.level.ltopic.map((lt: any) => (lt.topic_name))

                );
            })
            .catch(function (error) {
                console.log(error);
            })


    }
    const addLevel = (e: any) => {
        {

            fetch(`${baseUrl}${api.addLevel}`, {
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
                        setCollapse(false)
                        reset(
                            {
                                course_name: props.course_name,
                                level_name: '',
                                ltopic: [],
                            }

                        )
                        swal({
                            title: "Success!",
                            text: "Level Created successfully",
                            icon: "success",
                        });

                    } else {
                        swal({
                            title: "Error!",
                            text: response.status + ' ' + response.statusText + " - Level not Created",
                            icon: "error",
                        });
                    }

                })

                .catch(error => console.log('error', error));

        }
    }
    const updateLevel = (e: any) => {

        fetch(`${baseUrl}${api.updateLevel}${e.id}`, {
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
                    props.fetchShowCourse();
                    setCollapse(false);
                    swal({
                        title: "Success!",
                        text: "Level updated successfully",
                        icon: "success",
                    });
                } else {
                    swal({
                        title: "Error!",
                        text: res.status + ' ' + res.statusText +
                            " - level not updated",
                        icon: "error",
                    });
                }

            })
            .catch(error => console.log('error', error));


    }
    const deleteLevel = (id: any) => {
        if (window.confirm('Are you sure?')) {
            fetch(`${baseUrl}${api.deleteLevel}${id}`, {
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
                            text: "Level deleted successfully",
                            icon: "success",
                        });
                    } else {
                        swal({
                            title: "Error!",
                            text: res.status + ' ' + res.statusText +
                                " - Level not deleted",
                            icon: "error",
                        });
                    }
                })
                .catch(error => console.log('error', error));
        }
    }

    const onSubmit = (e: any) => {
        type === "C" ? addLevel(e) : updateLevel(e);
    }
    return (

        <div className="container mt-2">
            <IonItem>
                <IonLabel color="primary">
                    <h1>{props.course_name}</h1>
                </IonLabel>
            </IonItem>


            <Collapse in={collapse}>
                <div id="collapseID">
                    <div className="container mt-5 mb-5 ">

                        <IonCard>
                            <IonCardHeader>
                                <IonCardTitle>
                                    <IonToolbar>
                                        <IonTitle><h1 className="text-center display-6">{type === "C" ? "Create" : "Edit"} Level</h1></IonTitle>
                                    </IonToolbar>
                                </IonCardTitle>
                            </IonCardHeader>
                            <hr />
                            <IonCardContent>
                                <form onSubmit={handleSubmit(onSubmit)}>
                                    <IonItem>
                                        <IonLabel position="stacked">Level Name</IonLabel>
                                        <IonInput
                                            placeholder="level Name"
                                            type="text"
                                            {...register("level_name", { required: "Level Name Is Required" })}
                                        >
                                        </IonInput>
                                    </IonItem>
                                    <p style={{ color: "red" }}>
                                        <ErrorMessage errors={errors} name="level_name" />
                                    </p>
                                    <IonItem>
                                        <IonLabel position="stacked">Topic</IonLabel>
                                        <div className="mt-2" style={{ width: '100%' }}>

                                            <Controller
                                                control={control}
                                                name="ltopic"

                                                render={() => (
                                                    <Select

                                                        menuPortalTarget={document.body}
                                                        options={topicOptions}
                                                        placeholder={<i className="bi bi-search"> Select Topic</i>}
                                                        value={getValues('ltopic')}
                                                        onChange={(e: any) => setValue('ltopic', e)}
                                                        isMulti

                                                    />

                                                )}

                                            />
                                        </div>


                                    </IonItem>

                                    <p style={{ color: "red" }}>
                                        <ErrorMessage errors={errors} name="ltopic" /></p>

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
            <h1 className='text-center mb-2'>List of Levels</h1>
            <MaterialReactTable
                columns={columns}
                data={props.level}
                getRowId={(row => `${row.id}`)}
                enableRowActions
                enableRowNumbers
                enableColumnOrdering
                renderRowActions={({ row, table }) => (
                    <Box sx={{ display: 'flex', gap: '1rem' }}>
                        <Tooltip arrow placement="left" title="Edit" >
                            <IconButton aria-expanded={collapse} aria-controls="collapseID" onClick={() => {
                                editLevel(row.id)
                                setCollapse(!collapse)
                                clearErrors([
                                    'level_name',
                                    'ltopic',

                                ])
                            }}>

                                <Edit />
                            </IconButton>
                        </Tooltip>
                        <Tooltip arrow placement="left" title="View" >
                            <IconButton onClick={() => {
                                editLevel(row.id)
                                setModalOpen(true);

                            }}>

                                <Visibility />
                            </IconButton>
                        </Tooltip>
                        <Tooltip arrow placement="right" title="Delete">
                            <IconButton color="error" onClick={() => deleteLevel(row.id)}>
                                <Delete />
                            </IconButton>
                        </Tooltip>
                    </Box>
                )}
                renderTopToolbarCustomActions={() => (
                    <Tooltip title="Add-Level">
                        <IconButton aria-expanded={collapse} onClick={() => {
                            setCollapse(!collapse)
                            setLvlId('')
                            reset({
                                course_name: props.course_name,
                                level_name: '',
                                ltopic: topicOptions?.slice(0, 1),


                            })
                        }}>
                            Create <Add />
                        </IconButton>
                    </Tooltip>
                )}
            />
            <ViewLevel
                open={modalOpen}
                onClose={() => {
                    setModalOpen(false)

                }}
                level_name={level_name}
                level_topic={levelTopic}
            />
        </div>


    );

};

const ViewLevel: FC<{
    onClose: () => void;

    open: boolean;
    level_name: string;
    level_topic: any

}> = (props) => {

    return (
        <Dialog open={props.open}>
            <DialogTitle textAlign="center">View Level</DialogTitle>
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
                            <h2 className="mb-3">Level Name</h2>
                            <p>{props.level_name}</p>
                        </IonLabel>
                    </IonItem>
                    <IonItem >
                        <IonLabel>
                            <h2 className="mb-3">Level Topics</h2>
                            {props.level_topic.map((item: any, i: any) =>
                                <p className="mt-3" key={i.toString()}> {i + 1}. {item}</p>
                            )}
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
export default TchrLevel;