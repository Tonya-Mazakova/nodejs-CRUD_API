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
        hasRequiredField = Object.prototype.hasOwnProperty.call(body, reqField)
        bodyVal = body?.[reqField]
        schemaType = schema?.[reqField]?.type

        if (!hasRequiredField) {
            acc += `${acc ? ', ' : '' }no '${reqField}' field`
            return acc
        }

        let typeError
        if (schemaType === 'array') {
            isValidType = Array.isArray(bodyVal)
                && bodyVal.every((item: any) => typeof item === schema?.[reqField]?.items?.type)

            typeError =
                `${acc ? ', ' : ''}field '${reqField}' must be of type '${schema?.[reqField]?.type}' of '${schema?.[reqField]?.items?.type}'`
        } else {
            isValidType = typeof bodyVal === schema?.[reqField]?.type
            typeError = `${acc ? ', ' : ''}field '${reqField}' must be of type '${schema?.[reqField]?.type}'`
        }

        if (!isValidType) {
            acc += typeError
        }

        return acc

    }, '')

    return { isValid: !errors, errors }
}
