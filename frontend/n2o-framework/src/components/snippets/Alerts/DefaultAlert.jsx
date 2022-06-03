import React from 'react'
import PropTypes from 'prop-types'
import omit from 'lodash/omit'
import classNames from 'classnames'

import { AlertTypes } from './AlertsTypes'
import { AlertSection } from './AlertSection'

export const DefaultAlert = ({
    title,
    text,
    color: propsColor,
    href,
    timestamp,
    closeButton,
    className,
    style,
    stacktrace = null,
    animate,
    onDismiss,
    t,
    stacktraceVisible,
    togglingStacktrace,
    onClose = null,
    isField = false,
}) => {
    const color = propsColor || 'secondary'

    const batchedActionToClose = (e) => {
        e.preventDefault()

        if (onClose) {
            /* custom onClose this is used id AlertField */
            onClose()
        } else {
            onDismiss()
        }
    }

    const batchedActionToToggling = (e) => {
        e.preventDefault()
        togglingStacktrace()
    }

    const currentTitle = isField ? (title || text) : title
    const currentText = (isField && !title) ? null : text

    const titleSegmentClassName = title ? 'n2o-alert-segment__title' : 'n2o-alert-segment__text'

    const needToDivide = (currentTitle && currentText) || !!(currentText && (timestamp || closeButton))

    /* this is necessary for custom text colors or font-sizes */
    const getSectionStyle = (style) => {
        if (!style) {
            return null
        }

        return omit(style, ['width', 'height', 'padding', 'margin', 'backgroundColor'])
    }

    const checkSimpleAlert = () => {
        if (closeButton && !stacktrace && !timestamp) {
            return (!title && text) || (title && !text)
        }

        return false
    }

    const isSimple = checkSimpleAlert()

    function Wrapper({ children }) {
        return (
            <div
                className={classNames(
                    'alert n2o-alert',
                    className, {
                        [`alert-${color}`]: color,
                        'n2o-alert--animated': animate,
                        'with-details': stacktrace,
                        'with-link': href,
                    },
                )}
                style={style}
            >
                <a
                    href={href}
                    className={classNames(
                        {
                            [`alert-${color}`]: color,
                            'n2o-alert__with-link': href,
                        },
                    )}
                >
                    {children}
                </a>
            </div>
        )
    }

    Wrapper.propTypes = {
        children: PropTypes.node,
    }

    /* simple one section alert without extra features */
    if (isSimple) {
        return (
            <Wrapper>
                <AlertSection
                    text={currentTitle || currentText}
                    timestamp={timestamp}
                    closeButton={closeButton}
                    onClick={batchedActionToClose}
                    textClassName={titleSegmentClassName}
                    style={getSectionStyle(style)}
                    isSimple
                />
            </Wrapper>
        )
    }

    return (
        <Wrapper>
            <AlertSection
                text={currentTitle}
                timestamp={timestamp}
                closeButton={closeButton}
                onClick={batchedActionToClose}
                textClassName={titleSegmentClassName}
                style={getSectionStyle(style)}
            />
            {
                needToDivide && <hr className="w-100 n2o-alert__divider" />
            }
            <AlertSection text={currentText} textClassName="n2o-alert-segment__text" />
            <AlertSection
                onClick={batchedActionToToggling}
                stacktraceVisible={stacktraceVisible}
                stacktrace={stacktrace}
                t={t}
            />
        </Wrapper>
    )
}

DefaultAlert.propTypes = AlertTypes
