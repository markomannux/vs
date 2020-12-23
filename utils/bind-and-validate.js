
module.exports = (model, action, resource, formDataHook = () => {}) => {
    return async (req, res, next) => {

        const boundModel = new model(req.body)
        try {
            await boundModel.validate()
            req.boundModel = boundModel
            next()
        } catch (error) {
            const model = await formDataHook()

            res.set('Content-Type', 'application/javascript')
            .render('js/renderForm', {
                action,
                resource,
                model: {...model, ...boundModel._doc},
                errors: error.errors});
        }
    }
}