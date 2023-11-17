import {
    IonContent,
    IonCard, IonCardContent, IonCardHeader, IonCardTitle,
    IonCol, IonGrid, IonRow,
    IonItem, IonButton, IonNote,

} from '@ionic/react';
import Box from '@mui/material/Box';
import InputAdornment from '@mui/material/InputAdornment';
import TextField from '@mui/material/TextField';
import SearchIcon from '@mui/icons-material/Search';
import '../../../pages/Style.css';
import React, { useState, useEffect } from 'react';
import baseUrl, { api } from '../../../pages/Urls';
import { useHistory } from "react-router";
import { Link } from 'react-router-dom';
import { format } from 'date-fns'
import ReactPaginate from "react-paginate";
import Categories from './Categories';
const Blog: React.FC = () => {
    const auth = localStorage.getItem("token");
    const [article, setArticle] = useState([]);
    const [allCategory, setAllCategory] = useState([]);
    const [slug, setSlug] = useState('');
    const history = useHistory();
    const [pageNumber, setPageNumber] = useState(0);
    const articlePerPage = 10;
    const pagesVisited = pageNumber * articlePerPage;
    const pageCount = Math.ceil(article.length / articlePerPage);
    const changePage = ({ selected }: any) => {
        setPageNumber(selected);
    };
    const fetchAllBlog = () => {
        fetch(`${baseUrl}${api.blog}`, {
            method: 'GET',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem("token")}`

            }
        })
            .then(resp => resp.json())
            .then(resp => {
                setArticle(resp)
            })
    }


    useEffect(() => {
        fetchAllBlog();

    }, [])

    const search = (text: any) => {
        if (text) {
            let matches = article.filter((item: any) => {
                const regex = new RegExp(`${text}`, "gi");
                return item.title.match(regex);
            })
            setArticle(matches);
        } else {
            fetchAllBlog();
        }

    };

    return (
        <IonContent>
            <IonGrid>
                <IonRow>
                    <IonCol>
                        <div className="container mt-3 mb-5">
                            <h2 className="text-muted">Recent Articles Post : <span className="text-success text-capitalize">All Categories</span></h2>
                            <hr />
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
                                article.length != 0 ?
                                    <Box sx={{ width: '100%', mb: 2, mt: 3 }}>


                                        {(articlePerPage > 0
                                            ? article.slice(pagesVisited, pagesVisited + articlePerPage)
                                            : article).map((item: any, i: any) => (
                                                <IonCard key={i.toString()}>
                                                    {/* <IonCardHeader>
                                                        <IonCardTitle>
                                                            <h4 className="text-primary">
                                                                <Link className='text-decoration-none'
                                                                    to={auth != null ? `/dashboard/blog/${format(new Date(item.date), 'yyyy')}/${format(new Date(item.date), 'MM')}/${format(new Date(item.date), 'dd')}/${item.slug}` :
                                                                        `/${format(new Date(item.date), 'yyyy')}/${format(new Date(item.date), 'MM')}/${format(new Date(item.date), 'dd')}/${item.slug}`
                                                                    }>
                                                                    {item.title}
                                                                </Link></h4>
                                                        </IonCardTitle>

                                                    </IonCardHeader> */}

                                                    <IonCardContent>

                                                        <div style={{ width: '100%' }}>
                                                            {item.content.match(/<img\s+[^>][^>]*>/i) ?

                                                                <div style={{ width: '20%', float: 'left', }}>
                                                                    <div
                                                                        //style={{ width: "100%", height: "100%" }}
                                                                        className='mb-2 mx-2'
                                                                        dangerouslySetInnerHTML={{ __html: article ? item.content.match(/<img\s+[^>][^>]*>/i) : '' }}
                                                                    />
                                                                </div> : ''
                                                            }

                                                            <div style={{ width: '80%', float: 'left' }}>
                                                                <h1 className="text-primary mx-2">
                                                                    <Link className='text-decoration-none'
                                                                        to={auth != null ? `/dashboard/blog/${format(new Date(item.date), 'yyyy')}/${format(new Date(item.date), 'MM')}/${format(new Date(item.date), 'dd')}/${item.slug}` :
                                                                            `/${format(new Date(item.date), 'yyyy')}/${format(new Date(item.date), 'MM')}/${format(new Date(item.date), 'dd')}/${item.slug}`
                                                                        }>
                                                                        {item.title}
                                                                    </Link></h1>
                                                                <p
                                                                    className='ellipsis mb-2 mx-2'
                                                                    dangerouslySetInnerHTML={{ __html: article ? item.content.replace(/<img .*?>/g, "") : '' }}
                                                                />
                                                                <p className='mx-2'> {format(new Date(item.date), 'yyyy-MM-dd')}</p>
                                                            </div>
                                                        </div>

                                                    </IonCardContent>
                                                </IonCard>

                                            ))}

                                    </Box>
                                    :
                                    <div className='text-center mt-5'>
                                        <IonNote color="danger">**Not match search data**</IonNote>
                                    </div>

                            }


                        </div>
                        {article.length != 0 && article.length > articlePerPage ?
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
                            /> : ''}
                    </IonCol>

                    <IonCol size="auto">
                        <Categories />

                    </IonCol>

                </IonRow>
            </IonGrid>

        </IonContent>

    );
}


export default Blog;

