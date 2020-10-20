package net.n2oapp.framework.config.util;

import net.n2oapp.framework.api.metadata.compile.BindProcessor;
import net.n2oapp.framework.api.metadata.meta.ClientDataProvider;
import net.n2oapp.framework.api.metadata.meta.ModelLink;

import java.util.Map;

/**
 * Утилита для связывания метаданных с данными
 */
public class BindUtil {
    /**
     * Разрешение ссылок на предыдущие страницы в {@link ClientDataProvider}
     * @param dataProvider Провайдер данных
     * @param p Процессор
     */
    public static void bindDataProvider(ClientDataProvider dataProvider, BindProcessor p) {
        if (dataProvider == null)
            return;
        Map<String, ModelLink> pathMapping = dataProvider.getPathMapping();
        Map<String, ModelLink> queryMapping = dataProvider.getQueryMapping();
        dataProvider.setUrl(p.resolveUrl(dataProvider.getUrl(), pathMapping, queryMapping));
        pathMapping.forEach((k, v) -> pathMapping.put(k, (ModelLink) p.resolveLink(v)));
        queryMapping.forEach((k, v) -> queryMapping.put(k, (ModelLink) p.resolveLink(v)));
    }
}