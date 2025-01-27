import evalExpression, { parseExpression } from '../../utils/evalExpression'
import * as presets from '../validation/presets'

import { VALIDATION_SEVERITY_PRIORITY as SEVERITY_PRIORITY } from './const'

/**
 * @typedef {Object} Validation
 * @property {VALIDATION_SEVERITY} severity
 * @property {string} text
 * @property {string} validationKey
 * @property {string} type
 * @property {string | boolean} [enabled]
 * @property {string} [expression] only for type='condition'
 */
/**
 * @typedef {Object} ValidationResult
 * @property {VALIDATION_SEVERITY} severity
 * @property {string} text
 */

/**
 * @param {string} field
 * @param {object} model
 * @param {Validation[]} validationList
 * @return {ValidationResult[]}
 */
export async function validateField(field, model, validationList) {
    const errors = []

    const validations = validationList.filter((validation) => {
        if (typeof presets[validation.type] !== 'function') {
            // eslint-disable-next-line no-console
            console.warn(`Validation error: not found preset for type="${validation.type}", field="${field}"`)

            return false
        }

        const conditions = validation.enablingConditions

        if (conditions?.length) {
            return conditions.every(conditions => evalExpression(conditions, model))
        }

        return true
    })

    for (const validation of validations) {
        const validationFunction = presets[validation.type]

        try {
            const valid = await validationFunction(field, model, validation)

            if (!valid) {
                const expression = parseExpression(validation.text)
                const text = expression ? evalExpression(expression, model) : validation.text

                errors.push({
                    text,
                    severity: validation.severity,
                })
            }
        } catch (error) {
            // eslint-disable-next-line no-console
            console.warn(`validate error: ${error.message}`)
        }
    }

    return errors.sort((first, second) => SEVERITY_PRIORITY[first.severity] - SEVERITY_PRIORITY[second.severity])
}
