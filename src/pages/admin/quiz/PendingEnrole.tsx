import React, { FC, useMemo, useState, useEffect } from 'react';

import MaterialReactTable, {
    MRT_ColumnDef,

} from 'material-react-table';
import {
    Box,
    IconButton,
    Tooltip,
} from '@mui/material';
import { Approval, Input } from '@mui/icons-material';
import baseUrl, { api } from '../../../pages/Urls';
import { IonContent } from '@ionic/react';
import swal from 'sweetalert';
type CourseData = {
    id: string;
    name: string;
    course_name: string;
    description: string;
    is_enrole: any;

};


const PendingEnrole: FC = () => {
    const [course, setCourse] = useState([]);

    const fetchCourse = () => {
        fetch(`${baseUrl}${api.allPending}`, {
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
                accessorKey: 'name',
                header: 'User Name',

            },
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

    const approveEnrolement = (id: any) => {
        if (window.confirm('Want to Approve?')) {
            fetch(`${baseUrl}${api.approve}${id}`, {
                method: 'PUT',
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
                            text: "Enrole approved successfully",
                            icon: "success",
                        });
                    }
                    else {
                        swal({
                            title: "Error!",
                            text: response.status + ' ' + response.statusText + " - Enrole not approved",
                            icon: "error",
                        });
                    }
                })

                .catch(error => console.log('error', error));

        }

    }
    const disapproveEnrolement = (id: any) => {
        if (window.confirm('Want to disapproved?')) {
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
                            text: "Enrole disapproved successfully",
                            icon: "success",
                        });
                    }
                    else {
                        swal({
                            title: "Error!",
                            text: response.status + ' ' + response.statusText + " - Enrole disapproved unsuccessfull",
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
                <h1 className='text-center mb-2'>Pending Enrole Courses List</h1>
                <MaterialReactTable
                    columns={columns}
                    data={course}
                    getRowId={(row => `${row.id}`)}
                    enableRowNumbers
                    enableRowActions
                    positionActionsColumn="last"
                    enableColumnOrdering
                    renderRowActions={({ row, table }) => (
                        <Box sx={{ display: 'flex', gap: '1rem' }}>

                            <Tooltip arrow placement="right" title="Approve">
                                <IconButton style={{ color: "green" }} onClick={() => approveEnrolement(row.id)}>
                                    <Approval />
                                </IconButton>
                            </Tooltip>
                            <Tooltip arrow placement="right" title="disapprove">
                                <IconButton style={{ color: "red" }} onClick={() => disapproveEnrolement(row.id)}>
                                    <Approval />
                                </IconButton>
                            </Tooltip>

                        </Box>
                    )}

                />

            </div>
        </IonContent>

    );

};

export default PendingEnrole;