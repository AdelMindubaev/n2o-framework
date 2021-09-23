package net.n2oapp.framework.api.pack;

import net.n2oapp.framework.api.metadata.aware.NamespaceUriAware;
import net.n2oapp.framework.api.metadata.io.NamespaceIO;

public interface PersistersBuilder<B> {

    B ios(NamespaceIO<? extends NamespaceUriAware>... ios);
}
