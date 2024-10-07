import {Express, Request, Response} from "express";
import {RequestWithBody, RequestWithQuery, RequestWthParams, RequestWthParamsAndBody} from "../types";
import {GetCourseQueryModel} from "../models/GetCourseQueryModel";
import {CourseViewModel} from "../models/CourseViewModel";
import {CourseURIModel} from "../models/CourseURIModel";
import {CourseCreateModel} from "../models/CourseCreateModel";
import {CourseTypeModel} from "../models/CourseTypeModel";
import {CourseUpdateModel} from "../models/CourseUpdateModel";
import {db} from "../db/db";


export const HTTP_STATUSES = {
    OK_200: 200,
    CREATED_201: 201,
    NO_CONTENT_204: 204,
    BAD_REQUEST_400: 400,
    NOT_FOUND_404: 404
};

export const getCourseViewModel = (course: CourseTypeModel): CourseViewModel => {
    return {
        id: course.id,
        title: course.title,
    }
}

export const addCoursesRoutes = (app: Express ) => {
    app.get('/', (req: Request, res: Response) => {
        res.write('<button> <a href="/courses">redirect to courses</a> </button>');
    })

    /* Request<{},{},{},{title: string}> => RequestWithQuery<{title: string}> */
    app.get('/courses', (req: RequestWithQuery<GetCourseQueryModel>, res: Response<CourseViewModel[]>) => {
        let foundCourses = db.courses;

        if(req.query.title) {
            foundCourses = foundCourses
                .filter(c => c.title.indexOf(req.query.title) > -1);
        }

        res.json(foundCourses.map(getCourseViewModel));
    });

    /* Request<{id: string}> => RequestWthParams<{id: string}> */
    app.get('/courses/:id', (req: RequestWthParams<CourseURIModel>, res: Response<CourseViewModel>) => {
        const course = db.courses
            .find(c => c.id === +req.params.id);

        if (!course){
            res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
            return;
        }

        res.json(getCourseViewModel(course));
    });

    /* Request<{},{},{title: string}> => RequestWithBody<{title: string} */
    app.post('/courses', (req: RequestWithBody<CourseCreateModel>, res: Response<CourseViewModel>) => {
        if (!req.body.title) {
            res.sendStatus(HTTP_STATUSES.BAD_REQUEST_400);
            return;
        }
        const newCourse: CourseTypeModel = {
            id: +(new Date()),
            title: req.body.title,
            studentsCount: 0,
        };

        db.courses.push(newCourse);
        res
            .status(HTTP_STATUSES.CREATED_201)
            .json(getCourseViewModel(newCourse));
    });

    /* Request<{id: string}, {}, {title: string}> => RequestWthParamsAndBody<{id: string}, {title: string}> */
    app.put('/courses/:id', (req: RequestWthParamsAndBody<CourseURIModel, CourseUpdateModel>, res: Response<CourseViewModel[]>) => {
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

    app.delete('/courses/:id', (req: RequestWthParams<CourseURIModel>, res: Response) => {
        db.courses = db.courses
            .filter(c => c.id === +req.params.id);

        res.sendStatus(HTTP_STATUSES.NO_CONTENT_204);
    });
}