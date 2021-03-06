import { Options, Vue } from 'vue-class-component'
import HelloWorld from '@/components/HelloWorld.vue' // @ is an alias to /src
@Options({
    components: {
        HelloWorld,
    },
})
export default class HomePage extends Vue {
    mounted() {
        console.log('mounted')
    }

    show() {
        this.$modal.open(HelloWorld, {}, { title: 'adfsvdc', mask: false })
    }
}