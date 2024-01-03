const manageLocalStorage = {
    set: (key, data) => localStorage.setItem(key, JSON.stringify(data)) || null,
    rm: (key) => localStorage.removeItem(key),
    get: (key) => JSON.parse(localStorage.getItem(key)),
}

export { manageLocalStorage }
