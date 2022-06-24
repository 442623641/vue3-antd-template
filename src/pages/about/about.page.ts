import { Options, Vue } from 'vue-class-component'
@Options({
    setup() {
        console.log("setup I'm AboutPage")
    }
})
export default class AboutPage extends Vue {
    items: any = [];
    columns: any[] = [];
    mounted() {
        console.log("mounted I'm AboutPage")
        this.items = [
            {
                key: '1',
                name: '胡彦斌',
                age: 32,
                address: '西湖区湖底公园1号',
            },
            {
                key: '2',
                name: '胡彦祖',
                age: 42,
                address: '西湖区湖底公园1号',
            },
        ]

        this.columns = [
            {
                title: '姓名',
                dataIndex: 'name',
                key: 'name',
            },
            {
                title: '年龄',
                dataIndex: 'age',
                key: 'age',
            },
            {
                title: '住址',
                dataIndex: 'address',
                key: 'address',
            },
        ]
    }
}