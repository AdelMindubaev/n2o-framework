��� �������������� ��������-����� N2O ��� ����������� ��������� ������� ����:
> � ��� ������ ���� �����������: NodeJs, NPM. NPM ��������� ��������� �� ��������� ����������� i-novus.

1. �������� ����������, ��� ����� �������� ������� ������� (� ���� ������� - js)
2. ��������� ������� `npm init` � ����� ������� (js)
3. ��������� ������� `npm install local-n2o`
4. �������� ���� index.js (�� ��������� ��� ����� n2o)\
5. ������ ����� index.js:
```javascript
const n2o = require('local-n2o');
n2o.build(
  {
    components: {
      controls: {
        list: {
          'Super': {
            path: './src/control/superInput',
            key: 'superInput'
          }
        }
      },
      widgets: {
        list: {
          'Puper': {
            path: './src/widget/puperWidget',
            key: 'puperWidget'
          }
        }
      }
    }
  },
  {
    output: '../webapp',
    rootPath: __dirname
  }
);
```
6. ��������� ������ `node index.js`