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
    IonText,
    IonCol, IonGrid, IonRow,
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
    FormControl,
    NativeSelect,
} from '@mui/material';
import { Delete, Edit, Visibility } from '@mui/icons-material';
import baseUrl, { api } from '../../../pages/Urls';
import { Collapse } from 'react-bootstrap'
import { format } from 'date-fns';
import swal from 'sweetalert';
import Select from 'react-select';
import { useForm, Controller, useFieldArray } from "react-hook-form";
import { ErrorMessage } from "@hookform/error-message";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { TextField } from "@mui/material";
import { DateTimePicker, LocalizationProvider } from "@mui/x-date-pickers";
type quizData = {
    id: string,
    course_name: string,
    quiz_name: string,
    status: string,
    start_date: Date
    test_time: any



};


const Quiz: FC = () => {
    const [quiz, setQuiz] = useState([]);
    const [id, setId] = useState('');
    const [showQuiz, setShowQuiz] = useState([]);
    const [quizData, setQuizData] = useState({});
    const [qerror, setQError] = useState('');
    const [modalOpen, setModalOpen] = useState(false);
    const [levelOptions, setLevelOptions] = useState([]);
    const [collapse, setCollapse] = useState(false);
    const [start_date, setStart_date] = useState(format(new Date(), "yyyy-MM-dd HH:mm:ss"));
    const [end_date, setEnd_date] = useState(format(new Date(), "yyyy-MM-dd HH:mm:ss"));
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
            quiz_name: '',
            test_time: '',
            status: '',
            inputlist: [{ level_name: '', qcount: '' }],
            start_date: format(new Date(), "yyyy-MM-dd HH:mm"),

        }
    });
    const { fields, remove, append } = useFieldArray({
        name: 'inputlist',
        control,
    });



    const fetchQuiz = () => {
        fetch(`${baseUrl}${api.allQuiz}`, {
            method: 'GET',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem("token")}`

            }
        })
            .then(resp => resp.json())
            .then(resp => {
                setQuiz(resp.reverse())
            })
    }
    useEffect(() => {
        fetchQuiz();
    }, [])

    const columns = useMemo<MRT_ColumnDef<quizData>[]>(
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
                accessorKey: 'test_time',
                header: 'Duration (Minutes)',

            },
            {
                accessorKey: 'status',
                header: 'Status',
                Cell: ({ cell }) => (
                    cell.getValue<string>() === "P" ?
                        'Publish' : 'Draft'
                ),
            },
            {
                accessorFn: (row) => format(new Date(row.start_date), "yyyy-MM-dd HH:mm:ss"),
                accessorKey: 'start_date',
                header: 'Start Date',

            },


        ],
        [],
    );


    const editQuiz = (id: any) => {

        fetch(`${baseUrl}${api.showQuiz}${id}`, {
            method: 'GET',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem("token")}`

            }
        })
            .then(res => res.json())
            .then(result => {
                setLevelOptions(result.level.map((item: any) => ({
                    label: item.level_name,
                    value: item.level_name
                })));
                //setId(result.quiz.id)
                setStart_date(result.quiz.start_date);
                setEnd_date(result.quiz.test_end);
                setShowQuiz(result.quiz.qlevel);
                setValue('quiz_name', result.quiz.quiz_name);
                setValue('status', result.quiz.status);
                setValue('start_date', result.quiz.start_date);
                setValue('test_time', result.quiz.test_time);
                setValue('id', result.quiz.id)
                setValue('inputlist',
                    result.quiz.qlevel.map((item: any, i: any) => ({
                        level_name: {
                            label: item.level_name,
                            value: item.level_name,
                        },
                        qcount: item.qcount

                    }))
                );

            })
            .catch(function (error) {
                console.log(error);
            })


    }
    const updateQuiz = (e: any) => {

        fetch(`${baseUrl}${api.updateQuiz}${e.id}`, {
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
                    fetchQuiz();
                    setCollapse(false)
                    swal({
                        title: "Success!",
                        text: "Quiz updated successfully",
                        icon: "success",
                    });
                } else if (res.status === 400) {
                    setQError('Question Number out of range')
                } else {
                    swal({
                        title: "Error!",
                        text: res.status + ' ' + res.statusText +
                            " - Quiz not updated",
                        icon: "error",
                    });
                }

            })
            .catch(error => console.log('error', error));


    }
    const deleteQuiz = (id: any) => {
        if (window.confirm('Are you sure?')) {
            fetch(`${baseUrl}${api.deleteQuiz}${id}`, {
                method: 'DELETE',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem("token")}`

                }

            })

                .then(res => {
                    if (res.status === 200) {
                        fetchQuiz();
                        swal({
                            title: "Success!",
                            text: "Quiz deteled successfully",
                            icon: "success",
                        });
                    } else {
                        swal({
                            title: "Error!",
                            text: res.status + ' ' + res.statusText +
                                " - Quiz not deleted",
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

                <Collapse in={collapse}>
                    <div id="collapseID">
                        <div className="container mt-5 mb-5 ">

                            <IonCard>
                                <IonCardHeader>
                                    <IonCardTitle>
                                        <IonToolbar>
                                            <IonTitle><h1 className="text-center display-6">Edit Quiz</h1></IonTitle>
                                        </IonToolbar>
                                    </IonCardTitle>
                                </IonCardHeader>
                                <hr />
                                <IonCardContent>
                                    <form onSubmit={handleSubmit(updateQuiz)}>
                                        <IonItem>
                                            <IonLabel position="stacked">Quiz Name</IonLabel>
                                            <IonInput placeholder="quiz name"
                                                type="text"
                                                {...register("quiz_name", { required: "Quiz Name Is Required" })}
                                            >
                                            </IonInput>
                                        </IonItem>
                                        <p style={{ color: "red" }}>
                                            <ErrorMessage errors={errors} name="quiz_name" />
                                        </p>
                                        <IonItem>
                                            <IonText color="primary">
                                                <h2 className="mt-3 mb-3">Add Quiz Level</h2>
                                            </IonText>

                                        </IonItem>

                                        <div>

                                            {
                                                fields.map((x, i) => {

                                                    return (
                                                        <div key={i.toString()} className="mb-3 mt-3">
                                                            <IonGrid>
                                                                <IonRow>
                                                                    <IonCol size="7">
                                                                        <IonItem>
                                                                            <IonLabel position="stacked">Level</IonLabel>
                                                                            <div className="mt-2" style={{ width: '100%' }}>

                                                                                <Controller
                                                                                    control={control}
                                                                                    name={`inputlist.${i}.level_name`}
                                                                                    rules={{
                                                                                        required: 'Level name is required',
                                                                                    }}
                                                                                    render={() => (
                                                                                        <Select

                                                                                            menuPortalTarget={document.body}
                                                                                            options={levelOptions}
                                                                                            placeholder={<i className="bi bi-search"> Select Level</i>}
                                                                                            value={getValues(`inputlist.${i}.level_name`)}
                                                                                            onChange={(e: any) => setValue(`inputlist.${i}.level_name`, e)}


                                                                                        />

                                                                                    )}

                                                                                />
                                                                            </div>

                                                                        </IonItem>
                                                                        <p style={{ color: "red" }}>
                                                                            <ErrorMessage errors={errors} name={`inputlist.${i}.level_name`} />
                                                                        </p>
                                                                    </IonCol>
                                                                    <IonCol size="3">
                                                                        <IonItem>
                                                                            <IonLabel position="stacked">No of Question</IonLabel>
                                                                            <IonInput type="number"
                                                                                min={1}
                                                                                step='1'
                                                                                value={getValues(`inputlist.${i}.qcount`)}
                                                                                {...register(`inputlist.${i}.qcount`, { required: "Question No Is Required" })}
                                                                            >
                                                                            </IonInput>
                                                                        </IonItem>
                                                                        <p style={{ color: "red" }}>
                                                                            <ErrorMessage errors={errors} name={`inputlist.${i}.qcount`} />
                                                                        </p>
                                                                    </IonCol>
                                                                    <IonCol>
                                                                        <div className="mt-4">
                                                                            {
                                                                                fields.length !== 1 &&
                                                                                <button onClick={() => remove(i)}>X</button>
                                                                            }
                                                                            {
                                                                                fields.length - 1 === i &&
                                                                                <button className="mx-3 " onClick={() => append({ level_name: '', qcount: '' })}>
                                                                                    <i className="bi bi-plus-circle-fill" title="add-option"></i>
                                                                                </button>
                                                                            }
                                                                        </div>
                                                                    </IonCol>
                                                                </IonRow>
                                                            </IonGrid>

                                                        </div>
                                                    );
                                                })}

                                        </div>
                                        <p className="text-center" style={{ color: "red" }}>

                                            {qerror}
                                        </p>

                                        <IonItem>
                                            <IonLabel position="stacked">Status</IonLabel>
                                            <Box sx={{ width: '100%' }}>
                                                <FormControl fullWidth sx={{ mt: 1 }}>
                                                    <NativeSelect
                                                        {...register("status", { required: "Status Is Required" })}

                                                    >
                                                        <option value='P'>Publish</option>
                                                        <option value='D'>Draft</option>


                                                    </NativeSelect>
                                                </FormControl>
                                            </Box>

                                        </IonItem>
                                        <p style={{ color: "red" }}>
                                            <ErrorMessage errors={errors} name="status" />
                                        </p>
                                        <IonItem>
                                            <IonLabel position="stacked">Duration (Minutes)</IonLabel>

                                            <IonInput type="number"
                                                min={1}
                                                step='1'
                                                {...register("test_time", { required: "Duration Is Required" })}

                                            >
                                            </IonInput>
                                        </IonItem>
                                        <p style={{ color: "red" }}>
                                            <ErrorMessage errors={errors} name="test_time" />
                                        </p>
                                        <IonItem >
                                            <IonLabel position="floating">Quiz Start </IonLabel>
                                            <Controller
                                                name="start_date"
                                                control={control}
                                                rules={{
                                                    required: 'Date is required',
                                                }}
                                                defaultValue={format(new Date(), "yyyy-MM-dd HH:mm")}
                                                render={({ field: { ...rest } }) => (
                                                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                                                        <DateTimePicker

                                                            inputFormat="yyyy-MM-dd HH:mm"

                                                            value={rest.value}
                                                            onChange={(e: any) => {
                                                                setValue("start_date", format(e, "yyyy-MM-dd HH:mm"));

                                                            }}
                                                            renderInput={(params) => (
                                                                <TextField {...params} sx={{ mt: 3, width: '100%' }} />
                                                            )}
                                                        />
                                                    </LocalizationProvider>
                                                )}
                                            />
                                        </IonItem>
                                        <p style={{ color: "red" }}>
                                            <ErrorMessage errors={errors} name="start_date" />
                                        </p>
                                        <div style={{ marginTop: "3%" }} className="text-center mb-5">
                                            <IonButton color="danger" onClick={() => setCollapse(false)}>
                                                Cancel
                                            </IonButton>
                                            <IonButton color="primary" type="submit">
                                                Save
                                            </IonButton>

                                        </div>
                                    </form>
                                </IonCardContent>
                            </IonCard>

                        </div>

                    </div>
                </Collapse>
                <h1 className='text-center mb-2'>List of Quiz</h1>
                <MaterialReactTable
                    columns={columns}
                    data={quiz}
                    getRowId={(row => `${row.id}`)}
                    enableRowActions
                    positionActionsColumn="last"
                    enableRowNumbers
                    enableColumnOrdering
                    renderRowActions={({ row, table }) => (
                        <Box sx={{ display: 'flex', gap: '1rem' }}>
                            <Tooltip arrow placement="left" title="Edit" >
                                <IconButton aria-expanded={collapse} aria-controls="collapseID" onClick={() => {
                                    editQuiz(row.id)
                                    setCollapse(!collapse)
                                    setQError('')
                                    clearErrors([
                                        'quiz_name',
                                        'test_time',
                                        'status',
                                        'inputlist',
                                        'start_date',

                                    ])
                                }}>

                                    <Edit />
                                </IconButton>
                            </Tooltip>
                            <Tooltip arrow placement="left" title="View" >
                                <IconButton onClick={() => {
                                    editQuiz(row.id)
                                    setModalOpen(true);
                                    setQuizData(row.original)
                                }}>

                                    <Visibility />
                                </IconButton>
                            </Tooltip>
                            <Tooltip arrow placement="right" title="Delete">
                                <IconButton color="error" onClick={() => deleteQuiz(row.id)}>
                                    <Delete />
                                </IconButton>
                            </Tooltip>
                        </Box>
                    )}

                />
                <ViewQuiz
                    open={modalOpen}
                    onClose={() => {
                        setModalOpen(false)

                    }}
                    showQuiz={showQuiz}
                    quizData={quizData}
                    test_start={format(new Date(start_date), "yyyy-MM-dd HH:mm:ss")}
                    test_end={format(new Date(end_date), "yyyy-MM-dd HH:mm:ss")}
                />
            </div>
        </IonContent>

    );

};
const ViewQuiz: FC<{
    onClose: () => void;

    open: boolean;
    quizData: any;
    showQuiz: any;
    test_start: any;
    test_end: any;

}> = (props) => {

    return (
        <Dialog open={props.open}>
            <DialogTitle textAlign="center">View Quiz</DialogTitle>
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
                            <h2 className="mb-3">Course Name</h2>
                            <p>{props.quizData.course_name}</p>
                        </IonLabel>
                    </IonItem>
                    <IonItem>
                        <IonLabel>
                            <h2 className="mb-3">Quiz Name</h2>
                            <p>{props.quizData.quiz_name}</p>
                        </IonLabel>
                    </IonItem>
                    <IonItem>
                        <IonLabel>
                            <h2 className="mb-3">Quiz Start</h2>
                            <p>{props.test_start}</p>

                        </IonLabel>
                    </IonItem>
                    <IonItem>
                        <IonLabel>
                            <h2 className="mb-3">Quiz End</h2>
                            <p>{props.test_end}</p>
                        </IonLabel>
                    </IonItem>
                    <IonItem>
                        <IonLabel>
                            <h2 className="mb-3">Quiz Duration</h2>
                            <p>{props.quizData.test_time} Minutes</p>
                        </IonLabel>
                    </IonItem>


                    <IonItem >
                        <IonLabel>
                            <h2 className="mb-3">Quiz Level and Question</h2>
                            {props.showQuiz.map((item: any, i: any) =>
                                <p className="mt-3" key={i}> {item.level_name} | {item.qcount}</p>
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

export default Quiz;
