import React from 'react';
import UploadButton from '../_components/upload-button';
import { Input } from '@/components/ui/input';

function ImagesPage() {
	return (
		<div className="flex flex-col px-4">
			<div className="py-4 flex w-full justify-between items-center">
				<h1 className="text-2xl font-bold">Imagens</h1>
				<UploadButton />
			</div>
		</div>
	);
}

export default ImagesPage;
