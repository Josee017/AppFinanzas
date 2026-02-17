import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonList, IonItem, IonLabel, IonToggle, IonSelect, IonSelectOption, IonIcon } from '@ionic/react';
import { moon, globe, person } from 'ionicons/icons';
import { useTranslation } from 'react-i18next';
import { useStore } from '../lib/store';
import { supabase } from '../lib/supabase';

const Profile: React.FC = () => {
    const { t, i18n } = useTranslation();
    const { themeMode, setThemeMode } = useStore();

    const toggleDarkMode = (ev: any) => {
        setThemeMode(ev.detail.checked ? 'dark' : 'light');
    };

    const changeLanguage = (lang: string) => {
        i18n.changeLanguage(lang);
    };

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonTitle>{t('tabs.profile')}</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent fullscreen>
                <IonList inset>
                    <IonItem>
                        <IonIcon slot="start" icon={moon} />
                        <IonLabel>{t('profile.dark_mode')}</IonLabel>
                        <IonToggle checked={themeMode === 'dark'} onIonChange={toggleDarkMode} />
                    </IonItem>
                    <IonItem>
                        <IonIcon slot="start" icon={globe} />
                        <IonLabel>{t('profile.language')}</IonLabel>
                        <IonSelect value={i18n.language.split('-')[0]} interface="popover" onIonChange={e => changeLanguage(e.detail.value)}>
                            <IonSelectOption value="en">{t('profile.english')}</IonSelectOption>
                            <IonSelectOption value="es">{t('profile.spanish')}</IonSelectOption>
                        </IonSelect>
                    </IonItem>
                </IonList>

                <div className="p-4 mt-4">
                    <button
                        onClick={() => {
                            useStore.getState().reset(); // Clear store
                            supabase.auth.signOut();
                        }}
                        className="w-full bg-red-500 hover:bg-red-600 text-white font-bold py-3 px-4 rounded-lg shadow-lg transition-colors flex items-center justify-center gap-2"
                    >
                        <IonIcon icon={person} />
                        {t('auth.logout') || 'Cerrar Sesión'}
                    </button>
                    <p className="text-center text-xs text-gray-500 mt-4 font-mono">
                        v3.0.0 (DB: V3) - {themeMode === 'dark' ? 'Cyberpunk' : 'Light'} Mode
                    </p>
                </div>
            </IonContent>
        </IonPage>
    );
};

export default Profile;
