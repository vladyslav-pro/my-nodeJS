import {CourseTypeModel} from "../models/CourseTypeModel";

export const db: { courses: CourseTypeModel[] } = {
    courses: [
        {id: 1, title: 'Front-end', studentsCount: 5},
        {id: 2, title: 'Back-end', studentsCount: 5},
        {id: 3, title: 'DevOps', studentsCount: 5},
        {id: 4, title: 'QA', studentsCount: 5},
        {id: 5, title: 'Automation QA', studentsCount: 5}
    ]
};