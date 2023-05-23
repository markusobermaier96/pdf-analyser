import { error, type RequestHandler } from "@sveltejs/kit";
import { ethers } from "ethers";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "$env/static/private";
import { prisma } from "@lib/server/prisma";

interface User {
  publicAddress: string;
  token?: string;
}

export const POST: RequestHandler = async ({ request, cookies }) => {
  // get data
  const { signedMessage, userAddress } = await request.json();

  if (!(signedMessage && userAddress)) {
    throw error(500, "something went wrong");
  }

  // get user
  const currentUser = await prisma.user
    .findUnique({
      where: {
        publicAddress: userAddress,
      },
    })
    .catch(() => {
      throw error(500, "Could not retrieve user from db");
    });

  // verify signature
  if (
    ethers.verifyMessage(currentUser!.nonce, signedMessage).toLowerCase() !==
    userAddress
  ) {
    console.log("Invalid signature");
    return new Response("Invalid signature", { status: 500 });
  }
  console.log("Signature verified");

  // update user
  const updatedUser = await prisma.user.update({
    where: {
      publicAddress: userAddress,
    },
    data: {
      nonce: crypto.randomBytes(16).toString("hex"),
    },
  });

  const token = jwt.sign(
    {
      address: updatedUser.publicAddress,
    },
    JWT_SECRET,
    { expiresIn: "6h" }
  );

  const user_model: User = {
    publicAddress: updatedUser.publicAddress,
    token: token,
  };

  cookies.set("user", JSON.stringify(user_model), {
    // sets the cookie to expire in 6 hours
    expires: new Date(Date.now() + 6 * 60 * 60 * 1000),
    path: "/",
  });

  return new Response(JSON.stringify(user_model));
};
