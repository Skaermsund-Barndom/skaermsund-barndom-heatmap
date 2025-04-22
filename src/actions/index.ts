import { defineAction } from "astro:actions";
import { z } from "zod";

export const server = {
	checkPassword: defineAction({
		input: z.string().nullable().optional(),
		handler: (password) => password === "kpfoundry_admin",
	}),
	getPassword: defineAction({
		input: z.void(),
		handler: () => "kpfoundry_admin",
	}),
};
