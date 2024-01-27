'use client';
import useLayoutContext from '@/components/hook/useLayoutContext';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import {
	Tooltip,
	TooltipTrigger,
	TooltipProvider,
	TooltipContent,
} from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import { DatabaseUserAttributes } from '@/server/auth';
import {
	AudioLines,
	Camera,
	FileText,
	Film,
	Library,
	Music,
	Video,
} from 'lucide-react';
interface SidebarProps {
	className?: string;
	user: DatabaseUserAttributes;
}

export function Sidebar({ className, user }: SidebarProps) {
	const { isCollapsed } = useLayoutContext();

	const percentageUtilized = (user.current_quota_use / user.quota) * 100;
	return (
		<div className={cn('pb-0 h-full relative', className)}>
			<div className="space-y-4 py-4">
				<TooltipProvider delayDuration={0}>
					<div className={isCollapsed ? ` py-2` : `px-3 py-2`}>
						{!isCollapsed && (
							<h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
								Galeria
							</h2>
						)}
						<div className="space-y-1 transition-all ease-in duration-300">
							{isCollapsed ? (
								<Tooltip delayDuration={0}>
									<TooltipTrigger>
										<Button
											variant="ghost"
											className="w-full justify-start"
										>
											<Camera className=" transition-all ease-in duration-300 h-4 w-4" />
										</Button>
									</TooltipTrigger>
									<TooltipContent
										side="right"
										className="flex items-center gap-4"
									>
										Imagens
									</TooltipContent>
								</Tooltip>
							) : (
								<Button
									variant="ghost"
									className="w-full justify-start"
								>
									<Camera className="mr-2 h-4 w-4" />
									Imagens
								</Button>
							)}
							{isCollapsed ? (
								<Tooltip delayDuration={0}>
									<TooltipTrigger>
										<Button
											variant="ghost"
											className="w-full justify-start"
										>
											<AudioLines className="h-4 w-4" />
										</Button>
									</TooltipTrigger>
									<TooltipContent
										side="right"
										className="flex items-center gap-4"
									>
										Músicas
									</TooltipContent>
								</Tooltip>
							) : (
								<Button
									variant="ghost"
									className="w-full justify-start"
								>
									<AudioLines className="mr-2 h-4 w-4" />
									Músicas
								</Button>
							)}
							{isCollapsed ? (
								<Tooltip delayDuration={0}>
									<TooltipTrigger>
										<Button
											variant="ghost"
											className="w-full justify-start"
										>
											<FileText className="h-4 w-4" />
										</Button>
									</TooltipTrigger>
									<TooltipContent
										side="right"
										className="flex items-center gap-4"
									>
										PDFs
									</TooltipContent>
								</Tooltip>
							) : (
								<Button
									variant="ghost"
									className="w-full justify-start"
								>
									<FileText className="mr-2 h-4 w-4" />
									PDFs
								</Button>
							)}
							{isCollapsed ? (
								<Tooltip delayDuration={0}>
									<TooltipTrigger>
										<Button
											variant="ghost"
											className="w-full justify-start"
										>
											<Film className="h-4 w-4" />
										</Button>
									</TooltipTrigger>
									<TooltipContent
										side="right"
										className="flex items-center gap-4"
									>
										Vídeos
									</TooltipContent>
								</Tooltip>
							) : (
								<Button
									variant="ghost"
									className="w-full justify-start"
								>
									<Film className="mr-2 h-4 w-4" />
									Vídeos
								</Button>
							)}

							{isCollapsed ? (
								<Tooltip delayDuration={0}>
									<TooltipTrigger>
										<Button
											variant="ghost"
											className="w-full justify-start"
										>
											<Library className="h-4 w-4" />
										</Button>
									</TooltipTrigger>
									<TooltipContent
										side="right"
										className="flex items-center gap-4"
									>
										Bibliotecas
									</TooltipContent>
								</Tooltip>
							) : (
								<Button
									variant="ghost"
									className="w-full justify-start"
								>
									<Library className="mr-2 h-4 w-4" />
									Bibliotecas
								</Button>
							)}
						</div>
					</div>
				</TooltipProvider>
				<Separator />
				<div className="py-2">
					{!isCollapsed && (
						<>
							<h2 className="relative px-7 text-lg font-semibold tracking-tight">
								Bibliotecas
							</h2>

							<ScrollArea className="min-h-[200px] md:max-h-[100px] 2xl:max-h-[400px] px-1">
								<div className="space-y-1 p-2">
									{/* {playlists?.map((playlist, i) => (
								<Button
									key={`${playlist}-${i}`}
									variant="ghost"
									className="w-full justify-start font-normal"
								>
									<svg
										xmlns="http://www.w3.org/2000/svg"
										viewBox="0 0 24 24"
										fill="none"
										stroke="currentColor"
										strokeWidth="2"
										strokeLinecap="round"
										strokeLinejoin="round"
										className="mr-2 h-4 w-4"
									>
										<path d="M21 15V6" />
										<path d="M18.5 18a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z" />
										<path d="M12 12H3" />
										<path d="M16 6H3" />
										<path d="M12 18H3" />
									</svg>
									{playlist}
								</Button>
							))} */}
								</div>
							</ScrollArea>
							<Separator />
							<div className="w-full absolute bottom-0  max-w-md px-6 py-2 bg-background rounded-lg  dark:bg-background">
								<TooltipProvider delayDuration={0}>
									<Tooltip>
										<TooltipTrigger className="w-full">
											<div className="mt-4">
												<div className="mt-2 h-2 bg-gray-200 rounded-full dark:bg-gray-700">
													<div
														className="h-full bg-primary rounded-full"
														style={{
															width: `${percentageUtilized}`,
														}}
													/>
												</div>
												<div className="flex items-center w-full justify-between">
													<span className="text-xs text-gray-700 dark:text-gray-200">
														{(
															user.current_quota_use /
															1000
														).toFixed(2)}{' '}
														GB
													</span>
													<span className="text-xs text-gray-700 dark:text-gray-200">
														{(
															user.quota / 1000
														).toFixed(2)}{' '}
														GB
													</span>
												</div>
											</div>
										</TooltipTrigger>
										<TooltipContent
											side="top"
											className="flex items-center gap-4"
										>
											Quanto de espaço você está
											utilizando no momento
										</TooltipContent>
									</Tooltip>
								</TooltipProvider>
							</div>
						</>
					)}
				</div>
			</div>
		</div>
	);
}
