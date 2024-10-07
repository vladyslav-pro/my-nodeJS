import express, {Request, Response} from "express";
import {addCoursesRoutes, HTTP_STATUSES} from "./routes/courses";
import {db} from "./db/db";

export const app = express();

export const jsonBodyMiddleware = express.json();

app.use(jsonBodyMiddleware);

addCoursesRoutes(app);

/* for testing */
app.delete('/__test__/', (req: Request, res: Response) => {
    db.courses = [];
    res.sendStatus(HTTP_STATUSES.NO_CONTENT_204);
});