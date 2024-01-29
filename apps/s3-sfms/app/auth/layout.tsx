import { readSession } from '@/actions/session';
import { redirect } from 'next/navigation';

export default async function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	const user = await readSession();
	if (user) {
		redirect('/gallery');
	}
	return (
		<div className="flex items-center w-full h-full justify-center">
			{children}
		</div>
	);
}
