import { DEFAULT_ERROR_MESSAGE, DEFAULT_ERROR_STATUS } from "@/utils/constants";
import type { NowPlayingResponse } from "@/ts/types";

const isSpotifyErrorObject = (
	error: unknown
): error is SpotifyApi.ErrorObject =>
	typeof error === "object" &&
	error !== null &&
	"message" in error &&
	"status" in error;

export const getNowPlaying = async (
	token: string
): Promise<NowPlayingResponse> => {
	const ENDPOINT = "https://api.spotify.com/v1/me/player/currently-playing";

	const response = await fetch(ENDPOINT, {
		headers: { Authorization: `Bearer ${token}` }
	});

	if (!response.ok) {
		let message = DEFAULT_ERROR_MESSAGE;
		let cause = DEFAULT_ERROR_STATUS;

		// ? TODO: Handle JSON parsing errors here instead of relying on the route-level try/catch
		const { error } = await response.json();

		if (isSpotifyErrorObject(error)) {
			message = error.message;
			cause = error.status;
		}

		throw new Error(message, { cause });
	}

	return response.status === 204 ? {} : await response.json();
};
