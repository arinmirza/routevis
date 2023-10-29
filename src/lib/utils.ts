/* Ensures that the query result is a list. */
export function list<T>(result: T | T[] | null) {
	if (!result) return [];
    if (Array.isArray(result)) return result as T[];
    return [result] as T[];
}