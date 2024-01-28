import React from 'react';
import UploadButton from './_components/upload-button';
import { getFourMostRecentFilesFromUserId } from '@/lib/files';
import { readSession } from '@/actions/session';
import { redirect } from 'next/navigation';
import { Card, CardFooter, CardHeader } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import Link from 'next/link';
import { AudioLines, FileText, Film, Ghost } from 'lucide-react';

async function GalleryPage() {
	const user = await readSession();
	if (!user) {
		redirect('/auth/login');
	}
	const latestFourFiles = await getFourMostRecentFilesFromUserId(user?.id);
	return (
		<div className="flex flex-col px-4">
			<div className="p-4 flex w-full justify-between items-center">
				<h1 className="text-2xl font-bold">Galeria</h1>
				<UploadButton />
			</div>
			<div className="flex flex-col gap-6">
				<div className="space-y-4">
					<h2 className="text-2xl font-semibold">
						Seus Arquivos Mais Recentes
					</h2>
					{latestFourFiles.length > 0 ? (
						<div className="grid grid-cols-4 gap-4">
							{latestFourFiles.map((file) => (
								<Card
									className="min-h-[32rem] max-h-[32rem] flex flex-col h-auto relative"
									key={file.id}
								>
									<CardHeader>
										{file.type.includes('image') ? (
											<Link
												href={file.url}
												target="_blank"
												className="cursor-pointer"
											>
												<img
													alt={file.title}
													className="aspect-square object-cover border border-gray-200 w-full rounded-lg overflow-hidden dark:border-gray-800 min-h-[20rem] h-[20rem]"
													height="100"
													src={file.url}
												/>
											</Link>
										) : file.type.includes('video') ? (
											<Link
												href={file.url}
												target="_blank"
												className="cursor-pointer"
											>
												<div className=" w-full flex justify-center items-center border border-solid rounded-md py-12 min-h-[20rem] h-[20rem]">
													<Film className="h-24 w-24 text-zinc-800 " />
												</div>
											</Link>
										) : file.type.includes('audio') ? (
											<Link
												href={file.url}
												target="_blank"
												className="cursor-pointer"
											>
												<div className=" w-full flex justify-center items-center border border-solid rounded-md py-12 min-h-[20rem] h-[20rem]">
													<AudioLines className="h-24 w-24 text-zinc-800 " />
												</div>
											</Link>
										) : file.type.includes('text') ||
										  file.type.includes('pdf') ? (
											<Link
												href={file.url}
												target="_blank"
												className="cursor-pointer"
											>
												<div className="border border-solid rounded-md py-12 min-h-[20rem] w-full flex justify-center items-center h-[20rem]">
													<FileText className="h-24 w-24 text-zinc-800 " />
												</div>
											</Link>
										) : (
											<Link
												href={file.url}
												target="_blank"
												className="cursor-pointer"
											>
												<div className="bg-foreground w-full flex justify-center items-center">
													<Ghost className="h-24 w-24 text-zinc-800 " />
												</div>
											</Link>
										)}
										<Separator />
										<h2 className="text-lg font-semibold line-clamp-1">
											{file.title}
										</h2>
										<div className="flex w-full justify-between">
											<p className="text-muted-foreground">
												{file.type}
											</p>
											<p className="text-sm  text-muted-foreground">
												{new Date(
													file.updatedAt as Date
												).toLocaleDateString('pt-br')}
											</p>
										</div>
									</CardHeader>
								</Card>
							))}
						</div>
					) : (
						<div className="mt-16 flex flex-col items-center gap-2">
							<Ghost className="h-8 w-8 text-zinc-800 animate-pulse  duration-[3s]" />
							<h3 className="text-xl font-semibold">
								Tá bem vazio por aqui...
							</h3>
							<p>
								Parece que você ainda não tem um arquivo para
								chamar de seu.
							</p>
						</div>
					)}
				</div>
				<div className="space-y-4">
					<h2 className="text-2xl font-semibold">
						Suas Bibliotecas Mais Recentes
					</h2>
					<div className="grid grid-cols-4 gap-4">
						<img
							alt="Folder 1"
							className="aspect-square object-cover border border-gray-200 w-full rounded-lg overflow-hidden dark:border-gray-800"
							height="100"
							src="/placeholder.svg"
							width="100"
						/>
						<img
							alt="Folder 2"
							className="aspect-square object-cover border border-gray-200 w-full rounded-lg overflow-hidden dark:border-gray-800"
							height="100"
							src="/placeholder.svg"
							width="100"
						/>
						<img
							alt="Folder 3"
							className="aspect-square object-cover border border-gray-200 w-full rounded-lg overflow-hidden dark:border-gray-800"
							height="100"
							src="/placeholder.svg"
							width="100"
						/>
						<img
							alt="Folder 4"
							className="aspect-square object-cover border border-gray-200 w-full rounded-lg overflow-hidden dark:border-gray-800"
							height="100"
							src="/placeholder.svg"
							width="100"
						/>
					</div>
				</div>
			</div>
		</div>
	);
}

export default GalleryPage;
