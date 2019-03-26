package net.n2oapp.framework.api.metadata;

import net.n2oapp.framework.api.metadata.local.view.widget.util.SubModelQuery;
import net.n2oapp.framework.api.metadata.meta.ModelLink;
import org.junit.Test;

import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertTrue;

public class ModelLinkEquivalenceTest {
    @Test
    public void testEquals() {
        ModelLink withSubModelQuery1 = new ModelLink(ReduxModel.RESOLVE, "widget", "field.id");
        SubModelQuery subModelQuery1 = new SubModelQuery("field", "queryId", "id", "name", null, null);
        withSubModelQuery1.setSubModelQuery(subModelQuery1);

        ModelLink withSubModelQuery2 = new ModelLink(ReduxModel.RESOLVE, "widget");
        SubModelQuery subModelQuery2 = new SubModelQuery(null, "queryId", "id", "name", null, null);
        withSubModelQuery2.setValue("`field.id`");
        withSubModelQuery2.setSubModelQuery(subModelQuery2);

        ModelLink modelLink1 = new ModelLink(ReduxModel.RESOLVE, "widget");
        modelLink1.setValue("`field.name`");
        ModelLink modelLink2 = new ModelLink(ReduxModel.RESOLVE, "widget", "field");
        modelLink2.setValue("`name`");
        ModelLink modelLink3 = new ModelLink(ReduxModel.RESOLVE, "widget", "field.name");
        ModelLink modelLink4 = new ModelLink(ReduxModel.RESOLVE, "widget", "field");

        assertTrue(withSubModelQuery1.equalsLink(modelLink1));
        assertTrue(withSubModelQuery1.equalsLink(modelLink2));
        assertTrue(withSubModelQuery1.equalsLink(modelLink3));
        assertTrue(withSubModelQuery1.equalsLink(modelLink4));

        assertTrue(withSubModelQuery2.equalsLink(modelLink1));
        assertTrue(withSubModelQuery2.equalsLink(modelLink2));
        assertTrue(withSubModelQuery2.equalsLink(modelLink3));
        assertTrue(withSubModelQuery2.equalsLink(modelLink4));

        assertTrue(modelLink1.equalsLink(withSubModelQuery1));
        assertTrue(modelLink2.equalsLink(withSubModelQuery1));
        assertTrue(modelLink3.equalsLink(withSubModelQuery1));
        assertTrue(modelLink4.equalsLink(withSubModelQuery1));

        assertTrue(modelLink1.equalsLink(withSubModelQuery2));
        assertTrue(modelLink2.equalsLink(withSubModelQuery2));
        assertTrue(modelLink3.equalsLink(withSubModelQuery2));
        assertTrue(modelLink4.equalsLink(withSubModelQuery2));

        assertTrue(modelLink3.equalsLink(modelLink4));
    }

    @Test
    public void testNotEquals() {
        ModelLink withSubModelQuery1 = new ModelLink(ReduxModel.RESOLVE, "widget", "field.id");
        SubModelQuery subModelQuery1 = new SubModelQuery("field", "queryId", "id", "name", null, null);
        withSubModelQuery1.setSubModelQuery(subModelQuery1);

        ModelLink withSubModelQuery2 = new ModelLink(ReduxModel.RESOLVE, "widget");
        SubModelQuery subModelQuery2 = new SubModelQuery(null, "queryId", "id", "name", null, null);
        withSubModelQuery2.setSubModelQuery(subModelQuery2);

        ModelLink modelLink1 = new ModelLink(ReduxModel.RESOLVE, "widget1");
        modelLink1.setValue("`field.name`");
        ModelLink modelLink2 = new ModelLink(ReduxModel.RESOLVE, "widget", "field1");
        modelLink2.setValue("`name`");

        assertFalse(withSubModelQuery1.equalsLink(modelLink1));
        assertFalse(withSubModelQuery1.equalsLink(modelLink2));

        assertFalse(modelLink1.equalsLink(modelLink2));

        assertFalse(withSubModelQuery1.equalsLink(null));
        assertFalse(withSubModelQuery1.equalsLink(new Object()));
    }
}
