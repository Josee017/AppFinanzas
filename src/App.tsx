import React from 'react';
import { IonApp, IonRouterOutlet, setupIonicReact } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { Redirect, Route } from 'react-router-dom';
import { AuthProvider } from './lib/auth';
import Login from './pages/Login';
import Register from './pages/Register';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { TabsLayout } from './components/layout/TabsLayout';
import { SidebarLayout } from './components/layout/SidebarLayout';
import { useStore } from './lib/store';

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

/* Theme variables */
import './theme/variables.css';
import './index.css';

setupIonicReact();

const App: React.FC = () => {
  // DEBUG TRACE
  console.log('App Component Rendering');
  const isDesktop = window.innerWidth > 768;
  const themeMode = useStore(state => state.themeMode);

  React.useEffect(() => {
    document.body.classList.toggle('dark', themeMode === 'dark');
  }, [themeMode]);

  return (
    <IonApp>
      <AuthProvider>
        <IonReactRouter>
          <IonRouterOutlet>
            <Route exact path="/login" component={Login} />
            <Route exact path="/register" component={Register} />
            <Route exact path="/">
              <Redirect to="/register" />
            </Route>
            <Route exact path="/dashboard">
              {isDesktop ? <Redirect to="/home" /> : <Redirect to="/tabs/home" />}
            </Route>

            {/* Catch-all for app routes (home, transactions, etc.) */}
            <Route
              render={() => (
                <ProtectedRoute>
                  {isDesktop ? <SidebarLayout /> : <TabsLayout />}
                </ProtectedRoute>
              )}
            />
          </IonRouterOutlet>
        </IonReactRouter>
      </AuthProvider>
    </IonApp>
  );
};

export default App;
