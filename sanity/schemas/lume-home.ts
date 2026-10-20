import { defineField, defineType } from "sanity";
import { tenantField } from "./tenant-field";

export const lumeHome = defineType({
	name: "lumeHome",
	title: "Home",
	type: "document",
	fields: [
		tenantField,
		defineField({
			name: "heroTitle",
			title: "Título",
			type: "string",
			validation: (rule) => rule.required().max(60),
		}),
		defineField({
			name: "heroTitleEmphasis",
			title: "Título em destaque",
			description: "Segunda linha do título, exibida em itálico.",
			type: "string",
			validation: (rule) => rule.max(60),
		}),
		defineField({
			name: "heroDescription",
			title: "Frase de apoio",
			type: "string",
			validation: (rule) => rule.max(140),
		}),
		defineField({
			name: "heroImage",
			title: "Imagem principal",
			type: "image",
			options: { hotspot: true },
			fields: [
				defineField({
					name: "alt",
					title: "Descrição da imagem",
					description: "Lida por leitores de tela. Descreva o que aparece na foto.",
					type: "string",
					validation: (rule) => rule.required(),
				}),
			],
			validation: (rule) => rule.required(),
		}),
	],
	preview: {
		select: { title: "heroTitle", media: "heroImage" },
		prepare: ({ title, media }) => ({ title: "Home", subtitle: title, media }),
	},
});
