import { v4 } from 'uuid'
import { IUsers, IUserEntity } from './UserEntity'

class DataStore {
    private users: IUsers = {}

    public async findAll(): Promise<IUserEntity[]> {
        return Object.values(this.users)
    }
}

export default new DataStore()
