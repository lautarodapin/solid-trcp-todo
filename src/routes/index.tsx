import {type ParentComponent, Switch, Match, For, createSignal} from "solid-js"
import {Title} from "solid-start"
import {trpc} from "~/utils/trpc"

const Home: ParentComponent = () => {
    const res = trpc.todo.all.useQuery()
    const [value, setValue] = createSignal('')
    const addMutation = trpc.todo.add.useMutation()
    const toggleMutation = trpc.todo.toggle.useMutation()
    const deleteMutation = trpc.todo.delete.useMutation()
    const utils = trpc.useContext()
    const handleSubmit = async (e: Event) => {
        e.preventDefault()
        await addMutation.mutateAsync({description: value()})
        setValue('')
        utils.todo.all.invalidate()
    }
    const handleToggle = (id: string) => async () => {
        await toggleMutation.mutateAsync({id})
        utils.todo.all.invalidate()
    }
    const handleDelete = (id: string) => async () => {
        await deleteMutation.mutateAsync({id})
        utils.todo.all.invalidate()
    }
    return (
        <>
            <Title>Home</Title>
            <main class=''>
                <form onSubmit={handleSubmit}>
                    <input value={value()} onInput={e => setValue(e.currentTarget.value)} />
                    <button type='submit'>Add</button>
                </form>

                <Switch
                    fallback={
                        <For each={res.data}>
                            {todo => (
                                <div class='flex space-x-4'>
                                    <button onClick={handleToggle(todo.id)}>
                                        {todo.done ? '✓' : '⁜'}
                                        {todo.description}
                                    </button>
                                    <button onClick={handleDelete(todo.id)}>
                                        ⌫
                                    </button>
                                </div>
                            )}
                        </For>
                    }
                >
                    <Match when={res.isLoading}>
                        <div class="font-bold text-2xl text-gray-500">Loading...</div>
                    </Match>
                </Switch>
            </main>
        </>
    )
}

export default Home
