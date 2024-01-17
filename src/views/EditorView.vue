<script setup>
import 'quill/dist/quill.snow.css'
import { ref } from 'vue'
import { QuillEditor } from '@vueup/vue-quill'
import TitleComponent from '@/components/TitleComponent.vue'

import IconComponent from '@/components/IconComponent.vue'
import GoBackComponent from '@/components/GoBackComponent.vue'
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
        ],
    },
}
const emit = defineEmits()

const dateInfo = new Date()

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
            router.back()
            toast.success('The note has been sent')
        } else {
            toast.error('Please provide more information')
        }
    } catch (error) {
        toast.error(error.code)
    }
}
</script>
<template>
    <IconComponent class="mt-6" />
    <div class="px-8 min-h-screen flex flex-col">
        <TitleComponent text="Editor" class="mt-5 ml-5 mb-4" />
        <input
            v-model="title"
            maxlength="17"
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

        <button
            @click="sendNote"
            class="border-lightningYellow text-lightningYellow border-4 w-[80px] p-2 ml-auto mt-4 rounded-lg"
        >
            <font-awesome-icon
                :icon="['far', 'paper-plane']"
                class="text-4xl"
            />
        </button>
    </div>
    <GoBackComponent @click="router.back()" />
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
