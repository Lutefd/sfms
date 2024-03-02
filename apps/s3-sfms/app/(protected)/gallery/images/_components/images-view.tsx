'use client';
import CardPreview from '@/components/CardPreview';
import { getAllImagesFromUserId } from '@/lib/files';
import { useQuery } from '@tanstack/react-query';

function ImagesView({ id }: { id: string }) {
	const { data, isLoading } = useQuery({
		queryKey: ['image', id],
		queryFn: () => getAllImagesFromUserId(),
	});
	return (
		<div className="grid items-center justify-center gap-6 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
			{isLoading && <p>Carregando...</p>}
			{data &&
				data.map((image) => (
					<CardPreview key={image.id} file={image} />
				))}
		</div>
	);
}

export default ImagesView;
