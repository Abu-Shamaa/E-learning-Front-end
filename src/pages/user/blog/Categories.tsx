import {
    IonItem, IonButton,
} from '@ionic/react';
import React, { useState, useEffect } from 'react';
import baseUrl, { api } from '../../../pages/Urls';
import { Link } from 'react-router-dom';

const Categories: React.FC = () => {
    const auth = localStorage.getItem("token");
    const [categories, setCategories] = useState([]);

    const fetchCategories = () => {
        fetch(`${baseUrl}${api.allCategory}`, {
            method: 'GET',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            }
        })
            .then(resp => resp.json())
            .then(resp => {
                setCategories(resp)
            })
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    // console.log(auth)
    return (
        <>
            <div style={{ width: "200px" }}>
                <h3>Categories</h3>

                <IonItem >
                    <IonButton fill="clear" onClick={() => { }}>
                        <Link className='text-decoration-none' to={auth != null ? `/dashboard/blog` : `/`}>
                            All Categories
                        </Link>
                    </IonButton>
                </IonItem>
                {categories.map((cat: any, i: any) =>
                    <IonItem key={i.toString()}>
                        <IonButton fill="clear">
                            <Link className='text-decoration-none' to={auth != null ? `/dashboard/blog/${cat.slug}` : `/${cat.slug}`}>
                                {cat.name}
                            </Link>
                        </IonButton>
                    </IonItem>
                )}
            </div>
        </>
    );
};

export default Categories;