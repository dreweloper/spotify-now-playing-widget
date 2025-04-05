import { NowPlaying } from "@/components";

export default function Home() {
	const TOKEN = process.env.ACCESS_TOKEN || "";

	return <NowPlaying accessToken={TOKEN} />;
}
