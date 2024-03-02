import type { Files } from '@/server/db/schema';
import { Card, CardHeader } from './ui/card';
import { Separator } from '@/components/ui/separator';
import { Film, AudioLines, FileText, Ghost } from 'lucide-react';
import Link from 'next/link';

function CardPreview({ file }: { file: Files }) {
	return (
		<Card
			className="min-h-[28rem] max-h-[28rem] flex flex-col h-auto relative"
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
							className="aspect-square border border-gray-200 w-full rounded-lg overflow-hidden dark:border-primary/15 min-h-[20rem] h-[20rem] object-contain"
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
							<video src={file.url}>
								<source src={`${file.url}#t=0.1`} />
							</video>
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
				) : file.type.includes('text') || file.type.includes('pdf') ? (
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
						{file.type.split('/')[1]}
					</p>
					<p className="text-sm  text-muted-foreground">
						{new Date(file.updatedAt!).toLocaleDateString('pt-br')}
					</p>
				</div>
			</CardHeader>
		</Card>
	);
}

export default CardPreview;
