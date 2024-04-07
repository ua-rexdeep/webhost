<template>
    <div class="flex justify-between">
        <div class="font-bold mx-3 text-lg opacity-0">All files</div>
        <div class="flex gap-1 items-center">
            <span>Sort by:</span>
            <div class="border border-[#333539] rounded-md uppercase text-xs px-2 py-1 h-fit cursor-pointer"
                :class="{ 'border-[#222326] bg-[#333539]': sortBy == 0 }" @click="sortBy = 0">add date</div>
            <div class="border border-[#333539] rounded-md uppercase text-xs px-2 py-1 h-fit cursor-pointer"
                :class="{ 'border-[#222326] bg-[#333539]': sortBy == 1 }" @click="sortBy = 1">last used</div>
        </div>
    </div>
    <div class="grid grid-cols-7 gap-2 overflow-y-scroll overflow-x-hidden pr-1" id="all-files-list">

        <div class="flex flex-col w-48 justify-between group bg-[#333539] px-2 rounded-md cursor-pointer py-2 relative"
            v-for="file in filesWithSortedBy" @click="CopyIDToClipboard(file.id + '.' + file.type)" :key="file.id">

            <div class="media-type border rounded-md border-[#222326] bg-[#333539] uppercase absolute left-2 top-2">{{
                    file.type }}</div>
            <div class="mx-1 my-4 h-24" v-if="['png', 'jpg', 'jpeg'].includes(file.type)"
                :style="{ background: `center / contain no-repeat url(http://localhost:3092/api/file/${file.id})` }">
            </div>
            <video class="mx-1 my-4 h-24" v-if="file.type == 'mp4'" loop autoplay muted
                :src="`http://localhost:3092/api/file/${file.id}`" />

            <div class="flex items-center">
                <i class="fa-solid fa-copy text-[#456CCF] text-lg mr-2 flex"></i>
                <div class="text-sm whitespace-nowrap w-56 overflow-hidden text-ellipsis">{{ file.name }}</div>
            </div>
            <div class="flex items-center justify-between mt-1">
                <div class="text-xs mr-1" v-show="sortBy == 0">Added: {{ new Date(file.addedAt).toLocaleDateString() }}
                </div>
                <div class="text-sm mr-1 text-[#F05D5D]" v-show="sortBy == 1 && file?.lastUsed == 0">Never used</div>
                <div class="text-xs mr-1" v-show="sortBy == 1 && file?.lastUsed"
                    :class="{ 'text-[#F05D5D]': Date.now() - file?.lastUsed > 2629800000 }">
                    LastUsed: {{ new Date(file.lastUsed).toLocaleDateString() }}
                </div>
                <div class="flex pr-2">
                    <i class="fa-solid fa-trash text-[#F05D5D] cursor-pointer"
                        @click="fileStore.DeleteFile(file.id)"></i>
                </div>
            </div>
        </div>

    </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useFileStore } from '../stores/files';
import { APIProvider } from '../api/api';

const fileStore = useFileStore();
const sortBy = ref(0);

const filesWithSortedBy = computed(() => {
    const sorted = [...fileStore.files];
    if (sortBy.value == 0) sorted.sort((prev, next) => prev.addedAt < next.addedAt ? 1 : -1);
    if (sortBy.value == 1) sorted.sort((prev, next) => prev.lastUsed > next.lastUsed ? 1 : -1);
    return sorted;
})

function CopyIDToClipboard(text) {
    navigator.clipboard.writeText(`${APIProvider.defaults.baseURL}/file/${text}`);
}
</script>

<style scoped>
.media-type {
    font-size: 0.8rem;
    margin-right: 10px;
    padding: 3px 8px;
}
</style>