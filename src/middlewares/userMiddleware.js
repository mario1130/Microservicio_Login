import Joi from 'joi';

// Definimos esquemas de validación


// function validateFilterUsers(req, res) {
//     const { error, value } = userSchemaFiltered.validate(req.body, { abortEarly: false });

//     if (error) {
//         // Si hay un error de validación, enviamos una respuesta 400
//         return res.status(400).json({
//             message: 'Invalid request parameters',
//             details: error.details.map(err => err.message),
//         });
//     }

//     // Si pasa la validación, añadimos los datos validados a `req.query`
//     req.query = value;
//     return res.status(200);;
// }

export const validateFilterUsers = (req, res, next) => {
    const schema = Joi.object({
        mail: Joi.string().email().required(),
    });

    const { error, value } = schema.validate(req.body, { abortEarly: false });

    if (error) {
        return res.status(400).json({
            message: 'Invalid request parameters',
            details: error.details.map(err => err.message),
        });
    }

    req.validatedData = value;
    next();
};


export default {

    validateFilterUsers

}
