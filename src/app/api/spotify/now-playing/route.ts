import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { getNowPlaying } from "@/lib/spotify";
import { DEFAULT_ERROR_MESSAGE, DEFAULT_ERROR_STATUS } from "@/utils/constants";
import type { Track } from "@/ts/types";

const isSpotifyCurrentlyPlayingObject = (
	data: unknown
): data is SpotifyApi.CurrentlyPlayingObject =>
	typeof data === "object" && data !== null && "item" in data;

const isSpotifyTrackObject = (
	data: unknown
): data is SpotifyApi.TrackObjectFull =>
	typeof data === "object" &&
	data !== null &&
	"type" in data &&
	data.type === "track";

const getTrackArtists = (
	artists: SpotifyApi.ArtistObjectSimplified[]
): string => artists.map((artist: { name: string }) => artist.name).join(", ");

const calculateTrackTimeLeft = (
	duration_ms: number,
	progress_ms: number | null
): number => (progress_ms === null ? 0 : duration_ms - progress_ms);

const formatNowPlayingObject = (
	data: SpotifyApi.CurrentlyPlayingObject
): Track => {
	const { is_playing, item, progress_ms } = data;

	const { album, artists, duration_ms, name } =
		item as SpotifyApi.TrackObjectFull;

	return {
		albumCover: album.images[0], // First image is the widest
		isPlayerActive: true,
		isTrackPlaying: is_playing,
		trackArtists: getTrackArtists(artists),
		trackName: name,
		trackTimeLeft: calculateTrackTimeLeft(duration_ms, progress_ms)
	};
};

export const GET = async (req: NextRequest) => {
	const token = req.headers.get("X-Access-Token")!;

	try {
		const data = await getNowPlaying(token);

		if (Object.keys(data).length === 0) {
			return NextResponse.json({ isPlayerActive: false });
		}

		if (!isSpotifyCurrentlyPlayingObject(data)) {
			throw new Error("Unexpected data structure received from Spotify API");
		}

		// TODO: Handle other types
		// * - Episode
		if (!isSpotifyTrackObject(data.item)) {
			const message = !data.item
				? "Track item is not available" // Spotify API returns a null item
				: `Currently playing type "${data.currently_playing_type}" is not supported yet`;

			throw new Error(message);
		}

		const nowPlaying = formatNowPlayingObject(data);

		return NextResponse.json(nowPlaying);
	} catch (error) {
		let message = DEFAULT_ERROR_MESSAGE;
		let status = DEFAULT_ERROR_STATUS;

		if (error instanceof Error) {
			message = error.message;
			status =
				error.cause && typeof error.cause === "number" ? error.cause : status;
		}

		return NextResponse.json({ message }, { status });
	}
};
