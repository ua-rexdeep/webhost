<template>
    <div class="flex flex-col w-48 justify-between group bg-[#333539] px-2 rounded-md cursor-pointer py-2 relative" @click="$emit('copy')">
        <div class="media-type border rounded-md border-[#222326] bg-[#333539] uppercase absolute left-2 top-2">
            {{ file.type }}
        </div>
        <div class="mx-1 my-4 h-24" v-if="['png', 'jpg', 'jpeg', 'webp', 'gif'].includes(file.type)"
            :style="{ background: `center / contain no-repeat url(http://localhost:3092/api/file/${file.id})` }">
        </div>
        <video class="mx-1 my-4 h-24" v-if="file.type == 'mp4'" loop autoplay muted
        :src="`http://localhost:3092/api/file/${file.id}`" />
        <div class="h-24 my-4 w-full flex flex-col gap-3 items-center justify-center" v-if="file.type == 'mp3'">
            <div v-if="!paused" class="text-lg flex items-center justify-center bg-[#222] rounded-full aspect-square w-10 translate-x-px cursor-pointer" @click.stop="pauseAudio()"><i class="fas fa-pause" /></div>
            <div v-else class="text-lg flex items-center justify-center bg-[#222] rounded-full aspect-square w-10 translate-x-px cursor-pointer" @click.stop="playAudio()"><i class="fas fa-play" /></div>
            <audio ref="audioRef" hidden volume="0.05" :src="`http://localhost:3092/api/file/${file.id}.${file.type}`"></audio>
        </div>

        <div class="flex items-center">
            <i class="fa-solid fa-copy text-[#456CCF] text-lg mr-2 flex" v-show="lastCopied != file.id"></i>
            <i class="fa-solid fa-check text-success text-lg mr-2 flex" v-show="lastCopied == file.id"></i>
            <div class="text-sm whitespace-nowrap w-56 overflow-hidden text-ellipsis">{{ file.id }}</div>
        </div>
        <div class="flex items-center justify-between mt-1">
            <div class="text-xs mr-1" v-show="sortBy == 0">Added: {{ new Date(file.addedAt).toLocaleDateString() }}</div>
            <div class="text-xs mr-1 text-[#F05D5D]" v-show="sortBy == 1 && file?.lastUsed == 0">Never used</div>
                <div class="text-xs mr-1" v-show="sortBy == 1 && file?.lastUsed"
                    :class="{ 'text-[#F05D5D]': Date.now() - file?.lastUsed > 2629800000 }">LastUsed: {{ new Date(file.lastUsed).toLocaleDateString() }}
            </div>
            <div class="flex pr-2 gap-2 items-center">
                <i class="fa-solid fa-layer-group cursor-pointer p-1 hover:bg-[#111] rounded" @click.stop="e => $emit('changeClick', e, file.id)"></i>
                <i class="fa-solid fa-trash text-[#F05D5D] cursor-pointer p-1 hover:bg-[#111] rounded"
                @click.stop="fileStore.DeleteFile(file.id)"></i>
            </div>
        </div>
    </div>
</template>

<script setup>
import { defineProps, ref } from 'vue';
import { useFileStore } from '../stores/files';
const fileStore = useFileStore();
defineProps(['file', 'sortBy', 'lastCopied']);
defineEmits(['copy', 'changeClick'])
const audioRef = ref(null);
const paused = ref(true);

function playAudio() {
    audioRef?.value?.play()
    paused.value = false;
}

function pauseAudio() {
    audioRef?.value?.pause()
    paused.value = true;
}
</script>