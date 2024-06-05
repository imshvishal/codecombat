'use client';

import { useUserQuery } from './api/endpoints/userApi';
import { login } from './states/authStateSlice';
import { store } from './store';
import { Provider, useDispatch } from 'react-redux';

interface Props {
	children: React.ReactNode;
}

export default function CustomProvider({ children }: Props) {
	return <Provider store={store}>
		{children}
	</Provider>;
}