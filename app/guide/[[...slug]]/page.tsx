import { openapi, source } from "@/app/source";
import { metadataImage } from "@/utils/metadata";
import defaultMdxComponents from "fumadocs-ui/mdx";
import {
	DocsBody,
	DocsCategory,
	DocsDescription,
	DocsPage,
	DocsTitle,
} from "fumadocs-ui/page";
import { notFound } from "next/navigation";
import { LinkCard } from "@/components/ui/link-card/link-card";

export default async function Page(props: {
	params: Promise<{ slug: string[] }>;
}) {
	const params = await props.params;
	const page = source.getPage(params.slug);
	if (!page) notFound();

	const MDX = page.data.body;

	return (
		<DocsPage
			toc={page.data.toc}
			lastUpdate={page.data.lastModified}
			full={page.data.full}
			editOnGithub={{
				repo: "docs",
				owner: "webisopen",
				path: `content/guide/${page.file.path}`,
			}}
		>
			<DocsTitle>{page.data.title}</DocsTitle>
			<DocsDescription>{page.data.description}</DocsDescription>
			<DocsBody>
				<MDX
					components={{
						...defaultMdxComponents,
						APIPage: openapi.APIPage,
						LinkCard: LinkCard,
					}}
				/>
			</DocsBody>
			{page.data.index ? <DocsCategory page={page} from={source} /> : null}
		</DocsPage>
	);
}

export async function generateStaticParams() {
	return source.generateParams();
}

export async function generateMetadata(props: {
	params: Promise<{ slug?: string[] }>;
}) {
	const params = await props.params;
	const page = source.getPage(params.slug);
	if (!page) notFound();

	return metadataImage.withImage(page.slugs, {
		title: page.data.title,
		description: page.data.description,
	});
}
