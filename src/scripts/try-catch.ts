type Success<T> = {
	data: T;
	error: null;
};

type Failure<E> = {
	data: null;
	error: E;
};

type Result<T, E = Error> = Success<T> | Failure<E>;

type MaybePromise<T> = T | Promise<T>;

export function tryCatch<T, E = Error>(
	arg: Promise<T> | (() => MaybePromise<T>),
): Result<T, E> | Promise<Result<T, E>> {
	if (typeof arg === "function") {
		try {
			const result = arg();

			return result instanceof Promise ?
					tryCatch(result)
				:	{ data: result, error: null };
		} catch (error) {
			return { error: error as E, data: null };
		}
	}

	return arg
		.then((data) => ({ data, error: null }))
		.catch((error) => ({ error: error as E, data: null }));
}
