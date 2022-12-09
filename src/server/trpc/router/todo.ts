import {z} from "zod"
import {procedure, router} from "../utils"

export default router({
    all: procedure.query(async ({ctx}) => {
        const todos = await ctx.prisma.todo.findMany()
        return todos
    }),
    add: procedure.input(z.object({description: z.string()})).mutation(async ({ctx, input}) => {
        const todo = await ctx.prisma.todo.create({
            data: {
                ...input,
            }
        })
        return todo
    }),
    delete: procedure.input(z.object({id: z.string()})).mutation(async ({ctx, input}) => {
        return await ctx.prisma.todo.delete({where: {id: input.id}})
    }),
    toggle: procedure.input(z.object({id: z.string()})).mutation(async ({ctx, input}) => {
        const todo = await ctx.prisma.todo.findFirst({where: {id: input.id}})
        if (!todo) throw new Error('404')
        return await ctx.prisma.todo.update({
            where: {id: todo.id},
            data: {
                done: !todo.done
            }
        })

    }),
})
