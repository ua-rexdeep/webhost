<template>
    <div class="flex justify-between">
        <div class="flex gap-3 items-center flex-1">
            <input
                class="outline-none px-3 py-1.5 rounded-md border border-[#333539] text-white placeholder:text-white bg-[#191a1c] w-1/4"
                placeholder="Search by ID" v-model="filterByID" />
            <span class="text-xs" v-show="filterByID.length">Found {{ computedFiles.length }} files</span>
        </div>
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
            v-for="file in computedFiles" @click="CopyIDToClipboard(file.id, file.id + '.' + file.type)" :key="file.id">

            <div class="media-type border rounded-md border-[#222326] bg-[#333539] uppercase absolute left-2 top-2">
                {{ file.type }}
            </div>
            <div class="mx-1 my-4 h-24" v-if="['png', 'jpg', 'jpeg', 'webp', 'gif'].includes(file.type)"
                :style="{ background: `center / contain no-repeat url(http://localhost:3092/api/file/${file.id})` }">
            </div>
            <video class="mx-1 my-4 h-24" v-if="file.type == 'mp4'" loop autoplay muted
                :src="`http://localhost:3092/api/file/${file.id}`" />

            <div class="flex items-center">
                <i class="fa-solid fa-copy text-[#456CCF] text-lg mr-2 flex" v-show="lastCopied != file.id"></i>
                <i class="fa-solid fa-check text-success text-lg mr-2 flex" v-show="lastCopied == file.id"></i>
                <div class="text-sm whitespace-nowrap w-56 overflow-hidden text-ellipsis">{{ file.id }}</div>
            </div>
            <div class="flex items-center justify-between mt-1">
                <div class="text-xs mr-1" v-show="sortBy == 0">Added: {{ new Date(file.addedAt).toLocaleDateString() }}
                </div>
                <div class="text-xs mr-1 text-[#F05D5D]" v-show="sortBy == 1 && file?.lastUsed == 0">Never used</div>
                <div class="text-xs mr-1" v-show="sortBy == 1 && file?.lastUsed"
                    :class="{ 'text-[#F05D5D]': Date.now() - file?.lastUsed > 2629800000 }">
                    LastUsed: {{ new Date(file.lastUsed).toLocaleDateString() }}
                </div>
                <div class="flex pr-2 gap-2 items-center">
                    <i class="fa-solid fa-layer-group cursor-pointer p-1 hover:bg-[#111] rounded" @click.stop="e => onChangeCategoryClick(e, file.id)"></i>
                    <i class="fa-solid fa-trash text-[#F05D5D] cursor-pointer p-1 hover:bg-[#111] rounded"
                        @click.stop="fileStore.DeleteFile(file.id)"></i>
                </div>
            </div>
        </div>

        <Teleport to="body">
            <div class="w-full h-full bg-[#141414c9] absolute top-0 left-0 cursor-zoom-out" @click="changeCategory.show = false"
                :class="[ changeCategory.show ? 'opacity-100 z-10' : 'opacity-0 -z-10' ]">
                <div class="w-44 min-h-12 bg-[#333] rounded-md flex flex-col gap-1 py-1 relative"
                    :style="{ 'left': changeCategory.x+'px', 'top': changeCategory.y+'px' }">
                    <div class="text-white text-base p-2 px-3 hover:bg-[#222] cursor-pointer" @click.stop="onChangeCategoryOption(cat.name)"
                        v-for="cat in categoryStore.categories" :key="cat.id">{{ cat.name }}</div>
                </div>
            </div>
        </Teleport>

    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useFileStore } from '../stores/files';
import { useCategories } from '../stores/categories';
import { useToast } from 'vue-toast-notification';

const $toast = useToast();
const fileStore = useFileStore();
const categoryStore = useCategories();
const sortBy = ref(0);
const lastCopied = ref(null);
const filterByID = ref('');
const changeCategory = ref({ show: false, x: 0, y: 0, fileId: null });

const env = import.meta.env;

const computedFiles = computed(() => {
    let sorted = [...fileStore.files];
    if (sortBy.value == 0) sorted.sort((prev, next) => prev.addedAt < next.addedAt ? 1 : -1);
    if (sortBy.value == 1) sorted.sort((prev, next) => prev.lastUsed > next.lastUsed ? 1 : -1);

    sorted = sorted.filter((file) => {
        return file.id.toLocaleLowerCase().includes(filterByID.value.toLocaleLowerCase());
    })

    return sorted;
})

function CopyIDToClipboard(id, text) {
    navigator.clipboard.writeText(`http://${env.VITE_IP}:3092/api/file/${text}`);
    lastCopied.value = id;
    setTimeout(() => {
        if(lastCopied.value == id) lastCopied.value = null;
    }, 1500);
}

function onChangeCategoryClick({ target }, fileID) {
    const rect = target.getBoundingClientRect();
    changeCategory.value.show = true;
    changeCategory.value.x = rect.x + rect.width;
    changeCategory.value.y = rect.y + rect.height;
    changeCategory.value.fileId = fileID;
}

async function onChangeCategoryOption(categoryName) {
    changeCategory.value.show = false;

    $toast.success(`Category for file changed to ${categoryName}`, {
        position: "top",
        timeout: 5000,
        closeOnClick: true,
        pauseOnFocusLoss: true,
        pauseOnHover: true,
        draggable: true,
        draggablePercent: 0.6,
        showCloseButtonOnHover: true,
        hideProgressBar: true,
        closeButton: "button",
        icon: "fas fa-rocket",
        rtl: false
    });

    await categoryStore.changeFileCategory(changeCategory.value.fileId, categoryName);
    categoryStore.getAllCategories();
}
</script>

<style scoped>
.media-type {
    font-size: 0.8rem;
    margin-right: 10px;
    padding: 3px 8px;
}
</style>