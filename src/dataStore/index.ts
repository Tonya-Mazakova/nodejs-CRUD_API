import { IUsers, IUserEntity } from './UserEntity'

class DataStore {
    private users: IUsers = {}

    public async findAll(): Promise<IUserEntity[]> {
        return Object.values(this.users)
    }

    public async create(data: IUserEntity): Promise<IUserEntity> {
        this.users[data.id] = data

        return data
    }
}

export default new DataStore()
