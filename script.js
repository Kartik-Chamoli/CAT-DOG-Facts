document.querySelectorAll('.choice-option').forEach(item=>{
    item.addEventListener('click',function(event){
        catOrDog(event);
    });
});

function toggleTransition(index){
    document.getElementsByClassName('choice-img')[index].classList.toggle('hover-class');
}


document.querySelectorAll('.choice-img').forEach((item,index)=>
    ['mouseover','mouseout'].forEach(event=>item.addEventListener(event,()=>toggleTransition(index)))
);

function catOrDog(event){
    let optChoose = event.target.dataset.opt;

    if(optChoose) window.location.href=`facts.html?opt=${optChoose}&page=1`;
     
}

document.querySelectorAll('.choice-text').forEach((item,index)=>{
    ['mouseover','mouseout'].forEach(event=>item.addEventListener(event,()=>toggleTransition(index)));
});



    
