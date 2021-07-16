const CONFIG = require('./src/ci-config.json')

let contextPath = CONFIG.docusaurusUrl || '/'

if (contextPath[contextPath.length - 1] !== '/') {
    contextPath += '/'
}

/** @type {import('@docusaurus/types').DocusaurusConfig} */
module.exports = {

    /* Обязательные поля */

    // Текст вкладки браузера и h1 на дефолтной главной странице (useDocusaurusContext().siteConfig.title)
    title: CONFIG.title || 'N2O Framework',
    // Хост вашего сайта без пути и слеша в конце. Ваще ХЗ на кой оно нужно и на что влияет. Скорее что-то для SEO.
    url: CONFIG.url || 'https://n2oapp.net',
    // Путь, по которому нужно открывать документацию (аналог contextPath), н.р. /docusaurus/
    // Требуется для корректных ссылок на статику
    baseUrl: contextPath,

    /* Опциональные поля */

    //tagline: 'The tagline of my site',
    onBrokenLinks: 'throw',
    onBrokenMarkdownLinks: 'warn',
    // Ссылка относительно папки static. Можно указать http адрес
    favicon: 'img/favicon.ico',
    organizationName: CONFIG.organizationName || 'Ай-Новус',
    projectName: 'N2O Framework',
    themeConfig: {
        prism: {
            theme: require('prism-react-renderer/themes/oceanicNext'),
        },
        navbar: {
            title: CONFIG.navbarTitle || '',
            logo: {
                alt: CONFIG.navbarIconAlt || 'N2O Framework',
                src: CONFIG.navbarIconSrc || 'img/logo_dark.png',
                srcDark: CONFIG.navbarIconSrcLight || 'img/logo_light.png',
            },
            items: [
                {
                    type: 'doc',
                    docId: 'introduction',
                    label: 'Документация',
                    position: 'left',
                },
                {
                    type: 'doc',
                    docId: 'buttons',
                    label: 'Примеры',
                    position: 'left',
                },
                {
                    type: 'docsVersionDropdown',
                    position: 'right',
                    dropdownActiveClassDisabled: true,
                },
                {
                    href: 'https://github.com/i-novus-llc/n2o-framework',
                    label: 'GitHub',
                    position: 'right',
                },
            ],
        },
        footer: {
            style: 'dark',
            copyright: `Copyright © ${new Date().getFullYear()} N2O, Inc. Built with I-Novus.`,
        },
    },
    presets: [
        [
            '@docusaurus/preset-classic',
            {
                docs: {
                    sidebarPath: require.resolve('./sidebars.js'),
                    disableVersioning: false,
                    lastVersion: 'current',
                    onlyIncludeVersions: ['current'],
                    versions: {
                        current: {
                            label: `${CONFIG.n2oVersion} 🚧`,
                        },
                    },
                },
                theme: {
                    customCss: require.resolve('./src/css/custom.css'),
                },

            },
        ],
    ],
    plugins: ['docusaurus-plugin-sass'],
}
