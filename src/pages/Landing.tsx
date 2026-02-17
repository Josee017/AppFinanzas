import { IonPage, IonContent, IonButton, IonIcon } from '@ionic/react';
import { logInOutline, personAddOutline, walletOutline } from 'ionicons/icons';
import { useHistory } from 'react-router-dom';

const Landing: React.FC = () => {
    console.log('Rendering Landing Page');
    const history = useHistory();

    return (
        <>
            <div style={{ position: 'absolute', top: 0, left: 0, zIndex: 9999, color: 'red', background: 'yellow' }}>
                DEBUG: Landing Page Loaded
            </div>
            <IonPage>
                <IonContent className="ion-padding" fullscreen>
                    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 px-6">
                        <div className="text-center mb-12">
                            <div className="bg-white dark:bg-gray-700 p-4 rounded-full shadow-lg inline-block mb-6">
                                <IonIcon icon={walletOutline} className="text-6xl text-blue-600 dark:text-blue-400" />
                            </div>
                            <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight mb-4">
                                Finance Flow
                            </h1>
                            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-xs mx-auto">
                                Master your money, anytime, anywhere. Experience the freedom of offline-first finance.
                            </p>
                        </div>

                        <div className="w-full max-w-sm space-y-4">
                            <IonButton
                                expand="block"
                                className="h-14 font-bold text-lg shadow-md"
                                color="primary"
                                onClick={() => history.push('/login')}
                            >
                                <IonIcon slot="start" icon={logInOutline} />
                                Log In
                            </IonButton>

                            <IonButton
                                expand="block"
                                className="h-14 font-bold text-lg shadow-sm"
                                fill="outline"
                                color="secondary"
                                onClick={() => history.push('/register')}
                            >
                                <IonIcon slot="start" icon={personAddOutline} />
                                Create Account
                            </IonButton>
                        </div>

                        <div className="mt-12 text-center">
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                Secure • Private • reliable
                            </p>
                        </div>
                    </div>
                </IonContent>
            </IonPage>
        </>
    );
};

export default Landing;
