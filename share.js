const shareButton = document.querySelector('.share-button');

if (!navigator.share) {
    shareButton.style.display = 'none';
}

shareButton.addEventListener('click', async () => {
    try {
        await navigator.share({
            title: 'Ritom',
            url: 'https://rittmang.xyz',
            text: 'Just checked out Ritom\'s profile, you should take a look too :'
        });
        console.log("Shared");
    }
    catch (err) {
        console.log("Error");
    }
});


//-------------------------

// const audio = document.getElementById("hoverSound");
// // const links = document.getElementsByClassName("link"); <- already used in script outside

// for(const link of links){
//     link.addEventListener("mouseenter", function () {
//         audio.currentTime = 0;
//         audio.play();
//         link.style.border = "dashed var(--color) 2px;"
//         // audio.loop = true;
//     });
    
//     link.addEventListener("mouseleave",function(){
//         audio.pause();
//     });
// }

