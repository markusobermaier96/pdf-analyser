import type { Actions } from "@sveltejs/kit";

export const actions: Actions = {
    default: async (event) => {
        const data = event.request.formData;
        console.log(data)
    }
};