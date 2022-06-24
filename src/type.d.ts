import { ModalProps } from 'ant-design-vue'
import { ComponentCustomProperties } from 'vue'
declare module '@vue/runtime-core' {
    interface ComponentCustomProperties {
      // $http: typeof axios
      // $name: string
      // $print: (data: any) => void
      $modal:{
        $container:HTMLDivElement,
        open:(component:Component,data:Object,options:ModalProps) => void,
        zIndex:number
      }
    }
  }