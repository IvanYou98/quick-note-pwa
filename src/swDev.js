const swDev = () => {
    let swUrl = `${process.env.PUBLIC_URL}/sw.js`
    navigator.serviceWorker.register(swUrl).then(
        console.log('sw registered!')
    )
}

export default swDev;

