package net.n2oapp.framework.config.metadata.pack;

import net.n2oapp.framework.api.pack.MetadataPack;
import net.n2oapp.framework.config.N2oApplicationBuilder;
import net.n2oapp.framework.config.io.action.*;
import net.n2oapp.framework.config.metadata.compile.action.*;
import net.n2oapp.framework.config.reader.event.*;
import net.n2oapp.framework.config.metadata.compile.action.OpenPageCompiler;

public class N2oActionsPack implements MetadataPack<N2oApplicationBuilder> {
    @Override
    public void build(N2oApplicationBuilder b) {
        b.ios(new InvokeActionElementIOV1(),
                new ShowModalElementIOV1(),
                new OpenPageElementIOV1(),
                new AnchorElementIOV1(),
                new CloseActionElementIOV1(),
                new SetValueElementIOV1(),
                new N2oValidateActionElementIOV1(),
                new CustomActionIOv1(),
                new CopyActionElementIOV1(),
                new ClearActionElementIOV1());
        b.readers(new InvokeActionReaderV1(),
                new ShowModalFormReaderV1(),
                new ShowModalWithActionReaderV1(),
                new OpenPageReaderV1(),
                new AnchorReaderV1());
        b.compilers(new CustomActionCompiler(),
                new ShowModalCompiler(),
                new InvokeActionCompiler(),
                new CloseActionCompiler(),
                new RefreshActionCompiler(),
                new OpenPageCompiler(),
                new AnchorCompiler(),
                new ClearActionCompiler(),
                new CopyActionCompiler());
        b.binders(new InvokeActionBinder(), new ReduxActionBinder(), new LinkActionBinder(), new ShowModalBinder());
    }
}
