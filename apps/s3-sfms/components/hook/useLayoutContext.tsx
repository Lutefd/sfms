'use client';

import { useContext } from 'react';
import { LayoutContext } from '../context/layoutContext';

function useLayoutContext() {
	const context = useContext(LayoutContext);
	if (!context) {
		throw new Error('useLayout must be used within a LayoutContext');
	}
	return context;
}

export default useLayoutContext;
