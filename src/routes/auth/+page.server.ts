import { prisma } from "@lib/server/prisma";
import { error, redirect, type Actions } from "@sveltejs/kit";
import crypto from "crypto";

export const actions: Actions = {
  login: async ({ request }) => {
    const userAddress = await request.formData().then((data) => {
      return data.get("user") as string;
    });
    if (!userAddress) {
      throw error(500, "No user data");
    }

    // retrieve user from db
    const user = await prisma.user
      .findUnique({
        where: {
          publicAddress: userAddress,
        },
      })
      .catch((err) => {
        console.log(err);
        throw error(500, "Error occured while calling the database");
      });
    /* create new user if he is not registered yet and return nonce to frontend */
    let nonce;
    if (!user) {
      nonce = crypto.randomBytes(16).toString("hex");
      const user_model = {
        publicAddress: userAddress,
        nonce: nonce,
      };
      await prisma.user
        .create({
          data: user_model,
        })
        .then(() => {
          console.log("created user");
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      nonce = user.nonce;
      console.log("user already exists");
    }
    return {
      nonce: nonce,
    };
  },

  logout: async ({ cookies }) => {
    cookies.delete("user");
    cookies.delete("document");

    throw redirect(302, "/");
  },
};
