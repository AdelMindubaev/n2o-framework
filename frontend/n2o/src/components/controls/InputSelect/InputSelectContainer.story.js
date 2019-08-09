import React from 'react';
import { omit } from 'lodash';
import { storiesOf } from '@storybook/react';
import { jsxDecorator } from 'storybook-addon-jsx';
import {
  withKnobs,
  text,
  boolean,
  number,
  select,
} from '@storybook/addon-knobs/react';
import withTests from 'N2oStorybook/withTests';
import InputSelectContainer from './InputSelectContainer.jsx';
import InputSelectContainerJson from './InputSelectContainer.meta.json';
import fetchMock from 'fetch-mock';
import { parseUrl, getStubData } from 'N2oStorybook/fetchMock';
import {
  FormFields,
  FormValidations,
  excludeMetadata,
} from 'N2oStorybook/json';
import withForm from 'N2oStorybook/decorators/withForm';
import { InputSelect as InputSelectComponent } from './InputSelect';
import Factory from '../../../core/factory/Factory';
const stories = storiesOf('Контролы/InputSelect', module);
const form = withForm();

stories.addDecorator(withKnobs);
stories.addDecorator(withTests('InputSelect'));
stories.addDecorator(jsxDecorator);
stories.addParameters({
  info: {
    propTables: [InputSelectComponent],
    propTablesExclude: [InputSelectContainer, Factory],
  },
});

