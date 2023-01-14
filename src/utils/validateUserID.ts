import { validate } from 'uuid'

export const validateUserID = (id: any): { isValid: boolean, error: string } => {
    const isValid = validate(id)

    return { isValid, error: `${isValid ? '' : 'user id is invalid'}` }
}
