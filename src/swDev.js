const publicVapidKey = 'BMlbkvtMg9ftQcl-fHZ93N6EtFqeSOvFXBp7mRmZZkStzMDNBYivnOci2giLLbtuqBqS0T9qFSwrDVlO2h_fMow';

function urlBase64ToUint8Array(base64String) {
    var padding = '='.repeat((4 - base64String.length % 4) % 4);
    var base64 = (base64String + padding)
        .replace(/\-/g, '+')
        .replace(/_/g, '/');

    var rawData = window.atob(base64);
    var outputArray = new Uint8Array(rawData.length);

    for (var i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
}

const swDev = () => {
    let swUrl = `${process.env.PUBLIC_URL}/sw.js`
    navigator.serviceWorker.register(swUrl).then(
        console.log('sw registered!')
    )

    navigator.serviceWorker.ready.then(swReg => {
        swReg.pushManager.subscribe(
            {
                userVisibleOnly: true,
                applicationServerKey: urlBase64ToUint8Array(publicVapidKey)
            }
        ).then(
            console.log('Push registered!')
        )
    })
}

export default swDev;

