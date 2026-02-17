import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonButtons, IonBackButton, IonList, IonItem, IonLabel, IonInput, IonSelect, IonSelectOption, IonButton, IonToast } from '@ionic/react';
import { useState, useEffect } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { useStore } from '../lib/store';
import { v4 as uuidv4 } from 'uuid';
import { useTranslation } from 'react-i18next';

const AddCategory: React.FC = () => {
    const { t } = useTranslation();
    const history = useHistory();
    const { id } = useParams<{ id?: string }>();
    const { addCategory, updateCategory, categories, currentUserId } = useStore();

    const [name, setName] = useState('');
    const [type, setType] = useState<'income' | 'expense'>('expense');
    const [icon, setIcon] = useState('cart');

    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');

    useEffect(() => {
        if (id) {
            const c = categories.find(c => c.id === id);
            if (c) {
                setName(c.name);
                setType(c.type);
                setIcon(c.icon);
            }
        }
    }, [id, categories]);

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
            icon
        };

        try {
            if (id) {
                const existing = categories.find(c => c.id === id);
                if (existing) {
                    await updateCategory({ ...existing, ...commonData });
                }
            } else {
                await addCategory({
                    id: uuidv4(),
                    ...commonData
                });
            }
            history.goBack();
        } catch (error: any) {
            console.error('Failed to save category', error);
            setToastMessage(`Error: ${error.message || JSON.stringify(error)}`);
            setShowToast(true);
        }
    };

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonButtons slot="start">
                        <IonBackButton defaultHref="/tabs/categories" text={t('common.back')} />
                    </IonButtons>
                    <IonTitle>{id ? t('categories.edit_category') : t('categories.add_category')}</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent className="ion-padding">
                <IonList>
                    <IonItem>
                        <IonSelect value={type} onIonChange={e => setType(e.detail.value)}>
                            <IonSelectOption value="expense">{t('transactions.expense')}</IonSelectOption>
                            <IonSelectOption value="income">{t('transactions.income')}</IonSelectOption>
                        </IonSelect>
                    </IonItem>
                    <IonItem>
                        <IonLabel position="stacked">{t('categories.category_name')}</IonLabel>
                        <IonInput value={name} onIonInput={e => setName(e.detail.value!)}></IonInput>
                    </IonItem>
                    <IonItem>
                        <IonLabel position="stacked">{t('categories.icon')}</IonLabel>
                        <IonSelect value={icon} onIonChange={e => setIcon(e.detail.value)}>
                            <IonSelectOption value="cart">{t('categories.icons.cart')}</IonSelectOption>
                            <IonSelectOption value="home">{t('categories.icons.home')}</IonSelectOption>
                            <IonSelectOption value="car">{t('categories.icons.car')}</IonSelectOption>
                            <IonSelectOption value="airplane">{t('categories.icons.travel')}</IonSelectOption>
                            <IonSelectOption value="barChart">{t('categories.icons.chart')}</IonSelectOption>
                            <IonSelectOption value="construct">{t('categories.icons.utility')}</IonSelectOption>
                        </IonSelect>
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

export default AddCategory;
