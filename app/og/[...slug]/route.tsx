// import { generateOGImage } from "fumadocs-ui/og";
import { baseUrl, metadataImage } from "@/utils/metadata";
import { ImageResponse } from "next/og";

export const GET = metadataImage.createAPI((page) => {
	return new ImageResponse(
		(
			<img
				src={`${baseUrl}/banner.png`}
				alt="Background"
				height={1225}
				width={690}
				style={{
					position: "absolute",
					top: 0,
					left: 0,
					width: "100%",
					height: "100%",
					zIndex: -1,
				}}
			/>
		)
	);
});

export function generateStaticParams() {
	return metadataImage.generateParams();
}
