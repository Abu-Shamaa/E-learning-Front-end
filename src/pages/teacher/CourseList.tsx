import React, { FC, useMemo, useState, useEffect } from 'react';
import MaterialReactTable, {
    MRT_ColumnDef,

} from 'material-react-table';
import {
    Box,
    IconButton,
    Tooltip,
} from '@mui/material';
import { Input } from '@mui/icons-material';
import baseUrl, { api } from '../../pages/Urls';
import { IonContent } from '@ionic/react';
import swal from 'sweetalert';
type CourseData = {
    id: string;
    course_name: string;
    description: string;

};


const CourseList: FC = () => {
    const [course, setCourse] = useState([]);

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
    useEffect(() => {
        fetchCourse();

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

    const enroleCourse = (id: any) => {
        if (window.confirm('Want to enrole this course?')) {

            let data = {
                'course_id': id,
            }
            fetch(`${baseUrl}${api.courseEnrole}`, {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem("token")}`
                },
                body: JSON.stringify(data),

            })

                .then(response => {
                    if (response.status === 200) {
                        fetchCourse();
                        swal({
                            title: "Success!",
                            text: "Please wait for aproval",
                            icon: "success",
                        });
                    }
                    else {
                        swal({
                            title: "Error!",
                            text: response.status + ' ' + response.statusText +
                                " - Course not enroled",
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
                <h1 className='text-center mb-2'>List of Courses</h1>
                {localStorage.getItem("role") == 'ar_instructor' ?
                    <MaterialReactTable
                        columns={columns}
                        data={course}
                        getRowId={(row => `${row.id}`)}
                        enableRowNumbers
                        enableColumnOrdering

                    />
                    :
                    <MaterialReactTable
                        columns={columns}
                        data={course}
                        getRowId={(row => `${row.id}`)}
                        enableRowActions
                        enableRowNumbers
                        enableColumnOrdering
                        renderRowActions={({ row, table }) => (
                            <Box sx={{ display: 'flex', gap: '1rem' }}>

                                <Tooltip arrow placement="right" title="Enrole-course">
                                    <IconButton style={{ color: "green" }} onClick={() => enroleCourse(row.id)}>
                                        <Input />
                                    </IconButton>
                                </Tooltip>

                            </Box>
                        )}

                    />
                }


            </div>
        </IonContent>

    );

};

export default CourseList;