const dataUrl = 'begin:n2o/data';
const data = [
  {
    id: '1',
    name: 'Медведева Светлана Андреевна',
    icon: 'fa fa-address-card',
    image: 'https://img.faceyourmanga.com/mangatars/0/2/2729/large_3206.png',
    dob: '11.09.1992',
    country: 'Россия',
  },
  {
    id: '2',
    name: 'Орлов Матвей Эрнестович ',
    icon: 'fa fa-address-card',
    image: 'https://img.faceyourmanga.com/mangatars/0/2/2729/large_3156.png',
    dob: '24.04.1891',
    country: 'Россия',
  },
  {
    id: '3',
    name: 'Салагин Святослав Григориевич',
    icon: 'fa fa-address-card',
    image: 'https://img.faceyourmanga.com/mangatars/0/0/39/large_511.png',
    dob: '03.12.1981',
    country: 'США',
  },
  {
    id: '4',
    name: 'Моргунова Алина Мироновна',
    icon: 'fa fa-address-card',
    image: 'https://img.faceyourmanga.com/mangatars/0/0/39/large_140189.png',
    dob: '11.11.2003',
    country: 'США',
  },
  {
    id: '5',
    name: 'Краевский Гавриил Алексеевич',
    icon: 'fa fa-address-card',
    image: 'https://img.faceyourmanga.com/mangatars/0/0/39/large_9319.png',
    dob: '20.11.1991',
    country: 'Беларусь',
  },
  {
    id: '6',
    name: 'Сазонтова Елена Данииловна',
    icon: 'fa fa-address-card',
    image: 'https://img.faceyourmanga.com/mangatars/0/0/39/large_140189.png',
    dob: '20.11.1991',
    country: 'Беларусь',
  },
  {
    id: '7',
    name: 'Унковский Юрий Эдуардович',
    icon: 'fa fa-address-card',
    image: 'https://img.faceyourmanga.com/mangatars/0/2/2729/large_3206.png',
    dob: '20.11.1991',
    country: 'Беларусь',
  },
  {
    id: '8',
    name: 'Ягешева Милена Ивановна',
    icon: 'fa fa-address-card',
    image: 'https://img.faceyourmanga.com/mangatars/0/0/39/large_140189.png',
    dob: '20.11.1991',
    country: 'Беларусь',
  },
  {
    id: '9',
    name: 'Краснянский Анатолий Давидович',
    icon: 'fa fa-address-card',
    image: 'https://img.faceyourmanga.com/mangatars/0/2/2729/large_3206.png',
    dob: '11.09.1992',
    country: 'Россия',
  },
  {
    id: '10',
    name: 'Сериков Владлен Фомевич',
    icon: 'fa fa-address-card',
    image: 'https://img.faceyourmanga.com/mangatars/0/2/2729/large_3156.png',
    dob: '24.04.1891',
    country: 'Россия',
  },
  {
    id: '11',
    name: 'Рябов Гаврила Еремеевич',
    icon: 'fa fa-address-card',
    image: 'https://img.faceyourmanga.com/mangatars/0/0/39/large_511.png',
    dob: '03.12.1981',
    country: 'США',
  },
  {
    id: '12',
    name: 'Яманова Нона Семеновна',
    icon: 'fa fa-address-card',
    image: 'https://img.faceyourmanga.com/mangatars/0/2/2729/large_3206.png',
    dob: '11.09.1992',
    country: 'Россия',
  },
  {
    id: '13',
    name: 'Черепанова Зоя Афанасиевна',
    icon: 'fa fa-address-card',
    image: 'https://img.faceyourmanga.com/mangatars/0/2/2729/large_3156.png',
    dob: '24.04.1891',
    country: 'Россия',
  },
  {
    id: '14',
    name: 'Ивашин Соломон Макарович',
    icon: 'fa fa-address-card',
    image: 'https://img.faceyourmanga.com/mangatars/0/0/39/large_511.png',
    dob: '03.12.1981',
    country: 'США',
  },
  {
    id: '15',
    name: 'Тотенков Егор Денисович',
    icon: 'fa fa-address-card',
    image: 'https://img.faceyourmanga.com/mangatars/0/2/2729/large_3206.png',
    dob: '11.09.1992',
    country: 'Россия',
  },
  {
    id: '16',
    name: 'Куксюка Дарья Иосифовна',
    icon: 'fa fa-address-card',
    image: 'https://img.faceyourmanga.com/mangatars/0/2/2729/large_3156.png',
    dob: '24.04.1891',
    country: 'Россия',
  },
  {
    id: '17',
    name: 'Попова Влада Никитевна',
    icon: 'fa fa-address-card',
    image: 'https://img.faceyourmanga.com/mangatars/0/0/39/large_511.png',
    dob: '03.12.1981',
    country: 'США',
  },
  {
    id: '18',
    name: 'Скороходова Виктория Тимофеевна',
    icon: 'fa fa-address-card',
    image: 'https://img.faceyourmanga.com/mangatars/0/2/2729/large_3206.png',
    dob: '11.09.1992',
    country: 'Россия',
  },
  {
    id: '19',
    name: 'Муратов Афанасий Зиновиевич',
    icon: 'fa fa-address-card',
    image: 'https://img.faceyourmanga.com/mangatars/0/2/2729/large_3156.png',
    dob: '24.04.1891',
    country: 'Россия',
  },
  {
    id: '20',
    name: 'Бореев Захар Федосиевич',
    icon: 'fa fa-address-card',
    image: 'https://img.faceyourmanga.com/mangatars/0/0/39/large_511.png',
    dob: '03.12.1981',
    country: 'США',
  },
];

const handleData = data => url => {
  const mergeData = { ...InputSelectContainerJson, list: data };
  const filterValue = parseUrl(decodeURI(url))[
    `filter.${InputSelectContainerJson.labelFieldId}`
  ];
  if (filterValue) {
    const newData = mergeData.data.filter(item =>
      item[InputSelectContainerJson.labelFieldId].includes(filterValue)
    );
    return { ...InputSelectContainerJson, list: newData };
  }
  return mergeData;
};

