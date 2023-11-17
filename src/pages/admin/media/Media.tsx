import React, { FC, useCallback, useState, useEffect, useRef } from 'react';
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
import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    IconButton,
    FormControl,
    NativeSelect,
    Stack,
    Tooltip,
    InputLabel,
} from '@mui/material';
import Dropzone, { useDropzone } from 'react-dropzone';
import Grid from '@material-ui/core/Grid';
import Paper from '@mui/material/Paper';
import { Delete, Edit, Add } from '@mui/icons-material';
import Popper from '@material-ui/core/Popper';
import LinkIcon from '@material-ui/icons/Link';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import { styled } from '@mui/material/styles';
import { makeStyles } from '@material-ui/core/styles';
import baseUrl, { api } from '../../../pages/Urls';

interface FileThumbProps {
    abs_url: string,
    rel_url: string,
};

interface FileThumbsProps {
    large: FileThumbProps,
    medium: FileThumbProps,
    small: FileThumbProps,
};

interface FileProps {
    abs_url: string,
    last_modified: number,
    mime: string,
    name: string,
    rel_url: string,
    size: number,
    thumbs: FileThumbsProps,
}

interface ImageViewerProps {
    file: FileProps | null,
    open: boolean,
    onClose: (event: object, reason: string) => void,
};

interface UploaderProps {
    open: boolean,
    onClose: (event: object, reason: string) => void,
    fetchUpload: Function,
};

interface UploadDropZoneProps {
    fetchUpload: Function,
}

const useStyles = makeStyles((theme) => ({
    paper: {
        border: '1px solid',
        padding: theme.spacing(1),
        backgroundColor: theme.palette.background.paper,
    },
}));

const ImageViewer: FC<ImageViewerProps> = (props: ImageViewerProps) => {
    const [file, setFile] = useState<FileProps | null>(null);
    const [open, setOpen] = useState(false);

    useEffect(() => {
        setFile(props.file);
    }, [props.file]);

    useEffect(() => {
        setOpen(props.open);
    }, [props.open]);

    return (
        <>
            <Dialog
                open={open}
                onClose={props.onClose}
            >
                <DialogContent>
                    <figure>
                        <img src={file?.abs_url} />
                        <figcaption>
                            <b>{file?.name}</b> ({file ? (file.size / 1024).toFixed(0) : ''} kB)
                        </figcaption>
                    </figure>
                </DialogContent>
            </Dialog>
        </>
    );
};

const UploadDropZone: FC<UploadDropZoneProps> = (props: UploadDropZoneProps) => {
    const [files, setFiles] = useState<any>([]);

    const formData = new FormData();

    const onDrop = useCallback((droppedFiles: any) => {
        setFiles(droppedFiles);

        droppedFiles.forEach((file: any) => {
            formData.append('files[]', file);
        });

        props.fetchUpload(formData);
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

    return (
        <div {...getRootProps()} style={{
            width: '480px',
            height: '360px',
            border: 'dashed 10px #ccc',
        }}>
            <input {...getInputProps()} />
            <div style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
            }}>
                <h3>
                    {isDragActive ? 'Drop here ...' : (
                        files.length === 0 ? 'Drag & Drop Files' : (
                            files.length === 1 ? `Uploading ${files[0].name} ...` : `Uploading ${files.length} files ...`
                        )
                    )}
                </h3>
            </div>
        </div>
    );
};

const Uploader: FC<UploaderProps> = (props: UploaderProps) => {
    const [open, setOpen] = useState(false);

    useEffect(() => {
        setOpen(props.open);
    }, [props.open]);

    return (
        <>
            <Dialog
                open={open}
                onClose={props.onClose}
            >
                <DialogTitle>
                    File Uploader
                </DialogTitle>
                <DialogContent>
                    <UploadDropZone fetchUpload={props.fetchUpload} />
                </DialogContent>
            </Dialog>
        </>
    );
}

