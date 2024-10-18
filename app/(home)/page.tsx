"use client";

import { redirect } from "next/navigation";
import { useEffect } from "react";

export default function HomePage() {
	useEffect(() => {
		// so we can get og image work for home page
		redirect("/guide/core");
	}, []);

	return <></>;
}
