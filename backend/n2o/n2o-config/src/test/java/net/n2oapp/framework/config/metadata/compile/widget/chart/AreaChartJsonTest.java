package net.n2oapp.framework.config.metadata.compile.widget.chart;

import net.n2oapp.framework.config.N2oApplicationBuilder;
import net.n2oapp.framework.config.metadata.pack.N2oChartsIOPack;
import net.n2oapp.framework.config.metadata.pack.N2oWidgetsPack;
import net.n2oapp.framework.config.test.JsonMetadataTestBase;
import org.junit.Before;
import org.junit.Test;

public class AreaChartJsonTest extends JsonMetadataTestBase {
    @Override
    @Before
    public void setUp() throws Exception {
        super.setUp();
    }

    @Override
    protected void configure(N2oApplicationBuilder builder) {
        super.configure(builder);
        builder.packs(new N2oChartsIOPack(), new N2oWidgetsPack());
        builder.compilers(new AreaChartCompiler());
    }

    @Test
    public void areaChart() {
        check("net/n2oapp/framework/config/metadata/compile/widgets/chart/testAreaChart.widget.xml",
                "components/widgets/Chart/json/AreaChart.meta.json")
                .cutJson("Page_Chart.chart")
                .cutXml("chart")
                .exclude("src", "margin", "autoFocus", "fetchOnInit", "layout", "stackOffset", "baseValue",
                        "XAxis.hide", "XAxis.width", "XAxis.height", "XAxis.tickCount", "XAxis.type", "XAxis.allowDecimals",
                        "XAxis.allowDataOverflow", "XAxis.allowDuplicatedCategory", "XAxis.interval", "XAxis.padding",
                        "XAxis.minTickGap", "XAxis.axisLine", "XAxis.tickLine", "XAxis.tickSize",
                        "YAxis.hide", "YAxis.width", "YAxis.height", "YAxis.tickCount", "YAxis.type", "YAxis.allowDecimals",
                        "YAxis.allowDataOverflow", "YAxis.allowDuplicatedCategory", "YAxis.interval", "YAxis.padding",
                        "YAxis.minTickGap", "YAxis.axisLine", "YAxis.tickLine", "YAxis.tickSize",
                        "cartesianGrid.x", "cartesianGrid.y", "cartesianGrid.width", "cartesianGrid.height",
                        "cartesianGrid.horizontalPoints", "cartesianGrid.verticalPoints",
                        "tooltip.offset", "tooltip.filterNull", "tooltip.itemStyle", "tooltip.wrapperStyle",
                        "tooltip.contentStyle", "tooltip.labelStyle", "tooltip.viewBox", "tooltip.label",
                        "legend.width", "legend.height", "legend.layout", "legend.align", "legend.verticalAlign",
                        "legend.iconSize", "legend.margin", "legend.wrapperStyle",
                        "areas[0].type", "areas[0].legendType", "areas[0].dot", "areas[0].activeDot",
                        "areas[0].stroke", "areas[0].layout", "areas[0].stackId",
                        "areas[1].type", "areas[1].legendType", "areas[1].dot", "areas[1].activeDot",
                        "areas[1].stroke", "areas[1].layout", "areas[1].stackId",
                        "areas[2].type", "areas[2].legendType", "areas[2].dot", "areas[2].activeDot",
                        "areas[2].stroke", "areas[2].layout", "areas[2].stackId"
                ).assertEquals();
    }
}
