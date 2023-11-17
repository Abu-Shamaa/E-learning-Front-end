import {

    IonPage,
    IonContent,
    IonTitle,
    IonMenu,
    IonList,
    IonMenuToggle,
    IonItem,
    IonLabel,
    IonRouterOutlet,
    IonSplitPane,
    IonHeader,
    IonToolbar,
    IonButtons,
    IonMenuButton,

} from "@ionic/react";
import React, { useState, useEffect } from 'react';
import { Redirect } from 'react-router-dom';
import { Route, useHistory, useLocation } from "react-router";
import Articles from './admin/articles/Articles';
import Media from './admin/media/Media';
import Course from './admin/quiz/Course';
import Topic from './admin/quiz/Topic';
import Quiz from './admin/quiz/Quiz';
import Level from './admin/quiz/Level';
import Question from './admin/quiz/Question';
import TrashArticle from './admin/articles/TrashArticle';
import CourseList from './teacher/CourseList';
import MyCourse from './teacher/MyCourse';
import Blog from './user/blog/Blog';
import ViewBlog from './user/blog/ViewBlog';
import UserCourse from './user/ucourse/UserCourse';
import ViewCourseLayout from './teacher/ViewCourseLayout';
import Instructor from './admin/quiz/Instructor';
import GroupComponent from './admin/Group';
import ChangePassword from './ChangePassword';
import PendingCourseEnrole from './user/ucourse/PendingCourseEnrole';
import PendingEnrole from './admin/quiz/PendingEnrole';
import Category from './admin/Category';
import CategoryBlog from './user/blog/CategoryBlog';
import MyQuizResult from "./user/ucourse/MyQuizResult";


const Dashboard: React.FC = () => {
    const admin = (localStorage.getItem('role') == 'ar_mgmt' ||
        localStorage.getItem('role') == 'ar_admin' ||
        localStorage.getItem('role') == 'ar_staff1' ||
        localStorage.getItem('role') == 'ar_staff2');
    const teacher = (localStorage.getItem('role') == 'ar_instructor');
    const user = (localStorage.getItem('role') == '');


    return (
        <>
            {admin && (
                <Route path="/dashboard" component={AdminDashboard} />
            )
            }
            {teacher && (
                <Route path="/dashboard" component={TeacherDashboard} />
            )
            }
            {user && (
                <Route path="/dashboard" component={UserDashboard} />
            )
            }

        </>
    );
};


