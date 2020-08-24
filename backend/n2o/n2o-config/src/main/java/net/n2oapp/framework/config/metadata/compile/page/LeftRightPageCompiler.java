package net.n2oapp.framework.config.metadata.compile.page;

import net.n2oapp.framework.api.metadata.Source;
import net.n2oapp.framework.api.metadata.compile.CompileProcessor;
import net.n2oapp.framework.api.metadata.global.view.page.N2oLeftRightPage;
import net.n2oapp.framework.api.metadata.global.view.region.N2oAbstractRegion;
import net.n2oapp.framework.api.metadata.global.view.widget.N2oWidget;
import net.n2oapp.framework.api.metadata.meta.page.PageRoutes;
import net.n2oapp.framework.api.metadata.meta.page.StandardPage;
import net.n2oapp.framework.api.metadata.meta.region.Region;
import net.n2oapp.framework.config.metadata.compile.IndexScope;
import net.n2oapp.framework.config.metadata.compile.context.PageContext;
import org.springframework.stereotype.Component;

import java.util.*;

/**
 * Компиляция страницы с правыми и левыми регионами
 */
@Component
public class LeftRightPageCompiler extends BasePageCompiler<N2oLeftRightPage, StandardPage> {
    @Override
    public StandardPage compile(N2oLeftRightPage source, PageContext context, CompileProcessor p) {
        StandardPage page = new StandardPage();
        List<N2oAbstractRegion> allRegions = new ArrayList<>();
        allRegions.addAll(Arrays.asList(source.getLeft()));
        allRegions.addAll(Arrays.asList(source.getRight()));
        List<N2oWidget> allWidgets = new ArrayList<>();
        if (source.getLeftRegionWidgets() != null)
            allWidgets.addAll(Arrays.asList(source.getLeftRegionWidgets()));
        if (source.getRightRegionWidgets() != null)
            allWidgets.addAll(Arrays.asList(source.getRightRegionWidgets()));
        if ((source.getLeftWidth() != null && !source.getLeftWidth().isEmpty()) ||
                (source.getRightWidth() != null && !source.getRightWidth().isEmpty()))
            page.setWidth(page.new RegionWidth(source.getLeftWidth(), source.getRightWidth()));
        return compilePage(source, page, context, p, allWidgets.toArray(new N2oWidget[0]),
                allRegions.toArray(new N2oAbstractRegion[0]), null);
    }

    @Override
    protected void initRegions(N2oLeftRightPage source, StandardPage page, CompileProcessor p,
                               PageContext context, PageScope pageScope, PageRoutes pageRoutes) {
        Map<String, List<Region>> regionMap = new HashMap<>();
        IndexScope index = new IndexScope();
        mapRegion(source.getRight(), "right", regionMap, p, context, pageScope, index, pageRoutes);
        mapRegion(source.getLeft(), "left", regionMap, p, context, pageScope, index, pageRoutes);
        page.setRegions(regionMap);
    }

    @Override
    public Class<? extends Source> getSourceClass() {
        return N2oLeftRightPage.class;
    }

    private void mapRegion(N2oAbstractRegion[] regions, String position, Map<String, List<Region>> regionMap,
                           CompileProcessor p, PageContext context, Object... scopes) {
        if (regions != null) {
            List<Region> regionList = new ArrayList<>();
            for (N2oAbstractRegion n2oRegion : regions) {
                Region region = p.compile(n2oRegion, context, scopes);
                regionList.add(region);
            }
            regionMap.put(position, regionList);
        }
    }

    @Override
    protected String getPropertyPageSrc() {
        return "n2o.api.page.left_right.src";
    }
}
