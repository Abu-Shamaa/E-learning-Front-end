
import {
    IonCardHeader,
    IonTitle,
    IonToolbar,
    IonButtons,
    IonButton,
    IonCardContent,
    IonCard,
    IonItem,
    IonContent,
    IonCol, IonGrid, IonRow

} from '@ionic/react';
import React, { useState, useEffect } from 'react';
import { useHistory, useParams } from "react-router";
import baseUrl, { api, web } from '../../../pages/Urls';
import { format } from 'date-fns';
import Categories from './Categories';
import "./ViewBlog.css";

interface Category {
    id: number,
    name: string,
    slug: string,
};

interface Group {
    id: number,
    name: string,
};

interface User {
    id: number,
    name: string,
};

interface Article {
    categories: Category[],
    content: string,
    created_at: string,
    date: string,
    deleted_at: string | null,
    groups: Group[],
    id: number,
    ingroup: number,
    slug: string,
    status: string,
    title: string,
    updated_at: string,
    user: User,
    user_id: number,
};

const ViewBlog: React.FC = () => {
    type ViewBlogParams = {
        slug: string;
    };
    const auth = localStorage.getItem("token");
    const [article, setArticle] = useState<Article | null>(null);

    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [date, setDate] = useState(format(new Date(), 'yyyy-MM-dd'));
    const [category, setCategory] = useState([]);

    const history = useHistory();
    const { slug } = useParams<ViewBlogParams>();

    const viewArticle = () => {
        fetch(`${baseUrl}${api.viewArticle}${slug}`, {
            method: 'GET',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem("token")}`,
            }
        })
            .then(resp => resp.json())
            .then(result => {
                setArticle(result);

                setTitle(result.title);
                setContent(result.content);
                setDate(result.date);
                setCategory(result.category);
            })
    }
    useEffect(() => {
        viewArticle();

    }, [])

    return (
        <IonContent>
            <IonGrid>
                <IonRow>
                    <IonCol>
                        <IonCard>
                            <div className="container mt-3 mb-5">
                                <IonCardHeader>
                                    <IonToolbar>

                                        <IonButtons slot="start">
                                            <IonButton onClick={() => history.goBack()} > <i className="bi bi-backspace"> Back</i> </IonButton>
                                        </IonButtons>
                                    </IonToolbar>
                                </IonCardHeader>


                                <IonCardContent>
                                    <IonItem>
                                        <h1 style={{
                                            fontWeight: 'bold',
                                            fontSize: '2rem',
                                        }}>{article?.title}</h1>
                                    </IonItem>
                                    <IonItem>
                                        <h4 style={{
                                            color: '#666',
                                        }}>
                                            Posted on {article ? format(new Date(article.date), 'MMMM dd, yyyy') : ''} by {article?.user?.name}<br />
                                            <b>Categories: </b>
                                            {article?.categories.map((category, i) => <span>
                                                <a key={i.toString()} href={auth != null ? `/dashboard/blog/${category.slug}` : `/${category.slug}`}>
                                                    {category.name}</a>
                                            </span>)}
                                        </h4>
                                    </IonItem>
                                    <IonItem>
                                        <div
                                            id="article-content"
                                            dangerouslySetInnerHTML={{ __html: article ? article.content : '' }}
                                        />
                                    </IonItem>

                                </IonCardContent>


                            </div>
                        </IonCard>
                    </IonCol>

                    <IonCol size="auto">
                        <Categories />
                    </IonCol>
                </IonRow>
            </IonGrid>
        </IonContent >
    );
};
export default ViewBlog;