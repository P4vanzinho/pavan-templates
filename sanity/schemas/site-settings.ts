import { defineField, defineType } from "sanity";
import { tenantField } from "./tenant-field";

const hexColor = /^#[0-9a-f]{6}$/i;

export const siteSettings = defineType({
	name: "siteSettings",
	title: "Configurações do site",
	type: "document",
	fields: [
		tenantField,
		defineField({
			name: "title",
			title: "Nome do site",
			type: "string",
			validation: (rule) => rule.required().max(80),
		}),
		defineField({
			name: "description",
			title: "Descrição para buscadores",
			type: "text",
			rows: 3,
			validation: (rule) => rule.required().max(200),
		}),
		defineField({
			name: "theme",
			title: "Cores",
			type: "object",
			options: { collapsible: true },
			fields: [
				defineField({
					name: "paper",
					title: "Fundo",
					type: "string",
					validation: (rule) => rule.required().regex(hexColor),
				}),
				defineField({
					name: "ink",
					title: "Texto",
					type: "string",
					validation: (rule) => rule.required().regex(hexColor),
				}),
				defineField({
					name: "accent",
					title: "Destaque",
					type: "string",
					validation: (rule) => rule.required().regex(hexColor),
				}),
			],
		}),
	],
	preview: { select: { title: "title", subtitle: "tenant" } },
});
