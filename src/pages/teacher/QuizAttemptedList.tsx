import React, { FC, useMemo, useState, useEffect } from 'react';
import MaterialReactTable, {
    MRT_ColumnDef,

} from 'material-react-table';
import {
    Box,
    IconButton,
    Tooltip,
} from '@mui/material';
import { Autorenew } from '@mui/icons-material';
import baseUrl, { api } from '../../pages/Urls';
import { IonContent, IonItem, IonLabel } from '@ionic/react';
import swal from 'sweetalert';
type listData = {
    id: string;
    quiz_name: string;
    name: string;
    total_point: string;
    total_question: string;

};

const QuizAttemptedList: FC<{

    courseId: string
    course_name: string
}> = (props) => {
    const [attemptList, setAttemptList] = useState([]);

    const fetchAtmList = () => {
        fetch(`${baseUrl}${api.attemptHistory}${props.courseId}`, {
            method: 'GET',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem("token")}`

            }
        })
            .then(resp => resp.json())
            .then(result => {
                setAttemptList(result)

            })
    }
    useEffect(() => {
        fetchAtmList();

    }, [])

    const columns = useMemo<MRT_ColumnDef<listData>[]>(
        () => [


            {
                accessorKey: 'quiz_name',
                header: 'Quiz Name',

            },
            {
                accessorKey: 'name',
                header: 'User Name',

            },
            {

                accessorFn: (row) => `${row.total_point} / ${row.total_question}`,
                id: 'total_point',
                header: 'Total Mark',

            },



        ],
        [],
    );

    const reAttempt = (id: any) => {
        if (window.confirm('Are you sure?')) {

            fetch(`${baseUrl}${api.reAttempt}${id}`, {
                method: 'PUT',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem("token")}`

                },

            }).then(res => {
                if (res.status === 200) {

                    fetchAtmList();
                    swal({
                        title: "Success!",
                        text: "Quiz reattempted successfully",
                        icon: "success",
                    });
                } else {
                    swal({
                        title: "Error!",
                        text: res.status + ' ' + res.statusText +
                            " - Quiz not reattempted",
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
            <h1 className='text-center mb-2'>Quiz Attempted List</h1>
            <MaterialReactTable
                columns={columns}
                data={attemptList}
                getRowId={(row => `${row.id}`)}
                enableRowActions
                enableRowNumbers
                enableColumnOrdering
                renderRowActions={({ row, table }) => (
                    <Box sx={{ display: 'flex', gap: '1rem' }}>

                        <Tooltip arrow placement="right" title="Re-attempt">
                            <IconButton style={{ color: "green" }} onClick={() => reAttempt(row.id)}>
                                <Autorenew />
                            </IconButton>
                        </Tooltip>
                    </Box>
                )}

            />

        </div>


    );

};

export default QuizAttemptedList;