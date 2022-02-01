import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import map from 'lodash/map'
import { NavLink } from 'react-router-dom'

import { getFromSource } from '../Header/SimpleHeader/NavItemContainer'
import { id as generateId } from '../../utils/id'
import { renderBadge } from '../../components/snippets/Badge/Badge'
import { NavItemImage } from '../../components/snippets/NavItemImage/NavItemImage'
import { Tooltip } from '../../components/snippets/Tooltip/Tooltip'
import { SimpleTooltip } from '../../components/snippets/Tooltip/SimpleTooltip'
import { WithDataSource } from '../../core/datasource/WithDataSource'

// eslint-disable-next-line import/no-cycle
import SidebarDropdown from './SidebarDropdown'

const ItemType = {
    DROPDOWN: 'dropdown',
    LINK: 'link',
}

const OUTER_LINK_TYPE = 'outer'

/**
 * Рендер иконки
 * @param icon - иконка
 * @param title - текст итема
 * @param type - тип итема
 * @param sidebarOpen - флаг сжатия сайдбара
 * @param subItems
 * @returns {*}
 */
export const renderIcon = (icon, title, type, sidebarOpen, subItems) => {
    let component = <i className={classNames(icon)} />

    if (!sidebarOpen && type === ItemType.DROPDOWN && !subItems) {
        return title
    } if (!sidebarOpen && !icon) {
        component = title.substring(0, 1)
    }

    return <span className="n2o-sidebar__item-content-icon">{component}</span>
}

/**
 * Sidebar Item
 * @param className
 * @param item - объект итема
 * @param activeId - активный элемент
 * @param sidebarOpen - флаг сжатия сайдбара
 * @param showContent
 * @param isMiniView
 * @param isStaticView
 * @param level - уровень вложенности
 * @returns {*}
 * @constructor
 */

const ItemHOC = ({ children, needTooltip, hint }) => {
    if (needTooltip) {
        return <Tooltip label={children} placement="right" hint={hint} />
    }

    return children
}

export function SidebarItemContainer({
    className,
    itemProps,
    activeId,
    sidebarOpen,
    showContent,
    isMiniView,
    isStaticView,
    level = 1,
    datasources,
    datasource,
    models,
}) {
    const item = getFromSource(itemProps, datasources, datasource, models)
    const { type, linkType, items = [] } = item

    const renderItem = type => (
        <>
            {type === ItemType.LINK && renderLink(item)}
            {type === ItemType.DROPDOWN && renderDropdown()}
        </>
    )

    const renderLink = item => (linkType === OUTER_LINK_TYPE
        ? renderOuterLink(item)
        : renderInnerLink(item))

    const renderCurrentTitle = (isMiniView, icon, title) => {
        if (isMiniView) {
            if (icon) {
                return null
            }

            return title.substring(0, 1)
        }

        return title
    }

    // eslint-disable-next-line react/prop-types
    const renderOuterLink = ({ href, title, icon, imageSrc, imageShape }) => {
        const id = generateId()

        return (
            <a id={id} className="n2o-sidebar__item" href={href}>
                {!imageSrc && icon && renderIcon(icon, title, type, sidebarOpen)}
                {imageSrc && <NavItemImage imageSrc={imageSrc} title={title} imageShape={imageShape} />}
                <span className={classNames(
                    'n2o-sidebar__item__title',
                    {
                        none: isMiniView && icon,
                    },
                )}
                >
                    {renderCurrentTitle(isMiniView, icon, title)}
                </span>
                {renderBadge(item)}
            </a>
        )
    }
    // eslint-disable-next-line react/prop-types
    const renderInnerLink = ({ href, title, icon, imageSrc, imageShape }) => {
        const id = generateId()

        const Component = () => (
            <>
                <NavLink
                    exact
                    to={href}
                    className="n2o-sidebar__item"
                    activeClassName="active"
                    id={id}
                >
                    {icon && renderIcon(icon, title, type, sidebarOpen)}
                    {imageSrc && <NavItemImage imageSrc={imageSrc} title={title} imageShape={imageShape} />}
                    <span
                        className={classNames(
                            'n2o-sidebar__item-title',
                            {
                                visible: isStaticView ? true : showContent,
                            },
                        )}
                    >
                        {renderCurrentTitle(isMiniView, icon, title)}
                    </span>
                    {renderBadge(item)}
                </NavLink>
            </>
        )

        return (
            <ItemHOC needTooltip={isMiniView} hint={title}>
                <Component />
            </ItemHOC>
        )
    }

    const renderDropdown = () => {
        const id = generateId()

        return (
            <>
                <SidebarDropdown
                    {...item}
                    sidebarOpen={sidebarOpen}
                    showContent={showContent}
                    isMiniView={isMiniView}
                    id={id}
                >
                    {map(items, (item, i) => (
                        <div
                            key={i}
                            className={classNames(
                                'n2o-sidebar__sub-item',
                                `n2o-sidebar__sub-item--level-${level}`,
                            )}
                        >
                            <SidebarItemContainer
                                level={level + 1}
                                key={i}
                                activeId={activeId}
                                item={item}
                                sidebarOpen={sidebarOpen}
                                showContent={showContent}
                                isMiniView={isMiniView}
                            />
                        </div>
                    ))}
                </SidebarDropdown>
                {isMiniView && <SimpleTooltip id={id} message={item.title} placement="right" />}
            </>
        )
    }

    return (
        <div
            className={classNames(className, {
                'n2o-sidebar__item--dropdown': type === ItemType.DROPDOWN,
            })}
        >
            {renderItem(type)}
        </div>
    )
}
SidebarItemContainer.propTypes = {
    itemProps: PropTypes.object,
    activeId: PropTypes.string,
    level: PropTypes.number,
    className: PropTypes.string,
    sidebarOpen: PropTypes.bool,
    showContent: PropTypes.bool,
    isMiniView: PropTypes.bool,
    isStaticView: PropTypes.bool,
    datasources: PropTypes.object,
    datasource: PropTypes.string,
    models: PropTypes.object,
}

export default WithDataSource(SidebarItemContainer)
