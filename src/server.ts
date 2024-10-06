import express, { Request, Response } from 'express';
export const app = express();
const port = process.env.PORT || 3000;

const jsonBodyMiddleware = express.json();
app.use(jsonBodyMiddleware);

const db = {
    courses: [
        {id: 1, title: 'Front-end'},
        {id: 2, title: 'Back-end'},
        {id: 3, title: 'DevOps'},
        {id: 4, title: 'QA'},
        {id: 5, title: 'Automation QA'}
    ]
};

const HTTP_STATUSES = {
    OK_200: 200,
    CREATED_201: 201,
    NO_CONTENT_204: 204,
    BAD_REQUEST_400: 400,
    NOT_FOUND_404: 404
};

app.get('/', (req: Request, res: Response) => {
    res.write('<button> <a href="/courses">redirect to courses</a> </button>');
})

app.get('/courses', (req: Request, res: Response) => {
    if(req.query.title) {
        const foundCourses = db.courses
            .filter(c => c.title.indexOf(req.query.title as string) > -1);
        res.json(foundCourses);
    }
    res.json(db.courses);
});

app.get('/courses/:id', (req: Request, res: Response) => {
    const courses = db.courses
        .find(c => c.id === +req.params.id);

    if (!courses){
        res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
        return;
    }

    res.json(courses);
});

app.post('/courses', (req: Request, res: Response) => {
    if (!req.body.title) {
        res.sendStatus(HTTP_STATUSES.BAD_REQUEST_400);
        return;
    }
    const newCourse = {
        id: +(new Date()),
        title: req.body.title
    };
    db.courses.push(newCourse);
    res
        .status(HTTP_STATUSES.CREATED_201)
        .json(db.courses);
});

app.put('/courses/:id', (req: Request, res: Response) => {
    if (!req.body.title) {
        res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
        return;
    }

    const courses = db.courses
        .find(c => c.id === +req.params.id);

    if (!courses){
        res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
        return;
    }

    courses.title = req.body.title;

    res.json(db.courses);
});

app.delete('/courses/:id', (req: Request, res: Response) => {
    db.courses = db.courses
        .filter(c => c.id === +req.params.id);


    res.sendStatus(HTTP_STATUSES.NO_CONTENT_204);
})

app.delete('/__test__/', (req: Request, res: Response) => {
    db.courses = [];
    res.sendStatus(HTTP_STATUSES.NO_CONTENT_204);
})


app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
})
