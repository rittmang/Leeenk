const shareButton = document.querySelector('.share-button');

if(!navigator.share){
    shareButton.style.display = 'none';
}

shareButton.addEventListener('click', async () => {
    try {
        await navigator.share({
            title:'Ritom',
            url:'https://rittmang.xyz', 
            text:'Just checked out Ritom\'s profile, you should take a look too :'
        });
        console.log("Shared");
    }
    catch(err){
        console.log("Error");
    }
});