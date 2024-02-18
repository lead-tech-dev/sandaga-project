import { rest } from "msw";

export const handlers = [
    rest.get(
        "http://localhost:8080/api/v1/notifications",
        (req, res, ctx) => {
            return res(
                ctx.status(200),
                ctx.json([
                    {
                        id: "1",
                        message: "Vous avez reçu un message 1",
                        createdAt: new Date(),
                        status: "pending"
                    },
                    {
                        id: "2",
                        message: "Vous avez reçu un message 2",
                        createdAt: new Date(),
                        status: "pending"
                    }
                ])
            )
        }
    )
]