import React, { Fragment } from 'react';
import { storiesOf } from '@storybook/react';
import { jsxDecorator } from 'storybook-addon-jsx';
import { withKnobs, text, boolean, number } from '@storybook/addon-knobs/react';
import withTests from 'N2oStorybook/withTests';
import fetchMock from 'fetch-mock';
import InputSelectTreeContainer, {
  InputSelectTreeContainer as InputSelectComponent,
} from './InputSelectTreeContainer';
import InputSelectTreeContainerJson from './InputSelectTreeContainer.meta';
import { parseUrl } from 'N2oStorybook/fetchMock';
import withForm from 'N2oStorybook/decorators/withForm';
import { Col, Button, Form, FormGroup, Label, Input } from 'reactstrap';
import { withState } from 'recompose';
import { WIDGETS } from '../../../core/factory/factoryLevels';
import { InputSelectTreeDefaultValue } from 'N2oStorybook/json';
import Factory from '../../../core/factory/Factory';

const stories = storiesOf('Контролы/InputSelectTree', module);
const form = withForm({ src: 'InputSelectTree' });

stories.addDecorator(withKnobs);
stories.addDecorator(withTests('InputSelectTree'));
stories.addDecorator(jsxDecorator);
stories.addParameters({
  info: {
    propTables: [InputSelectComponent],
    propTablesExclude: [InputSelectTreeContainer, Factory],
  },
});

const dataUrl = 'begin:n2o/data';

const data = [
  {
    id: '1',
    name: 'Алексей Николаев',
    icon: 'fa fa-address-card',
    image: 'https://img.faceyourmanga.com/mangatars/0/2/2729/large_3206.png',
    dob: '11.09.1992',
    country: 'Россия',
    hasChildren: true,
  },
  {
    id: '2',
    name: 'Игонь Николаев',
    icon: 'fa fa-address-card',
    image: 'https://img.faceyourmanga.com/mangatars/0/2/2729/large_3156.png',
    dob: '24.04.1891',
    country: 'Россия',
    parentId: '1',
    hasChildren: true,
  },
  {
    id: '3',
    name: 'Владимир Серпухов',
    icon: 'fa fa-address-card',
    image: 'https://img.faceyourmanga.com/mangatars/0/0/39/large_511.png',
    dob: '03.12.1981',
    country: 'США',
    parentId: '2',
    hasChildren: false,
  },
  {
    id: '44',
    name: 'Игонь Николаев',
    icon: 'fa fa-address-card',
    image: 'https://img.faceyourmanga.com/mangatars/0/2/2729/large_3156.png',
    dob: '24.04.1891',
    country: 'Россия',
    parentId: '1',
    hasChildren: true,
  },
  {
    id: '444',
    name: 'Владимир Серпухов',
    icon: 'fa fa-address-card',
    image: 'https://img.faceyourmanga.com/mangatars/0/0/39/large_511.png',
    dob: '03.12.1981',
    country: 'США',
    parentId: '44',
    hasChildren: false,
  },
  {
    id: '4',
    name: 'Анатолий Петухов',
    icon: 'fa fa-address-card',
    image: 'https://img.faceyourmanga.com/mangatars/0/0/39/large_140189.png',
    dob: '11.11.2003',
    country: 'США',
    hasChildren: true,
  },
  {
    id: '5',
    name: 'Николай Патухов',
    icon: 'fa fa-address-card',
    image: 'https://img.faceyourmanga.com/mangatars/0/0/39/large_9319.png',
    dob: '20.11.1991',
    country: 'Беларусь',
    parentId: '4',
    hasChildren: false,
  },
  {
    id: '6',
    name: 'Сергей Медведев',
    icon: 'fa fa-address-card',
    image: 'https://img.faceyourmanga.com/mangatars/0/2/2729/large_3156.png',
    dob: '11.11.2003',
    country: 'США',
    hasChildren: true,
  },
  {
    id: '7',
    name: 'Павел Милешин',
    icon: 'fa fa-address-card',
    image: 'https://img.faceyourmanga.com/mangatars/0/0/39/large_9319.png',
    dob: '20.11.1991',
    country: 'Беларусь',
    parentId: '6',
    hasChildren: false,
  },
  {
    id: '8',
    name: 'Анатолий Попов',
    icon: 'fa fa-address-card',
    image: 'https://img.faceyourmanga.com/mangatars/0/2/2729/large_3156.png',
    dob: '11.11.2003',
    country: 'США',
    hasChildren: true,
  },
  {
    id: '9',
    name: 'Андрей Мельников',
    icon: 'fa fa-address-card',
    image: 'https://img.faceyourmanga.com/mangatars/0/0/39/large_9319.png',
    dob: '20.11.1991',
    country: 'Беларусь',
    hasChildren: false,
  },
];

