'use client';

import useLayoutContext from '@/components/hook/useLayoutContext';
import { ResizablePanel } from '@/components/ui/resizable';
import { cn } from '@/lib/utils';
import { Sidebar } from 'lucide-react';
import React from 'react';

function ResizableMenu({ children }: { children: React.ReactNode }) {
	const { isCollapsed, setIsCollapsed } = useLayoutContext();
	return (
		<ResizablePanel
			defaultSize={100}
			collapsible={true}
			minSize={10}
			maxSize={15}
			onCollapse={() => {
				setIsCollapsed(true);
			}}
			onExpand={() => {
				setIsCollapsed(false);
			}}
			className={cn(
				isCollapsed &&
					'min-w-[50px] transition-all duration-300 ease-in-out'
			)}
		>
			{children}
		</ResizablePanel>
	);
}

export default ResizableMenu;
