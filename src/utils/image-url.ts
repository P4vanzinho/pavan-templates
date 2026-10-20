/** Monta a URL de uma largura específica no CDN de imagens do Sanity. */
export function sizedImageUrl(url: string, width: number): string {
	const sized = new URL(url);
	sized.searchParams.set("w", String(width));
	sized.searchParams.set("auto", "format");
	sized.searchParams.set("fit", "max");
	return sized.toString();
}

export function imageSrcset(url: string, widths: readonly number[]): string {
	return widths.map((width) => `${sizedImageUrl(url, width)} ${width}w`).join(", ");
}
