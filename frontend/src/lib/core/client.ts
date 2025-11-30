import type { AppRouter } from '@exercise/backend/router';
import { createTRPCClient, httpBatchLink } from '@trpc/client';

export const client = createTRPCClient<AppRouter>({
	links: [httpBatchLink({ url: 'http://localhost:3000' })]
});
