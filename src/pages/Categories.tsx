import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonList, IonItem, IonLabel, IonFab, IonFabButton, IonIcon, IonItemSliding, IonItemOptions, IonItemOption, IonAlert } from '@ionic/react';
import { add, trash, cart, home, car, airplane, barChart, construct } from 'ionicons/icons';
import { useEffect, useState } from 'react';
import { useStore } from '../lib/store';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';

const iconMap: { [key: string]: string } = {
    cart, home, car, airplane, barChart, construct
};

const Categories: React.FC = () => {
    const { t } = useTranslation();
    const { categories, fetchCategories, deleteCategory } = useStore();
    const location = useLocation();
    const [categoryToDelete, setCategoryToDelete] = useState<string | null>(null);

    useEffect(() => {
        fetchCategories();
    }, [fetchCategories]);

    const handleDelete = (id: string) => {
        setCategoryToDelete(id);
    };

    const confirmDelete = async () => {
        if (categoryToDelete) {
            await deleteCategory(categoryToDelete);
            setCategoryToDelete(null);
        }
    };

    const getEditLink = (id: string) => {
        const prefix = location.pathname.startsWith('/tabs') ? '/tabs/categories' : '/categories';
        return `${prefix}/edit/${id}`;
    };

    const getAddLink = () => {
        const prefix = location.pathname.startsWith('/tabs') ? '/tabs/categories' : '/categories';
        return `${prefix}/add`;
    };

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonTitle>{t('categories.title')}</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent fullscreen>
                <IonHeader collapse="condense">
                    <IonToolbar>
                        <IonTitle size="large">{t('categories.title')}</IonTitle>
                    </IonToolbar>
                </IonHeader>

                <IonList>
                    {categories.length === 0 ? (
                        <div className="text-center p-8 text-gray-500">
                            {t('categories.no_categories')}
                        </div>
                    ) : (
                        categories.map(c => (
                            <IonItemSliding key={c.id}>
                                <IonItem routerLink={getEditLink(c.id)} detail>
                                    <IonIcon icon={iconMap[c.icon] || cart} slot="start" />
                                    <IonLabel>
                                        <h2>{c.name}</h2>
                                        <p className="capitalize">{c.type}</p>
                                    </IonLabel>
                                </IonItem>

                                <IonItemOptions side="end">
                                    <IonItemOption color="danger" onClick={() => handleDelete(c.id)}>
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
                    isOpen={!!categoryToDelete}
                    onDidDismiss={() => setCategoryToDelete(null)}
                    header={t('common.delete') + '?'}
                    message={t('common.confirm_delete_message')}
                    buttons={[
                        {
                            text: t('common.cancel'),
                            role: 'cancel',
                            handler: () => setCategoryToDelete(null)
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

export default Categories;
