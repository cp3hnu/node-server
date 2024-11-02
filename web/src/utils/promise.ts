/**
 * @param { Promise } promise
 * @return { Promise }
 */
export async function to<T, U = any>(promise: Promise<T>): Promise<[T, null] | [null, U]> {
  try {
    const data = await promise;
    return [data, null];
  } catch (error) {
    return [null, error as U];
  }
}

export default to;