stories
  .add(
    'Метаданные',
    form(() => {
      const props = {
        loading: boolean('loading', InputSelectContainerJson.loading),
        value: text('value', InputSelectContainerJson.value),
        disabled: boolean('disabled', InputSelectContainerJson.disabled),
        placeholder: text('placeholder', InputSelectContainerJson.placeholder),
        valueFieldId: text(
          'valueFieldId',
          InputSelectContainerJson.valueFieldId
        ),
        labelFieldId: text(
          'labelFieldId',
          InputSelectContainerJson.labelFieldId
        ),
        filter: select(
          'filter',
          ['includes', 'startsWith', 'endsWith'],
          InputSelectContainerJson.filter
        ),
        resetOnBlur: boolean(
          'resetOnBlur',
          InputSelectContainerJson.resetOnBlur
        ),
        queryId: text('queryId', InputSelectContainerJson.queryId),
        size: number('size', InputSelectContainerJson.size),
        iconFieldId: text('iconFieldId', InputSelectContainerJson.iconFieldId),
        imageFieldId: text(
          'imageFieldId',
          InputSelectContainerJson.imageFieldId
        ),
        multiSelect: boolean(
          'multiSelect',
          InputSelectContainerJson.multiSelect
        ),
        groupFieldId: text(
          'groupFieldId',
          InputSelectContainerJson.groupFieldId
        ),
        hasCheckboxes: boolean(
          'hasCheckboxes',
          InputSelectContainerJson.hasCheckboxes
        ),
        closePopupOnSelect: boolean(
          'closePopupOnSelect',
          InputSelectContainerJson.closePopupOnSelect
        ),
        format: text('format', InputSelectContainerJson.format),
        dataProvider: InputSelectContainerJson.dataProvider,
        expandPopUp: boolean(
          'expandPopUp',
          InputSelectContainerJson.expandPopUp
        ),
        flip: boolean('flip', InputSelectContainerJson.flip),
      };

      fetchMock
        .restore()
        .get(dataUrl, url =>
          getStubData(url, { list: data, size: 10, count: data.length })
        );
      return props;
    })
  )

  .add('Расширяемый popUp', () => {
    const newProps = {
      filter: 'includes',
      iconFieldId: '',
      imageFieldId: '',
      options: [],
      expandPopUp: true,
    };
    const props = Object.assign({}, InputSelectContainerJson, newProps);

    const data = [
      {
        id: '1',
        name: 'Крузенштерн Розенкранц Николаевич. Моряк и подводник.....',
      },
      {
        id: '2',
        name: 'Комаровский Иммануил Васильевич',
      },
      {
        id: '3',
        name: 'Петровский Сергей Вахтангович',
      },
    ];

    fetchMock.restore().get(dataUrl, handleData(data));

    return <InputSelectContainer {...props} />;
  })

  .add('Баджи', () => {
    const newProps = {
      filter: 'includes',
      iconFieldId: '',
      imageFieldId: '',
      badgeFieldId: 'badge',
      badgeColorFieldId: 'color',
      options: [],
    };
    const props = Object.assign({}, InputSelectContainerJson, newProps);
    const data = [
      {
        id: '1',
        name: 'Розенкранц',
        badge: 'Писатель',
      },
      {
        id: '2',
        name: 'Иммануил',
        badge: 'Художник',
        color: 'danger',
      },
      {
        id: '3',
        name: 'Сергей',
        badge: 'Поэт',
        color: 'info',
      },
    ];

    fetchMock.restore().get(dataUrl, handleData(data));

    return <InputSelectContainer {...props} />;
  })

  .add('Сжатие текста', () => {
    const newProps = {
      filter: 'includes',
      iconFieldId: '',
      imageFieldId: '',
      options: [],
    };
    const props = Object.assign({}, InputSelectContainerJson, newProps);
    const data = [
      {
        id: '1',
        name:
          '«Русла́н и Людми́ла» — первая законченная поэма Александра Сергеевича Пушкина; волшебная сказка, вдохновлённая древнерусскими былинами.',
      },
      {
        id: '2',
        name:
          'Поэма написана в 1818—1820, после выхода из Лицея; Пушкин иногда указывал, что начал писать поэму ещё в Лицее, но, по-видимому, к этому времени относятся лишь самые общие замыслы, едва ли текст. Ведя после выхода из Лицея в Петербурге жизнь «самую рассеянную», Пушкин работал над поэмой в основном во время болезней.',
      },
      {
        id: '3',
        name:
          'Пушкин ставил задачей создать «богатырскую» сказочную поэму в духе известного ему по французским переводам «Неистового Роланда» Ариосто (критики называли этот жанр «романтическим», что не следует путать с романтизмом в современном понимании).',
      },
    ];

    fetchMock.restore().get(dataUrl, handleData(data));

    return <InputSelectContainer {...props} />;
  })

  .add('Чекбоксы', () => {
    const newProps = {
      multiSelect: true,
      hasCheckboxes: true,
      filter: 'server',
      iconFieldId: '',
      imageFieldId: '',
    };
    const props = Object.assign({}, InputSelectContainerJson, newProps);

    const data = [
      {
        id: '1',
        name: 'Первый',
      },
      {
        id: '2',
        name: 'Второй',
      },
      {
        id: '3',
        name: 'Третии',
      },
      {
        id: '4',
        name: 'Четвертый',
      },
      {
        id: '5',
        name: 'Пятый',
      },
      {
        id: '6',
        name: 'Шестой',
      },
      {
        id: '7',
        name: 'Седьмой',
      },
    ];

    fetchMock.restore().get(dataUrl, handleData(data));

    return <InputSelectContainer {...props} />;
  })

  .add('Форматирование', () => {
    const newProps = {
      format: "`name+' '+dob`",
      filter: 'includes',
    };
    const props = Object.assign({}, InputSelectContainerJson, newProps);

    const data = [
      {
        id: '1',
        name: 'Владимир Серпухов',
        dob: '11.09.1992',
      },
      {
        id: '2',
        name: 'Игонь Николаев',
        dob: '24.04.1891',
      },
      {
        id: '3',
        name: 'Владимир Серпухов ',
        dob: '03.12.1981',
      },
      {
        id: '4',
        name: 'Анатолий Петухов',
        dob: '11.11.2003',
      },
      {
        id: '5',
        name: 'Николай Патухов',
        dob: '20.11.1991',
      },
    ];

    fetchMock.restore().get(dataUrl, handleData(data));

    return <InputSelectContainer {...props} />;
  })

  .add('Группы', () => {
    const newProps = {
      groupFieldId: 'country',
      filter: 'includes',
      iconFieldId: '',
      imageFieldId: '',
    };
    const props = Object.assign({}, InputSelectContainerJson, newProps);

    const data = [
      {
        id: '1',
        name: 'Петр',
        country: 'Россия',
        icon: 'fa fa-male',
      },
      {
        id: '2',
        name: 'Петро',
        country: 'Украина',
        icon: 'fa fa-female',
      },
    ];

    fetchMock.restore().get(dataUrl, handleData(data));

    return <InputSelectContainer {...props} />;
  })

  .add('Иконки', () => {
    const newProps = {
      iconFieldId: 'icon',
      filter: 'includes',
      imageFieldId: '',
      value: '',
    };
    const props = Object.assign({}, InputSelectContainerJson, newProps);
    const data = [
      {
        id: '1',
        name: 'Мужской',
        icon: 'fa fa-male',
      },
      {
        id: '2',
        name: 'Женский',
        icon: 'fa fa-female',
      },
    ];

    fetchMock.restore().get(dataUrl, handleData(data));

    return <InputSelectContainer {...props} />;
  })

  .add('Изображения', () => {
    const newProps = {
      iconFieldId: null,
      imageFieldId: 'image',
      filter: 'includes',
      value: '',
    };
    const props = Object.assign({}, InputSelectContainerJson, newProps);
    const data = [
      {
        id: '1',
        name: 'Moto Morini Scrambler',
        image:
          'http://bazamoto.ru/img/moto_morini/sport-1200/sport-1200_2009_1.jpg',
      },
      {
        id: '2',
        name: 'Moto Indian Scout ABS Burgundy Metallic',
        image:
          'https://cdn.dealerspike.com/imglib/v1/800x600/imglib/trimsdb/7373871-5858031-38816341.jpg',
      },
      {
        id: '3',
        name: 'Moto Indian Scout ABS',
        image:
          'https://cdp.azureedge.net/products/USA/IDN/2018/MC/CRUISER/SCOUT_ABS/49/BRILLIANT_BLUE_-_WHITE_-_RED_PINSTRIPE/2000000001.jpg',
      },
      {
        id: '4',
        name: 'Moto Indian Scout Sixty ABS',
        image:
          'https://cdp.azureedge.net/products/USA/IDN/2018/MC/CRUISER/SCOUT_SIXTY_ABS/49/INDIAN_MOTORCYCLE_RED/2000000006.jpg',
      },
    ];

    fetchMock.restore().get(dataUrl, handleData(data));

    return <InputSelectContainer {...props} />;
  })

  .add('Мульти режим', () => {
    const newProps = {
      multiSelect: true,
      filter: 'includes',
      imageFieldId: 'image',
    };
    const props = Object.assign({}, InputSelectContainerJson, newProps);

    const data = [
      {
        id: '1',
        name: 'Медведева Светлана Андреевна',
        image:
          'https://img.faceyourmanga.com/mangatars/0/2/2729/large_3206.png',
      },
      {
        id: '2',
        name: 'Орлов Матвей Эрнестович ',
        image:
          'https://img.faceyourmanga.com/mangatars/0/2/2729/large_3156.png',
      },
      {
        id: '3',
        name: 'Салагин Святослав Григориевич',
        image: 'https://img.faceyourmanga.com/mangatars/0/0/39/large_511.png',
      },
      {
        id: '4',
        name: 'Моргунова Алина Мироновна',
        image:
          'https://img.faceyourmanga.com/mangatars/0/0/39/large_140189.png',
      },
      {
        id: '5',
        name: 'Краевский Гавриил Алексеевич',
        image: 'https://img.faceyourmanga.com/mangatars/0/0/39/large_9319.png',
      },
      {
        id: '6',
        name: 'Сазонтова Елена Данииловна',
        image:
          'https://img.faceyourmanga.com/mangatars/0/0/39/large_140189.png',
      },
    ];

    fetchMock.restore().get(dataUrl, handleData(data));

    return <InputSelectContainer {...props} />;
  })

  .add('Кеширование запросов', () => {
    const data = [
      {
        id: '1',
        name: 'Медведева Светлана Андреевна',
        image:
          'https://img.faceyourmanga.com/mangatars/0/2/2729/large_3206.png',
      },
      {
        id: '2',
        name: 'Орлов Матвей Эрнестович ',
        image:
          'https://img.faceyourmanga.com/mangatars/0/2/2729/large_3156.png',
      },
      {
        id: '3',
        name: 'Салагин Святослав Григориевич',
        image: 'https://img.faceyourmanga.com/mangatars/0/0/39/large_511.png',
      },
      {
        id: '4',
        name: 'Моргунова Алина Мироновна',
        image:
          'https://img.faceyourmanga.com/mangatars/0/0/39/large_140189.png',
      },
      {
        id: '5',
        name: 'Краевский Гавриил Алексеевич',
        image: 'https://img.faceyourmanga.com/mangatars/0/0/39/large_9319.png',
      },
      {
        id: '6',
        name: 'Сазонтова Елена Данииловна',
        image:
          'https://img.faceyourmanga.com/mangatars/0/0/39/large_140189.png',
      },
    ];

    fetchMock.restore().get(dataUrl, handleData(data));

    return (
      <React.Fragment>
        <div className="row">
          <InputSelectContainer
            {...InputSelectContainerJson}
            placeholder="Стандартный"
          />
        </div>
        <div className="row" style={{ marginTop: '10px' }}>
          <InputSelectContainer
            {...InputSelectContainerJson}
            caching={true}
            placeholder="С кешированием"
          />
        </div>
      </React.Fragment>
    );
  })

  .add('Список из метаданных', () => {
    return (
      <InputSelectContainer {...InputSelectContainerJson} options={data} />
    );
  });
