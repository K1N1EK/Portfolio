document.addEventListener("DOMContentLoaded", function () {
    const image = document.getElementById("clickable-image2");
    const sound = document.getElementById("click-sound");

    // Change image and play sound when clicked
    image.addEventListener("mousedown", function () {
        image.src = "assets/mao2.png"; // Change to the second image
        sound.currentTime = 0; // Reset sound if it's already playing
        sound.play();
    });

    // Revert to original image when mouse button is released
    image.addEventListener("mouseup", function () {
        image.src = "assets/mao1.png"; // Change back to the original
    });

});