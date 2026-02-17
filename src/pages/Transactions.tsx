import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonList, IonItem, IonLabel, IonNote, IonFab, IonFabButton, IonIcon, IonItemSliding, IonItemOptions, IonItemOption, IonAlert, IonSpinner } from '@ionic/react';
import { add, trash, walletOutline, pricetagOutline } from 'ionicons/icons';
import { useEffect, useState } from 'react';
import { useStore } from '../lib/store';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';

const Transactions: React.FC = () => {
    const { t } = useTranslation();
    const { transactions, wallets, categories, fetchTransactions, fetchWallets, fetchCategories, deleteTransaction, isLoading } = useStore();
    const location = useLocation();
    const [transactionToDelete, setTransactionToDelete] = useState<string | null>(null);

    useEffect(() => {
        const loadData = async () => {
            await Promise.all([
                fetchTransactions(),
                fetchWallets(),
                fetchCategories()
            ]);
        };
        loadData();
    }, [fetchTransactions, fetchWallets, fetchCategories]);

    const handleDelete = (id: string) => {
        setTransactionToDelete(id);
    };

    const confirmDelete = async () => {
        if (transactionToDelete) {
            await deleteTransaction(transactionToDelete);
            setTransactionToDelete(null);
        }
    };

    const getEditLink = (id: string) => {
        const prefix = location.pathname.startsWith('/tabs') ? '/tabs/transactions' : '/transactions';
        return `${prefix}/edit/${id}`;
    };

    const getAddLink = () => {
        const prefix = location.pathname.startsWith('/tabs') ? '/tabs/transactions' : '/transactions';
        return `${prefix}/add`;
    };

    const getCategoryName = (categoryId: string) => {
        const cat = categories.find(c => c.id === categoryId);
        return cat ? cat.name : t('common.unknown_category') || 'Unknown Category';
    };

    const getWalletName = (walletId: string) => {
        const wallet = wallets.find(w => w.id === walletId);
        return wallet ? wallet.name : t('common.unknown_wallet') || 'Unknown Wallet';
    };

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonTitle>{t('transactions.title')}</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent fullscreen>
                <IonHeader collapse="condense">
                    <IonToolbar>
                        <IonTitle size="large">{t('transactions.title')}</IonTitle>
                    </IonToolbar>
                </IonHeader>

                {isLoading && (
                    <div className="flex justify-center p-4">
                        <IonSpinner />
                    </div>
                )}

                <IonList>
                    {transactions.length === 0 && !isLoading ? (
                        <div className="text-center p-8 text-gray-500">
                            {t('dashboard.no_transactions')}
                        </div>
                    ) : (
                        transactions.map(tx => (
                            <IonItemSliding key={tx.id}>
                                <IonItem routerLink={getEditLink(tx.id)} detail lines="full">
                                    <IonLabel className="ion-text-wrap">
                                        <h2 className="font-bold text-lg">{tx.note || getCategoryName(tx.category_id)}</h2>
                                        <div className="flex flex-col gap-1 mt-1">
                                            <p className="flex items-center text-sm text-gray-500">
                                                <IonIcon icon={pricetagOutline} className="mr-1 text-xs" />
                                                {getCategoryName(tx.category_id)}
                                            </p>
                                            <p className="flex items-center text-sm text-gray-500">
                                                <IonIcon icon={walletOutline} className="mr-1 text-xs" />
                                                {getWalletName(tx.wallet_id)}
                                            </p>
                                            <p className="text-xs text-gray-400">
                                                {new Date(tx.date).toLocaleDateString()}
                                            </p>
                                        </div>
                                    </IonLabel>
                                    <IonNote slot="end" color={tx.amount < 0 ? 'danger' : 'success'} className="font-bold text-base">
                                        {tx.amount < 0 ? '-' : '+'}${Math.abs(tx.amount).toFixed(2)}
                                    </IonNote>
                                </IonItem>

                                <IonItemOptions side="end">
                                    <IonItemOption color="danger" onClick={() => handleDelete(tx.id)}>
                                        <IonIcon slot="icon-only" icon={trash} />
                                    </IonItemOption>
                                </IonItemOptions>
                            </IonItemSliding>
                        ))
                    )}
                </IonList>

                <IonFab vertical="bottom" horizontal="end" slot="fixed">
                    <IonFabButton routerLink={getAddLink()}>
                        <IonIcon icon={add} />
                    </IonFabButton>
                </IonFab>

                <IonAlert
                    isOpen={!!transactionToDelete}
                    onDidDismiss={() => setTransactionToDelete(null)}
                    header={t('common.delete') + '?'}
                    message={t('common.confirm_delete_message')}
                    buttons={[
                        {
                            text: t('common.cancel'),
                            role: 'cancel',
                            handler: () => setTransactionToDelete(null)
                        },
                        {
                            text: t('common.delete'),
                            role: 'confirm',
                            handler: confirmDelete
                        }
                    ]}
                />
            </IonContent>
        </IonPage>
    );
};

export default Transactions;
