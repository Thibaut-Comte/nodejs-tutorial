function printMessage(message) {
    console.log('Message is : ', message)
}
let i = 1;
setInterval( () => {
    printMessage(i);
    i+=1;
},1000);