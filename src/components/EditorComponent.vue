<template>
    <div class="px-8 min-h-screen flex flex-col">
        <TitleComponent text="Note" class="mt-5 ml-5 mb-2" />
        <div class="ql-editor border-2 rounded-2xl max-h-50">
            <div class="border-b-[2px]">Title</div>
            <p class="" ref="contentDiv"></p>
        </div>
        <TitleComponent text="Editor" class="mt-5 ml-5" />
        <quill-editor
            placeholder="Add some text..
        "
            theme="snow"
            v-model="content"
            :options="editorOptions"
            contentType="html"
            @update:content="onEditorReady"
        />
        <ButtonComponent
            @click="showText"
            text="Add note"
            class="mt-4 ml-auto"
        />
    </div>
</template>

<script setup>
import 'quill/dist/quill.snow.css'
import { ref } from 'vue'
import { QuillEditor } from '@vueup/vue-quill'
import TitleComponent from './TitleComponent.vue'
import ButtonComponent from './ButtonComponent.vue'

const content = ref('')
const contentDiv = ref(null)

const showInfo = () => {
    console.log(contentDiv.value)
}

const onEditorReady = (editor) => {
    content.value = editor
    updateContentDiv()
}

const updateContentDiv = () => {
    if (contentDiv.value) {
        contentDiv.value.innerHTML = content.value
        console.log(contentDiv.value.innerHTML)
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

const showText = () => {
    console.log(contentDiv.value)
}
</script>

<style>
div.ql-editor pre.ql-syntax {
    background-color: #fff !important;
}
div.ql-container {
    max-width: 100% !important;
}

/* Dodatkowy styl dla maksymalnej liczby znaków w jednej linii */
</style>
