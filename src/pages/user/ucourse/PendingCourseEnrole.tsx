import React, { FC, useMemo, useState, useEffect } from 'react';
import MaterialReactTable, {
    MRT_ColumnDef,

} from 'material-react-table';
import {
    Box,
    IconButton,
    Tooltip,
} from '@mui/material';
import baseUrl, { api } from '../../../pages/Urls';
import { IonContent } from '@ionic/react';
import { Delete } from '@mui/icons-material';
import swal from 'sweetalert';
type CourseData = {
    id: string;
    course_name: string;
    description: string;
    is_enrole: any;

};

const PendingCourseEnrole: FC = () => {
    const [course, setCourse] = useState([]);


    const fetchCourse = () => {
        fetch(`${baseUrl}${api.pendingEnrole}`, {
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

    const removeEnrolement = (id: any) => {
        if (window.confirm('Want to remove this enrolement?')) {
            fetch(`${baseUrl}${api.disapprove}${id}`, {
                method: 'DELETE',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem("token")}`
                },


            })
                .then(response => {
                    if (response.status === 200) {

                        fetchCourse();
                        swal({
                            title: "Success!",
                            text: "Enrolement removed successfully",
                            icon: "success",
                        });
                    }
                    else {
                        swal({
                            title: "Error!",
                            text: response.status + ' ' + response.statusText +
                                " - Enrolement not removed",
                            icon: "error",
                        });
                    }
                })

                .catch(error => console.log('error', error));

        }

    }

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
            {
                accessorKey: 'is_enrole',
                header: 'Status',
                Cell: ({ cell }) => (
                    cell.getValue<any>() === 0 && 'Pending'

                ),
            },

        ],
        [],
    );


    return (
        <IonContent>
            <div className="container mt-5">
                <h1 className='text-center mb-2'>Pending Enrole Courses</h1>
                <MaterialReactTable
                    columns={columns}
                    data={course}
                    getRowId={(row => `${row.id}`)}
                    enableRowNumbers
                    enableColumnOrdering
                    positionActionsColumn="last"
                    enableRowActions
                    renderRowActions={({ row, table }) => (
                        <Box sx={{ display: 'flex', gap: '1rem' }}>

                            <Tooltip arrow placement="right" title="remove">
                                <IconButton style={{ color: "red" }} onClick={() => removeEnrolement(row.id)}>
                                    <Delete />
                                </IconButton>
                            </Tooltip>

                        </Box>
                    )}

                />

            </div>
        </IonContent>

    );

};

export default PendingCourseEnrole;