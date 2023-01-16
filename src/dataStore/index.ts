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

    public async findByID(id: string): Promise<IUserEntity> {
        return this.users[id]
    }

    public async updateByID(id: string, data: IUserEntity): Promise<IUserEntity> {
        this.users[id] = {...this.users[id], ...data}

        return this.users[id]
    }

    public async deleteByID(id: string): Promise<boolean> {
        return delete this.users[id]
    }
}

export default new DataStore()
