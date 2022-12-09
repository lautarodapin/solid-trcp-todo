import todoRouter from '~/server/trpc/router/todo'
import {t} from "../utils"


export const appRouter = t.router({
    todo: todoRouter,
})

export type IAppRouter = typeof appRouter
