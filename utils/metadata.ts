import type { Metadata } from "next";
import { source } from "@/app/source";
import { createMetadataImage } from "fumadocs-core/server";

export const metadataImage = createMetadataImage({
	imageRoute: "/og",
	source,
});

export function createMetadata(override: Metadata): Metadata {
	return {
		...override,
		openGraph: {
			title: override.title ?? undefined,
			description: override.description ?? undefined,
			url: baseUrl,
			images: "/banner.png",
			siteName: "Open Docs",
			...override.openGraph,
		},
		twitter: {
			card: "summary_large_image",
			creator: "@webisopen",
			title: override.title ?? undefined,
			description: override.description ?? undefined,
			images: "/banner.png",
			...override.twitter,
		},
	};
}

export const baseUrl =
	process.env.NODE_ENV === "development" || !process.env.VERCEL_URL
		? new URL("http://localhost:3000")
		: process.env.NODE_ENV === "production"
			? new URL("https://docs.open.network")
			: new URL(`https://${process.env.VERCEL_URL}`);
