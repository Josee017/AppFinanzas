import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonCardHeader, IonCardTitle, IonCardContent, IonSegment, IonSegmentButton, IonLabel, IonIcon } from '@ionic/react';
import { barChart } from 'ionicons/icons';
import { useTranslation } from 'react-i18next';
import { useStore } from '../lib/store';
import { useEffect, useState, useMemo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

const Statistics: React.FC = () => {
    const { t } = useTranslation();
    const { transactions, categories, fetchAll } = useStore();
    const [view, setView] = useState<'expenses' | 'income'>('expenses');

    useEffect(() => {
        fetchAll();
    }, [fetchAll]);

    const data = useMemo(() => {
        const relevantTransactions = transactions.filter(t =>
            view === 'expenses' ? t.amount < 0 : t.amount > 0
        );

        const categoryTotals: { [key: string]: number } = {};

        relevantTransactions.forEach(tx => {
            const category = categories.find(c => c.id === tx.category_id);
            // Translate category name if it's a standard one or fallback to name
            const categoryName = category ? category.name : t('categories.category_name');
            const amount = Math.abs(tx.amount);

            categoryTotals[categoryName] = (categoryTotals[categoryName] || 0) + amount;
        });

        return Object.entries(categoryTotals).map(([name, value]) => ({
            name,
            value
        })).sort((a, b) => b.value - a.value);

    }, [transactions, categories, view, t]);

    return (
        <IonPage>
            <IonHeader className="ion-no-border">
                <IonToolbar className="transition-colors duration-300" style={{ '--background': 'transparent' }}>
                    <div className="bg-white/90 dark:bg-black/80 backdrop-blur-md border-b border-gray-200 dark:border-neon-purple/30 p-2">
                        <IonTitle className={`font-black tracking-widest text-center ${useStore.getState().themeMode === 'dark'
                                ? 'text-transparent bg-clip-text bg-gradient-to-r from-neon-pink via-neon-purple to-neon-cyan drop-shadow-[0_0_5px_rgba(255,0,255,0.8)] animate-pulse'
                                : 'text-gray-900'
                            }`}>
                            {t('tabs.statistics')}
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

                    <div className="max-w-4xl mx-auto relative z-10">
                        <IonSegment
                            value={view}
                            onIonChange={e => setView(e.detail.value as any)}
                            className={`mb-8 p-1 rounded-full ${useStore.getState().themeMode === 'dark' ? 'bg-black/50 border border-neon-purple/30' : 'bg-white border border-gray-200 shadow-sm'}`}
                            style={{ '--background': 'transparent' }}
                        >
                            <IonSegmentButton value="expenses" style={{
                                '--color-checked': useStore.getState().themeMode === 'dark' ? '#FF003C' : '#DC2626',
                                '--indicator-color': useStore.getState().themeMode === 'dark' ? 'rgba(255, 0, 60, 0.2)' : 'rgba(220, 38, 38, 0.1)'
                            }}>
                                <IonLabel className={`font-mono font-bold tracking-wider ${useStore.getState().themeMode === 'dark' ? '' : 'text-gray-700'}`}>{t('transactions.expense')}</IonLabel>
                            </IonSegmentButton>
                            <IonSegmentButton value="income" style={{
                                '--color-checked': useStore.getState().themeMode === 'dark' ? '#00F0FF' : '#2563EB',
                                '--indicator-color': useStore.getState().themeMode === 'dark' ? 'rgba(0, 240, 255, 0.2)' : 'rgba(37, 99, 235, 0.1)'
                            }}>
                                <IonLabel className={`font-mono font-bold tracking-wider ${useStore.getState().themeMode === 'dark' ? '' : 'text-gray-700'}`}>{t('transactions.income')}</IonLabel>
                            </IonSegmentButton>
                        </IonSegment>

                        <div className={`rounded-lg p-4 mb-8 relative overflow-hidden group transition-all duration-300 ${useStore.getState().themeMode === 'dark'
                                ? 'bg-black/40 backdrop-blur-xl border border-neon-cyan/50 shadow-[0_0_20px_rgba(0,255,255,0.1)]'
                                : 'bg-white shadow-lg border border-gray-100'
                            }`}>
                            {/* Decorative Corner (Dark Mode Only) */}
                            {useStore.getState().themeMode === 'dark' && (
                                <>
                                    <div className="absolute top-0 left-0 w-8 h-8 border-t border-l border-neon-purple rounded-tl-lg"></div>
                                    <div className="absolute bottom-0 right-0 w-8 h-8 border-b border-r border-neon-purple rounded-br-lg"></div>
                                </>
                            )}

                            <IonCardHeader className="text-center">
                                <IonCardTitle className={`font-mono text-sm tracking-[0.2em] uppercase mb-4 ${useStore.getState().themeMode === 'dark'
                                        ? 'text-neon-cyan drop-shadow-[0_0_5px_rgba(0,255,255,0.5)]'
                                        : 'text-gray-500'
                                    }`}>
                                    {view === 'expenses' ? t('statistics.expenses_by_category') : t('statistics.income_by_category')}
                                </IonCardTitle>
                            </IonCardHeader>
                            <IonCardContent className="h-80">
                                {data.length > 0 ? (
                                    <ResponsiveContainer width="100%" height="100%">
                                        <PieChart>
                                            <Pie
                                                data={data}
                                                cx="50%"
                                                cy="50%"
                                                innerRadius={60}
                                                outerRadius={100}
                                                paddingAngle={5}
                                                dataKey="value"
                                                stroke="none"
                                            >
                                                {data.map((_, index) => (
                                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke={useStore.getState().themeMode === 'dark' ? "rgba(0,0,0,0.5)" : "#fff"} strokeWidth={2} />
                                                ))}
                                            </Pie>
                                            <Tooltip
                                                contentStyle={{
                                                    backgroundColor: useStore.getState().themeMode === 'dark' ? 'rgba(5,5,5,0.9)' : 'white',
                                                    borderColor: useStore.getState().themeMode === 'dark' ? '#00F0FF' : '#e5e7eb',
                                                    borderRadius: '8px',
                                                    color: useStore.getState().themeMode === 'dark' ? '#fff' : '#111',
                                                    fontFamily: 'monospace',
                                                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                                                }}
                                                itemStyle={{ color: useStore.getState().themeMode === 'dark' ? '#fff' : '#111' }}
                                                formatter={(value: any) => [`$${parseFloat(value || 0).toFixed(2)}`, '']}
                                            />
                                            <Legend wrapperStyle={{ fontFamily: 'monospace', fontSize: '12px', color: useStore.getState().themeMode === 'dark' ? '#fff' : '#374151' }} />
                                        </PieChart>
                                    </ResponsiveContainer>
                                ) : (
                                    <div className="h-full flex flex-col items-center justify-center gap-4">
                                        <div className={`w-16 h-16 rounded-full border flex items-center justify-center ${useStore.getState().themeMode === 'dark' ? 'border-gray-700' : 'border-gray-200 bg-gray-50'
                                            }`}>
                                            <IonIcon icon={barChart} className={`text-3xl ${useStore.getState().themeMode === 'dark' ? 'text-gray-600' : 'text-gray-400'}`} />
                                        </div>
                                        <span className={`font-mono text-xs tracking-widest uppercase ${useStore.getState().themeMode === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>
                                            {t('statistics.no_data')}
                                        </span>
                                    </div>
                                )}
                            </IonCardContent>
                        </div>

                        {data.length > 0 && (
                            <div className="grid gap-4">
                                {data.map((item, index) => (
                                    <div key={item.name} className={`flex items-center justify-between p-4 rounded-lg backdrop-blur-sm transition-all group/item ${useStore.getState().themeMode === 'dark'
                                            ? 'bg-black/60 border border-neon-purple/20 hover:border-neon-purple/60 hover:bg-black/80 hover:shadow-[0_0_15px_rgba(191,0,255,0.2)]'
                                            : 'bg-white border border-gray-100 hover:border-blue-200 hover:shadow-md'
                                        }`}>
                                        <div className="flex items-center gap-4">
                                            <div className="w-3 h-3 rounded-full shadow-sm" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                                            <span className={`font-bold font-mono tracking-wide ${useStore.getState().themeMode === 'dark' ? 'text-white' : 'text-gray-800'}`}>{item.name}</span>
                                        </div>
                                        <span className={`font-black font-mono tracking-wider ${useStore.getState().themeMode === 'dark'
                                                ? 'text-neon-cyan drop-shadow-[0_0_5px_rgba(0,255,255,0.4)]'
                                                : 'text-gray-900'
                                            }`}>
                                            ${item.value.toFixed(2)}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </IonContent>
        </IonPage>
    );
};

export default Statistics;