const handleData = data => url => {
  const mergeData = { ...InputSelectTreeContainerJson, list: data };
  const filterValue = parseUrl(decodeURI(url))[
    `filter.${InputSelectTreeContainerJson.labelFieldId}`
  ];
  if (filterValue) {
    const newData = mergeData.data.filter(item =>
      item[InputSelectTreeContainerJson.labelFieldId].includes(filterValue)
    );
    return { ...InputSelectTreeContainerJson, list: newData };
  }
  return mergeData;
};

stories
  .add(
    'Метаданные',
    form(() => {
      const props = {
        loading: boolean('loading', InputSelectTreeContainerJson.loading),
        disabled: boolean('disabled', InputSelectTreeContainerJson.disabled),
        placeholder: text(
          'placeholder',
          InputSelectTreeContainerJson.placeholder
        ),
        valueFieldId: text(
          'valueFieldId',
          InputSelectTreeContainerJson.valueFieldId
        ),
        labelFieldId: text(
          'labelFieldId',
          InputSelectTreeContainerJson.labelFieldId
        ),
        parentFieldId: text(
          'parentFieldId',
          InputSelectTreeContainerJson.parentFieldId
        ),
        filter: text('filter', InputSelectTreeContainerJson.filter),
        value: text('value', InputSelectTreeContainerJson.value),
        resetOnBlur: boolean(
          'resetOnBlur',
          InputSelectTreeContainerJson.resetOnBlur
        ),
        queryId: text('queryId', InputSelectTreeContainerJson.queryId),
        size: number('size', InputSelectTreeContainerJson.size),
        iconFieldId: text(
          'iconFieldId',
          InputSelectTreeContainerJson.iconFieldId
        ),
        imageFieldId: text(
          'imageFieldId',
          InputSelectTreeContainerJson.imageFieldId
        ),
        multiSelect: boolean(
          'multiSelect',
          InputSelectTreeContainerJson.multiSelect
        ),
        groupFieldId: text(
          'groupFieldId',
          InputSelectTreeContainerJson.groupFieldId
        ),
        hasCheckboxes: boolean(
          'hasCheckboxes',
          InputSelectTreeContainerJson.hasCheckboxes
        ),
        closePopupOnSelect: boolean(
          'closePopupOnSelect',
          InputSelectTreeContainerJson.closePopupOnSelect
        ),
        format: text('format', InputSelectTreeContainerJson.format),
        ajax: boolean('ajax', InputSelectTreeContainerJson.ajax),
        dataProvider: InputSelectTreeContainerJson.dataProvider,
        hasChildrenFieldId: boolean(
          'hasChildrenFieldId',
          InputSelectTreeContainerJson.hasChildrenFieldId
        ),
      };

      fetchMock.restore().get(dataUrl, handleData(data));

      return props;
    })
  )

  .add('Расширяемый popUp', () => {
    const newProps = {
      filter: 'includes',
      iconFieldId: '',
      imageFieldId: '',
      options: [],
    };

    const props = Object.assign({}, InputSelectTreeContainerJson, newProps);

    const data = [
      {
        id: '1',
        name: 'Манин Евстигней Проклович',
        hasChildren: true,
      },
      {
        id: '2',
        name: 'Расторгуев Захар Эрнестович',
        hasChildren: false,
        parentId: '1',
      },
      {
        id: '3',
        name: 'Шлиппенбах Елизар Андреевич',
        hasChildren: true,
      },
      {
        id: '4',
        name: 'Курицын Марк Якубович',
        hasChildren: false,
        parentId: '3',
      },
      {
        id: '5',
        name: 'Амбражевич Елисей Никифорович',
        hasChildren: true,
      },
      {
        id: '6',
        name: 'Иванников Степан Ипатович',
        hasChildren: false,
        parentId: '5',
      },
      {
        id: '7',
        name: 'Заварзин Данила Сергеевич',
        hasChildren: false,
        parentId: '5',
      },
      {
        id: '8',
        name: 'Кулик Карл Мирославович',
        hasChildren: true,
      },
      {
        id: '10',
        name: 'Нюнка Измаил Изяславович',
        hasChildren: false,
        parentId: '8',
      },
    ];

    fetchMock.restore().get(dataUrl, handleData(data));

    return (
      <div style={{ width: '300px' }}>
        <InputSelectTreeContainer {...props} />
      </div>
    );
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
    const props = Object.assign({}, InputSelectTreeContainerJson, newProps);
    const data = [
      {
        id: '1',
        name: 'Лероев Прокл Еремеевич',
        badge: 'Писатель',
        hasChildren: true,
      },
      {
        id: '2',
        name: 'Коренев Евсей Сигизмундови',
        badge: 'Художник',
        color: 'danger',
        parentId: '1',
        hasChildren: false,
      },
      {
        id: '3',
        name: 'Тизенгаузен Борислав Тихонович',
        badge: 'Поэт',
        color: 'info',
        hasChildren: true,
      },
      {
        id: '4',
        name: 'Холостых Еремей Онуфриевич',
        badge: 'Писатель',
        parentId: '3',
        hasChildren: false,
      },
      {
        id: '5',
        name: 'Федоренко Аркадий Чеславович',
        badge: 'Художник',
        color: 'danger',
        hasChildren: true,
      },
      {
        id: '6',
        name: 'Шмагин Юлиан Афанасиевич',
        badge: 'Поэт',
        color: 'info',
        parentId: '5',
        hasChildren: false,
      },
      {
        id: '7',
        name: 'Леваневский Леондий Кондратиевич',
        badge: 'Писатель',
        hasChildren: true,
      },
      {
        id: '8',
        name: 'Янаслов Ульян Ефремович',
        badge: 'Художник',
        color: 'danger',
        parentId: '7',
        hasChildren: false,
      },
      {
        id: '9',
        name: 'Колотушкин Чеслав Севастьянович',
        badge: 'Поэт',
        color: 'info',
      },
    ];

    fetchMock.restore().get(dataUrl, handleData(data));

    return <InputSelectTreeContainer {...props} />;
  })

  .add('Сжатие текста', () => {
    const newProps = {
      filter: 'includes',
      iconFieldId: '',
      imageFieldId: '',
      expandPopUp: false,
      options: [],
    };
    const props = Object.assign({}, InputSelectTreeContainerJson, newProps);
    const data = [
      {
        id: '1',
        name:
          'Гедонизм осмысляет дедуктивный метод. Интеллект естественно понимает под собой интеллигибельный закон внешнего мира, открывая... ',
        hasChildren: true,
      },
      {
        id: '2',
        name:
          'Структурализм абстрактен. Отсюда естественно следует, что автоматизация дискредитирует предмет деятельности. Отсюда естественно...',
        parentId: '1',
        hasChildren: false,
      },
      {
        id: '3',
        name:
          'Созерцание непредсказуемо. Дискретность амбивалентно транспонирует гравитационный парадокс. Импликация, следовательно,... ',
        hasChildren: true,
      },
      {
        id: '4',
        name:
          'Сомнение рефлектирует естественный закон исключённого третьего.. Отсюда естественно следует, что автоматизация дискредитирует... ',
        parentId: '3',
        hasChildren: false,
      },
      {
        id: '5',
        name:
          'Дедуктивный метод решительно представляет собой бабувизм. Созерцание непредсказуемо. Согласно мнению известных философов,... ',
        hasChildren: true,
      },
      {
        id: '6',
        name:
          'Импликация, следовательно, контролирует бабувизм, открывая новые горизонты. Согласно мнению известных философов, дедуктивный... ',
        parentId: '5',
        hasChildren: false,
      },
      {
        id: '7',
        name:
          'Надстройка нетривиальна. Сомнение рефлектирует естественный закон исключённого третьего.. Отсюда естественно следует, что ...',
        hasChildren: true,
      },
      {
        id: '8',
        name:
          'Надстройка нетривиальна. Надстройка нетривиальна. Созерцание непредсказуемо. Дискретность амбивалентно транспонирует ...',
        parentId: '7',
        hasChildren: false,
      },
      {
        id: '9',
        name:
          'Аксиома силлогизма, по определению, представляет собой неоднозначный предмет деятельности. Наряду с этим ощущение мира ...',
        parentId: '7',
        hasChildren: false,
      },
      {
        id: '10',
        name:
          'Надстройка нетривиальна. Надстройка нетривиальна. Созерцание непредсказуемо. Дискретность амбивалентно транспонирует ...',
        hasChildren: false,
      },
      {
        id: '11',
        name:
          'Аксиома силлогизма, по определению, представляет собой неоднозначный предмет деятельности. Наряду с этим ощущение мира ...',
        hasChildren: false,
      },
      {
        id: '12',
        name:
          'Надстройка нетривиальна. Надстройка нетривиальна. Созерцание непредсказуемо. Дискретность амбивалентно транспонирует ...',
        hasChildren: false,
      },
      {
        id: '13',
        name:
          'Аксиома силлогизма, по определению, представляет собой неоднозначный предмет деятельности. Наряду с этим ощущение мира ...',
        hasChildren: false,
      },
    ];

    fetchMock.restore().get(dataUrl, handleData(data));

    return <InputSelectTreeContainer {...props} />;
  })

  .add('Тест на большой обьем данных', () => {
    const TestForm = ({ data, setData }) => {
      const generateName = y => new Array(y).join('-');

      const generateCollection = ({ x, y, z }) => {
        const name = generateName(y);
        let result = [];
        for (let i = 1; i <= z; i++) {
          for (let j = 1; j <= x; j++) {
            result.push({
              id: `${j}-${i}`,
              name,
              ...(i - 1 && { parentId: `${j}-${i - 1}` }),
            });
          }
        }

        setData(result);
      };

      const handlerSubmit = event => {
        event.preventDefault();
        const data = new FormData(event.target);
        const fields = {};
        for (let name of data.keys()) {
          fields[name] = parseInt(data.get(name));
        }

        generateCollection(fields);
      };

      return (
        <Fragment>
          <Form onSubmit={handlerSubmit}>
            {['x', 'y', 'z'].map(key => (
              <FormGroup row>
                <Label for="exampleEmail" sm={2}>
                  {key}
                </Label>
                <Col sm={10}>
                  <Input
                    type="number"
                    name={key}
                    id={key}
                    placeholder="Введите значение"
                    required
                  />
                </Col>
              </FormGroup>
            ))}
            <FormGroup check row>
              <Col sm={{ size: 10, offset: 2 }}>
                <Button>Сгенерировать данные</Button>
              </Col>
            </FormGroup>
            <div>Generate {data.length} items</div>
          </Form>
          <div style={{ paddingTop: '30px' }}>
            <InputSelectTreeContainer data={data} />
          </div>
        </Fragment>
      );
    };

    const RenderForm = withState('data', 'setData', [])(TestForm);

    return <RenderForm />;
  })

  .add('Чекбоксы', () => {
    const newProps = {
      multiSelect: true,
      hasCheckboxes: true,
      filter: 'includes',
      iconFieldId: '',
      imageFieldId: '',
    };
    const props = Object.assign({}, InputSelectTreeContainerJson, newProps);

    const data = [
      {
        id: '1',
        name: 'Первый',
        hasChildren: true,
      },
      {
        id: '2',
        name: 'Второй',
        hasChildren: true,
      },
      {
        id: '3',
        name: 'Третии',
        parentId: '2',
        hasChildren: false,
      },
      {
        id: '4',
        name: 'Четвертый',
        hasChildren: true,
      },
      {
        id: '5',
        name: 'Пятый',
        parentId: '4',
        hasChildren: false,
      },
      {
        id: '6',
        name: 'Шестой',
        hasChildren: true,
      },
      {
        id: '7',
        name: 'Седьмой',
        parentId: '6',
        hasChildren: false,
      },
    ];

    fetchMock.restore().get(dataUrl, handleData(data));

    return <InputSelectTreeContainer {...props} />;
  })

  .add('Форматирование', () => {
    const newProps = {
      format: "`name+' '+dob`",
      filter: 'includes',
      iconFieldId: '',
      imageFieldId: '',
    };
    const props = Object.assign({}, InputSelectTreeContainerJson, newProps);

    fetchMock.restore().get(dataUrl, handleData(data));

    return <InputSelectTreeContainer {...props} />;
  })

  .add('Группы', () => {
    const newProps = {
      groupFieldId: 'country',
      filter: 'includes',
      iconFieldId: '',
      imageFieldId: '',
    };
    const props = Object.assign({}, InputSelectTreeContainerJson, newProps);

    fetchMock.restore().get(dataUrl, handleData(data));

    return <InputSelectTreeContainer {...props} />;
  })

  .add('Иконки', () => {
    const newProps = {
      iconFieldId: 'icon',
      filter: 'includes',
      imageFieldId: '',
      value: '',
    };
    const props = Object.assign({}, InputSelectTreeContainerJson, newProps);
    const data = [
      {
        id: '1',
        name: 'Мужской',
        icon: 'fa fa-male',
        hasChildren: true,
      },
      {
        id: '2',
        name: 'Женский',
        icon: 'fa fa-female',
        parentId: '1',
        hasChildren: true,
      },
      {
        id: '3',
        name: 'Книга',
        icon: 'fa fa-address-book',
        hasChildren: true,
      },
      {
        id: '4',
        name: 'Огонь',
        icon: 'fa fa-free-code-camp',
        parentId: '3',
        hasChildren: false,
      },
      {
        id: '5',
        name: 'Пользователь',
        icon: 'fa fa-user-circle',
        hasChildren: true,
      },
      {
        id: '6',
        name: 'Окно',
        icon: 'fa fa-window-maximize',
        parentId: '5',
        hasChildren: false,
      },
    ];

    fetchMock.restore().get(dataUrl, handleData(data));

    return <InputSelectTreeContainer {...props} />;
  })

  .add('Изображения', () => {
    const newProps = {
      iconFieldId: null,
      imageFieldId: 'image',
      filter: 'includes',
      value: '',
    };
    const props = Object.assign({}, InputSelectTreeContainerJson, newProps);
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
        parentId: '2',
      },
      {
        id: '4',
        name: 'Moto Indian Scout Sixty ABS',
        image:
          'https://cdp.azureedge.net/products/USA/IDN/2018/MC/CRUISER/SCOUT_SIXTY_ABS/49/INDIAN_MOTORCYCLE_RED/2000000006.jpg',
        parentId: '2',
      },
    ];

    fetchMock.restore().get(dataUrl, handleData(data));

    return <InputSelectTreeContainer {...props} />;
  })

  .add('Мульти режим', () => {
    const newProps = {
      multiSelect: true,
      filter: 'includes',
      iconFieldId: '',
      imageFieldId: '',
    };
    const props = Object.assign({}, InputSelectTreeContainerJson, newProps);

    fetchMock.restore().get(dataUrl, handleData(data));

    return <InputSelectTreeContainer {...props} />;
  })

  .add('Кеширование запросов', () => {
    const newProps = {
      multiSelect: true,
      filter: 'includes',
      iconFieldId: '',
      imageFieldId: '',
    };
    const props = Object.assign({}, InputSelectTreeContainerJson, newProps);

    fetchMock.restore().get(dataUrl, handleData(data));

    return (
      <React.Fragment>
        <div className="row">
          <InputSelectTreeContainer {...props} placeholder="Стандартный" />
        </div>
        <div className="row" style={{ marginTop: '10px' }}>
          <InputSelectTreeContainer
            {...props}
            caching={true}
            placeholder="С кешированием"
          />
        </div>
      </React.Fragment>
    );
  })

  .add('Список из метаданных', () => {
    return (
      <InputSelectTreeContainer
        {...InputSelectTreeContainerJson}
        options={data}
      />
    );
  })

  .add(
    'Динамическая загрузка',
    form(() => {
      const newProps = {
        multiSelect: false,
        filter: 'includes',
        iconFieldId: '',
        imageFieldId: '',
        ajax: true,
      };
      const props = Object.assign({}, InputSelectTreeContainerJson, newProps);

      const data = [
        {
          id: '1',
          name: 'Мужской',
          icon: 'fa fa-male',
          hasChildren: true,
        },
        {
          id: '3',
          name: 'Книга',
          icon: 'fa fa-address-book',
          hasChildren: true,
        },
        {
          id: '5',
          name: 'Пользователь',
          icon: 'fa fa-user-circle',
          hasChildren: true,
        },
      ];

      const getMockObject = parentId => ({
        list: [
          {
            id: parentId + 'uid',
            name: 'Потомок',
            icon: 'fa fa-minus',
            parentId,
            hasChildren: false,
          },
        ],
      });

      fetchMock.restore().get(dataUrl, url => {
        const filterValue = parseUrl(decodeURI(url))['filter.parent_id'];
        if (filterValue) return getMockObject(filterValue);
        return handleData(data);
      });

      return props;
    })
  )
  .add('Предустановленные данные', () => {
    const delay = ms => new Promise(r => setTimeout(() => r(), ms));

    fetchMock.restore().get('begin:n2o/formData', {
      list: [
        {
          field: [
            {
              id: '1',
              name: 'Алексей Николаев',
              icon: 'fa fa-address-card',
              image:
                'https://img.faceyourmanga.com/mangatars/0/2/2729/large_3206.png',
              dob: '11.09.1992',
              country: 'Россия',
              hasChildren: true,
            },
            {
              id: '5',
              name: 'Николай Патухов',
              icon: 'fa fa-address-card',
              image:
                'https://img.faceyourmanga.com/mangatars/0/0/39/large_9319.png',
              dob: '20.11.1991',
              country: 'Беларусь',
              parentId: '4',
              hasChildren: false,
            },
          ],
        },
      ],
    });
    fetchMock.get(dataUrl, async () => {
      await delay(1000);
      return handleData(data);
    });

    return (
      <Factory
        level={WIDGETS}
        {...InputSelectTreeDefaultValue['Page_Form']}
        id="Page_Form"
      />
    );
  });
