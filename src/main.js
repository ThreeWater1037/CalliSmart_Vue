//引入相应模块
import { createApp } from 'vue'
import pinia from '@/stores/index'
import App from './App.vue'
import router from './router'
import { Tabbar, TabbarItem } from 'vant';
import { Icon } from 'vant'
import { Cell, CellGroup } from 'vant';
import { Button } from 'vant';
import { Divider } from 'vant';
import { Picker } from 'vant';
import { Sticky } from 'vant';
import { Field} from 'vant';
import { Space } from 'vant';
import { Popup } from 'vant';
import { NavBar } from 'vant';
import { Toast } from 'vant';
import 'default-passive-events'
import { FloatingPanel } from 'vant';
import 'vant/lib/index.css'
import '@/assets/main.scss'
const app = createApp(App)//注册
// 注册及在全项目使用
app.use(pinia)
app.use(Cell);
app.use(CellGroup);
app.use(Space);
app.use(Popup);
app.use(router)
app.use(Tabbar);
app.use(NavBar);
app.use(Divider)
app.use(TabbarItem);
app.use(Picker);
app.use(Button);
app.use(Field);
app.use(Toast);
app.use(Icon);
app.use(Sticky);
app.use(FloatingPanel);
app.mount('#app')