const AdminDashboard: React.FC = () => {

    return (

        <IonSplitPane when='sm' contentId="main-content">
            <AdminMenu />

            <IonPage id="main-content">

                <TemporaryHeader />

                <IonContent >
                    <IonRouterOutlet id="main-content">
                        <Route path="/dashboard/media" exact>
                            <Media />
                        </Route>
                        <Route path="/dashboard/article" exact>
                            <Articles />
                        </Route>
                        <Route path="/dashboard/category" exact>
                            <Category />
                        </Route>
                        <Route path="/dashboard/group" exact>
                            <GroupComponent />
                        </Route>
                        <Route path="/dashboard/instructor" exact>
                            <Instructor />
                        </Route>
                        <Route path="/dashboard/course" exact>
                            <Course />
                        </Route>
                        <Route path="/dashboard/enrolement" exact>
                            <PendingEnrole />
                        </Route>
                        <Route path="/dashboard/topic" exact>
                            <Topic />
                        </Route>
                        <Route path="/dashboard/quiz" exact>
                            <Quiz />
                        </Route>
                        <Route path="/dashboard/level" exact>
                            <Level />
                        </Route>
                        <Route path="/dashboard/question" exact>
                            <Question />
                        </Route>
                        <Route path="/dashboard/trash" exact>
                            <TrashArticle />
                        </Route>
                        <Route path="/dashboard/change">
                            <ChangePassword />
                        </Route>
                        {/* Default Redirect */}
                        <Route path="/dashboard" exact>
                            <Redirect to="/dashboard/article" />
                        </Route>
                    </IonRouterOutlet>
                </IonContent>

            </IonPage>

        </IonSplitPane>

    );
};
const TeacherDashboard: React.FC = () => {
    const history = useHistory()
    const pathname = history.location.pathname
    return (

        <IonSplitPane when='sm' contentId="main-content">
            <TeacherMenu />

            <div className="ion-page" id="main-content">
                <TemporaryHeader />
                <IonContent>
                    <IonRouterOutlet >
                        <Route path="/dashboard/course/list" exact>
                            <CourseList />
                        </Route>
                        <Route path="/dashboard/mycourse" exact>
                            <MyCourse />

                        </Route>

                        <Route path="/dashboard/mycourse/:id" >
                            <ViewCourseLayout />

                        </Route>
                        <Route path="/dashboard/change">
                            <ChangePassword />
                        </Route>
                        {/* Default Redirect */}
                        <Route path="/dashboard" exact>
                            <Redirect to="/dashboard/course/list" />
                        </Route>
                    </IonRouterOutlet>
                </IonContent>

            </div>

        </IonSplitPane>

    );
};
const UserDashboard: React.FC = () => {


    return (

        <IonSplitPane when='sm' contentId="main-content">
            {/* {window.location.pathname == `/dashboard/mycourse/${localStorage.getItem('course_id')}/quiz/${localStorage.getItem('quiz_id')}` ? '' :
                <UserMenu />
            } */}

            <UserMenu />
            <IonPage id="main-content">

                <TemporaryHeader />

                <IonContent >
                    <IonRouterOutlet id="main-content">
                        <Route path="/dashboard/blog" exact>
                            <Blog />
                        </Route>
                        <Route path="/dashboard/blog/:slug" exact>
                            <CategoryBlog />
                        </Route>
                        <Route path="/dashboard/blog/:date/:date/:date/:slug" exact>
                            <ViewBlog />
                        </Route>
                        <Route path="/dashboard/course/list" exact>
                            <CourseList />
                        </Route>
                        <Route path="/dashboard/course/pending" exact>
                            <PendingCourseEnrole />
                        </Route>
                        <Route path="/dashboard/mycourse" exact>
                            <MyCourse />
                        </Route>
                        <Route path="/dashboard/results" exact>
                            <MyQuizResult />
                        </Route>
                        <Route path="/dashboard/mycourse/:id">
                            <UserCourse />
                        </Route>
                        <Route path="/dashboard/change">
                            <ChangePassword />
                        </Route>

                        {/* Default Redirect */}
                        <Route path="/dashboard" exact>
                            <Redirect to="/dashboard/blog" />
                        </Route>
                    </IonRouterOutlet>
                </IonContent>

            </IonPage>

        </IonSplitPane>

    );
};
const TemporaryHeader: React.FC = () => {
    const location = useLocation();
    const title = () => {
        if (location.pathname === "/dashboard/course/list") return "Course";
        if (location.pathname === "/dashboard/course/pending") return "Pending Enrolement";
        if (location.pathname === "/dashboard/mycourse") return "My Course";
        if (location.pathname === "/dashboard/results") return "Quiz Results";
        if (location.pathname === "/dashboard/media") return "Gallery";
        if (location.pathname === "/dashboard/blog") return "Blog";
        if (location.pathname === "/dashboard/article") return "Article";
        if (location.pathname === "/dashboard/group") return "Group";
        if (location.pathname === "/dashboard/category") return "Category";
        if (location.pathname === "/dashboard/instructor") return "Instructor";
        if (location.pathname === "/dashboard/enrolement") return "Enrolement";
        if (location.pathname === "/dashboard/course") return "Course";
        if (location.pathname === "/dashboard/topic") return "Topic";
        if (location.pathname === "/dashboard/quiz") return "Quiz";
        if (location.pathname === "/dashboard/level") return "Level";
        if (location.pathname === "/dashboard/question") return "Question";
        if (location.pathname === "/dashboard/trash") return "TrashArticle";

    };
    return (
        <IonHeader>
            <IonToolbar>
                <IonButtons slot="start">
                    <IonMenuButton></IonMenuButton>
                </IonButtons>
                <IonTitle>{title()}</IonTitle>
            </IonToolbar>
        </IonHeader>
    );
};

