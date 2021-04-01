
let factController = (function(){

let factObj = {};

    return {

        splitUrl(){
            let val = location.hash;
            val = new URLSearchParams(val.split('#')[1]);
            
            let valArr = [];
            for(let pair of val.entries()){
                valArr.push(pair[1]);
            }

            return valArr;
        },
        
        async apiData(choice){
            let factsUrl,imageUrl;

            if(choice==='cat') {
                factsUrl = 'https://catfact.ninja/facts?limit=100&max_length=100';
                imageUrl = 'https://api.thecatapi.com/v1/images/search?limit=100&size=medium&format=json&mime_types=png';
            }
            else{
                factsUrl = 'https://api.allorigins.win/raw?url=https://dog-api.kinduff.com/api/facts?number=100';
                imageUrl = 'https://dog.ceo/api/breeds/image/random/50';
            }

            factObj.facts = await fetch(factsUrl);
            factObj.facts = await factObj.facts.json();
            
            factObj.pictures = await fetch(imageUrl);
            factObj.pictures = await factObj.pictures.json();
            
            if(choice==='dog'){
                let tempDogArr;
                tempDogArr = await fetch(imageUrl);
                tempDogArr = await tempDogArr.json();
    
                factObj.pictures.message  = [...factObj.pictures.message,...tempDogArr.message];
            }

            if(choice === 'cat'){
                factObj.facts=factObj.facts.data.map(function(item){
                    return item.fact;
                    });
            
                factObj.pictures = factObj.pictures.map(function(item){
                    return item.url;
                    });
            }
            else{
                factObj.facts = factObj.facts.facts;
                factObj.pictures = factObj.pictures.message;
            }

            return [factObj.facts,factObj.pictures];
            
        },
        
    }
})();

let UIController = (function() {

    function createCards(fact,imgUrl,number){
        let eleCard = `<div class="fact-card">
                    <div class="fact-card-in">
                        <div class="fact-card-front">
                        <img src=${imgUrl}  style="width:300px;height:300px;">
                        </div>
                        <div class="fact-card-back">
                        <h1>#${number}</h1> 
                        <p>${fact}</p> 
                        </div>
                    </div>
                    </div>`

        document.querySelector('#facts-placeholder').insertAdjacentHTML('beforeend',eleCard);
    }

    function cleanPrevious(ele){
            if(ele==='data')
                document.querySelector('#facts-placeholder').innerHTML="";

            else
                document.querySelector('#btn').innerHTML="";
        
    }

    return{
    setLoaderImage(choice){
        document.querySelector('#loader-img').src = `ASSETS/${choice}_1.png`;
    },
    removeLoader(){
        let loader = document.querySelector('#loader');
        loader.parentNode.removeChild(loader);
    },
    

    displayData(arr,noOfItemsPerPage,currentPage){
    
        cleanPrevious('data');
        let lowerLimit = (currentPage-1)*noOfItemsPerPage;
        let upperLimit = currentPage*noOfItemsPerPage;
            for(let i=lowerLimit;i<upperLimit;i++){
                createCards(arr[0][i],arr[1][i],i+1); 
            }
    },

    displayNavButton(currentPage,noOfPages){
    
        cleanPrevious('btn',currentPage);

        let btnElement;
        let navBtnElement =  document.querySelector('#btn');
        document.querySelector('#nav-btn b:nth-child(1)').innerHTML = currentPage;

        if(currentPage===1){
            btnElement = `<button title="next"  class="btn-right" >&#8203;</button>`;
            navBtnElement.insertAdjacentHTML('afterbegin',btnElement);
        }
        else if(currentPage===noOfPages){
            btnElement = ` <button title="previous"  class="btn-left" >&#8203;</button>`;
            navBtnElement.insertAdjacentHTML('afterbegin',btnElement);
        }
        else{
            btnElement = `<button title="previous" class="btn-left" >&#8203;</button>
                          <button title="next"  class="btn-right" >&#8203;</button>`;
            navBtnElement.insertAdjacentHTML('afterbegin',btnElement);
        }
    }
}
})();


let controller = (function(factCtrl,UICtrl){
    window.location.href=window.location.href.replace("?", "#");
    let choice = factCtrl.splitUrl()[0]; 
    let factArray;
    let noOfItemsPerPage;
    let currentPage = +factCtrl.splitUrl()[1];

    const noOfPages = 10;

    async function initData(){
        document.querySelector('nav h1').innerHTML = `${choice} FACTS`
        UICtrl.setLoaderImage(choice);
        factArray = await factCtrl.apiData(choice);
        UICtrl.removeLoader();
        document.querySelector(`[data-goto=${choice}]`).id = "active";

   }
  
    function renderUI(){
       noOfItemsPerPage = Math.ceil(factArray[0].length/noOfPages);
       UICtrl.displayData(factArray,noOfItemsPerPage,currentPage);
       UICtrl.displayNavButton(currentPage,noOfPages);
   }

   function setUpEventListeners(){
       document.querySelector('#btn').addEventListener('click',(event)=>{
            if(event.target.title==='next'){
                window.location.hash=`opt=${choice}&page=${++currentPage}`;
                UICtrl.displayData(factArray,noOfItemsPerPage,currentPage);
                UICtrl.displayNavButton(currentPage,noOfPages);

            }
            else if(event.target.title==='previous'){
                window.location.hash=`opt=${choice}&page=${--currentPage}`;
                UICtrl.displayData(factArray,noOfItemsPerPage,currentPage);
                UICtrl.displayNavButton(currentPage,noOfPages);
            }
       });

       document.querySelector('.nav-link').addEventListener('click',(event)=>{
            if(event.target.localName==="img"){
                event.target.id = "active";
                let data_goto = event.target.dataset.goto;
           
                if(data_goto!==choice){
                    window.location.href=`facts.html?opt=${data_goto}&page=1`;
                }
            }
       });
   }
   return{
        async init(){
            await initData();
            renderUI();
            setUpEventListeners();
       }
   }
})(factController,UIController);

controller.init();
    