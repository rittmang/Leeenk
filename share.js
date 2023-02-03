const shareButton = document.querySelector('.share-button');

if(!navigator.share){
    shareButton.style.display = 'none';
}

shareButton.addEventListener('click', async () => {
    try {
        await navigator.share({
            title:'Check out Ritom, he awesome',
            url:'https://rittmang.xyz', 
            text:'I just checked out Ritoms profile, it seems amazing. You should take a look too!'
        });
        console.log("Shared");
    }
    catch(err){
        console.log("Error");
    }
});