import { compose, mapProps } from 'recompose'

import withActionButton from '../withActionButton'
import mappingProps from '../Simple/mappingProps'

export const withPerformAction = compose(
    withActionButton({
        onClick: (e, props) => {
            const { action, onClick, dispatch } = props

            if (action) {
                dispatch(action)
            }

            if (onClick) {
                onClick(e)
            }
        },
    }),
    mapProps(props => mappingProps(props)),
)

export default withPerformAction
