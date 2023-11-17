import React, { FC, useMemo, useState, useEffect, useRef } from 'react';
import { useForm } from "react-hook-form";
import MaterialReactTable, {
    MRT_ColumnDef,
} from 'material-react-table';
import baseUrl, { api } from '../../../pages/Urls';
import { IonContent } from '@ionic/react';

type GroupTable = {
    id: string;
    course_name: string;
    quiz_name: string;
    total_question: string;
    total_point: string;

};

const MyQuizResult: FC = () => {
    const [result, setResult] = useState([]);

    const fetchResult = () => {
        fetch(`${baseUrl}${api.results}`, {
            method: 'GET',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem("token")}`

            }
        })
            .then(resp => resp.json())
            .then(resp => {
                setResult(resp.reverse())
            })
    }
    useEffect(() => {
        fetchResult();
    }, [])

    const columns = useMemo<MRT_ColumnDef<GroupTable>[]>(
        () => [

            {
                accessorKey: 'course_name',
                header: 'Course Name',

            },
            {
                accessorKey: 'quiz_name',
                header: 'Quiz Name',

            },
            {
                accessorKey: 'total_question',
                header: 'Total Question',

            },
            {
                accessorKey: 'total_point',
                header: 'Total Points',

            },

        ],
        [],
    );


    return (
        <IonContent>
            <div className="container mt-5">
                <h1 className='text-center mb-2'>Quiz Results</h1>
                <MaterialReactTable
                    columns={columns}
                    data={result}
                    getRowId={(row => `${row.id}`)}
                    //enableRowActions
                    positionActionsColumn="last"
                    enableRowNumbers

                />

            </div>
        </IonContent>

    );

};


export default MyQuizResult;