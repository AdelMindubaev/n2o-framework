import React, { useEffect } from 'react'
import PropTypes from 'prop-types'
import { bindActionCreators } from 'redux'
import get from 'lodash/get'
import map from 'lodash/map'
import keys from 'lodash/keys'
import { connect } from 'react-redux'
import {
    compose,
    withContext,
    lifecycle,
    withHandlers,
} from 'recompose'
import numeral from 'numeral'
import 'numeral/locales/ru'
import isEmpty from 'lodash/isEmpty'

import { Spinner } from '../snippets/Spinner/Spinner'
import {
    requestConfig as requestConfigAction,
    setReady as setReadyAction,
    registerLocales,
    globalSelector,
} from '../../ducks/global/store'
import { register } from '../../ducks/datasource/store'

import { GlobalAlertsConnected } from './GlobalAlerts'

function Application(props) {
    const { ready, loading, render, locale, localesConfig, TimeAgo, menu, registerDatasorces, ...config } = props
    const { datasources } = menu

    useEffect(() => {
        if (isEmpty(datasources)) { return }

        Object.entries(datasources).forEach(([id, config]) => {
            registerDatasorces(id, config)
        })
    }, [datasources, registerDatasorces])

    numeral.locale(locale)

    const timeAgo = new TimeAgo(localesConfig[locale].prefix)

    /* getTimeAgo(timestamp) высчитывает время от timestamp до Date.now()
       example getTimeAgo(timestamp) => 10 минут назад*/
    const getTimeAgo = timestamp => (timestamp ? timeAgo.format(new Date(timestamp)) : null)

    return (
        <>
            <GlobalAlertsConnected getTimeAgo={getTimeAgo} />
            <Spinner type="cover" loading={loading}>
                {ready && render(config)}
            </Spinner>
        </>
    )
}

Application.propTypes = {
    ready: PropTypes.bool,
    loading: PropTypes.bool,
    realTimeConfig: PropTypes.bool,
    render: PropTypes.func,
    locale: PropTypes.string,
    datasources: PropTypes.object,
    menu: PropTypes.object,
    registerDatasorces: PropTypes.func,
    localesConfig: PropTypes.object,
    TimeAgo: PropTypes.func,
}

const mapStateToProps = state => ({
    ...globalSelector(state),
})

const mapDispatchToProps = dispatch => ({
    setReady: bindActionCreators(setReadyAction, dispatch),
    requestConfig: bindActionCreators(requestConfigAction, dispatch),
    registerLocales: locales => dispatch(registerLocales(locales)),
    registerDatasorces: (id, config) => dispatch(register(id, config)),
})

export default compose(
    connect(
        mapStateToProps,
        mapDispatchToProps,
    ),
    withContext(
        {
            getFromConfig: PropTypes.func,
            configLocale: PropTypes.string,
        },
        props => ({
            getFromConfig: key => get(props, key),
            configLocale: props.locale,
        }),
    ),
    withHandlers({
        addCustomLocales: ({ i18n, customLocales }) => () => {
            map(keys(customLocales), (locale) => {
                i18n.addResourceBundle(locale, 'translation', customLocales[locale])
            })
        },
    }),
    lifecycle({
        componentDidMount() {
            const {
                realTimeConfig,
                requestConfig,
                setReady,
                locales = {},
                customLocales,
                registerLocales,
                addCustomLocales,
                locale,
                TimeAgo,
                localesConfig,
            } = this.props

            addCustomLocales()
            registerLocales(keys({ ...locales, ...customLocales }))

            TimeAgo.addDefaultLocale(localesConfig[locale].meta)

            if (realTimeConfig) {
                requestConfig()
            } else {
                setReady()
            }
        },
        componentDidUpdate(prevProps) {
            const { locale, i18n, TimeAgo, localesConfig } = this.props

            if (prevProps.locale !== locale) {
                i18n.changeLanguage(locale)

                TimeAgo.addLocale(localesConfig[locale].meta)
            }
        },
    }),
)(Application)
