import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonIcon, IonFab, IonFabButton, IonList, IonItem, IonLabel, IonNote } from '@ionic/react';
import { add, arrowUp, arrowDown, wallet, time } from 'ionicons/icons';
import { useTranslation } from 'react-i18next';
import { useStore } from '../lib/store';
import { useEffect, useMemo } from 'react';

const Dashboard: React.FC = () => {
    const { t } = useTranslation();
    const { transactions, fetchAll } = useStore();

    useEffect(() => {
        fetchAll();
    }, [fetchAll]);

    const stats = useMemo(() => {
        let income = 0;
        let expense = 0;
        transactions.forEach(tx => {
            if (tx.amount > 0) income += tx.amount;
            else expense += Math.abs(tx.amount);
        });
        return {
            income,
            expense,
            balance: income - expense
        };
    }, [transactions]);

    const recentTransactions = transactions.slice(0, 5);

    return (
        <IonPage>
            <IonHeader className="ion-no-border">
                <IonToolbar className="transition-colors duration-300" style={{ '--background': 'transparent' }}>
                    <div className="bg-white/90 dark:bg-black/80 backdrop-blur-md border-b border-gray-200 dark:border-neon-purple/30 p-2">
                        <IonTitle className={`font-black tracking-widest text-center ${useStore.getState().themeMode === 'dark'
                                ? 'text-transparent bg-clip-text bg-gradient-to-r from-neon-pink via-neon-purple to-neon-cyan drop-shadow-[0_0_5px_rgba(255,0,255,0.8)] animate-pulse'
                                : 'text-gray-900'
                            }`}>
                            {t('dashboard.title')}
                        </IonTitle>
                    </div>
                </IonToolbar>
            </IonHeader>
            <IonContent fullscreen className="transition-colors duration-300">
                <div className={`p-4 safe-area-top relative overflow-hidden min-h-full ${useStore.getState().themeMode === 'dark' ? 'bg-cyber-black' : 'bg-gray-50'}`}>

                    {/* Cyber Grid Background Effect (Dark Mode Only) */}
                    {useStore.getState().themeMode === 'dark' && (
                        <div className="absolute inset-0 z-0 opacity-20 pointer-events-none"
                            style={{
                                backgroundImage: 'linear-gradient(rgba(0, 255, 255, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 0, 255, 0.1) 1px, transparent 1px)',
                                backgroundSize: '40px 40px'
                            }}>
                        </div>
                    )}

                    {/* Main Balance Card */}
                    <div className={`relative z-10 rounded-lg p-6 mb-8 group overflow-hidden transition-all duration-300 ${useStore.getState().themeMode === 'dark'
                            ? 'bg-black/40 backdrop-blur-xl border border-neon-cyan/50 shadow-[0_0_20px_rgba(0,255,255,0.2)]'
                            : 'bg-white shadow-lg border border-gray-100'
                        }`}>
                        {/* Decorative Corner (Dark Mode Only) */}
                        {useStore.getState().themeMode === 'dark' && (
                            <>
                                <div className="absolute top-0 right-0 w-16 h-16 border-t-2 border-r-2 border-neon-pink rounded-tr-lg"></div>
                                <div className="absolute bottom-0 left-0 w-16 h-16 border-b-2 border-l-2 border-neon-pink rounded-bl-lg"></div>
                                <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
                                    <IonIcon icon={wallet} style={{ fontSize: '120px', color: 'var(--neon-cyan)' }} />
                                </div>
                            </>
                        )}

                        <div className="relative z-10">
                            <h2 className={`text-xs font-mono tracking-[0.2em] mb-2 uppercase ${useStore.getState().themeMode === 'dark' ? 'text-neon-cyan' : 'text-gray-500'}`}>
                                {t('dashboard.total_balance')}
                            </h2>
                            <h1 className={`text-5xl font-black mb-6 ${useStore.getState().themeMode === 'dark'
                                    ? 'text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]'
                                    : 'text-gray-900'
                                }`}>
                                ${stats.balance.toFixed(2)}
                            </h1>

                            <div className="flex gap-4">
                                <div className={`flex-1 rounded-lg p-3 backdrop-blur-sm ${useStore.getState().themeMode === 'dark'
                                        ? 'bg-black/60 border border-neon-green/30 shadow-[0_0_10px_rgba(0,255,0,0.1)]'
                                        : 'bg-green-50 border border-green-100'
                                    }`}>
                                    <div className={`flex items-center gap-2 mb-1 ${useStore.getState().themeMode === 'dark' ? 'text-neon-green' : 'text-green-600'}`}>
                                        <div className={`p-1 rounded-full ${useStore.getState().themeMode === 'dark' ? 'bg-neon-green/20' : 'bg-green-100'}`}>
                                            <IonIcon icon={arrowUp} size="small" />
                                        </div>
                                        <span className="text-[10px] font-mono tracking-wider uppercase">{t('dashboard.income_month')}</span>
                                    </div>
                                    <p className={`text-lg font-bold ml-1 ${useStore.getState().themeMode === 'dark'
                                            ? 'text-white drop-shadow-[0_0_5px_rgba(0,255,0,0.5)]'
                                            : 'text-gray-900'
                                        }`}>
                                        +${stats.income.toFixed(2)}
                                    </p>
                                </div>
                                <div className={`flex-1 rounded-lg p-3 backdrop-blur-sm ${useStore.getState().themeMode === 'dark'
                                        ? 'bg-black/60 border border-neon-red/30 shadow-[0_0_10px_rgba(255,0,0,0.1)]'
                                        : 'bg-red-50 border border-red-100'
                                    }`}>
                                    <div className={`flex items-center gap-2 mb-1 ${useStore.getState().themeMode === 'dark' ? 'text-neon-red' : 'text-red-600'}`}>
                                        <div className={`p-1 rounded-full ${useStore.getState().themeMode === 'dark' ? 'bg-neon-red/20' : 'bg-red-100'}`}>
                                            <IonIcon icon={arrowDown} size="small" />
                                        </div>
                                        <span className="text-[10px] font-mono tracking-wider uppercase">{t('dashboard.expenses_month')}</span>
                                    </div>
                                    <p className={`text-lg font-bold ml-1 ${useStore.getState().themeMode === 'dark'
                                            ? 'text-white drop-shadow-[0_0_5px_rgba(255,0,0,0.5)]'
                                            : 'text-gray-900'
                                        }`}>
                                        -${stats.expense.toFixed(2)}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Recent Transactions */}
                    <div className="flex justify-between items-center mb-4 px-1 relative z-10">
                        <h3 className={`text-lg font-bold tracking-wider uppercase ${useStore.getState().themeMode === 'dark'
                                ? 'text-neon-purple drop-shadow-[0_0_5px_rgba(191,0,255,0.6)]'
                                : 'text-gray-800'
                            }`}>
                            {t('dashboard.recent_transactions')}
                        </h3>
                        <span
                            className={`text-[10px] font-mono border px-3 py-1 rounded cursor-pointer transition-all ${useStore.getState().themeMode === 'dark'
                                    ? 'text-neon-cyan border-neon-cyan/50 hover:bg-neon-cyan hover:text-black shadow-[0_0_5px_rgba(0,255,255,0.3)] hover:shadow-[0_0_15px_rgba(0,255,255,0.6)]'
                                    : 'text-blue-600 border-blue-200 hover:bg-blue-50'
                                }`}
                            onClick={() => { }}
                        >
                            {t('common.view_all')}
                        </span>
                    </div>

                    <div className={`rounded-lg overflow-hidden relative z-10 transition-all duration-300 ${useStore.getState().themeMode === 'dark'
                            ? 'bg-black/40 backdrop-blur-md border border-neon-purple/30 shadow-[0_0_15px_rgba(191,0,255,0.1)]'
                            : 'bg-white shadow-md border border-gray-100'
                        }`}>
                        {transactions.length === 0 ? (
                            <div className="p-8 text-center flex flex-col items-center">
                                <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-3 ${useStore.getState().themeMode === 'dark'
                                        ? 'bg-black/50 border border-neon-purple/50 shadow-[0_0_10px_rgba(191,0,255,0.3)]'
                                        : 'bg-gray-100 border border-gray-200'
                                    }`}>
                                    <IonIcon icon={time} className={useStore.getState().themeMode === 'dark' ? 'text-neon-purple' : 'text-gray-400'} />
                                </div>
                                <p className={`font-mono text-sm ${useStore.getState().themeMode === 'dark' ? 'text-neon-purple/70' : 'text-gray-500'}`}>
                                    {t('dashboard.no_transactions')}
                                </p>
                            </div>
                        ) : (
                            <IonList lines="none" className="bg-transparent">
                                {recentTransactions.map(tx => (
                                    <IonItem key={tx.id} button detail={false} className={`border-b last:border-b-0 ${useStore.getState().themeMode === 'dark' ? 'border-neon-purple/10' : 'border-gray-100'
                                        }`} style={{ '--background': 'transparent', '--color': 'inherit' }}>
                                        <div slot="start" className={`p-2 rounded-lg border ${tx.amount > 0
                                                ? (useStore.getState().themeMode === 'dark' ? 'bg-neon-green/10 border-neon-green/30 text-neon-green shadow-[0_0_5px_rgba(0,255,0,0.3)]' : 'bg-green-50 border-green-100 text-green-600')
                                                : (useStore.getState().themeMode === 'dark' ? 'bg-neon-red/10 border-neon-red/30 text-neon-red shadow-[0_0_5px_rgba(255,0,0,0.3)]' : 'bg-red-50 border-red-100 text-red-600')
                                            }`}>
                                            <IonIcon icon={tx.amount > 0 ? arrowUp : arrowDown} />
                                        </div>
                                        <IonLabel>
                                            <h3 className={`font-bold tracking-wide ${useStore.getState().themeMode === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                                                {tx.note || (tx.amount > 0 ? t('common.income') : t('common.expense'))}
                                            </h3>
                                            <p className={`text-xs font-mono mt-1 ${useStore.getState().themeMode === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                                                {new Date(tx.date).toLocaleDateString()}
                                            </p>
                                        </IonLabel>
                                        <IonNote slot="end" className={`font-mono font-bold text-base ${tx.amount > 0
                                                ? (useStore.getState().themeMode === 'dark' ? 'text-neon-green drop-shadow-[0_0_3px_rgba(0,255,0,0.5)]' : 'text-green-600')
                                                : (useStore.getState().themeMode === 'dark' ? 'text-neon-red drop-shadow-[0_0_3px_rgba(255,0,0,0.5)]' : 'text-red-600')
                                            }`}>
                                            {tx.amount > 0 ? '+' : ''}${Math.abs(tx.amount).toFixed(2)}
                                        </IonNote>
                                    </IonItem>
                                ))}
                            </IonList>
                        )}
                    </div>
                </div>

                <IonFab vertical="bottom" horizontal="end" slot="fixed" className="mb-4 mr-2">
                    <IonFabButton routerLink="/tabs/transactions/add" className={`shadow-lg transition-all ${useStore.getState().themeMode === 'dark' ? 'shadow-[0_0_20px_rgba(0,255,255,0.6)]' : ''
                        }`} color={useStore.getState().themeMode === 'dark' ? "secondary" : "primary"}>
                        <IonIcon icon={add} />
                    </IonFabButton>
                </IonFab>
            </IonContent>
        </IonPage>
    );
};

export default Dashboard;
