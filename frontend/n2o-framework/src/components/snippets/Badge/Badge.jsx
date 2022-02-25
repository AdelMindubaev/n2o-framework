import React from 'react'
import PropTypes from 'prop-types'
import cx from 'classnames'

export const renderBadge = ({
    badge,
    badgeColor = 'light',
    icon,
}) => ((badge || typeof badge === 'number') ? (
    <span
        className={
            cx(
                `ml-1 rounded-pill badge badge-${badgeColor}`,
            )}
    >
        {badge}
    </span>
)
    : icon && (
        <span
            className={
                cx(
                    `n2o-counter badge badge-${badgeColor}`,
                    badge !== ' ' ? 'n2o-badge-counter' : 'n2o-badge-dot',
                )}
        >
            {badge}
        </span>
    ))

renderBadge.propTypes = {
    badge: PropTypes.oneOf(['number', 'string']),
    badgeColor: PropTypes.string,
    icon: PropTypes.string,
}