const UserMenu: React.FC = () => {
    const location = useLocation()
    const history = useHistory();
    const lnk = window.location.pathname == `/dashboard/mycourse/${localStorage.getItem('course_id')}/quiz/${localStorage.getItem('quiz_id')}`;
    const bClick = () => {
        if (lnk) {
            if (window.confirm('Are you sure? You are in Quiz Page')) {
                history.push("/dashboard/blog");
            }
        } else {
            history.push("/dashboard/blog");
        }
    }
    const cClick = () => {
        if (lnk) {
            if (window.confirm('Are you sure? You are in Quiz Page')) {
                history.push("/dashboard/course/list");
            }
        } else {
            history.push("/dashboard/course/list");
        }
    }
    const pClick = () => {
        if (lnk) {
            if (window.confirm('Are you sure? You are in Quiz Page')) {
                history.push("/dashboard/course/pending");
            }
        } else {
            history.push("/dashboard/course/pending");
        }
    }
    const mClick = () => {
        if (lnk) {
            if (window.confirm('Are you sure? You are in Quiz Page')) {
                history.push("/dashboard/mycourse");
            }
        } else {
            history.push("/dashboard/mycourse");
        }
    }
    const rClick = () => {
        if (lnk) {
            if (window.confirm('Are you sure? You are in Quiz Page')) {
                history.push("/dashboard/results");
            }
        } else {
            history.push("/dashboard/results");
        }
    }

    return (
        <IonMenu contentId="main-content">
            <IonHeader>
                <IonToolbar color="light" >
                    <IonTitle> {localStorage.getItem("username")}</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent className="ion-padding">
                <IonList>

                    <IonMenuToggle autoHide={false}>
                        <IonItem onClick={bClick} className={location.pathname === '/dashboard/blog' ? "selected" : ''} routerLink='#' routerDirection="none">
                            <IonLabel >Blog</IonLabel>
                        </IonItem>
                        <IonItem onClick={cClick} className={location.pathname === '/dashboard/course/list' ? "selected" : ''} routerLink="#" routerDirection="none">
                            <IonLabel>Course</IonLabel>
                        </IonItem>
                        <IonItem onClick={pClick} className={location.pathname === '/dashboard/course/pending' ? "selected" : ''} routerLink="#" routerDirection="none">
                            <IonLabel>Pending Enrole</IonLabel>
                        </IonItem>
                        <IonItem onClick={mClick} className={location.pathname === '/dashboard/mycourse' ? "selected" : ''} routerLink="#" routerDirection="none">
                            <IonLabel>My Course</IonLabel>
                        </IonItem>
                        <IonItem onClick={rClick} className={location.pathname === '/dashboard/results' ? "selected" : ''} routerLink="#" routerDirection="none">
                            <IonLabel>Quiz Results</IonLabel>
                        </IonItem>

                    </IonMenuToggle>
                </IonList>

            </IonContent>
        </IonMenu>
    );
};
const TeacherMenu: React.FC = () => {


    const location = useLocation()
    return (
        <IonMenu contentId="main-content" color="primary">
            <IonHeader>
                <IonToolbar color="light" >
                    <IonTitle> {localStorage.getItem("username")}</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent className="ion-padding">
                <IonList>
                    <IonMenuToggle autoHide={false}>
                        <IonItem className={location.pathname === '/dashboard/course/list' ? "selected" : ''} routerLink="/dashboard/course/list" routerDirection="none">
                            <IonLabel>Course</IonLabel>
                        </IonItem>
                        <IonItem className={location.pathname === '/dashboard/mycourse' ? "selected" : ''} routerLink="/dashboard/mycourse" routerDirection="none">
                            <IonLabel>My Course</IonLabel>
                        </IonItem>

                    </IonMenuToggle>
                </IonList>

            </IonContent>
        </IonMenu>
    );
};
const AdminMenu: React.FC = () => {


    const location = useLocation()
    return (
        <IonMenu contentId="main-content">
            <IonHeader>
                <IonToolbar color="light" >
                    <IonTitle> {localStorage.getItem("username")}</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent className="ion-padding">
                <IonList>

                    <IonMenuToggle autoHide={false}>
                        <IonItem className={location.pathname === '/dashboard/media' ? "selected" : ''} routerLink="/dashboard/media" routerDirection="none">
                            <IonLabel>Media Gallery</IonLabel>
                        </IonItem>
                        <IonItem className={location.pathname === '/dashboard/article' ? "selected" : ''} routerLink="/dashboard/article" routerDirection="none">
                            <IonLabel>Articles</IonLabel>
                        </IonItem>
                        <IonItem className={location.pathname === '/dashboard/category' ? "selected" : ''} routerLink="/dashboard/category" routerDirection="none">
                            <IonLabel>Categories</IonLabel>
                        </IonItem>
                        <IonItem className={location.pathname === '/dashboard/group' ? "selected" : ''} routerLink="/dashboard/group" routerDirection="none">
                            <IonLabel>Groups</IonLabel>
                        </IonItem>
                        <IonItem className={location.pathname === '/dashboard/instructor' ? "selected" : ''} routerLink="/dashboard/instructor" routerDirection="none">
                            <IonLabel>Instructors</IonLabel>
                        </IonItem>
                        <IonItem className={location.pathname === '/dashboard/enrolement' ? "selected" : ''} routerLink="/dashboard/enrolement" routerDirection="none">
                            <IonLabel>Enrolements</IonLabel>
                        </IonItem>
                        <IonItem className={location.pathname === '/dashboard/course' ? "selected" : ''} routerLink="/dashboard/course" routerDirection="none">
                            <IonLabel>Courses</IonLabel>
                        </IonItem>
                        <IonItem className={location.pathname === '/dashboard/topic' ? "selected" : ''} routerLink="/dashboard/topic" routerDirection="none">
                            <IonLabel>Topics</IonLabel>
                        </IonItem>
                        <IonItem className={location.pathname === '/dashboard/quiz' ? "selected" : ''} routerLink="/dashboard/quiz" routerDirection="none">
                            <IonLabel>Quizes</IonLabel>
                        </IonItem>
                        <IonItem className={location.pathname === '/dashboard/level' ? "selected" : ''} routerLink="/dashboard/level" routerDirection="none">
                            <IonLabel>Levels</IonLabel>
                        </IonItem>
                        <IonItem className={location.pathname === '/dashboard/question' ? "selected" : ''} routerLink="/dashboard/question" routerDirection="none">
                            <IonLabel>Questions</IonLabel>
                        </IonItem>
                        <IonItem className={location.pathname === '/dashboard/trash' ? "selected" : ''} routerLink="/dashboard/trash" routerDirection="none">
                            <IonLabel>Trash</IonLabel>
                        </IonItem>

                    </IonMenuToggle>
                </IonList>

            </IonContent>
        </IonMenu>
    );
};


export default Dashboard;