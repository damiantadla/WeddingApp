<script setup>
import 'quill/dist/quill.snow.css'
import { ref } from 'vue'
import { QuillEditor } from '@vueup/vue-quill'
import TitleComponent from '@/components/TitleComponent.vue'
import ButtonComponent from '@/components/ButtonComponent.vue'
import InputComponent from '@/components/InputComponent.vue'
import { toast } from 'vue3-toastify'

import { useRouter } from 'vue-router'
import { useStore } from 'vuex'

const store = useStore()
const router = useRouter()

const content = ref('')
const title = ref('')
const date = ref('')

let contentDiv = ref()
let quillEditorRef = ref(null)

const onEditorReady = (editor) => {
    content.value = editor
    quillEditorRef.value = editor
    updateContentDiv()
}

const updateContentDiv = () => {
    if (contentDiv.value) {
        contentDiv.value.innerHTML = content.value
    }
}

const editorOptions = {
    modules: {
        toolbar: [
            ['bold', 'italic', 'underline', 'strike'],
            ['blockquote', 'code-block'],
            [{ list: 'ordered' }, { list: 'bullet' }],
            [{ script: 'sub' }, { script: 'super' }],
            [{ indent: '-1' }, { indent: '+1' }],
            [{ direction: 'rtl' }],
            [{ size: ['small', false, 'large', 'huge'] }],
            [{ color: [] }, { background: [] }],
            [{ align: [] }],
            ['link', 'image'],
        ],
    },
}
const emit = defineEmits()

console.log('tak')
const dateInfo = new Date()
const toDay = `${dateInfo.getFullYear()}-${dateInfo.getMonth()}-${dateInfo.getDate()}`
console.log(toDay)

const sendNote = async () => {
    try {
        if (title.value && content.value) {
            await store.dispatch('setDoc', {
                data: {
                    title: title.value,
                    text: content.value,
                    date: `${dateInfo.getFullYear()}-${
                        dateInfo.getMonth() + 1
                    }-${dateInfo.getDate()}`,
                },
                path: `users/${store.getters.getData.id}/notes`,
            })
            emit('sendData', { title: title.value, text: content.value })
            title.value = ''
            content.value = ''
            router.go(-1)
            toast.success('The note has been sent')
        } else {
            toast.error('Please provide more information')
        }
    } catch (error) {
        console.log(error)
    }
}
const goToBack = () => {
    router.go(-1)
}
</script>
<template>
    <div class="px-8 min-h-screen flex flex-col">
        <TitleComponent text="Editor" class="mt-5 ml-5 mb-4" />
        <input
            v-model="title"
            type="text"
            placeholder="Title"
            class="w-full text-base text-white bg-transparent placeholder-white border-[2px] py-2 px-3 rounded-xl"
        />

        <quill-editor
            placeholder="Add some text..."
            theme="snow"
            v-model="content"
            :options="editorOptions"
            contentType="html"
            ref="editor"
            @update:content="onEditorReady"
        />
        <ButtonComponent
            @click="
                () => {
                    sendNote()
                }
            "
            text="Add note"
            class="mt-4 ml-auto"
        />
    </div>
    <font-awesome-icon
        @click="goToBack"
        class="fixed bottom-0 left-0 p-4 text-white text-6xl cursor-pointer"
        :icon="['fas', 'circle-left']"
    />
</template>
<style>
.scroll-container::-webkit-scrollbar {
    width: 12px;
}

.scroll-container::-webkit-scrollbar-thumb {
    background-color: #ddd;
    border-radius: 10px;
}

/* Firefox */
.scroll-container {
    scrollbar-width: thin;
}

.scroll-container::-moz-scrollbar-thumb {
    background-color: #ddd;
    border-radius: 10px;
}
</style>
