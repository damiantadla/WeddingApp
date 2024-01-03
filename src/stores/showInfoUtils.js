import { toast } from 'vue3-toastify'

const show = {
    success: (messege) => {
        setTimeout(() => {
            toast.success(messege)
        }, 0)
    },
    error: (messege) => toast.error(messege),
}

export { show }
