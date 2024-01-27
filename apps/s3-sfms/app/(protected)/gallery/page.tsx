import React from 'react';
import UploadButton from './_components/upload-button';

async function GalleryPage() {
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
					<div className="grid grid-cols-4 gap-4">
						<img
							alt="File 1"
							className="aspect-square object-cover border border-gray-200 w-full rounded-lg overflow-hidden dark:border-gray-800"
							height="100"
							src="/placeholder.svg"
							width="100"
						/>
						<img
							alt="File 2"
							className="aspect-square object-cover border border-gray-200 w-full rounded-lg overflow-hidden dark:border-gray-800"
							height="100"
							src="/placeholder.svg"
							width="100"
						/>
						<img
							alt="File 3"
							className="aspect-square object-cover border border-gray-200 w-full rounded-lg overflow-hidden dark:border-gray-800"
							height="100"
							src="/placeholder.svg"
							width="100"
						/>
						<img
							alt="File 4"
							className="aspect-square object-cover border border-gray-200 w-full rounded-lg overflow-hidden dark:border-gray-800"
							height="100"
							src="/placeholder.svg"
							width="100"
						/>
					</div>
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
