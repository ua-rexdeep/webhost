<template>
    <title>WebHost - Dashboard</title>
    <div class="w-full h-full flex gap-3" id="droparea">
        <div class="flex flex-col overflow-hidden m-4 mr-2 rounded-xl flex-1 gap-2 bg-[#222326] p-2.5 border border-[#333539]">
            <AllFiles />
        </div>
        <div class="flex flex-col gap-0">
            <div class="hidden xl:flex flex-col w-[480px] flex-1 p-4 bg-[#222326] mb-4 mt-4 rounded-xl border border-[#333539] gap-3">
                <div class="flex items-center gap-3">
                    <input
                            class="outline-none px-3 py-1.5 w-full rounded-md border border-[#333539] text-white placeholder:text-white bg-[#191a1c]"
                            placeholder="New category name" v-model="newCategoryName" />
                    <i class="fa-regular fa-square-plus text-xl" v-show="newCategoryName.length >= 4" @click="onCreateCategory()"></i>
                </div>
                <div class="flex flex-col gap-2">
                    <div class="text-base py-1 px-3 rounded-md flex justify-between items-center cursor-pointer"
                        @click="fileStore.GetAllFilesData()"
                        :class="{ 'bg-[#333539]': categoryStore.currentCategory == null }">
                        <span>All</span>
                        <span class="text-xs">{{ fileStore.allFilesCount }} files</span>
                    </div>
                    <div class="text-base py-1 px-3 rounded-md flex justify-between items-center cursor-pointer" 
                        :class="{ 'bg-[#333539]': categoryStore.currentCategory == category.name }"
                        @click="categoryStore.selectCategory(category.name)"
                        v-for="category in categoryStore.categories" :key="category.name">
                        <span>{{ category.name }}</span>
                        <span class="text-xs">{{ category.num_files }} files</span>
                    </div>
                </div>
            </div>
            <div class="hidden xl:flex w-[480px] h-[300px] p-4 bg-[#222326] mb-4 rounded-xl border border-[#333539]"
                :class="{ 'items-center justify-center': !uploadFile }">
                <div class="flex gap-2 items-center text-xl cursor-pointer p-10" @click="uploadFileRef.click()"
                    v-if="!uploadFile">
                    <i class="fa-solid fa-cloud-arrow-up"></i>
                    <div>Click here to select file to upload</div>
                </div>
                <div v-else class="flex flex-col gap-3 w-full">
                    <div class="text-lg border-b border-b-gray-700">{{ uploadFile.name }}</div>
                    <div class="flex gap-3 items-center">
                        <input
                            class="outline-none px-3 py-1.5 w-56 rounded-md border border-[#333539] text-white placeholder:text-white bg-[#191a1c]"
                            placeholder="File name" :value="uploadFileName" @input="uploadFileNameInput" />
                        <div class="flex gap-2 items-center" v-show="uploadFileNameCheck.state == 2">
                            <i class="fa-solid fa-triangle-exclamation text-[#C8A345]"></i>
                            Only a-zA-Z0-9 _ -
                        </div>
                        <div class="flex gap-2 items-center" v-show="uploadFileNameCheck.state == 0">
                            <i class="fa-solid fa-crow text-[#C8A345]"></i>
                            Перевіряємо ім'я
                        </div>
                        <div class="flex gap-2 items-center" v-show="uploadFileNameCheck.state == 1">
                            <i class="fa-solid fa-crow text-red-400"></i>
                            Такий файл вже існує
                        </div>
                    </div>
                    <select @click="({target}) => uploadFileCategory = target.value"
                        class="outline-none px-3 py-1.5 w-56 rounded-md border border-[#333539] text-white placeholder:text-white bg-[#191a1c]"
                        >
                        <option selected value="">No category</option>
                        <option :value="category.name"
                            v-for="category in categoryStore.categories" :key="category.name">{{ category.name }}</option>
                    </select>
                    <div>
                        <button class="py-1.5 px-4 rounded-md bg-[#333539] cursor-no-drop w-56"
                            :class="{ 'bg-success cursor-pointer': canUpload }" @click="canUpload && send()">Upload</button>
                    </div>
                </div>
            </div>
        </div>
        <form ref="uploadFileFormRem" action="/api/file/create" method="POST">
            <input hidden type="file" ref="uploadFileRef" @change="onLoaded" />
        </form>
    </div>
</template>

<script setup>
import {ref, computed, onMounted} from 'vue';
import AllFiles from '../components/all-files.vue';
import { useFileStore } from '../stores/files';
import { useCategories } from '../stores/categories';
import { useToast } from 'vue-toast-notification';
const uploadFile = ref();
const uploadFileRef = ref();
const uploadFileFormRem = ref();
const uploadFileName = ref();
const uploadFileCategory = ref();
const uploadFileNameCheck = ref({ state: 0, timeout: null });

const newCategoryName = ref('');

const canUpload = computed(() => {
    return uploadFileNameCheck.value.state == 2 && uploadFileName.value.length >= 5 && uploadFileCategory.value;
})

const toast = useToast();
const fileStore = useFileStore();
const categoryStore = useCategories();
async function send() {
    const formData = new FormData();
    Array.from([uploadFile.value]).map((file, index) => formData.append(index, file));
    formData.set('file-id', uploadFileName.value);
    formData.set('file-category', uploadFileCategory.value);

    fileStore.CreateFile(formData).then(() => {
        toast.success(`File ${formData.get('file-id')} created`, { position: 'top' })
    });
    uploadFile.value = null;
    uploadFileName.value = null;
    uploadFileCategory.value = null;
}

function onLoaded({ target }) {
    uploadFile.value = target.files[0]
    const [, match] = target.files[0].name.match(/^([\w\s\d_-]+)/);
    uploadFileName.value = match;

    uploadFileNameInput({ target: { value: match } })
}

function onCreateCategory() {
    categoryStore.createCategory(newCategoryName.value);
    newCategoryName.value = '';
}

function uploadFileNameInput({ target }) {
    const value = target.value;
    console.log('uploadFileNameInput', value)
    uploadFileName.value = value;
    clearTimeout(uploadFileNameCheck.value.timeout);
    uploadFileNameCheck.value.state = 0;
    if(value.length >= 5) {
        uploadFileNameCheck.value.timeout = setTimeout(async () => {
            const exists = await fileStore.DoesFileAlreadyExists(value)
            if(uploadFileName.value != value) return;

            uploadFileNameCheck.value.state = exists ? 1 : 2;

        }, 700);
    }
}

onMounted(() => {
    categoryStore.getAllCategories();
    fileStore.GetAllFilesData();

    document.addEventListener('dragover', (e) => {
        e.preventDefault()
    });
    document.addEventListener("drop", function(e) {
        e.preventDefault()
        e.stopPropagation()
        const files = Array.from(e.dataTransfer.files);
        
        uploadFile.value = files[0]
        
        const [, match] = files[0].name.match(/^([\w\s\d_-]+)/);
        uploadFileName.value = match;

        uploadFileNameInput({ target: { value: match } })
    }, false);
})
</script>