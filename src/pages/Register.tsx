import React, { useState, useEffect } from 'react';
import { IonPage, IonContent, IonItem, IonInput, IonSpinner, useIonToast, IonIcon } from '@ionic/react';
import { useHistory } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuth } from '../lib/auth';
import { useStore } from '../lib/store';
import { moon, sunny } from 'ionicons/icons';
import { useTranslation } from 'react-i18next';

const Register: React.FC = () => {
    const { t } = useTranslation();
    const history = useHistory();
    const { session, loading: authLoading } = useAuth();
    const { themeMode, setThemeMode } = useStore(); // Use global store

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [present] = useIonToast();

    // Auto-redirect if already authenticated
    useEffect(() => {
        if (!authLoading && session) {
            history.replace('/dashboard');
        }
    }, [session, authLoading, history]);

    const toggleTheme = () => {
        setThemeMode(themeMode === 'light' ? 'dark' : 'light');
    };

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const { data, error } = await supabase.auth.signUp({
            email,
            password,
        });

        setLoading(false);

        if (error) {
            present({
                message: error.message,
                duration: 3000,
                color: 'danger',
                position: 'top',
            });
        } else {
            if (data.session) {
                present({
                    message: '¡Registro exitoso! Iniciando sesión...',
                    duration: 2000,
                    color: 'success',
                    position: 'top',
                });
                // Force hard redirect to ensure fresh state
                window.location.href = '/dashboard';
            } else {
                present({
                    message: '¡Registro exitoso! Por favor verifica tu correo para continuar.',
                    duration: 4000,
                    color: 'warning',
                    position: 'top',
                });
                history.replace('/login');
            }
        }
    };

    if (authLoading) {
        return (
            <IonPage>
                <IonContent className="ion-padding">
                    <div className="flex h-full items-center justify-center">
                        <IonSpinner name="crescent" />
                    </div>
                </IonContent>
            </IonPage>
        );
    }

    const isDark = themeMode === 'dark';

    return (
        <IonPage>
            <IonContent fullscreen className="ion-padding transition-colors duration-300">
                <div className={`flex flex-col h-full justify-center items-center relative overflow-hidden ${isDark ? 'bg-cyber-black' : 'bg-gray-50'}`}>

                    {/* Cyber Grid Background Effect (Dark Mode Only) */}
                    {isDark && (
                        <div className="absolute inset-0 z-0 opacity-20 pointer-events-none"
                            style={{
                                backgroundImage: 'linear-gradient(rgba(0, 255, 255, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 0, 255, 0.1) 1px, transparent 1px)',
                                backgroundSize: '40px 40px'
                            }}>
                        </div>
                    )}

                    {/* Theme Toggle */}
                    <button
                        onClick={toggleTheme}
                        className={`absolute top-6 right-6 p-3 rounded-full border transition-all hover:scale-110 z-50 ${isDark
                            ? 'border-neon-cyan/50 shadow-[0_0_10px_rgba(0,255,255,0.3)] bg-black/50 text-neon-cyan'
                            : 'border-gray-300 bg-white text-yellow-500 shadow-md'
                            }`}
                    >
                        <IonIcon icon={isDark ? sunny : moon} className="text-xl" />
                    </button>

                    <div className="w-full max-w-md p-8 relative z-10">
                        {/* Card Container */}
                        <div className={`rounded-lg p-8 relative overflow-hidden transition-all duration-300 ${isDark
                            ? 'bg-black/40 backdrop-blur-xl border border-neon-cyan/50 shadow-[0_0_20px_rgba(0,255,255,0.2)]'
                            : 'bg-white shadow-xl border border-gray-100'
                            }`}>
                            {/* Decorative Corners (Dark Mode Only) */}
                            {isDark && (
                                <>
                                    <div className="absolute top-0 right-0 w-16 h-16 border-t-2 border-r-2 border-neon-pink rounded-tr-lg"></div>
                                    <div className="absolute bottom-0 left-0 w-16 h-16 border-b-2 border-l-2 border-neon-pink rounded-bl-lg"></div>
                                </>
                            )}

                            <div className="text-center mb-10">
                                <h1 className={`text-3xl font-black tracking-widest mb-2 ${isDark
                                    ? 'text-transparent bg-clip-text bg-gradient-to-l from-neon-pink via-neon-purple to-neon-cyan drop-shadow-[0_0_10px_rgba(0,255,255,0.8)] animate-pulse'
                                    : 'text-gray-900'
                                    }`}>
                                    {isDark ? t('cyber.new_user') : t('auth.register')}
                                </h1>
                                <p className={`text-xs tracking-[0.5em] uppercase ${isDark ? 'text-neon-pink' : 'text-gray-500'}`}>
                                    {isDark ? t('cyber.reg_protocol') : t('auth.create_account')}
                                </p>
                            </div>

                            <form onSubmit={handleRegister} className="space-y-8">
                                <div className="space-y-2 group/input">
                                    <label className={`text-xs font-mono ml-1 tracking-wider uppercase ${isDark ? 'text-neon-cyan' : 'text-gray-600'}`}>
                                        {isDark ? t('cyber.designation') : t('auth.email')}
                                    </label>
                                    <div className="relative">
                                        <IonItem lines="none" className={`rounded-none border-b bg-transparent transition-all duration-300 ${isDark
                                            ? 'border-neon-cyan/30 focus-within:border-neon-cyan focus-within:shadow-[0_0_10px_rgba(0,255,255,0.4)]'
                                            : 'border-gray-300 focus-within:border-gray-800'
                                            }`} style={{ '--background': 'transparent', '--padding-start': '0' }}>
                                            <IonInput
                                                type="text"
                                                inputmode="email"
                                                value={email}
                                                onIonInput={e => setEmail(e.detail.value!)}
                                                required
                                                placeholder="usuario@email.com"
                                                className={`font-mono ${isDark ? 'text-white placeholder:text-gray-600' : 'text-gray-900 placeholder:text-gray-400'}`}
                                                style={{ '--color': isDark ? '#fff' : '#000' }}
                                            />
                                        </IonItem>
                                    </div>
                                </div>

                                <div className="space-y-2 group/input">
                                    <label className={`text-xs font-mono ml-1 tracking-wider uppercase ${isDark ? 'text-neon-pink' : 'text-gray-600'}`}>
                                        {isDark ? t('cyber.secret_key') : t('auth.password')}
                                    </label>
                                    <div className="relative">
                                        <IonItem lines="none" className={`rounded-none border-b bg-transparent transition-all duration-300 ${isDark
                                            ? 'border-neon-pink/30 focus-within:border-neon-pink focus-within:shadow-[0_0_10px_rgba(255,0,255,0.4)]'
                                            : 'border-gray-300 focus-within:border-gray-800'
                                            }`} style={{ '--background': 'transparent', '--padding-start': '0' }}>
                                            <IonInput
                                                type="password"
                                                value={password}
                                                onIonInput={e => setPassword(e.detail.value!)}
                                                required
                                                placeholder="••••••••"
                                                className={`font-mono ${isDark ? 'text-white placeholder:text-gray-600' : 'text-gray-900 placeholder:text-gray-400'}`}
                                                style={{ '--color': isDark ? '#fff' : '#000' }}
                                            />
                                        </IonItem>
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className={`w-full font-black py-4 px-4 uppercase tracking-[0.2em] transition-all duration-300 transform hover:scale-[1.02] flex justify-center items-center ${isDark
                                        ? 'bg-neon-cyan/20 border border-neon-cyan text-neon-cyan hover:bg-neon-cyan hover:text-black shadow-[0_0_15px_rgba(0,255,255,0.3)] hover:shadow-[0_0_25px_rgba(0,255,255,0.8)] clip-path-polygon'
                                        : 'bg-black text-white hover:bg-gray-800 rounded-lg shadow-lg'
                                        }`}
                                    style={isDark ? { clipPath: 'polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px)' } : {}}
                                >
                                    {loading ? <IonSpinner name="crescent" color={isDark ? "secondary" : "light"} /> : (isDark ? t('cyber.execute_signup') : t('auth.signup'))}
                                </button>
                            </form>

                            <div className="mt-8 text-center">
                                <p className={`text-xs font-mono ${isDark ? 'text-gray-500' : 'text-gray-600'}`}>
                                    {isDark ? t('cyber.already_system') : "Already have an account?"}{' '}
                                    <button
                                        onClick={() => history.push('/login')}
                                        className={`transition-all font-bold tracking-wider ${isDark
                                            ? 'text-neon-pink hover:text-white hover:underline hover:shadow-[0_0_10px_rgba(255,0,255,0.8)]'
                                            : 'text-blue-600 hover:text-blue-800 hover:underline'
                                            }`}
                                    >
                                        {isDark ? t('cyber.access_login') : t('auth.login')}
                                    </button>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </IonContent>
        </IonPage>
    );
};

export default Register;