const Media: FC = () => {
    const [files, setFiles] = useState<FileProps[]>([]);
    const [currentFile, setCurrentFile] = useState<FileProps | null>(null);
    const [imageViewerOpen, setImageViewerOpen] = useState(false);
    const [uploaderOpen, setUploaderOpen] = useState(false);
    const [urlCopied, setUrlCopied] = useState(-1);

    const fetchData = () => {
        fetch(`${baseUrl}${api.media}`, {
            method: 'GET',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem("token")}`,
            },
        })
            .then(res => res.json())
            .then(res => {
                setFiles(res);
            });
    };

    const fetchUpload = (formData: FormData) => {
        fetch(`${baseUrl}${api.media}`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem("token")}`,
            },
            body: formData,
        })
            .then(res => res.json())
            .then(res => {
                fetchData();
                setUploaderOpen(false);
            });
    };

    const fetchDelete = (filename: string) => {
        fetch(`${baseUrl}${api.media}/${filename}`, {
            method: 'DELETE',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem("token")}`,
            },
        })
            .then(res => {
                fetchData();
            });
    };

    const handleOpenImageViewer = (file: FileProps) => {
        setCurrentFile(file);
        setImageViewerOpen(true);
    };

    const handleCloseImageViewer = () => {
        setCurrentFile(null);
        setImageViewerOpen(false);
    }

    const handleOpenUploader = () => {
        setUploaderOpen(true);
    };

    const handleCloseUploader = () => {
        setUploaderOpen(false);
    };

    const handleCopyURL = (url: string, idx: number) => {
        navigator.clipboard.writeText(url).then(() => {
            setUrlCopied(idx);
            console.log("URL copied", url);
        });
    };

    const handleDeleteFile = (filename: string) => {
        const cfm = window.confirm(`Confirm deletion of file: ${filename}?`);
        if (cfm) {
            fetchDelete(filename);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    useEffect(() => {
        if (urlCopied > -1) {
            setTimeout(() => {
                setUrlCopied(-1);
            }, 5000);
        }
    }, [urlCopied]);

    const Item = styled(Paper)(({ theme }) => ({
        backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
        ...theme.typography.body2,
        padding: theme.spacing(1),
        textAlign: 'center',
        color: theme.palette.text.secondary,
    }));
    // console.log('ff', files);
    return (
        <>
            <IonContent>
                <div className="container mt-5">
                    <h1 className='text-center mb-2'>Media Gallery</h1>

                    <Box sx={{ flexGrow: 1 }}>
                        <Tooltip title="Add-category">
                            <IconButton onClick={handleOpenUploader}>
                                Upload Files <Add />
                            </IconButton>
                        </Tooltip>
                    </Box>

                    <Box sx={{ flexGrow: 1 }}>
                        <Grid container spacing={2}>

                            {files.map((file, i) => <Grid key={`grid-file-${i}`} item xs={3}>
                                <Item>
                                    <Box
                                        onClick={file.thumbs ? () => {
                                            handleOpenImageViewer(file);
                                        } : () => {

                                        }}
                                    >
                                        <div style={{
                                            height: '185px',
                                        }}>
                                            {file.thumbs ? <img src={file.thumbs.medium.abs_url} /> : null}
                                        </div>
                                        <div>
                                            <b>{file.name}</b>
                                        </div>
                                        <div>
                                            <i>{file.mime}</i>
                                        </div>
                                    </Box>
                                    <Grid container>
                                        <Grid item xs={6}>
                                            <div
                                                title='Copy File URL'
                                                onClick={() => {
                                                    handleCopyURL(file.abs_url, i);
                                                }}
                                            >
                                                <LinkIcon color={urlCopied === i ? 'secondary' : 'primary'} />
                                            </div>
                                        </Grid>
                                        <Grid item xs={6}>
                                            <div
                                                title='Delete File'
                                                onClick={() => {
                                                    handleDeleteFile(file.name);
                                                }}
                                            >
                                                <DeleteForeverIcon />
                                            </div>
                                        </Grid>
                                    </Grid>
                                </Item>
                            </Grid>)}
                        </Grid>
                    </Box>
                </div>
                <ImageViewer
                    file={currentFile}
                    open={imageViewerOpen}
                    onClose={handleCloseImageViewer}
                />
                <Uploader
                    open={uploaderOpen}
                    onClose={handleCloseUploader}
                    fetchUpload={fetchUpload}
                />
            </IonContent >
        </>
    );
};

export default Media;
