import { generateOGImage } from "fumadocs-ui/og";
import { metadataImage } from "@/utils/metadata";

export const GET = metadataImage.createAPI((page) => {
	return generateOGImage({
		title: page.data.title,
		description: page.data.description,
		site: "Open Docs",
	});
});

export function generateStaticParams() {
	return metadataImage.generateParams();
}
