import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonButtons, IonBackButton, IonList, IonItem, IonLabel, IonInput, IonSelect, IonSelectOption, IonDatetime, IonButton, IonDatetimeButton, IonModal, IonToast } from '@ionic/react';
import { useState, useEffect } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { useStore } from '../lib/store';
import { v4 as uuidv4 } from 'uuid';
import { useTranslation } from 'react-i18next';

const AddTransaction: React.FC = () => {
    const { t } = useTranslation();
    const history = useHistory();
    const { id } = useParams<{ id?: string }>();

    const { addTransaction, updateTransaction, transactions, wallets, categories, currentUserId, fetchWallets, fetchCategories } = useStore();

    const [amount, setAmount] = useState<number | undefined>();
    const [note, setNote] = useState('');
    const [type, setType] = useState<'income' | 'expense'>('expense');
    const [date, setDate] = useState(new Date().toISOString());
    const [walletId, setWalletId] = useState<string>('');
    const [categoryId, setCategoryId] = useState<string>('');

    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');

    useEffect(() => {
        fetchWallets();
        fetchCategories();
    }, [fetchWallets, fetchCategories]);

    useEffect(() => {
        if (id) {
            const tx = transactions.find(t => t.id === id);
            if (tx) {
                setAmount(Math.abs(tx.amount));
                setNote(tx.note || '');
                setType(tx.amount < 0 ? 'expense' : 'income');
                setDate(tx.date);
                setWalletId(tx.wallet_id || '');
                setCategoryId(tx.category_id || '');
            }
        }
    }, [id, transactions]);

    const handleSave = async () => {
        if (!amount) {
            setToastMessage(t('common.please_enter_amount'));
            setShowToast(true);
            return;
        }

        if (!walletId) {
            setToastMessage(t('common.please_select_wallet') || 'Please select a wallet');
            setShowToast(true);
            return;
        }

        if (!categoryId) {
            setToastMessage(t('common.please_select_category') || 'Please select a category');
            setShowToast(true);
            return;
        }

        if (!currentUserId) {
            setToastMessage("Error: No user session found");
            setShowToast(true);
            return;
        }

        const finalAmount = type === 'expense' ? -Math.abs(amount) : Math.abs(amount);
        const commonData = {
            user_id: currentUserId,
            wallet_id: walletId,
            category_id: categoryId,
            amount: finalAmount,
            date,
            note,
            type: type
        };

        try {
            if (id) {
                const existing = transactions.find(t => t.id === id);
                if (existing) {
                    await updateTransaction({
                        ...existing,
                        ...commonData
                    });
                }
            } else {
                await addTransaction({
                    id: uuidv4(),
                    ...commonData
                });
            }
            history.goBack();
        } catch (error: any) {
            console.error('Failed to save transaction', error);
            setToastMessage(`Error: ${error.message || JSON.stringify(error)}`);
            setShowToast(true);
        }
    };

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonButtons slot="start">
                        <IonBackButton defaultHref="/tabs/transactions" text={t('common.back')} />
                    </IonButtons>
                    <IonTitle>{id ? t('transactions.edit_title') : t('transactions.add_title')}</IonTitle>
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
                        <IonLabel position="stacked">{t('wallets.title') || 'Wallet'}</IonLabel>
                        <IonSelect value={walletId} onIonChange={e => setWalletId(e.detail.value)} placeholder="Select Wallet">
                            {wallets.map(wallet => (
                                <IonSelectOption key={wallet.id} value={wallet.id}>
                                    {wallet.name}
                                </IonSelectOption>
                            ))}
                        </IonSelect>
                    </IonItem>

                    <IonItem>
                        <IonLabel position="stacked">{t('categories.title') || 'Category'}</IonLabel>
                        <IonSelect value={categoryId} onIonChange={e => setCategoryId(e.detail.value)} placeholder="Select Category">
                            {categories.filter(c => c.type === type).map(category => (
                                <IonSelectOption key={category.id} value={category.id}>
                                    {category.name}
                                </IonSelectOption>
                            ))}
                        </IonSelect>
                    </IonItem>

                    <IonItem>
                        <IonLabel position="stacked">{t('transactions.amount')}</IonLabel>
                        <IonInput type="number" value={amount} onIonInput={e => setAmount(parseFloat(e.detail.value!))} placeholder="0.00"></IonInput>
                    </IonItem>
                    <IonItem>
                        <IonLabel position="stacked">{t('transactions.description')}</IonLabel>
                        <IonInput value={note} onIonInput={e => setNote(e.detail.value!)} placeholder={t('transactions.description')}></IonInput>
                    </IonItem>
                    <IonItem>
                        <IonLabel>{t('transactions.date')}</IonLabel>
                        <IonDatetimeButton datetime="datetime"></IonDatetimeButton>
                        <IonModal keepContentsMounted={true}>
                            <IonDatetime id="datetime" value={date} onIonChange={e => setDate(e.detail.value as string)} presentation="date"></IonDatetime>
                        </IonModal>
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

export default AddTransaction;
