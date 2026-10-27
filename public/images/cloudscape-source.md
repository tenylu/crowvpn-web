# Cloudscape

Photo: Above-cloud photo of blue skies — Taylor Van Riper.
Page: https://unsplash.com/photos/above-cloud-photo-of-blue-skies-yQorCngxzwI
Source: https://images.unsplash.com/photo-1513002749550-c59d786b8e6c
Downloaded at source resolution, WebP quality 90, without upscaling.
CSS crops around the horizon and applies a light cool grade; no blur is applied.
`cloud-horizon-hd.webp` is a 2592×1800 native-resolution crop with a 256px
overlap seam and mild sharpening, prepared by `scripts/prepare-cloud-layers.py`.
`cloud-wisp.webp` extracts a faint transparent photographic cloud layer from
the same original. Neither asset is upscaled or represented as new 4K detail.
The panorama moves in one direction over 240 seconds; the closer wisp crosses
in 100 seconds. Motion pauses offscreen/in hidden tabs and honors reduced motion.

Current page asset: `cloud-horizon-crisp.webp` (2592×1800, lossless WebP),
reprocessed from `cloud-ocean-source.jpg`, the same source URL with `fm=jpg&q=100`.
Mild local contrast and edge sharpening are applied at native resolution.
No CSS brightening, white veil, or additional scroll zoom is applied to the sky.
The faint moving wisp renders at 25% of its previous opacity. This improves
source fidelity; it does not add resolution or recover detail absent in the photo.
License: https://unsplash.com/license
The cabin frame is an original SVG drawn for this project; no Jesko Jets artwork is used in the homepage implementation.
