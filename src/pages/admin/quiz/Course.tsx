import React, { FC, useMemo, useState, useEffect } from 'react';
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
import MaterialReactTable, {
    MRT_ColumnDef,

} from 'material-react-table';
import {
    Box,
    IconButton,
    Tooltip,
} from '@mui/material';
import { Delete, Edit, Add } from '@mui/icons-material';
import baseUrl, { api } from '../../../pages/Urls';
import { Collapse } from 'react-bootstrap';
import swal from 'sweetalert';
import Select from 'react-select';
import { useForm, Controller } from "react-hook-form";
import { ErrorMessage } from "@hookform/error-message";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
type CourseData = {
    id: string;
    course_name: string;
    description: string;

};

const schema = yup.object().shape({
    course_name: yup.string()
        .required('Course Name is required'),
    crs_inst: yup.array().required().min(1),

})
const Course: FC = () => {
    const [course, setCourse] = useState([]);
    const [instructor, setInstructor] = useState([]);
    const [collapse, setCollapse] = useState(false);
    const [crsId, setCrsId] = useState('');
    const type = crsId ? "E" : "C";
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
            course_name: '',
            description: '',
            crs_inst: [{}],

        },
        resolver: yupResolver(schema),
    });

    const fetchCourse = () => {
        fetch(`${baseUrl}${api.allCourse}`, {
            method: 'GET',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem("token")}`

            }
        })
            .then(resp => resp.json())
            .then(resp => {
                setCourse(resp.reverse())
            })
    }
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
                setInstructor(resp.map((item: any) => ({

                    label: item.name + ' ( ' + item.email + ' ) ',

                    value: item.id
                })))
            })
    }
    useEffect(() => {
        fetchCourse();
        fetchInstructor();
    }, [])

    const columns = useMemo<MRT_ColumnDef<CourseData>[]>(
        () => [

            {
                accessorKey: 'course_name',
                header: 'Course Name',

            },
            {
                accessorKey: 'description',
                header: 'Description',

            },

        ],
        [],
    );
    const editCourse = (id: any) => {
        setCrsId(id);
        fetch(`${baseUrl}${api.editCourse}${id}`, {
            method: 'GET',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem("token")}`

            }
        })
            .then(res => res.json())
            .then(result => {
                setValue('course_name', result.course.course_name);
                setValue('description', result.course.description);
                setValue('id', result.course.id);

                setValue('crs_inst',
                    result.course.instructor.map((ins: any) => ({
                        label: ins.name + ' ( ' + ins.email + ' ) ',
                        value: ins.id
                    })));
            })
            .catch(function (error) {
                console.log(error);
            })


    }
    const addCourse = (e: any) => {
        {

            fetch(`${baseUrl}${api.addCourse}`, {
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

                        setCollapse(false)
                        fetchCourse();
                        swal({
                            title: "Success!",
                            text: "Course Created successfully",
                            icon: "success",
                        });

                    } else {
                        swal({
                            title: "Error!",
                            text: response.status + ' ' + response.statusText + " - Course not Created",
                            icon: "error",
                        });
                    }

                })

                .catch(errors => console.log(errors.response.data.errors));

        }
    }
    const updateCourse = (e: any) => {

        fetch(`${baseUrl}${api.updateCourse}${e.id}`, {
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

                    fetchCourse();
                    setCollapse(false)
                    swal({
                        title: "Success!",
                        text: "Course updated successfully",
                        icon: "success",
                    });

                } else {
                    swal({
                        title: "Error!",
                        text: res.status + ' ' + res.statusText + " - Course not updated",
                        icon: "error",
                    });
                }

            })
            .catch(error => console.log('error', error));


    }
    const deleteCourse = (id: any) => {
        if (window.confirm('Are you sure?')) {
            fetch(`${baseUrl}${api.deleteCourse}${id}`, {
                method: 'DELETE',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem("token")}`

                }

            })

                .then(res => {
                    if (res.status === 200) {
                        fetchCourse();
                        swal({
                            title: "Success!",
                            text: "Course deleted successfully",
                            icon: "success",
                        });
                    } else {
                        swal({
                            title: "Error!",
                            text: res.status + ' ' + res.statusText + " - Course not deleted",
                            icon: "error",
                        });
                    }
                })
                .catch(error => console.log('error', error));
        }
    }
    const onSubmit = (e: any) => {
        type === "C" ? addCourse(e) : updateCourse(e);
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
                                            <IonTitle><h1 className="text-center display-6">{type === "C" ? "Create" : "Edit"} Course</h1></IonTitle>
                                        </IonToolbar>
                                    </IonCardTitle>
                                </IonCardHeader>
                                <hr />
                                <IonCardContent>
                                    <form onSubmit={handleSubmit(onSubmit)}>
                                        <IonItem>
                                            <IonLabel position="stacked">Course Name</IonLabel>
                                            <IonInput
                                                placeholder="Course Name"
                                                type="text"
                                                {...register("course_name")}
                                            ></IonInput>

                                        </IonItem>
                                        <p style={{ color: "red" }}>
                                            <ErrorMessage errors={errors} name="course_name" />
                                        </p>

                                        <IonItem>
                                            <IonLabel position="stacked">Description</IonLabel>
                                            <IonInput type="text"
                                                placeholder="Course description"

                                                {...register("description")}
                                            >
                                            </IonInput>
                                        </IonItem>

                                        <IonItem >
                                            <IonLabel position="stacked">Course Instructor</IonLabel>
                                            <div className="mt-2" style={{ width: '100%' }}>

                                                <Controller
                                                    control={control}
                                                    name="crs_inst"

                                                    render={() => (
                                                        <Select

                                                            menuPortalTarget={document.body}
                                                            options={instructor}
                                                            placeholder={<i className="bi bi-search"> Select Instructor</i>}
                                                            value={getValues('crs_inst')}
                                                            onChange={(e: any) => setValue('crs_inst', e)}
                                                            isMulti

                                                        />

                                                    )}

                                                />
                                            </div>
                                            {/* <IonSelect

                                                {...register("crs_inst", { required: "Course Instructor Is Required" })}

                                                placeholder="Select instructors" multiple={true}>
                                                {instructor.map((item: any, i: any) => (
                                                    < IonSelectOption key={i.toString()}>{item.name}</IonSelectOption>
                                                ))}
                                            </IonSelect> */}

                                        </IonItem>
                                        <p style={{ color: "red" }}>
                                            <ErrorMessage errors={errors} name="crs_inst" /></p>

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

                <h1 className='text-center mb-2'>List of Courses</h1>
                <MaterialReactTable
                    columns={columns}
                    data={course}
                    getRowId={(row => `${row.id}`)}
                    enableRowActions
                    positionActionsColumn="last"
                    enableRowNumbers
                    enableColumnOrdering
                    renderRowActions={({ row, table }) => (
                        <Box sx={{ display: 'flex', gap: '1rem' }}>
                            <Tooltip arrow placement="left" title="Edit" >
                                <IconButton aria-expanded={collapse} aria-controls="collapseID" onClick={() => {
                                    editCourse(row.id)
                                    setCollapse(!collapse)
                                    clearErrors([
                                        'course_name',
                                        'description',
                                        'crs_inst',

                                    ])
                                }}>

                                    <Edit />
                                </IconButton>
                            </Tooltip>

                            <Tooltip arrow placement="right" title="Delete">
                                <IconButton color="error" onClick={() => deleteCourse(row.id)}>
                                    <Delete />
                                </IconButton>
                            </Tooltip>
                        </Box>
                    )}
                    renderTopToolbarCustomActions={() => (
                        <Tooltip title="Add-Course">
                            <IconButton aria-expanded={collapse} onClick={() => {
                                setCollapse(!collapse)
                                setCrsId('')
                                reset({
                                    course_name: '',
                                    description: '',
                                    crs_inst: [],

                                })
                            }}>
                                Create <Add />
                            </IconButton>
                        </Tooltip>
                    )}
                />

            </div>
        </IonContent>

    );

};



export default Course;