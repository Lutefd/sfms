import { validateRequest } from '@/server/auth';
import { redirect } from 'next/navigation';

export default async function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	const { session } = await validateRequest();
	if (session) {
		redirect('/gallery');
	}
	return (
		<div className="flex items-center w-full h-full justify-center">
			{children}
		</div>
	);
}
