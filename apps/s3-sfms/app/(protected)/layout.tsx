import { validateRequest } from '@/server/auth';
import { redirect } from 'next/navigation';
import { UserNav } from './_components/user-nav';
import { JetBrains_Mono } from 'next/font/google';
import Link from 'next/link';
import {
	ResizableHandle,
	ResizablePanel,
	ResizablePanelGroup,
} from '@/components/ui/resizable';
import { Sidebar } from './_components/sidebar';
import { readSession } from '@/actions/session';
import { LayoutContextProvider } from '@/components/context/layoutContext';
import ResizableMenu from './_components/resizeble-menu';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ThemeToggle } from '@/components/ThemeToggle';
import { getLibrariesByUserId } from '@/lib/libraries';

const mono = JetBrains_Mono({ subsets: ['latin'] });
export default async function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	const user = await readSession();
	if (!user) {
		redirect('/auth/login');
	}
	const libraries = await getLibrariesByUserId(user.id);
	return (
		<div className="flex h-full flex-col">
			<div className="border-b">
				<div className="flex h-16 items-center px-4">
					{/* <Menu /> */}
					<Link
						href="/gallery"
						className={`text-2xl md:text-3xl font-bold ${mono.className}`}
					>
						SFMS
					</Link>
					<div className="ml-auto flex items-center space-x-4">
						<ThemeToggle />
						<UserNav
							username={user.name!}
							email={user.email}
							image={user.image ? user.image : undefined}
						/>
					</div>
				</div>
			</div>
			<ResizablePanelGroup
				direction="horizontal"
				className="h-full items-stretch !hidden md:!flex"
			>
				<LayoutContextProvider>
					<ResizableMenu>
						<Sidebar user={user} libraries={libraries} />
					</ResizableMenu>
				</LayoutContextProvider>
				<ResizableHandle withHandle />
				<ResizablePanel defaultSize={87}>
					<ScrollArea className="h-full px-1">{children}</ScrollArea>
				</ResizablePanel>
			</ResizablePanelGroup>
			<div className="md:hidden">{children}</div>
		</div>
	);
}
