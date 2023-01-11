interface IUserEntity {
    id: string
    username: string
    age: number
    hobbies: [string]
}

export interface IUsers {
    [index: string]: IUserEntity
}
