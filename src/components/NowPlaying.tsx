"use client";

import { useEffect } from "react";
import Image from "next/image";

import { useNowPlaying } from "@/hooks";
import type { NowPlayingProps } from "@/ts/types";

const NowPlaying: React.FC<NowPlayingProps> = ({
	accessToken,
	onError = (error) => console.log(`[${error.status}] ${error.message}`) // ! Temp
}) => {
	const { data, error, isLoading, isTokenValid } = useNowPlaying(accessToken);

	useEffect(() => {
		if (!isTokenValid) {
			onError({ message: "Token must be a non-empty string", status: 401 });
			return;
		}

		if (error) {
			onError(error);
			return;
		}
	}, [error, isTokenValid, onError]);

	if (!isTokenValid || error) {
		const message =
			error?.status === 503
				? "Spotify API is temporarily unavailable. Please try again later."
				: "There was an error trying to fetch the data. Check the console for more details.";

		return <p>{message}</p>;
	}

	if (isLoading) {
		return <p>Loading…</p>;
	}

	// ? TODO: ErrorBoundary
	// ! This should never happen
	if (!data) {
		return <p>No data available</p>;
	}

	return (
		<section>
			<h2>Now Playing</h2>
			<Image
				src="/spotify/Spotify_Primary_Logo_RGB_Green.png"
				alt="Spotify logo"
				width={21}
				height={21}
				priority={true}
			/>
			{!data.isPlayerActive ? (
				<p>Nothing is playing right now</p>
			) : (
				<article>
					<Image
						src={data.albumCover.url}
						alt="Album Cover"
						width={data.albumCover.width}
						height={data.albumCover.height}
						priority={true}
					/>
					<h3>{data.trackName}</h3>
					<p>{data.trackArtists}</p>
					<p>{data.isTrackPlaying ? "Playing" : "Paused"}</p>
					<p>{data.trackTimeLeft}</p>
				</article>
			)}
		</section>
	);
};

export default NowPlaying;
