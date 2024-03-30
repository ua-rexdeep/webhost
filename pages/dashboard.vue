<template>
    <title>WebHost - Dashboard</title>
    <div class="w-full h-full flex" v-if="fileStore.roles.includes('peof2')">
        <div class="flex flex-col overflow-hidden m-4 mr-2 rounded-xl flex-1 flex-[480px] gap-2" id="filesExplorer">
            <AllFiles />
        </div>
        <div class="w-full flex p-4 bg-[#222326] m-4 ml-2 rounded-xl"
            :class="{ 'items-center justify-center': !uploadFile }">
            <div class="flex gap-2 items-center text-xl cursor-pointer p-10" @click="uploadFileRef.click()"
                v-if="!uploadFile">
                <i class="fa-solid fa-cloud-arrow-up"></i>
                <div>Click here to select file to upload</div>
            </div>
            <div v-else class="flex flex-col gap-3 w-full">
                <div class="text-lg border-b border-b-gray-700">ID: {{ uploadFileId }}-{{ id }}</div>
                <div class="flex gap-3 items-center">
                    <input
                        class="outline-none px-3 py-1.5 w-56 rounded-md border border-[#333539] text-white placeholder:text-white bg-[#191a1c]"
                        placeholder="File name" v-model="uploadFileName" />
                    <div class="flex gap-2 items-center"><i class="fa-solid fa-triangle-exclamation text-[#C8A345]"></i>
                        Тільки англійські букви, прочерк та підкреслення</div>
                </div>
                <div>
                    <button class="py-1.5 px-4 rounded-md bg-[#333539] cursor-no-drop w-56"
                        :class="{ 'bg-success cursor-pointer': canUpload }"
                        @click="canUpload && send()">Завантажити</button>
                </div>
            </div>
        </div>
        <form ref="uploadFileFormRem" action="/api/file" method="POST">
            <input hidden type="file" ref="uploadFileRef" @change="onLoaded" />
        </form>
    </div>
</template>



<script setup>
import AllFiles from '~/components/all-files.vue';
const uploadFile = ref();
const uploadFileRef = ref();
const uploadFileFormRem = ref();
const uploadFileName = ref();
const uploadFileId = computed(() => {
    const match = [...uploadFileName.value.matchAll(/([\w\s\d\_\-]+)/g)].map(([v]) => v)
    return match.join('-').trim().replace(' ', '-');
})

const canUpload = computed(() => {
    return uploadFileId.value.length >= 5;
})

const fileStore = useFileStore();
async function send() {
    const formData = new FormData();
    Array.from([uploadFile.value]).map((file, index) => formData.append(index, file));
    formData.set('file-id', uploadFileId.value + '-' + id.value);
    formData.set('file-name', uploadFileName.value);

    await fileStore.CreateFile(formData);
    uploadFile.value = null;
    uploadFileName.value = null;
}

const id = ref('noid')
function uuid(length = 8) {
    let ret = '';
    const c = 'abcdef0123456789';
    return Array.from({ length }).fill(1).map(() => c[(Math.random() * (c.length - 0) + 0) ^ 0]).join('');
}

function onLoaded({ target }) {
    id.value = uuid();
    uploadFile.value = target.files[0]
    const [, match] = target.files[0].name.match(/^([\w\s\d\_\-]+)/);
    uploadFileName.value = match;
}
</script>