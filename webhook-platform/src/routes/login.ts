
import { Router, Request, Response } from "express";
import { pool } from "../db";

const router = Router();

router.post("/", async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;

        const udata = await pool.query(
            "SELECT * FROM users WHERE email = $1",
            [email]
        );

        if (udata.rowCount === 0) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        const user = udata.rows[0];

        if (user.password !== password) {
            return res.status(400).json({
                message: "Password incorrect"
            });
        }

        req.session.regenerate((err) => {
            if (err) {
                return res.status(500).json({
                    message: "Could not create session"
                });
            }

            req.session.userId = user.id;

            req.session.save((err) => {
                if (err) {
                    return res.status(500).json({
                        message: "Could not save session"
                    });
                }

                return res.status(200).json({
                    message: "Login successful",
                    user: {
                        id: user.id,
                        name: user.name,
                        email: user.email
                    }
                });
            });
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            message: "Something went wrong"
        });
    }
});

export default router;
