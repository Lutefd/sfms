import React from 'react';
import UploadButton from '../_components/upload-button';
import { Input } from '@/components/ui/input';
import { getAllImagesFromUserId } from '@/lib/files';
import { readSession } from '@/actions/session';
import ImagesView from './_components/images-view';

async function ImagesPage() {
	const user = await readSession();
	return (
		<div className="flex flex-col px-4">
			<div className="py-4 flex w-full justify-between items-center">
				<h1 className="text-2xl font-bold">Imagens</h1>
				<UploadButton fileType="image" />
			</div>
			<ImagesView id={user!.id!} />
		</div>
	);
}

export default ImagesPage;
