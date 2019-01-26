const { SchemaDirectiveVisitor, AuthenticationError } = require('apollo-server')

const roleLevel = ['USER', 'ADMIN']

class RequireAuthDirective extends SchemaDirectiveVisitor {
    visitFieldDefinition(field) {
        const { resolve = defaultFieldResolver } = field
        const { role } = this.args
        field.resolve = async function(...args) {
            const [, , context] = args
            if (context.user) {                
                if (roleLevel.indexOf(context.user.role) < roleLevel.indexOf(role)) {
                    throw new AuthenticationError(
                        "You are not authorized to perform this operation"
                    );
                } else {
                    const result = await resolve.apply(this, args)
                    return result
                }
            } else {
                throw new AuthenticationError(
                    "You must be logged in"
                )
            }
        } 
    }
}

module.exports = RequireAuthDirective