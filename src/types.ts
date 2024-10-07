import { Request } from "express";

export type RequestWithBody<T> = Request<{}, {}, T>;
export type RequestWithQuery<T> = Request<{}, {}, {}, T>;
export type RequestWthParams<T> = Request<T>;
export type RequestWthParamsAndBody<T, B> = Request<T, {}, B>;