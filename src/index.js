import './sass/main.scss';
import { alert, error, defaultModules } from '@pnotify/core/dist/PNotify.js'
import * as PNotifyMobile from '@pnotify/mobile/dist/PNotifyMobile.js'
import '@pnotify/core/dist/PNotify.css'
import '@pnotify/core/dist/BrightTheme.css'
defaultModules.set(PNotifyMobile, {})
import { defaults } from '@pnotify/core'
defaults.width = '400px'
defaults.delay = '2000'
defaults.minHeight = '86px'


// const debounce = require('lodash.debounce');
import API from "./js/apiService.js";
const { BASE__URL, MY__KEY, imageTypeHorizontal } = API;



import templates from "./templates/img-card.hbs";
import imgTemplate from './templates/big-img.hbs';


import refs from "./js/refs.js";
const {searchForm, gallery, loadMore, bigImgBox, btnCloseEl } = refs;


searchForm.addEventListener('submit', startSearch )
loadMore.addEventListener("click", continueSearch)


let page = 1;
let value = '';

if (localStorage.getItem('dataArr') !== null) {
    const markup = templates(JSON.parse(localStorage.getItem('dataArr')))
    gallery.insertAdjacentHTML('beforeend', markup);
    addListenerOnGallery()
}

function startSearch(e) {
    gallery.innerHTML = ''
    e.preventDefault();
  
    const { elements: { query } } = e.currentTarget;
     value = query.value;
    if (value.trim() === '') {
       alert({ text: 'Please, provide your query!' }) 
        return
    }
    fetchArr().then(arr => {
        if (arr.length === 0) {
            error({ text: 'Check the correctness of the data entered!' })
            return
        } else {
            generateMarkup(arr);
        addListenerOnGallery();
    setInterval(showBtn, 500);}
       
    })
    .catch(err=>console.log(err))
    searchForm.reset();
    
  
}
async function fetchArr() {
  
        const response = await fetch(`${BASE__URL}${imageTypeHorizontal}&q=${value}&page=${page}&per_page=12&key=${MY__KEY}`);
        const images = await response.json();
        const arrayImages = await images.hits
        return arrayImages;
    // return fetch(`${BASE__URL}${imageTypeHorizontal}&q=${value}&page=${page}&per_page=12&key=${MY__KEY}`)
    // .then(r => {
    //         if (r.status!==200) {
    //         throw new Error(r.status);
    //     }
    //     return r.json();
    // })
    //     .then(data => {
    //     localStorage.setItem('dataArr', JSON.stringify(data.hits))
    //     return data.hits
      
    //     }).catch(Error=>console.log(Error))
}
function generateMarkup(array) {
    const markup = templates(array)
    gallery.insertAdjacentHTML('beforeend', markup);
}



function continueSearch() {
       page += 1;
    fetchArr().then(arr => {
    generateMarkup(arr);
    const lastElId = arr[arr.length - 1].id;
        scrollEnd(lastElId);
})

}


function scrollEnd(id) {
    document.getElementById(id).scrollIntoView({
  behavior: 'smooth',
  block: 'end',
}); 
}

function showBtn() {
  loadMore.classList.remove('is-hidden') 
}

function addListenerOnGallery() {
 gallery.addEventListener('click', (e) => {
    bigImgShow(e)
   	
  })
  
}
function bigImgShow(e) {
     e.preventDefault()
    if (e.target.nodeName !== "IMG") return;
            const imgMarkup = `<div class="overlay">
         
<img class="big-img" src="${e.target.dataset.source}" alt="${e.target.alt}"></img></div>`
      
    bigImgBox.insertAdjacentHTML('beforeend', imgMarkup)
    setTimeout(addVisible, 300)
       
    btnCloseEl.addEventListener('click', bigImgCloseOnBtnClick)    
    bigImgBox.addEventListener('click', bigImgCloseOnOverlayClick)
      
}

function addVisible() {
    document.querySelector('.overlay').classList.add('is-visible')
    btnCloseEl.classList.add('is-visible')
    }
function bigImgCloseOnBtnClick() {
    
    bigImgHidden()
    btnCloseEl.removeEventListener('click', bigImgCloseOnBtnClick)
       
}
function bigImgCloseOnOverlayClick(e) {
    if(!e.target.classList.contains('overlay'))return
   
    bigImgHidden()
     bigImgBox.removeEventListener('click', bigImgCloseOnOverlayClick)
}
function bigImgHidden() {
    document.querySelector('.overlay').classList.remove('is-visible')
    bigImgBox.innerHTML = ''
   
    btnCloseEl.classList.remove('is-visible')  
}
