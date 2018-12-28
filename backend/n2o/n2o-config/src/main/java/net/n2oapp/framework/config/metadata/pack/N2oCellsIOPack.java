package net.n2oapp.framework.config.metadata.pack;

import net.n2oapp.framework.api.pack.MetadataPack;
import net.n2oapp.framework.api.pack.ReadersBuilder;
import net.n2oapp.framework.config.io.widget.table.cell.*;
import net.n2oapp.framework.config.reader.widget.cell.*;

/**
 * Набор считывателей ячеек
 */
public class N2oCellsIOPack implements MetadataPack<ReadersBuilder> {
    @Override
    public void build(ReadersBuilder b) {
        b.readers(new N2oTextCellXmlReader(),
                new N2oIconCellXmlReader(),
                new N2oLinkCellXmlReader(),
                new N2oBadgeXmlReader(),
                new N2oProgressBarCellXmlReader(),
                new N2oImageCellXmlReader(),
                new N2oListCellXmlReader(),
                new N2oCheckboxCellXmlReader(),
                new N2oColorCellXmlReader(),
                new N2oCustomCellXmlReader(),
                new N2oXEditableCellReader());
        b.ios(new TextCellElementIOv2(),
                new CheckboxCellElementIOv2(),
                new LinkCellElementIOv2(),
                new ProgressCellElementIOv2(),
                new CheckboxCellElementIOv2(),
                new ImageCellElementIOv2(),
                new EditCellElementIOv2(),
                new BadgeCellElementIOv2(),
                new CustomCellElementIOv2(),
                new ToolbarCellElementIOv2(),
                new IconCellElementIOv2());
    }
}
