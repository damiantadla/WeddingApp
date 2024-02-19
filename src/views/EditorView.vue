<script setup>
import 'quill/dist/quill.snow.css'
import { ref, defineProps, onMounted, getCurrentInstance } from 'vue'
import { QuillEditor } from '@vueup/vue-quill'
import TitleComponent from '@/components/TitleComponent.vue'
import GoBackComponent from '@/components/GoBackComponent.vue'
import { toast } from 'vue3-toastify'

import { useRouter } from 'vue-router'
import { useStore } from 'vuex'

const router = useRouter()
const store = useStore()

const { props, emit } = getCurrentInstance()

let content = ref('')
let title = ref('')
let date = ref('')

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

const dateInfo = new Date()

const sendNote = async () => {
    try {
        if (title.value && content.value) {
            const id = await store.dispatch('setDocAndGetId', {
                data: {
                    title: title.value,
                    text: content.value,
                    date: `${dateInfo.getFullYear()}-${
                        dateInfo.getMonth() + 1
                    }-${dateInfo.getDate()}`,
                },
                path: `users/${store.getters.getData.id}/notes`,
            })
            emit('changeData', {
                title: title.value,
                text: content.value,
                date: `${dateInfo.getFullYear()}-${
                    dateInfo.getMonth() + 1
                }-${dateInfo.getDate()}`,
                id,
            })
            title.value = ''
            content.value = ''
            updateIsVisibleEditor()
            toast.success('The note has been sent')
        } else {
            toast.error('Please provide more information')
        }
    } catch (error) {
        toast.error(error.code)
        console.log(error)
    }
}

const updateIsVisibleEditor = () => {
    emit('changeVisibleEditor', false)
}

const updateData = () => {
    // emit('changeData', {
    //     title: title.value,
    //     text: content.value,
    //     date: `${dateInfo.getFullYear()}-${
    //         dateInfo.getMonth() + 1
    //     }-${dateInfo.getDate()}`,
    // })
    console.log('wykonało se')
}
</script>
<template>
    <div
        class="fixed z-100 bottom-0 right-0 h-[550px] w-max-[400px] flex flex-col justify-center bg-glacier rounded-tl-xl"
    >
        <div class="px-8 flex flex-col">
            <TitleComponent text="Editor" class="mt-5 ml-5 mb-4" />
            <input
                v-model="title"
                maxlength="17"
                type="text"
                placeholder="Title"
                class="w-fulltext-base text-white bg-transparent placeholder-white border-[2px] py-2 px-3 rounded-t-xl"
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
            <div class="flex justify-around mt-10">
                <button
                    @click="updateIsVisibleEditor"
                    class="border-white border-4 w-[60px] mr-auto mt-4 rounded-lg"
                >
                    <font-awesome-icon
                        :icon="['fas', 'xmark']"
                        class="text-3xl text-white"
                    />
                </button>
                <button
                    @click="
                        () => {
                            sendNote()
                            updateData()
                        }
                    "
                    class="border-white text-lightningYellow border-4 w-[60px] p-2 ml-auto mt-4 rounded-lg"
                >
                    <img src="@/assets/icons/send.svg" alt="Send icon" />
                </button>
            </div>
        </div>
    </div>
</template>

