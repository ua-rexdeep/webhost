<template>
    <div :class="`h-3 w-[6vw] flex flex-col justify-center px-2 ${$props.class}`" @mousedown="e => mousedown(e)">
        <div ref="trackRef" class="h-1 bg-[#222] rounded relative w-full">
            <div :class="`absolute h-3 w-3 rounded-full bg-[#555] border border-[#333] ${isChanging && '!border-gray-500'} -translate-x-1/2 -translate-y-1/3 ${$props.disabled ? 'cursor-default' : 'cursor-pointer'}`"
                :style="{ left: _value+'%' }"></div>
        </div>
    </div>
</template>

<script setup>
import { onMounted, onUnmounted, ref } from 'vue';

const trackRef = ref();
const _value = ref(0);
const isChanging = ref(false);
const props = defineProps(['value', 'disabled', 'class', 'delay']);
const emit = defineEmits(['change'])
const _delay = ref();
const defaultUserSelect = ref('');

function calculate(x) {
    const bounds = trackRef.value.getBoundingClientRect();
    const zero = x - bounds.x;
    let percent = zero / (bounds.width) * 100;
    if(percent < 0) percent = 0;
    if(percent > 100) percent = 100;

    _value.value = percent;
    if(_delay.value) clearTimeout(_delay.value);
    _delay.value = setTimeout(() => {
        emit('onChange', +(percent.toFixed(2)));
    }, typeof(props.delay) == "number" ? props.delay : props.delay == false ? 0 : 300);
}

function mousemove(event) {
    if(isChanging.value) calculate(event.x);
}

function mouseup() {
    isChanging.value = false;
    document.body.style.userSelect = defaultUserSelect.value;
}

function mousedown(event) {
    defaultUserSelect.value = document.body.style.userSelect;
    document.body.style.userSelect = 'none';
    calculate(event.x);
    isChanging.value = true;
}

onMounted(() => {
    document.addEventListener('mousemove', mousemove)
    document.addEventListener('mouseup', mouseup)
})

onUnmounted(() => {
    document.removeEventListener('mousemove', mousemove)
    document.removeEventListener('mouseup', mouseup)
})

</script>