export function extractErrorMessage(error: unknown): string {
	if (error && typeof error === 'object') {
		const err = error as { data?: { message?: string }; shape?: { message?: string }; message?: string };
		return (
			err?.data?.message ||
			err?.shape?.message ||
			err?.message ||
			'An unexpected error occurred. Please try again.'
		);
	}
	return 'An unexpected error occurred. Please try again.';
}
