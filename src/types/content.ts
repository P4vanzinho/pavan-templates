export interface ThemeColors {
	paper: string;
	ink: string;
	accent: string;
}

export interface SiteSettings {
	title: string;
	description: string;
	theme: ThemeColors;
}

export interface ContentImage {
	url: string;
	alt: string;
	width: number;
	height: number;
	/** Ponto de foco do recorte, de 0 a 1 em cada eixo. */
	focus: { x: number; y: number };
}

export interface LumeHomeContent {
	heroTitle: string;
	heroTitleEmphasis?: string;
	heroDescription?: string;
	heroImage: ContentImage;
}
