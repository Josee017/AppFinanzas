import { IonContent, IonIcon, IonItem, IonLabel, IonList, IonMenu, IonMenuToggle, IonRouterOutlet, IonSplitPane } from '@ionic/react';
import { home, wallet, pieChart, person } from 'ionicons/icons';
import { Redirect, Route } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { useTranslation } from 'react-i18next';
import Dashboard from '../../pages/Dashboard';
import Transactions from '../../pages/Transactions';
import AddTransaction from '../../pages/AddTransaction';

import Wallets from '../../pages/Wallets';
import AddWallet from '../../pages/AddWallet';
import Categories from '../../pages/Categories';
import AddCategory from '../../pages/AddCategory';
import Profile from '../../pages/Profile';

import Statistics from '../../pages/Statistics';

export const SidebarLayout: React.FC = () => {
    const { t } = useTranslation();

    const appPages = [
        { title: t('tabs.home'), url: '/home', icon: home },
        { title: t('tabs.transactions'), url: '/transactions', icon: wallet },
        { title: t('tabs.wallets'), url: '/wallets', icon: wallet },
        { title: t('tabs.categories'), url: '/categories', icon: pieChart },
        { title: t('tabs.statistics'), url: '/statistics', icon: pieChart },
        { title: t('tabs.profile'), url: '/profile', icon: person }
    ];

    return (
        <IonSplitPane contentId="main">
            <IonMenu contentId="main" type="overlay" className="border-r border-gray-200 dark:border-gray-800">
                <IonContent className="ion-no-padding" style={{ '--background': 'var(--ion-background-color)' }}>
                    <div className="p-6 text-center border-b border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-black/50 backdrop-blur-md">
                        <h1 className="text-2xl font-black tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500 drop-shadow-sm dark:from-neon-pink dark:to-neon-cyan dark:drop-shadow-[0_0_5px_rgba(255,0,255,0.5)]">
                            FINANCE FLOW
                        </h1>
                        <p className="text-xs tracking-[0.2em] mt-1 opacity-80 text-gray-500 dark:text-neon-purple">CYBER SYSTEM v2.0</p>
                    </div>
                    <IonList id="inbox-list" className="bg-transparent pt-4">
                        {appPages.map((appPage, index) => (
                            <IonMenuToggle key={index} autoHide={false}>
                                <IonItem
                                    routerLink={appPage.url}
                                    routerDirection="none"
                                    lines="none"
                                    detail={false}
                                    className="mb-1 mx-2 rounded-lg transition-all duration-300 hover:scale-[1.02] group"
                                    style={{ '--background': 'transparent', '--color': 'var(--ion-text-color)' }}
                                >
                                    <IonIcon slot="start" icon={appPage.icon} className="transition-colors group-hover:text-blue-600 dark:group-hover:text-neon-cyan" />
                                    <IonLabel className="font-mono tracking-wide transition-colors group-hover:text-blue-600 dark:group-hover:text-neon-cyan">{appPage.title}</IonLabel>
                                </IonItem>
                            </IonMenuToggle>
                        ))}
                        <div className="my-4 border-t border-gray-200 dark:border-gray-800 mx-4" />
                        <IonMenuToggle autoHide={false}>
                            <IonItem
                                button
                                onClick={() => supabase.auth.signOut()}
                                lines="none"
                                className="mx-2 rounded-lg text-red-600 hover:text-red-700 dark:text-red-500 dark:hover:text-neon-pink transition-colors"
                                style={{ '--background': 'transparent' }}
                            >
                                <IonIcon slot="start" icon={person} />
                                <IonLabel className="font-mono">ABORT SESSION</IonLabel>
                            </IonItem>
                        </IonMenuToggle>
                    </IonList>
                </IonContent>
            </IonMenu>
            <IonRouterOutlet id="main">
                <Route exact path="/home" component={Dashboard} />
                <Route exact path="/transactions" component={Transactions} />
                <Route exact path="/transactions/add" component={AddTransaction} />
                <Route exact path="/transactions/edit/:id" component={AddTransaction} />
                <Route exact path="/wallets" component={Wallets} />
                <Route exact path="/wallets/add" component={AddWallet} />
                <Route exact path="/wallets/edit/:id" component={AddWallet} />
                <Route exact path="/categories" component={Categories} />
                <Route exact path="/categories/add" component={AddCategory} />
                <Route exact path="/categories/edit/:id" component={AddCategory} />
                <Route exact path="/statistics" component={Statistics} />
                <Route exact path="/profile" component={Profile} />
                <Route exact path="/">
                    <Redirect to="/home" />
                </Route>
            </IonRouterOutlet>
        </IonSplitPane>
    );
};
