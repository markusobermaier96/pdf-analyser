import type { Actions } from "@sveltejs/kit";

export const actions: Actions = {
    default: async ({request}) => {
        const data = Object.fromEntries(await request.formData())
        console.log(data)
        return "hi"
    }
};