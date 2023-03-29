import type { Actions } from "@sveltejs/kit";

export const actions: Actions = {
    default: async ({request}) => {
        const { question, history } = Object.fromEntries(await request.formData())
        console.log(question)
        console.log(history)
    }
};