package net.n2oapp.framework.boot;

import com.fasterxml.jackson.annotation.JsonAutoDetect;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import net.n2oapp.framework.api.data.DomainProcessor;
import net.n2oapp.framework.boot.json.N2oJacksonModule;

import java.text.SimpleDateFormat;

public class ObjectMapperConstructor {

    public static ObjectMapper metaObjectMapper() {
        ObjectMapper objectMapper = new ObjectMapper();
        objectMapper.setDateFormat(new SimpleDateFormat(DomainProcessor.JAVA_DATE_FORMAT));
        objectMapper.setSerializationInclusion(JsonInclude.Include.NON_NULL);
        objectMapper.setVisibility(objectMapper.getSerializationConfig().getDefaultVisibilityChecker()
                .withFieldVisibility(JsonAutoDetect.Visibility.NONE)
                .withGetterVisibility(JsonAutoDetect.Visibility.NONE)
                .withSetterVisibility(JsonAutoDetect.Visibility.NONE)
                .withCreatorVisibility(JsonAutoDetect.Visibility.NONE)
                .withIsGetterVisibility(JsonAutoDetect.Visibility.NONE));
        objectMapper.registerModule(new JavaTimeModule());
        objectMapper.registerModule(new N2oJacksonModule(new SimpleDateFormat(DomainProcessor.JAVA_DATE_FORMAT)));
        return objectMapper;
    }

    public static ObjectMapper dataObjectMapper() {
        ObjectMapper objectMapper = new ObjectMapper();
        objectMapper.setDateFormat(new SimpleDateFormat(DomainProcessor.JAVA_DATE_FORMAT));
        objectMapper.registerModule(new JavaTimeModule());
        objectMapper.registerModule(new N2oJacksonModule(new SimpleDateFormat(DomainProcessor.JAVA_DATE_FORMAT)));
        return objectMapper;
    }
}
