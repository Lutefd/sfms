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
import { FileIcon, ImageIcon, UploadIcon, VideoIcon } from 'lucide-react';
import Dropzone from 'react-dropzone';

import React from 'react';

function UploadButton() {
	return (
		<Dialog>
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
						console.log(acceptedFile);
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
					<Button type="submit">Upload</Button>
				</DialogFooter>
			</DialogContent>{' '}
		</Dialog>
	);
}

export default UploadButton;
