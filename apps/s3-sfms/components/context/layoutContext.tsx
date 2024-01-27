'use client';

import {
	useState,
	createContext,
	type Dispatch,
	type SetStateAction,
} from 'react';

export const LayoutContext = createContext<{
	isCollapsed: boolean;
	setIsCollapsed: Dispatch<SetStateAction<boolean>>;
} | null>(null);

export const LayoutContextProvider = ({
	children,
}: {
	children: React.ReactNode;
}) => {
	const [isCollapsed, setIsCollapsed] = useState<boolean>(false);

	return (
		<LayoutContext.Provider
			value={{
				isCollapsed,
				setIsCollapsed,
			}}
		>
			{children}
		</LayoutContext.Provider>
	);
};
