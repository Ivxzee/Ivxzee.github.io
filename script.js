function loadFile(filePath) {               //Funkce ukradnuta ze StackOverflow, ktera mi nacte text ze .txt souboru
    var result = null;                      //Po celem dni JS bych asi byl schopen na to nejak prijit sam
    var xmlhttp = new XMLHttpRequest();     
    xmlhttp.open("GET", filePath, false);
    xmlhttp.send();
    if (xmlhttp.status==200) {              //Status ok
      result = xmlhttp.responseText;
    }
  return result;  //Here's where I stopped stealing code
}

const allWords = loadFile("words.txt")+"";  //Jeden obri string
const allWordsSplit = allWords.split("\n"); //Jeden obri array

setInterval(SetText, 1000);

var currentWord;
var pastWords = [];
var pastTimes = [];

function SetText(){
  
    var time = FormattedTime();
    document.getElementById("date").innerHTML =time;
    currentWord = allWordsSplit[Math.floor(Math.random() * 233459)];  //Nahodne slovo z arraye allWordsSplit
    
    pastWords.unshift(currentWord);
    if (pastWords.length>8){
      pastWords.pop();
    }
    pastTimes.unshift(time);
    if (pastTimes.length>8){
      pastTimes.pop();
    }
    
   for (let i = 0; i<pastWords.length; i++){
     var element = document.getElementById("word"+i);
     element.innerHTML = "<b>"+pastTimes[i]+"</b>"+" "+pastWords[i];
   }
  
}

function FormattedTime(){
    let d = new Date();    
    var dateArray = [d.getHours(),d.getMinutes(),d.getSeconds()];               
    for(let i = 0; i < dateArray.length; i++)
    {
        dateArray[i] += "";                                                     //Pretypovani
        dateArray[i] = dateArray[i].length>1 ? dateArray[i] : "0"+dateArray[i]; //Formatovani: 1:5 -> 01:05
    }
    return(dateArray.join(":"));
}

function DictionaryApiCall(_word) {
    var url = "https://api.dictionaryapi.dev/api/v2/entries/en/"+_word;

    var xhr = new XMLHttpRequest();
    xhr.open("GET", url);

    xhr.onreadystatechange = function () {
    if (xhr.readyState === 4) {
        console.log(xhr.status);     
        var j = JSON.parse(xhr.responseText);
        doShit(j);
      }
    };
    xhr.send();
}
function Button(id){
  DictionaryApiCall(pastWords[id.slice(-1)]); //Ptam se API
}
function doShit(j){                           //jinak bych se musel srat s asynchroni funkci
  var div = document.getElementById("dictionary");
  div.innerHTML = '';//clear
  var word = document.createElement("h2");
  var origin = document.createElement("p");

  word.innerText = j[0]['word'];
  word.classList.add("word");

  if (j[0]['origin']){   
  origin.innerText = j[0]['origin'];
  } else {origin.innerText = "Sorry! We couldn't find the origin of this word."}
  origin.classList.add("origin");

  div.appendChild(word);
  div.appendChild(origin);
  var ul = document.createElement("ul");
  div.appendChild(ul)

  for (let i = 0; i < j[0]['meanings'][0]['definitions'].length; i++){
    var definition = document.createElement("li");
    definition.innerHTML = j[0]['meanings'][0]['definitions'][i]['definition']
    definition.classList.add("definition");
    ul.appendChild(definition);
  }
}