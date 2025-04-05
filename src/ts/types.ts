export type InactivePlayer = {
	isPlayerActive: false;
};

export type Track = {
	albumCover: SpotifyApi.ImageObject;
	isPlayerActive: true;
	isTrackPlaying: boolean;
	trackArtists: string;
	trackName: string;
	trackTimeLeft: number;
};

export type NowPlayingObject = Track | InactivePlayer;

export type NowPlayingResponse =
	| SpotifyApi.CurrentlyPlayingResponse
	| Record<string, never>;

export type NowPlayingProps = {
	accessToken: string;
	onError?: (error: SpotifyApi.ErrorObject) => void; // ! Temp: Error type
};
