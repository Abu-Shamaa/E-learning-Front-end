import React, { FC, useMemo, useState, useEffect } from 'react';
import MaterialReactTable, {
    MRT_ColumnDef,

} from 'material-react-table';
import {
    Box,
    IconButton,
    Tooltip,
} from '@mui/material';
import { Delete, Restore } from '@mui/icons-material';
import baseUrl, { api } from '../../../pages/Urls';
import { IonContent } from '@ionic/react';
import swal from 'sweetalert';
import { format } from 'date-fns';
type articleData = {
    id: string;
    name: string;
    title: string;
    slug: string;
    date: string;
    status: string;


};

//nested data is ok, see accessorKeys in ColumnDef below


const TrashArticle: FC = () => {
    const [article, setArticle] = useState([]);
    const fetchTrash = () => {
        fetch(`${baseUrl}${api.trashArticle}`, {
            method: 'GET',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem("token")}`

            }
        })
            .then(resp => resp.json())
            .then(resp => {
                setArticle(resp.reverse())
            })
    }
    useEffect(() => {
        fetchTrash();
    }, [])

    const columns = useMemo<MRT_ColumnDef<articleData>[]>(
        () => [

            {
                accessorKey: 'name',
                header: 'Created By',

            },
            {
                accessorKey: 'title',
                header: 'Title',

            },
            {
                accessorKey: 'slug',
                header: 'Slug',

            },
            {
                accessorKey: 'status',
                header: 'Status',
                muiTableAccessorKeyProps: {

                }
            },
            {
                accessorFn: (row) => format(new Date(row.date), "yyyy-MM-dd"),
                accessorKey: 'date',
                header: 'Date',

            },


        ],
        [],
    );

    const forceDelete = (id: any) => {
        if (window.confirm('Are you sure?')) {
            fetch(`${baseUrl}${api.forceDelete}${id}`, {
                method: 'DELETE',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem("token")}`

                }

            })

                .then(res => {
                    if (res.status === 200) {
                        fetchTrash();
                        swal({
                            title: "Success!",
                            text: "Article deleted successfully",
                            icon: "success",
                        });
                    } else {
                        swal({
                            title: "Error!",
                            text: res.status + ' ' + res.statusText + " - Article not deleted",
                            icon: "error",
                        });
                    }

                })
                .catch(error => console.log('error', error));
        }
    }
    const restore = (id: any) => {
        if (window.confirm('Want to restore?')) {
            fetch(`${baseUrl}${api.restoreArticle}${id}`, {
                method: 'GET',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem("token")}`

                }

            })

                .then(res => {
                    if (res.status === 200) {
                        fetchTrash();
                        swal({
                            title: "Success!",
                            text: "Article restored successfully",
                            icon: "success",
                        });
                    } else {
                        swal({
                            title: "Error!",
                            text: res.status + ' ' + res.statusText + " - Article not restored",
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
                <h1 className='text-center mb-2'>List of Trash Articles</h1>
                <MaterialReactTable
                    columns={columns}
                    data={article}
                    getRowId={(row => `${row.id}`)}
                    enableRowActions
                    positionActionsColumn="last"
                    enableRowNumbers
                    enableColumnOrdering
                    renderRowActions={({ row, table }) => (


                        <Box sx={{ display: 'flex', gap: '1rem' }}>
                            {(localStorage.getItem('role') == 'ar_staff2') ? '.......' :
                                <>
                                    <Tooltip arrow placement="left" title="Restore">
                                        <IconButton onClick={() => restore(row.id)}>
                                            <Restore />
                                        </IconButton>
                                    </Tooltip>
                                    {(localStorage.getItem('role') == 'ar_mgmt') ?
                                        <Tooltip arrow placement="right" title="Delete">
                                            <IconButton color="error" onClick={() => forceDelete(row.id)}>
                                                <Delete />
                                            </IconButton>
                                        </Tooltip>
                                        : ''}
                                </>
                            }

                        </Box>


                    )}

                />

            </div>
        </IonContent>

    );

};
export default TrashArticle;