// register the service worker in public folder (under development mode)
const swDev = () => {
    let swUrl = `${process.env.PUBLIC_URL}/sw.js`
    navigator.serviceWorker.register(swUrl).then(
        console.log('sw registered!')
    )
}

export default swDev;

