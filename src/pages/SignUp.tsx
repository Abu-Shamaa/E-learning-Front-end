import {
    IonCard,
    IonCardContent,
    IonCardHeader,
    IonButton,
    IonToolbar,
    IonTitle,
    IonInput,
    IonItem,
    IonLabel,
    IonHeader,
    IonContent,

} from "@ionic/react";
import React, { useState, useEffect } from "react";
import { useHistory } from "react-router";
import './Style.css';
import baseUrl, { api } from "./Urls";
import { useForm, Controller } from "react-hook-form";
import { ErrorMessage } from "@hookform/error-message";
import swal from 'sweetalert';
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
const schema = yup.object().shape({
    email: yup.string()
        .required('Email is required'),

    name: yup.string()
        .required('Name is required'),
    password: yup.string()
        .required('Password is required')
})
const SignUp: React.FC = () => {
    const history = useHistory();
    const [error, setError] = useState('');
    const {
        handleSubmit,
        register,
        formState: { errors },
        reset,
        watch
    } = useForm({
        defaultValues: {
            email: '',
            name: '',
            password: '',


        },
        resolver: yupResolver(schema),
    });

    const handleChange = (e: any) => {

        const eml = e.target.value;

        if (eml) {
            fetch(`${baseUrl}${api.checkUser}${eml}`, {
                method: 'GET',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',

                },
            })
                .then(resp => resp.json())
                .then(res => {
                    if (Object.keys(res).length != 0) {
                        setError('Email already exists')
                    }
                })
        }

    }
    //console.log(error)
    const signUp = (e: any) => {


        fetch(`${baseUrl}${api.signUp}`, {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',

            },
            body: JSON.stringify(e),
        })

            .then((response) => {

                if (response.status == 200) {
                    history.replace("/login");
                    setError('');
                    reset({
                        email: '',
                        name: '',
                        password: '',

                    })
                    swal({
                        title: "Success!",
                        text: "SignUp successfull",
                        icon: "success",
                    });
                }

            })



            .catch(error => {
                console.log('error', error)

            });

    }



    return (
        <IonContent>
            <div className="contain">
                <IonCard>
                    <IonCardHeader>
                        <IonHeader>
                            <IonToolbar>
                                <IonTitle>Create Account</IonTitle>
                            </IonToolbar>
                        </IonHeader>
                    </IonCardHeader>

                    <IonCardContent>
                        <form onSubmit={handleSubmit(signUp)}>
                            <IonItem>
                                <IonLabel position="stacked">Name</IonLabel>
                                <IonInput type="text"

                                    placeholder="enter your full name"

                                    {...register("name")}

                                >
                                </IonInput>

                            </IonItem>
                            <p style={{ color: "red" }}>
                                <ErrorMessage errors={errors} name="name" />
                            </p>

                            <IonItem>
                                <IonLabel position="stacked">Email</IonLabel>
                                <IonInput type="email"
                                    placeholder="enter email"
                                    {...register("email")}
                                    onIonChange={(e: any) => handleChange(e)}
                                >
                                </IonInput>

                            </IonItem>
                            <p style={{ color: "red" }}>
                                <ErrorMessage errors={errors} name="email" />
                            </p>
                            <p style={{ color: "red" }}>
                                {error ? error : ''}
                            </p>

                            <IonItem>
                                <IonLabel position="stacked">Password</IonLabel>
                                <IonInput type="password"
                                    placeholder="password"
                                    {...register("password")}

                                >
                                </IonInput>
                            </IonItem>
                            <p style={{ color: "red" }}>
                                <ErrorMessage errors={errors} name="password" />
                            </p>
                            <div style={{ marginTop: "3%" }}>
                                <IonButton color="primary" type='submit'>Sign Up</IonButton>


                            </div>
                        </form>
                    </IonCardContent>
                </IonCard>
            </div>
        </IonContent>
    );
};

export default SignUp;