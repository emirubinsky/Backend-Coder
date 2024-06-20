export default class ValidationError {
    static createError({
        name = "Error",
        cause,
        message,
        code,
        items
    }) {

        const error = new Error(message, { cause })

        error.name = name;
        error.code = code;
        error.items = items
        error.isCustom = true

        throw error;
    }
}