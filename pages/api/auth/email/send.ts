import type { NextApiRequest, NextApiResponse } from "next";
import { errorHandler } from "@utils";
import { ERROR_405_MESSAGE } from "@constants";
import nodemailer from "nodemailer";

const sendEmail = async (
  request: NextApiRequest,
  response: NextApiResponse
) => {
  try {
    if (request.method !== "POST") {
      response.status(405).json(ERROR_405_MESSAGE);
      return;
    }

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "",
        pass: "",
      },
    });

    const mailOptions = {
      from: "",
      to: "",
      subject: "Sending Email using Node.js",
      text: "That was easy!",
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
      } else {
        console.log("Email sent: " + info.response);
      }
    });
    response.send("success");
  } catch (error) {
    response.status(500).end(errorHandler(error));
  }
};

export default sendEmail;
