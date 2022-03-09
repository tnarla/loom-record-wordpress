/**
 * Retrieves the translation of text.
 *
 * @see https://developer.wordpress.org/block-editor/packages/packages-i18n/
 */
import { __ } from "@wordpress/i18n";

import { isSupported, setup } from "@loomhq/record-sdk";
import { oembed } from "@loomhq/loom-embed";

/**
 * React hook that is used to mark the block wrapper element.
 * It provides all the necessary props like the class name.
 *
 * @see https://developer.wordpress.org/block-editor/packages/packages-block-editor/#useBlockProps
 */
import { useBlockProps } from "@wordpress/block-editor";
import { useEffect, useState, useRef, useMemo } from "react";

/**
 * Lets webpack process CSS, SASS or SCSS files referenced in JavaScript files.
 * Those files can contain any CSS code that gets applied to the editor.
 *
 * @see https://www.npmjs.com/package/@wordpress/scripts#using-css
 */
// import "./editor.scss";

/**
 * The edit function describes the structure of your block in the context of the
 * editor. This represents what the editor will render when the block is used.
 *
 * @see https://developer.wordpress.org/block-editor/developers/block-api/block-edit-save/#edit
 *
 * @return {WPElement} Element to render.
 */
export default function Edit({ attributes, setAttributes }) {
	const buttonRef = useRef(null);
	const [loomSDK, setLoomSDK] = useState(null);
	const [isError, setIsError] = useState(false);

	useEffect(() => {
		async function fetchLoom() {
			const { supported, error } = await isSupported();
			console.log("hello two");

			// if (supported) {
			// 	const response = await setup({
			// 		publicAppId: "1cc2737b-b6d2-46da-9300-12a60874820c",
			// 	});
			// 	setLoomSDK(response);
			// } else {
				console.warn(`Error setting up Loom: ${error}`);
				setIsError(true);
			// }
		}

		fetchLoom();
	}, []);

	useEffect(() => {
		if (!loomSDK || !buttonRef.current) return;

		const sdkButton = loomSDK.configureButton({ element: buttonRef.current });

		sdkButton.on("insert-click", async (video) => {
			const { html } = await oembed(video.sharedUrl, { width: 400 });

			setAttributes({
				// We store the original video information just for future-proofing:
				loomVideo: video,
				loomEmbedHTML: html,
			});
		});
	}, [loomSDK]);

	const blockProps = useBlockProps();

	return isError ? (
		<p>
			Unable to record a Loom on this browser. Download the{" "}
			<a
				href="https://www.loom.com/download"
				target="_blank"
				rel="noopener"
				style={{
					color: "#615CF5",
					textDecoration: "none",
					fontWeight: "bold",
				}}
			>
				Loom desktop app
			</a>{" "}
			instead.
		</p>
	) : (
		<p {...blockProps}>
			{!attributes.loomEmbedHTML && (
				<button
					ref={buttonRef}
					type="button"
					style={{
						borderRadius: 6,
						padding: "7px 12px",
						fontSize: 12,
						lineHeight: "150%",
						background: "#615CF5",
						color: "white",
						border: "none",
						fontWeight: "bold",
						cursor: "pointer",
					}}
				>
					Record
				</button>
			)}

			{attributes.loomEmbedHTML && (
				<div dangerouslySetInnerHTML={{ __html: attributes.loomEmbedHTML }} />
			)}
		</p>
	);
}
