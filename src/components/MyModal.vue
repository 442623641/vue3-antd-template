<template>
  <a-modal :class="{ fullscreen: fullscreenModel, mini: miniModel }" class="cx-modal" ref="modalRef"
    :style="transformStyle" v-model:visible="visible"
    v-bind="omit(modalProps, ['visible', 'title', 'onCancel', 'onOk', 'onUpdate:visible', 'closable'])" :footer="null"
    :closable="false" :mask="false" :destroyOnClose="true" :maskClosable="false" :wrap-style="{ overflow: 'hidden' }"
    @ok="handleOk" :afterClose="(e: any) => onDismissed(e)">
    <component :is='component' v-bind="componentProps" />
    <template #title>
      <div ref="modalTitleRef" class="modal-title">
        <span>{{ modalProps?.title }}</span>
        <a-space>
          <a-button type="text" @click="miniModel = true"><template #icon>
              <minus-outlined />
            </template></a-button>
          <a-button type="text" @click="fullscreenModel = !fullscreenModel"><template #icon>
              <border-outlined />
            </template></a-button>
          <a-button type="text" @click="visible = false"><template #icon>
              <close-outlined />
            </template>
          </a-button>
        </a-space>
      </div>
    </template>
    <template #modalRender="{ originVNode }">
      <div @mousedown="focusin($event)" ref="modalEl">
        <component :is="originVNode" />
      </div>
    </template>
  </a-modal>
</template>
<script lang="ts">
import { defineComponent, ref, computed, CSSProperties, watch, watchEffect, getCurrentInstance, onMounted } from 'vue';
import { omit } from 'lodash-es';
import { useDraggable } from '@vueuse/core';
import { MinusOutlined, BorderOutlined, CloseOutlined } from '@ant-design/icons-vue';
export default defineComponent({
  data() {
    return { modalEl: null }
  },
  mounted() {
    this.modalEl = (<any>this.$refs.modalEl).parentElement.parentElement.parentElement.parentElement
  },
  components: {
    MinusOutlined,
    BorderOutlined,
    CloseOutlined
  },
  props: {
    modalProps: {
      type: Object,
      default: {}
    },
    componentProps: {
      type: Object,
      default: {}
    },
    component: {
      type: Object,
      requried: true
    }
  },

  setup(props: any) {
    const fullscreenModel = ref<boolean>(false);
    const miniModel = ref<boolean>(false);
    const visible = ref<boolean>(true);
    const modalTitleRef = ref<HTMLElement | null>(null);
    const modalRef = ref<HTMLElement | null>(null);
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
    const onClick = () => {
      console.log(modalRef.value)
    }
    const onDismissed = (e: any) => {
      console.log(e)
    }

    return {
      visible,
      handleOk,
      modalTitleRef,
      transformStyle,
      fullscreenModel,
      miniModel,
      // modalProps,
      // component,
      // componentProps,
      modalRef,
      omit,
      onClick,
      onDismissed,
      // modalEl
    };
  },
  methods: {
    focusin(e: any) {
      this.$modal.zIndex += 1;
      this.modalEl.style.zIndex = this.$modal.zIndex
    }
  }
});
</script>
<style lang="less">
.ant-modal-wrap {
  position: static;
  display: inline;

}

.cx-modal {
  max-width: unset;

  &.fullscreen {
    width: 100vw !important;
    height: 100vh !important;
    top: 0;
    left: 0;
    resize: none;

  }

  &.mini {
    display: none;
  }
}

.cx-modal {
  box-shadow: rgb(0 0 0 / 12%) 0px 3px 6px -4px, rgb(0 0 0 / 8%) 0px 6px 16px 0px, rgb(0 0 0 / 5%) 0px 9px 28px 8px;
  position: fixed;
  top: 15vh;
  right: 0;
  left: 0;
  border-radius: 2px;
  resize: both;
  overflow: auto;
  background: #fff;

  &::-webkit-scrollbar {
    width: 10px;
  }

  &::-webkit-scrollbar-thumb {
    background: rgba(0, 0, 0, .2);
    border-radius: 20px;
  }

  &::-webkit-scrollbar-track {
    background: #f0f0f0;
    border-radius: 20px;
  }

  &::-webkit-resizer {
    background: transparent;
  }

  .ant-modal-content {
    box-shadow: none;
    border-radius: 0;
  }

  .ant-modal-header {
    background: #cfdfed;
    border-bottom: 0px;
    padding: 0 0 0 16px;
    width: 100%;
    cursor: move;

    .ant-modal-title {
      line-height: unset;
      font-size: 14px;
    }

    .modal-title {
      display: flex;
      justify-content: space-between;
      align-items: center;
      user-select: none;

      svg {
        font-size: 12px;
        color: rgba(0, 0, 0, .65);
      }
    }
  }

  .ant-modal-body {
    padding: 16px;
  }
}
</style>