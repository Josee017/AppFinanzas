import React from 'react';
import { Redirect } from 'react-router-dom';
import { useAuth } from '../../lib/auth';
import { IonPage, IonContent, IonSpinner } from '@ionic/react';

interface ProtectedRouteProps {
    children: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
    const { session, loading } = useAuth();

    if (loading) {
        return (
            <IonPage>
                <IonContent className="ion-padding">
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                        <IonSpinner />
                    </div>
                </IonContent>
            </IonPage>
        );
    }

    if (!session) {
        return <Redirect to="/login" />;
    }

    return <>{children}</>;
};
