import { createContext, ReactNode, useCallback, useContext, useMemo, useState } from 'react';

const AuthContext = createContext({
	isLoading: true,
	isSignedIn: false,
	onLogin: () => { },
	onLogout: () => { }
});

const AuthProvider = ({ children }: { children: ReactNode; }) => {
	const [isLoading, setIsLoading] = useState(true);
	const [isSignedIn, setIsSignedIn] = useState(false);

	const onLogin = useCallback(() => {
		setIsLoading(false);
		setIsSignedIn(true);
	}, []);

	const onLogout = useCallback(() => {
		setIsLoading(false);
		setIsSignedIn(false);
	}, []);

	const authContext = useMemo(
		() => ({
			isLoading,
			isSignedIn,
			onLogin,
			onLogout
		}),
		[isLoading, isSignedIn]
	);

	return <AuthContext.Provider value={authContext}>{children}</AuthContext.Provider>;
};

const useAuthContext = () => useContext(AuthContext);

export { AuthProvider, useAuthContext };
