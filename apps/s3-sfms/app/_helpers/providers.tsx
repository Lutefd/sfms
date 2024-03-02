'use client';

import {
	QueryClient,
	QueryClientProvider,
	useQuery,
} from '@tanstack/react-query';
const queryClient = new QueryClient();

function Providers({ children }: { children: React.ReactNode }) {
	return (
		<QueryClientProvider client={queryClient}>
			{children}
		</QueryClientProvider>
	);
}

export default Providers;
