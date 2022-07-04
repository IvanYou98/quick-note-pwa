const swDev = () => {
    let swUrl = `${process.env.PUBLIC_URL}/sw.js`
    navigator.serviceWorker.register(swUrl).then(
        register => {
            console.warn('register', register);
        }
    )
}

export default swDev;

