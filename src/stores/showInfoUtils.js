import { toast } from 'vue3-toastify'

const show = {
    success: (message) => {
        setTimeout(() => {
            toast.success(message)
        }, 0)
    },
    error: (message) => toast.error(message),
}

export { show }
