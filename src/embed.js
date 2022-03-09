import { useEffect, useState } from "react";
import { oembed } from "@loomhq/loom-embed";

export default function Embed({ video }) {
	const [videoHTML, setVideoHTML] = useState(null);

	useEffect(() => {
		setVideoHTML(null);
		
		(async () => {
			const { html } = await oembed(video.sharedUrl, { width: 400 });
			setVideoHTML(html);
		})();
	}, [video]);

	return (
		<>
			{!videoHTML && <div>Loading...</div>}
			{videoHTML && <div dangerouslySetInnerHTML={{ __html: videoHTML }}></div>}
		</>
	);
}
