package net.n2oapp.framework.api.metadata.validate;

import net.n2oapp.framework.api.metadata.Source;
import net.n2oapp.framework.api.metadata.SourceMetadata;
import net.n2oapp.framework.api.metadata.aware.IdAware;
import net.n2oapp.framework.api.metadata.validation.exception.N2oMetadataValidationException;

import java.util.*;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.stream.Stream;

/**
 * Процессор валидации метаданных
 */
public interface ValidateProcessor {

    /**
     * Провалидировать вложенную метаданную
     * @param metadata Исходная метаданная
     * @param scope Объекты, влияющие на внутренние валдиации. Должны быть разных классов.
     * @param <T> Тип метаданной
     */
    <T extends Source> void validate(T metadata, Object... scope);

    /**
     * Получить исходную метаданную по идентификатору или вернуть null, если метаданная невалидна
     * @param id Идентификатор
     * @param metadataClass Класс метаданной
     * @param <T> Тип метаданной
     * @return Метаданная или null
     */
    <T extends SourceMetadata> T getOrNull(String id, Class<T> metadataClass);

    /**
     * Получить исходную метаданную по идентификатору или бросить исключение, если метаданная невалидна
     * @param id Идентификатор
     * @param metadataClass Класс метаданной
     * @param <T> Тип метаданной
     * @return Метаданная или null
     */
    <T extends SourceMetadata> T getOrThrow(String id, Class<T> metadataClass);

    /**
     * Получить метаданную, оказывающую влияние на валидацию
     *
     * @param scopeClass Класс метаданной
     * @param <D>        Тип скоупа
     * @return Метаданная, оказывающая влияние на валидацию, или null
     */
    <D> D getScope(Class<D> scopeClass);

    /**
     * Проверить, что объект не null
     * @param something Объект
     * @param errorMessage Сообщение о том, какой объект не должен быть null
     */
    default void checkNotNull(Object something, String errorMessage) {
        if (something == null)
            throw new N2oMetadataValidationException(getMessage(errorMessage));
    }

    /**
     * Проверить метаданную на существование
     * @param id Идентификатор метаданной
     * @param metadataClass Класс метаданной
     * @param errorMessage Сообщение о том, какой метаданной не существует
     * @param <T> Тип метаданной
     */
    <T extends SourceMetadata> void checkForExists(String id, Class<T> metadataClass, String errorMessage);

    /**
     * Проверить идентификатор метаданной по соглашениям об именовании
     * @param metadata Метаданная
     * @param errorMessage Сообщение о том, какой идентификатор не соответствует соглашениям об именовании
     */
    default void checkId(IdAware metadata, String errorMessage) {
        Pattern pattern = Pattern.compile(".*[а-яА-ЯёЁ].*");
        Matcher matcher = pattern.matcher(metadata.getId());
        if (matcher.find() || metadata.getId().contains(".")) {
            throw new N2oMetadataValidationException(getMessage(errorMessage, metadata.getId()));
        }
    }

    /**
     * Получить поток значений из массива
     * @param values Массив значений
     * @param <T> Тип значений
     * @return Поток значений или пустой поток, если массив null
     */
    default <T> Stream<T> safeStreamOf(T[] values) {
        return values == null ? Stream.empty() : Stream.of(values);
    }

    /**
     * Получить поток значений из коллекции
     * @param values Коллекция значений
     * @param <T> Тип значений
     * @return Поток значений или пустой поток, если коллекция null
     */
    default <T> Stream<T> safeStreamOf(Collection<T> values) {
        return values == null ? Stream.empty() : values.stream();
    }

    /**
     * Проверить уникальность идентификаторов в массиве
     * @param list Массив значений
     * @param errorMessage Сообщение в случае не уникальности
     * @param <T> Тип значений
     */
    default <T extends IdAware> void checkIdsUnique(T[] list, String errorMessage) {
        if (list != null) {
            checkIdsUnique(Arrays.asList(list), errorMessage);
        }
    }

    /**
     * Проверить уникальность идентификаторов в коллекции
     * @param list Коллекция значений
     * @param errorMessage Сообщение в случае не уникальности
     * @param <T> Тип значений
     */
    default <T extends IdAware> void checkIdsUnique(Collection<T> list, String errorMessage) {
        if (list == null)
            return;
        Set<String> uniqueSet = new HashSet<>();
        for (T item : list) {
            if (item.getId() == null)
                continue;
            if (!uniqueSet.add(item.getId())) {
                throw new N2oMetadataValidationException(getMessage(errorMessage, item.getId()));
            }
        }
    }

    /**
     * Получить локализованное сообщение по коду и аргументам
     *
     * @param messageCode Код сообщения
     * @param arguments   Аргументы сообщения
     * @return Локализованное сообщение
     */
    String getMessage(String messageCode, Object... arguments);
}
