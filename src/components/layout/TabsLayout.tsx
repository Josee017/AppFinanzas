import { IonTabs, IonTabBar, IonTabButton, IonIcon, IonLabel, IonRouterOutlet } from '@ionic/react';
import { home, wallet, pieChart, person, barChart } from 'ionicons/icons';
import { Route, Redirect } from 'react-router-dom';
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

export const TabsLayout: React.FC = () => {
    const { t } = useTranslation();

    return (
        <IonTabs>
            <IonRouterOutlet>
                <Route exact path="/tabs/home" component={Dashboard} />
                <Route exact path="/tabs/transactions" component={Transactions} />
                <Route exact path="/tabs/transactions/add" component={AddTransaction} />
                <Route exact path="/tabs/transactions/edit/:id" component={AddTransaction} />
                <Route exact path="/tabs/wallets" component={Wallets} />
                <Route exact path="/tabs/wallets/add" component={AddWallet} />
                <Route exact path="/tabs/wallets/edit/:id" component={AddWallet} />
                <Route exact path="/tabs/categories" component={Categories} />
                <Route exact path="/tabs/categories/add" component={AddCategory} />
                <Route exact path="/tabs/categories/edit/:id" component={AddCategory} />
                <Route exact path="/tabs/statistics" component={Statistics} />
                <Route exact path="/tabs/profile" component={Profile} />
                <Route exact path="/tabs">
                    <Redirect to="/tabs/home" />
                </Route>
                <Route exact path="/">
                    <Redirect to="/tabs/home" />
                </Route>
            </IonRouterOutlet>
            <IonTabBar slot="bottom" className="border-t pb-1 transition-colors duration-300 border-gray-200 bg-white/90 backdrop-blur-xl dark:border-neon-purple/30 dark:bg-black/90">
                <IonTabButton tab="home" href="/tabs/home" className="transition-colors hover:text-blue-500 selected:text-blue-600 dark:hover:text-neon-cyan dark:selected:text-neon-cyan">
                    <IonIcon icon={home} />
                    <IonLabel className="font-mono text-[10px]">{t('cyber.short_home')}</IonLabel>
                </IonTabButton>
                <IonTabButton tab="transactions" href="/tabs/transactions" className="transition-colors hover:text-blue-500 selected:text-blue-600 dark:hover:text-neon-pink dark:selected:text-neon-pink">
                    <IonIcon icon={wallet} />
                    <IonLabel className="font-mono text-[10px]">{t('cyber.short_txns')}</IonLabel>
                </IonTabButton>
                <IonTabButton tab="wallets" href="/tabs/wallets" className="transition-colors hover:text-blue-500 selected:text-blue-600 dark:hover:text-neon-green dark:selected:text-neon-green">
                    <IonIcon icon={wallet} />
                    <IonLabel className="font-mono text-[10px]">{t('cyber.short_wallets')}</IonLabel>
                </IonTabButton>
                <IonTabButton tab="categories" href="/tabs/categories" className="transition-colors hover:text-blue-500 selected:text-blue-600 dark:hover:text-neon-purple dark:selected:text-neon-purple">
                    <IonIcon icon={pieChart} />
                    <IonLabel className="font-mono text-[10px]">{t('cyber.short_cats')}</IonLabel>
                </IonTabButton>
                <IonTabButton tab="statistics" href="/tabs/statistics" className="transition-colors hover:text-blue-500 selected:text-blue-600 dark:hover:text-neon-cyan dark:selected:text-neon-cyan">
                    <IonIcon icon={barChart} />
                    <IonLabel className="font-mono text-[10px]">{t('cyber.short_stats')}</IonLabel>
                </IonTabButton>
                <IonTabButton tab="profile" href="/tabs/profile" className="transition-colors hover:text-blue-500 selected:text-blue-600 dark:hover:text-white dark:selected:text-white">
                    <IonIcon icon={person} />
                    <IonLabel className="font-mono text-[10px]">{t('cyber.short_id')}</IonLabel>
                </IonTabButton>
            </IonTabBar>
        </IonTabs>
    );
};
