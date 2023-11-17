import { Redirect, Route } from 'react-router-dom';
import { IonApp, IonContent, setupIonicReact } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { IonRouterOutlet } from "@ionic/react";

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

/* Theme variables */
import './theme/variables.css';

import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import { useEffect, useState } from "react";
import Nav from './components/Nav';
import SignUp from './pages/SignUp';
import ViewBlog from './pages/user/blog/ViewBlog';
import Blog from './pages/user/blog/Blog';
import CategoryBlog from './pages/user/blog/CategoryBlog';


setupIonicReact();

const App: React.FC = () => {
  const [isAuth, setAuth] = useState(false);

  useEffect(() => {
    isLogin();
  }, []);

  const isLogin = () => {
    const token = localStorage.getItem("token");
    token !== null && setAuth(true);
  };

  return (

    <IonApp>

      <IonReactRouter>
        <Nav isAuth={isAuth} />
        <IonContent>

          <IonRouterOutlet>

            < Route exact path="/">
              <Blog />
              {localStorage.getItem("token") != null &&
                <Redirect to="/dashboard" />

              }
            </Route>

            <Route exact path={`/:slug`}>
              <CategoryBlog />
            </Route>
            <Route exact path={`/:date/:date/:date/:slug`}>
              <ViewBlog />
            </Route>
            <Route exact path="/signup">
              <SignUp />
            </Route>
            <Route exact path="/login" >
              <Login onLogin={isLogin} />
            </Route>
            <Route path="/dashboard" component={Dashboard} />

          </IonRouterOutlet>
        </IonContent>

      </IonReactRouter>

    </IonApp >

  );
}

export default App;
