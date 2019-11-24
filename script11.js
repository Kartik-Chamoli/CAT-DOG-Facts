(function(){
	hello();
})()

let globObj = {

};

document.getElementsByClassName('button-class')[0].addEventListener('click',event=>{
	document.getElementsByClassName('facts')[0].innerHTML="";
	document.getElementsByClassName('button-class')[0].innerHTML="";
	displayData(globObj.factsArr,globObj.noOfpages,+event.target.dataset.goto);
})

async function hello(){
	let loader = document.getElementById("loader");
	loader.style.visibility = 'visible';
	let facts = await fetch('https://cors-anywhere.herokuapp.com/https://catfact.ninja/facts?limit=100');
	facts =await facts.json();
	globObj.factsArr = facts.data;
	globObj.noOfpages = globObj.factsArr.length/10;
	loader.parentNode.removeChild(loader);
	displayData(globObj.factsArr,globObj.noOfpages);
}

function displayData(arr,noOfpages,page=1){
	let lowerLimit = (page-1)*noOfpages;
	let higherLimit = page*noOfpages;
	let classVar = 0;
	for(let i=lowerLimit;i<higherLimit;i++){
		let fact_class=`<div class="fact-class">
		<span class="num">${i+1})</span> ${arr[i].fact}
		</div>`
		classVar++;
		document.getElementsByClassName("facts")[0].insertAdjacentHTML('beforeend',fact_class);
	}
	renderButton(page,noOfpages);
}

function renderButton(page,noOfpages){
	if(page===1){
		let btn = `<button class="btn-next" data-goto=${page+1}> Page ${page+1} &#8250; </button>`;
		document.getElementsByClassName('button-class')[0].insertAdjacentHTML('afterbegin',btn);
	}
	if(page===noOfpages){
		let btn = `<button class="btn-prev" data-goto=${page-1}> &#8249; Page ${page-1}  </button>`;
		document.getElementsByClassName('button-class')[0].insertAdjacentHTML('afterbegin',btn);
	}
	if(page>1&&page<noOfpages){
		let btn = `<button class="btn-prev" data-goto=${page-1}> &#8249; Page ${page-1} </button>
		<button class="btn-next" data-goto=${page+1}> Page ${page+1} &#8250;</button>
		`;
		document.getElementsByClassName('button-class')[0].insertAdjacentHTML('afterbegin',btn);
	}
}
