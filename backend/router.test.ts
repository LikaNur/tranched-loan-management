import { test, expect, beforeEach, afterEach } from 'bun:test'
import { startServer } from './server'
import { createInitialState, resetState, type AppRouter } from './router'
import { createTRPCClient, httpBatchLink } from '@trpc/client'

// There is a chance these tests will fail, this is expected.
// As defined in the router, there is an intended chance that moveLoanToActive will fail.

const client = createTRPCClient<AppRouter>({
    links: [httpBatchLink({ url: 'http://localhost:3000' })],
})

let server: ReturnType<typeof startServer>

beforeEach(() => {
    server = startServer()
    createInitialState()
})

afterEach(() => {
    server.stop(true)
    resetState()
})

test('getInactiveLoans', async () => {
    const res = await client.getInactiveLoans.query()
    console.log(res)
    expect(res).toHaveLength(20)
})

test('getActiveLoans', async () => {
    const res = await client.getActiveLoans.query()

    expect(res).toHaveLength(0)
})

test('moveLoanToActive', async () => {
    let inactiveLoans = await client.getInactiveLoans.query()
    const loanToMove = inactiveLoans[0]

    const res = await client.moveLoanToActive.mutate(loanToMove.id)
    expect(res).toEqual(loanToMove)

    const activeLoans = await client.getActiveLoans.query()

    expect(activeLoans).toHaveLength(1)
    expect(activeLoans[0]).toEqual(loanToMove)

    inactiveLoans = await client.getInactiveLoans.query()
    expect(inactiveLoans).toHaveLength(19)
})