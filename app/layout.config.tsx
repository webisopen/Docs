// import { RootToggle } from "fumadocs-ui/components/layout/root-toggle";
import type { HomeLayoutProps } from "fumadocs-ui/layouts/home";
import type { DocsLayoutProps } from "fumadocs-ui/layouts/docs";
import { source } from "./source";
import Image from "next/image";
/**
 * Shared layout configurations
 *
 * you can configure layouts individually from:
 * Home Layout: app/(home)/layout.tsx
 * Docs Layout: app/docs/layout.tsx
 */
export const baseOptions: HomeLayoutProps = {
	nav: {
		title: (
			<>
				<Image
					alt="Open Documentation"
					src="/logo/open.svg"
					width={35}
					height={35}
				/>
				Open Docs
			</>
		),
	},
	links: [
		{
			text: "Guide",
			url: "/guide/core",
			active: "nested-url",
		},
	],
	githubUrl: "https://github.com/webisopen/docs",
};

export const guideOptions: DocsLayoutProps = {
	...baseOptions,
	tree: source.pageTree,
};
