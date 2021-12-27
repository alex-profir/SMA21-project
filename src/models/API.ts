export type BasicQuerySearch = {
    limit: number,
    search: string,
    offset: number
}

export type QueryResult<T> = {
    count: number;
    results: T[]
}