import type { LayoutServerLoad } from "./$types";

export const load: LayoutServerLoad = async ({ cookies }) => {
  const user = cookies.get("user");
  const document = cookies.get("document");

  if (user && document) {
    return { user: user, document: document };
  } else if (user) {
    return { user: user };
  }
};
