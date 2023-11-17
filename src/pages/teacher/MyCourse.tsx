import {
    IonContent, IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonNote,
} from "@ionic/react";
import React, { useState, useEffect } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import InputAdornment from '@mui/material/InputAdornment';
import TextField from '@mui/material/TextField';
import SearchIcon from '@mui/icons-material/Search';
import TablePagination from '@mui/material/TablePagination';
import baseUrl, { api } from '../../pages/Urls';
import { Link } from 'react-router-dom';
import ReactPaginate from "react-paginate";

const MyCourse: React.FC = () => {

    const [mycourse, setMyCourse] = useState([]);
    const [pageNumber, setPageNumber] = useState(0);
    const mycoursePerPage = 10;
    const pagesVisited = pageNumber * mycoursePerPage;
    const pageCount = Math.ceil(mycourse.length / mycoursePerPage);
    const changePage = ({ selected }: any) => {
        setPageNumber(selected);
    };

    const fetchMycourse = () => {
        fetch(`${baseUrl}${api.myCourse}`, {
            method: 'GET',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem("token")}`

            }
        })
            .then(resp => resp.json())
            .then(resp => {
                setMyCourse(resp.reverse())
            })
    }
    useEffect(() => {
        fetchMycourse();
    }, []);

    const search = (text: any) => {
        if (text) {
            let matches = mycourse.filter((item: any) => {
                const regex = new RegExp(`${text}`, "gi");
                return item.course_name.match(regex);
            })
            setMyCourse(matches);
        } else {
            fetchMycourse();
        }

    };


    return (
        <IonContent>
            <div className="container mt-5 mb-5">
                <p className="h1 text-center">My Courses</p>
                <Box sx={{ display: 'flex', justifyContent: "flex-end", mx: 1 }}>
                    <TextField
                        id="input-with-icon-textfield"
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <SearchIcon />
                                </InputAdornment>
                            ),
                        }}
                        variant="standard"
                        onChange={(e: any) => search(e.target.value)}
                    />
                </Box>
                {
                    mycourse.length != 0 ?
                        <Box sx={{ width: '100%', mb: 2, mt: 3 }}>


                            {(mycoursePerPage > 0
                                ? mycourse.slice(pagesVisited, pagesVisited + mycoursePerPage)
                                : mycourse
                            ).map((item: any, i: any) => (

                                <IonCard key={i.toString()}>
                                    <IonCardHeader>

                                        <IonCardTitle>
                                            <Link className='text-decoration-none' to={`/dashboard/mycourse/${item.course_id}`}> {item.course_name}</Link>
                                        </IonCardTitle>

                                    </IonCardHeader>

                                    <IonCardContent>
                                        {item.description}
                                    </IonCardContent>

                                </IonCard>


                            ))}


                        </Box>
                        :
                        <div className='text-center mt-5'>
                            <IonNote color="danger">**No match data**</IonNote>
                        </div>

                }


            </div>
            {
                mycourse.length != 0 && mycourse.length > mycoursePerPage ?
                    <ReactPaginate
                        nextLabel=" >"
                        onPageChange={changePage}
                        pageRangeDisplayed={3}
                        marginPagesDisplayed={2}
                        pageCount={pageCount}
                        previousLabel="< "
                        pageClassName="page-item"
                        pageLinkClassName="page-link"
                        previousClassName="page-item"
                        previousLinkClassName="page-link"
                        nextClassName="page-item"
                        nextLinkClassName="page-link"
                        breakLabel="..."
                        breakClassName="page-item"
                        breakLinkClassName="page-link"
                        containerClassName="pagination"
                        activeClassName="active"
                        renderOnZeroPageCount={null || undefined}
                    /> : ''
            }
        </IonContent >
    );

}

export default MyCourse;

