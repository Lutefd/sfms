'use client';

import { Button } from '@/components/ui/button';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@radix-ui/react-dropdown-menu';
import {
	Check,
	FileIcon,
	ImageIcon,
	UploadIcon,
	VideoIcon,
} from 'lucide-react';
import Dropzone from 'react-dropzone';

import { useState, useTransition } from 'react';
import { generatePresignedUrl, saveFileToDb } from '@/actions/s3';
import { Progress } from '@/components/ui/progress';
import { useRouter } from 'next/navigation';

function UploadButton() {
	const [isPending, startTransition] = useTransition();
	const [uploadProgress, setUploadProgress] = useState<number>(0);
	const router = useRouter();
	const startSimulatedProgress = () => {
		setUploadProgress(0);

		const interval = setInterval(() => {
			setUploadProgress((prevProgress) => {
				if (prevProgress >= 95) {
					clearInterval(interval);
					return prevProgress;
				}
				return prevProgress + 5;
			});
		}, 500);
		return interval;
	};

	return (
		<Dialog
			onOpenChange={(open) => {
				if (!open) {
					router.refresh();
				}
				setUploadProgress(0);
			}}
		>
			<DialogTrigger asChild>
				<Button>Adicionar Arquivos</Button>
			</DialogTrigger>
			<DialogContent className="sm:max-w-[425px]">
				<DialogHeader>
					<DialogTitle>Novo arquivo</DialogTitle>
					<DialogDescription>
						Arraste e solte seus arquivos, ou clique na area abaixo
						para pesquisar em seus arquivos.
					</DialogDescription>
				</DialogHeader>
				<Dropzone
					multiple={false}
					onDrop={async (acceptedFile) => {
						const file = acceptedFile[0];
						const fileName = file.name;
						const fileType = file.type;
						const fileSize = file.size;
						startTransition(async () => {
							startSimulatedProgress();
							const signedUrl = await generatePresignedUrl(
								fileName,
								fileType
							);
							if (signedUrl.error) {
								console.log(signedUrl.error);
								return;
							}
							if (!signedUrl.url) {
								console.log('signedUrl.url is undefined');
								return;
							}
							await fetch(signedUrl.url, {
								body: file,
								method: 'PUT',
								headers: {
									'Content-Type': fileType,
									'Content-Disposition': `inline; filename="${file.name}"`,
								},
							});
							const { hostname, pathname } = new URL(
								signedUrl.url
							);
							const splitPath = pathname
								.split('/')
								.filter(Boolean);
							const key = splitPath[splitPath.length - 1];
							await saveFileToDb({
								name: fileName,
								format: fileType,
								size: fileSize,
								key,
							});

							setUploadProgress(100);
						});
					}}
				>
					{({ getRootProps, getInputProps, acceptedFiles }) => (
						<>
							<div
								className="flex flex-col items-center justify-center p-8 border-2 border-dashed rounded-md"
								{...getRootProps()}
							>
								<UploadIcon className="h-12 w-12 text-gray-500 dark:text-gray-400" />
								<p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
									Arraste e solte seus arquivos aqui
								</p>
								<p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
									ou
								</p>
								<Label className="mt-2 cursor-pointer bg-gray-200 px-4 py-2 rounded-md text-sm text-gray-700 dark:bg-gray-800 dark:text-gray-300">
									Pesquise em seus arquivos
								</Label>
								<Input
									{...getInputProps()}
									className="hidden"
									id="file-upload"
									type="file"
								/>
							</div>
							{acceptedFiles[0] && (
								<div className="grid gap-2">
									<div className="flex items-center gap-2">
										{acceptedFiles[0].type.includes(
											'image'
										) ? (
											<ImageIcon className="h-4 w-4" />
										) : acceptedFiles[0].type.includes(
												'video'
										  ) ? (
											<VideoIcon className="h-4 w-4" />
										) : (
											<FileIcon className="h-4 w-4" />
										)}

										<span>{acceptedFiles[0].name}</span>
									</div>
								</div>
							)}
						</>
					)}
				</Dropzone>

				<DialogFooter>
					{isPending ? (
						<div className="mx-auto mt-4 w-full max-w-xs">
							<Progress
								value={uploadProgress}
								className="h-1 w-full "
							/>
						</div>
					) : null}
					{!isPending && uploadProgress === 100 && (
						<div className="bg-emerald-500/15 p-3 rounded-md w-full flex items-center gap-x-2 text-sm text-emerald-500">
							<Check className="h-4 w-4" />
							<p>Upload Completo!</p>
						</div>
					)}
				</DialogFooter>
			</DialogContent>{' '}
		</Dialog>
	);
}

export default UploadButton;
