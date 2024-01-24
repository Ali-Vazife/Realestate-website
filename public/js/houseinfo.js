let slideIndex = 1;

const nextImgBtn = document.querySelector('.next');
const previewImgBtn = document.querySelector('.prev');
const demoImgs = document.querySelectorAll('.cursor');

showSlides(slideIndex);

// Next/previous controls
function plusSlides(n) {
  showSlides(slideIndex += n);
}

// Thumbnail image controls
function currentSlide(n) {
  showSlides(slideIndex = n);
}

function showSlides(n) {
  let i;
  let slides = document.getElementsByClassName("mySlides");
  let dots = document.getElementsByClassName("demo");
  if (n > slides.length) { slideIndex = 1 }
  if (n < 1) { slideIndex = slides.length }
  for (i = 0; i < slides.length; i++) {
    slides[i].style.display = "none";
  }
  for (i = 0; i < dots.length; i++) {
    dots[i].className = dots[i].className.replace(" active", "");
  }
  slides[slideIndex - 1].style.display = "block";
  dots[slideIndex - 1].className += " active";
}

nextImgBtn.addEventListener('click', () => {
  plusSlides(-1);
});
previewImgBtn.addEventListener('click', () => {
  plusSlides(1);
});

demoImgs.forEach((img, index) => {
  img.addEventListener('click', () => {
    currentSlide(index + 1); // Show the clicked image
  });
});
