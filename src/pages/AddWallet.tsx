import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonButtons, IonBackButton, IonList, IonItem, IonLabel, IonInput, IonSelect, IonSelectOption, IonButton, IonToast } from '@ionic/react';
import { useState, useEffect } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { useStore } from '../lib/store';
import { v4 as uuidv4 } from 'uuid';
import { useTranslation } from 'react-i18next';

const AddWallet: React.FC = () => {
    const { t } = useTranslation();
    const history = useHistory();
    const { id } = useParams<{ id?: string }>();
    const { addWallet, updateWallet, wallets, currentUserId } = useStore();

    const [name, setName] = useState('');
    const [type, setType] = useState('Checking');
    const [initialBalance, setInitialBalance] = useState<number | undefined>();

    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');

    useEffect(() => {
        if (id) {
            const w = wallets.find(w => w.id === id);
            if (w) {
                setName(w.name);
                setType(w.type);
                setInitialBalance(w.initial_balance);
            }
        }
    }, [id, wallets]);

    const handleSave = async () => {
        if (!name) {
            setToastMessage(t('common.please_enter_name'));
            setShowToast(true);
            return;
        }

        if (!currentUserId) {
            setToastMessage("Error: No user session found");
            setShowToast(true);
            return;
        }

        const commonData = {
            user_id: currentUserId,
            name,
            type,
            initial_balance: initialBalance || 0,
            current_balance: initialBalance || 0
        };

        try {
            if (id) {
                const existing = wallets.find(w => w.id === id);
                if (existing) {
                    await updateWallet({ ...existing, ...commonData });
                }
            } else {
                await addWallet({
                    id: uuidv4(),
                    ...commonData
                });
            }
            history.goBack();
        } catch (error: any) {
            console.error('Failed to save wallet', error);
            setToastMessage(`Error: ${error.message || JSON.stringify(error)}`);
            setShowToast(true);
        }
    };

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonButtons slot="start">
                        <IonBackButton defaultHref="/tabs/wallets" text={t('common.back')} />
                    </IonButtons>
                    <IonTitle>{id ? t('wallets.edit_wallet') : t('wallets.add_wallet')}</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent className="ion-padding">
                <IonList>
                    <IonItem>
                        <IonLabel position="stacked">{t('wallets.wallet_name')}</IonLabel>
                        <IonInput value={name} onIonInput={e => setName(e.detail.value!)} placeholder={t('wallets.wallet_name')}></IonInput>
                    </IonItem>
                    <IonItem>
                        <IonLabel position="stacked">{t('wallets.type')}</IonLabel>
                        <IonSelect value={type} onIonChange={e => setType(e.detail.value)}>
                            <IonSelectOption value="Checking">{t('wallets.types.checking')}</IonSelectOption>
                            <IonSelectOption value="Savings">{t('wallets.types.savings')}</IonSelectOption>
                            <IonSelectOption value="Credit Card">{t('wallets.types.credit_card')}</IonSelectOption>
                            <IonSelectOption value="Cash">{t('wallets.types.cash')}</IonSelectOption>
                        </IonSelect>
                    </IonItem>
                    <IonItem>
                        <IonLabel position="stacked">{t('wallets.initial_balance')}</IonLabel>
                        <IonInput type="number" value={initialBalance} onIonInput={e => setInitialBalance(parseFloat(e.detail.value!))} placeholder="0.00"></IonInput>
                    </IonItem>
                </IonList>
                <div className="p-4">
                    <IonButton expand="block" onClick={handleSave}>{t('common.save')}</IonButton>
                </div>
                <IonToast
                    isOpen={showToast}
                    onDidDismiss={() => setShowToast(false)}
                    message={toastMessage}
                    duration={2000}
                />
            </IonContent>
        </IonPage>
    );
};

export default AddWallet;
