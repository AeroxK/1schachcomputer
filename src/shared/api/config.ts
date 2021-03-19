export enum WebsocketEventNames {
    Connection = 'connection',
    DiscardGame = 'discard game',
    GetMoves = 'get moves',
    MakeMove = 'make move',
    UpdateBoard = 'update board',
    UpdateMoves = 'update moves'
}

export const apiPrefix = '/api';
export const loginApiUrl = `${apiPrefix}/login`;
export const registerApiUrl = `${apiPrefix}/register`;
