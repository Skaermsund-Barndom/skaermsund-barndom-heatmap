/**
 * Represents a function that takes a value and returns a value or Promise
 */
type PipeFunction<Input, Output> = (value: Input) => Output | Promise<Output>;

/**
 * Creates a pipe of functions that processes a value through a series of transformations
 * @param fns - Array of functions to be executed in sequence
 * @returns A function that takes an initial value and returns the final transformed value
 */
export const pipe = <Initial, Final>(
	first: PipeFunction<Initial, Final>,
	// biome-ignore lint/suspicious/noExplicitAny: TypeScript doesn't currently support perfectly typed variadic tuples in this case.
	...fns: PipeFunction<any, any>[]
): ((initialValue: Initial) => Promise<Final>) => {
	return async (initialValue: Initial) => {
		return fns.reduce(
			async (promise, fn) => {
				const value = await promise;
				return fn(value);
			},
			Promise.resolve(first(initialValue)),
		);
	};
};
