const slide = document.querySelector('.slider');
const num = document.querySelector('.number');
const capital = document.querySelector('#uppercase');
const small = document.querySelector('#lowercase');
const digit = document.querySelector('#numbers');
const char = document.querySelector('#symbols');
const datadisplay = document.querySelector('.display');
const generatebtn = document.querySelector('.generate');
const indicates = document.querySelector('.indicator');
const allCheckBox = document.querySelectorAll('input[type=checkbox]');
const copy = document.querySelector('.copymsg');
const copyBtn = document.querySelector('.datacpy')
const symbl = '~`!@#$%^&*()_-+=|}{\][:"?><;/.,';

let password = "";
let passwordLength = 8;
let checkCount = 0;
handleSlider();
setIndicator("#ccc");

function handleSlider(){
    slide.value = passwordLength;
    num.innerText = passwordLength;
    const min = slide.min;
    const max = slide.max;
    slide.style.backgroundSize = ( (passwordLength-min)*100/(max-min)) + "% 100%"
}

function setIndicator(color){
    indicates.style.backgroundColor = color;
    indicates.style.boxShadow = `0px 0px 12px 1px ${color}`;
}

function getRndInt(min,max){
    return Math.floor(Math.random() * (max-min)) + min;
}

function getRndNum(){
    return getRndInt(0,9);
}

function getRndLow(){
    return String.fromCharCode(getRndInt(97,123));
}

function getRndUp(){
    return String.fromCharCode(getRndInt(65,91));
}

function getRndSmbl(){
    const randNum = getRndInt(0,symbl.length);
    return symbl.charAt(randNum);
}

function calcsStrength(){
    let hasUpper = false;
    let hasLower = false;
    let hasNum = false;
    let hasSym = false;
    if(capital.checked) hasUpper = true;
    if(small.checked) hasLower = true;
    if(digit.checked) hasNum = true;
    if(char.checked) hasSym = true;

    if (hasUpper && hasLower && (hasNum || hasSym) && passwordLength >= 8){
        setIndicator("#0f0");
    } else if (
        (hasLower || hasUpper) &&
        (hasNum || hasSym) &&
        passwordLength >= 6
    ){
        setIndicator("#ff0");
    }else{
        setIndicator("#f00");
    }
}

async function copyContent(){
    try{
        await navigator.clipboard.writeText(datadisplay.value);
        // clipboard.writeText k through content ko kr skte h & it returns promise
        copy.innerText = "copied";
    }
    catch(e){
        copy.innerText = "Failed";
    }

    //to make visible on screen
    copy.classList.add("active");

    setTimeout( () => {
        copy.classList.remove("active");
    },2000);
}

function zumblePassword(array){
    // Fisher Yates Method
    for(let i=array.length-1; i>0; i--){
        const j = Math.floor(Math.random() * (i+1));
        const temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    let str = "";
    array.forEach((el) => (str += el));
    return str;
}

function handleCheckBoxChange(){
    checkCount = 0;
    allCheckBox.forEach( (checkbox) => {
        if(checkbox.checked)
        checkCount++;
    });

    if(passwordLength < checkCount){
        passwordLength = checkCount;
        handleSlider();
    }
}

allCheckBox.forEach( (checkbox) => {
    checkbox.addEventListener('change',handleCheckBoxChange);
})

slide.addEventListener('input' , (e) => {
    passwordLength = e.target.value;
    handleSlider();
})

copyBtn.addEventListener('click',() => {
    if(datadisplay.value)
    copyContent();
})

generatebtn.addEventListener('click', () => {
    if(checkCount == 0) return;

    if(passwordLength < checkCount){
        passwordLength = checkCount;
        handleSlider();
    }

    password = "";

    let funcArr = [];

    if(capital.checked){
        funcArr.push(getRndUp);
    }

    if(small.checked){
        funcArr.push(getRndLow);
    }

    if(digit.checked){
        funcArr.push(getRndNum);
    }

    if(char.checked){
        funcArr.push(getRndSmbl);
    }

    for(let i=0; i<funcArr.length; i++){
        password += funcArr[i]();
    }

    for(let i=0; i<passwordLength - funcArr.length; i++){
        let randIdx = getRndInt(0,funcArr.length);
        password += funcArr[randIdx]();
    }

    password = zumblePassword(Array.from(password));
    datadisplay.value = password;
    calcsStrength();

})
