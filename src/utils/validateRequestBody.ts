export const validateRequestBody = (
    body: any,
    schema: any
): { isValid: boolean, errors: string } => {

    if (!body) return { isValid: false, errors: 'No body to validate' }

    const requiredFields = schema?.required

    let bodyVal
    let isValidType
    let hasRequiredField
    let schemaType

    const errors = requiredFields?.reduce((acc: any, reqField: string) => {
        hasRequiredField = body.hasOwnProperty(reqField)
        bodyVal = body?.[reqField]
        schemaType = schema?.[reqField]?.type

        if (!hasRequiredField) {
            acc += `${acc ? ', ' : '' }no '${reqField}' field`
            return acc
        }

        if (schemaType === 'array') {
            isValidType = Array.isArray(bodyVal)
        } else {
            isValidType = typeof bodyVal === schema?.[reqField]?.type
        }

        if (!isValidType) {
            acc += `${acc ? ', ' : ''}field '${reqField}' must be '${schema?.[reqField]?.type}'`
        }

        return acc

    }, '')

    return { isValid: !errors, errors }
}
