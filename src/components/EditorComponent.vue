<script setup>
import 'quill/dist/quill.snow.css'
import { ref, onBeforeUnmount } from 'vue'
import { QuillEditor } from '@vueup/vue-quill'
import TitleComponent from './TitleComponent.vue'
import ButtonComponent from './ButtonComponent.vue'
import InputComponent from './InputComponent.vue'
import { toast } from 'vue3-toastify'

import { useStore } from 'vuex'
import router from '@/router'

const store = useStore()

const content = ref('')
const title = ref('')
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

const sendNote = async () => {
    try {
        if (title.value && content.value) {
            await store.dispatch('setDoc', {
                data: {
                    title: title.value,
                    text: content.value,
                },
                path: `users/${store.getters.getData.id}/notes`,
            })
            emit('sendData', { title: title.value, text: content.value })
            title.value = ''
            content.value = ''

            toast.success('The note has been sent')
        } else {
            toast.error('Please provide more information')
        }
    } catch (error) {
        console.log(error)
    }
}
</script>
<template>
    <div class="px-8 min-h-screen flex flex-col">
        <TitleComponent text="Note" class="mt-5 ml-5 mb-2" />
        <div
            class="min-h-[200px] max-h-[200px] ql-editor ql-container l-syntax ql-snow ql-blank overflow-hidden"
            style="max-width: 100%"
        >
            <div class="pb-2 mb-2 text-base text-white border-b-[2px]">
                <p>{{ title === '' ? 'Title' : title }}</p>
            </div>
            <p style="white-space: normal; word-break: break-word" ref="contentDiv"></p>
        </div>
        <TitleComponent text="Editor" class="mt-5 ml-5 mb-4" />
        <input
            v-model="title"
            type="text"
            placeholder="Title"
            class="w-full text-base text-white bg-transparent placeholder-white border-[2px] py-2 px-3 rounded-xl"
        />
        <input v-model="content" class="text-black" />
        <input v-model="contentDiv" class="text-black" />
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
</template>
