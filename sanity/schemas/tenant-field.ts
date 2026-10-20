import { defineField } from "sanity";

/** Vincula o documento a um tenant. É definido na criação e não é editável. */
export const tenantField = defineField({
	name: "tenant",
	title: "Site",
	type: "string",
	readOnly: true,
	hidden: true,
	validation: (rule) => rule.required(),
});
