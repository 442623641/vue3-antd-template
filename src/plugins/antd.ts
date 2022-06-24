import {
  Modal,
  Table,
  Menu,
  Input,
  Form,
  Card,
  Checkbox,
  Radio,
  Col,
  Row,
  Select,
  DatePicker,
  Button
} from 'ant-design-vue';
import type { App } from 'vue';
import Antd from 'ant-design-vue';
import 'ant-design-vue/dist/antd.less';

export function setupAntd(app: App<Element>) {
  // app.use(Button)
  //   .use(Form)
  //   .use(Input)
  //   .use(Modal)
  //   .use(Table)
  //   .use(Menu)
  //   .use(Card)
  //   .use(Checkbox)
  //   .use(Radio)
  //   .use(Col)
  //   .use(Row)
  //   .use(Select)
  //   .use(DatePicker);
  app.use(Antd)
}
