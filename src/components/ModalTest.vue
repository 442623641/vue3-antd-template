<template>
  <Modal v-model:visible="visible" ref="modalRef" title="Basic Modal" @ok="handleOk" :mask="false"
    :destroyOnClose="true" :maskClosable="false">
    <template #title>
      <div ref="modalTitleRef" style="width: 100%; cursor: move">Draggable Modal</div>
    </template>
    <template #modalRender="{ originVNode }">
      <div :style="transformStyle">
        <component :is="originVNode" />
      </div>
    </template>
    <p>ModalTest {{test}}</p>
    <slot></slot>
    <component :is="component" />
  </Modal>
</template>
<script lang="ts">
import { defineComponent, ref, computed, CSSProperties, watch, watchEffect, toRefs } from 'vue';
import { useDraggable } from '@vueuse/core'
import { Modal } from 'ant-design-vue'
import HelloWorld from '@/components/HelloWorld.vue'
export default defineComponent({
  props:{
    component:{type:Object ,require:true},
    test:{type:String,default:'aaa'}
  },
  components: { Modal,HelloWorld },
  
  setup(props) {
    const visible = ref<boolean>(true);
    const modalTitleRef = ref(null);
    const modalRef = ref(null)
    const { x, y, isDragging } = useDraggable(modalTitleRef);
    const handleOk = (e: MouseEvent) => {
      console.log(e);
      visible.value = false;
    };
    const startX = ref<number>(0);
    const startY = ref<number>(0);
    const startedDrag = ref(false);
    const transformX = ref(0);
    const transformY = ref(0);
    const preTransformX = ref(0);
    const preTransformY = ref(0);
    const dragRect = ref({ left: 0, right: 0, top: 0, bottom: 0 });
    watch([x, y], () => {
      if (!startedDrag.value) {
        startX.value = x.value;
        startY.value = y.value;
        const bodyRect = document.body.getBoundingClientRect();
        const titleRect = (<any>modalTitleRef).value.getBoundingClientRect();
        dragRect.value.right = bodyRect.width - titleRect.width;
        dragRect.value.bottom = bodyRect.height - titleRect.height;
        preTransformX.value = transformX.value;
        preTransformY.value = transformY.value;
      }
      startedDrag.value = true;
    });
    watch(isDragging, () => {
      if (!isDragging) {
        startedDrag.value = false;
      }
    });

    watchEffect(() => {
      if (startedDrag.value) {
        transformX.value =
          preTransformX.value +
          Math.min(Math.max(dragRect.value.left, x.value), dragRect.value.right) -
          startX.value;
        transformY.value =
          preTransformY.value +
          Math.min(Math.max(dragRect.value.top, y.value), dragRect.value.bottom) -
          startY.value;
      }
    });
    const transformStyle = computed<CSSProperties>(() => {
      return {
        transform: `translate(${transformX.value}px, ${transformY.value}px)`,
      };
    });
    const {component} = toRefs(props)
    const {test} = toRefs(props)
    // const component=computed(()=>{return component1.component.value})
    return {
      visible,
      handleOk,
      modalTitleRef,
      transformStyle,
      modalRef,
      component,
      test
    };
  },
  mounted() {
    console.log(this.component,this.test)
  }
})
</script>
