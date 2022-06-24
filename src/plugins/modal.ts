import MyModal from '../components/MyModal.vue';
import { App, inject, Plugin, h, render, Component, getCurrentInstance, ComponentInternalInstance, } from 'vue'

export const IonModalSymbol = Symbol()

export class IonModalResult {
    type: 'ok' | 'cancel' | 'string' = 'ok'
    body?: any = undefined
}

export class IonModalController {
    private modals: any[] = [];
    private _$containers: HTMLDivElement
    private _app?: App = undefined
    public zIndex = 1;
    constructor(app: App) {
        this._app = app;
        this._$containers = document.createElement("div");
        this._$containers.classList.add('ion-modals')
        document.body.appendChild(this._$containers);
    }
    public open(component: Component, componentProps: {}, modalProps?: any): Promise<IonModalResult> {
        return new Promise((reslove, reject) => {
            if (!this._app) {
                reject('_app is undefined')
                return;
            }
            // const container = document.createElement("div");
            // container.classList.add('cx-modals')
            // document.body.appendChild(container);
            const vnode = h(MyModal, {
                modalProps: {
                    getContainer: this._$containers,
                    title: 'asasas',
                    ...modalProps,
                    visible: true,
                    onCancel: (data?: any) => {
                        console.log('cancel', data)
                    },
                    onOk: (data?: any) => {
                        console.log('ok', data)
                    }
                },
                componentProps,
                component
            })

            // 关联app上下文
            vnode.appContext = this._app._context || getCurrentInstance()?.appContext
            render(vnode, document.createElement("div"));
            let instance: ComponentInternalInstance = <any>vnode.component!;
            setTimeout(() => console.log(instance), 1000)
            return {
                ...(<any>instance).ctx,
                dismiss: (id?: any) => {
                    instance.props.visible = false;
                },
                onDismissed: () => {
                    return new Promise((resolve) => {

                    })
                },
                onWillDismiss: () => {
                    // return new Promise((resolve) => {
                    //     instance._close = () => {
                    //         this._close(null, instance)
                    //         resolve({ data: instance.data })
                    //     }
                    // })
                },
            }
            // 这里需要合并props，传入到组件modal
            //   const vm = h(modal, {
            //     ...props,
            //     onOk:(data?:any)=>{
            //       // 弹出框关闭时移除节点
            //       document.body.removeChild(container)
            //       reslove(this.ok(data));
            //     },
            //     onCancel:(data?:any)=>{
            //       reslove(this.cancel(data));
            //     }
            //   });

            //   let instance={
            //     dismiss:()=>props.
            //   }
        });
    }


    public ok(data?: any): IonModalResult {
        const result = new IonModalResult();
        result.type = 'ok';
        result.body = data;
        return result;
    }

    public cancel(data?: any): IonModalResult {
        const result = new IonModalResult();
        result.type = 'cancel';
        result.body = data;
        return result;
    }
}


export function useDzModal(): IonModalController {

    const dzModal = inject<IonModalController>(IonModalSymbol)
    if (!dzModal) {
        throw new Error('No DzModal provided!')
    }
    return dzModal;
}

const plugin: Plugin = {
    install(app: App, options?: { [key: string]: any }) {
        const dzModal = new IonModalController(app)
        app.config.globalProperties.$modal = dzModal;
        app.provide(IonModalSymbol, dzModal);
    }
}
export default plugin;
