import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
	title: "Spotify Now Playing Widget",
	description: "I'm working on it!"
};

export default function RootLayout({
	children
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<body>{children}</body>
		</html>
	);
}
