import useSWR from "swr";

import { isNonEmptyString } from "@/utils/validators";
import type { InactivePlayer, NowPlayingObject, Track } from "@/ts/types";

const isPlayerInactive = (data: unknown): data is InactivePlayer =>
	typeof data === "object" &&
	data !== null &&
	"isPlayerActive" in data &&
	!data.isPlayerActive;

export const fetchWithToken = async (
	url: string,
	token: string
): Promise<NowPlayingObject> => {
	const response = await fetch(url, {
		headers: { "X-Access-Token": token }
	});

	// ? TODO: Safe parsing
	const result = await response.json();

	if (!response.ok) {
		throw { message: result.message, status: response.status };
	}

	return result;
};

export const calculateRefreshInterval = (
	data: NowPlayingObject | undefined
) => {
	const DEFAULT_DELAY = 10000; // 10 seconds

	if (!data) return 0;

	if (isPlayerInactive(data)) {
		return DEFAULT_DELAY;
	}

	const { isTrackPlaying, trackTimeLeft } = data as Track;

	if (!isTrackPlaying || trackTimeLeft === 0) {
		return DEFAULT_DELAY;
	}

	return trackTimeLeft + 5000; // 5 seconds more than the time left to avoid 0 value when refreshing
};

export const useNowPlaying = (accessToken: string) => {
	const isTokenValid = isNonEmptyString(accessToken);

	const { data, error, isLoading } = useSWR<NowPlayingObject>(
		isTokenValid ? ["/api/spotify/now-playing", accessToken] : null,
		([url, accessToken]: [string, string]) => fetchWithToken(url, accessToken),
		{
			refreshInterval: (data) => calculateRefreshInterval(data),
			shouldRetryOnError: false // E.g., 401 or 403 error
		}
	);

	return { data, error, isLoading, isTokenValid };
};
