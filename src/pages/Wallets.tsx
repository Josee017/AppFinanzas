import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonList, IonItem, IonLabel, IonNote, IonFab, IonFabButton, IonIcon, IonItemSliding, IonItemOptions, IonItemOption, IonAlert } from '@ionic/react';
import { add, trash, wallet as walletIcon } from 'ionicons/icons';
import { useEffect, useState } from 'react';
import { useStore } from '../lib/store';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';

const Wallets: React.FC = () => {
    const { t } = useTranslation();
    const { wallets, fetchWallets, deleteWallet } = useStore();
    const location = useLocation();
    const [walletToDelete, setWalletToDelete] = useState<string | null>(null);

    useEffect(() => {
        fetchWallets();
    }, [fetchWallets]);

    const handleDelete = (id: string) => {
        setWalletToDelete(id);
    };

    const confirmDelete = async () => {
        if (walletToDelete) {
            await deleteWallet(walletToDelete);
            setWalletToDelete(null);
        }
    };

    const getEditLink = (id: string) => {
        const prefix = location.pathname.startsWith('/tabs') ? '/tabs/wallets' : '/wallets';
        return `${prefix}/edit/${id}`;
    };

    const getAddLink = () => {
        const prefix = location.pathname.startsWith('/tabs') ? '/tabs/wallets' : '/wallets';
        return `${prefix}/add`;
    };

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonTitle>{t('wallets.title')}</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent fullscreen>
                <IonHeader collapse="condense">
                    <IonToolbar>
                        <IonTitle size="large">{t('wallets.title')}</IonTitle>
                    </IonToolbar>
                </IonHeader>

                <IonList>
                    {wallets.length === 0 ? (
                        <div className="text-center p-8 text-gray-500">
                            {t('common.no_wallets')}
                        </div>
                    ) : (
                        wallets.map(w => (
                            <IonItemSliding key={w.id}>
                                <IonItem routerLink={getEditLink(w.id)} detail>
                                    <IonIcon icon={walletIcon} slot="start" />
                                    <IonLabel>
                                        <h2>{w.name}</h2>
                                        <p>{w.type}</p>
                                    </IonLabel>
                                    <IonNote slot="end">
                                        ${w.initial_balance.toFixed(2)}
                                    </IonNote>
                                </IonItem>

                                <IonItemOptions side="end">
                                    <IonItemOption color="danger" onClick={() => handleDelete(w.id)}>
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
                    isOpen={!!walletToDelete}
                    onDidDismiss={() => setWalletToDelete(null)}
                    header={t('common.delete') + '?'}
                    message={t('common.confirm_delete_message')}
                    buttons={[
                        {
                            text: t('common.cancel'),
                            role: 'cancel',
                            handler: () => setWalletToDelete(null)
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

export default Wallets;
