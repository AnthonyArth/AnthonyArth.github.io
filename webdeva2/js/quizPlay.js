//useful functions
//get a random integer
function GetRandomInteger(min, max) {
    return Math.floor(Math.random() * (max - min) ) + min;
}

//shuffle an array
function Shuffle(array){
    //we use the Fisher-Yates shuffle
    let currentIndex = array.length,  randomIndex;

    // While there remain elements to shuffle.
    while (currentIndex != 0) {
        // Pick a remaining element.
        randomIndex = GetRandomInteger(0, currentIndex);
        --currentIndex;

        // And swap it with the current element.
        [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
    }
}

//set values to a new cookie
function SetCookie(name, value, expireDays) {
    const date = new Date();
    //set time as current time + the expireDays*time in a day
    date.setTime(date.getTime() + (expireDays*24*60*60*1000));
    let expires = "expires="+ date.toUTCString();
    //create the cookie
    document.cookie = name + "=" + value + ";" + expires + ";path=/";
}

//get value from a cookie
function GetCookie(cookieName) {
    let cookieToSearch = cookieName + "="; //create a string to search for out of cookieName
    let decodedCookie = decodeURIComponent(document.cookie); //decode the cookie string to handle cookies with special characters
    let cookieArray = decodedCookie.split(';'); //split all cookies into an array

    //loop through the cookie array
    for(let i = 0; i <cookieArray.length; i++) {
      //find the cookie
      let cookie = cookieArray[i];

      while (cookie.charAt(0) == ' ') {
        cookie = cookie.substring(1);
      }

      if (cookie.indexOf(cookieToSearch) == 0) {
        return cookie.substring(cookieToSearch.length, cookie.length);
      }
    }
    return "";
  }

//classes
class CQuestion{
    #question;
    #answer;

    constructor(){
        //throw an error as we want this class to be abstract
        if(this.constructor == CQuestion)
        {
            throw new Error("You cannot create an instance of Abstract class"); 
        } 
    }

    GetQuestion(){
        return this.#question;
    }

    SetQuestion(question){
        //check if input is a string
        if(typeof question != "string")
        {
            throw new Error("You cannot input question as a non string");  
        }
        this.#question = question;
    }

    GetAnswer(){
        return this.#answer;
    }

    SetAnswer(answer){
        //check if input is a string
        if(typeof answer != "string")
        {
            throw new Error("You cannot input answer as a non string");  
        }
        this.#answer = answer;
    }
}

class CMultipleChoiceQuestion extends CQuestion{
    #choices;
    #correctChoice;

    constructor(question, answer, choices){
        super();
        this.SetQuestion(question);
        this.SetAnswer(answer);

        //check if choices is an object(which includes array)
        if(typeof choices != "object")
        {
            //if not throw an error
            throw new Error("Cannot input choices as a non array");
        }

        this.#correctChoice = new Array;
        for(let i = 0; i < choices.length; ++i)
        {
            //check if choices is an array of strings
            if(typeof choices[i] != "string")
            {
                //if not throw an error
                throw new Error("choices cannot contain non string");
            }

            //check if answer is in choices
            if(answer.localeCompare(choices[i]))
            {
                this.#correctChoice.push(choices[i]);
            }
        }

        //if answer is not in choices
        if(this.#correctChoice.length == 0)
        {
            //throw an error
            throw new Error("answer is not in list of choices");
        }

        this.#choices = [...choices];
    }

    CheckWithCorrectChoice(input){
        for(let i = 0; i < this.#correctChoice.length; ++i)
        {
            if(input.localeCompare(this.#correctChoice[i]))
            {
                return true;
            }
        }
        return false;
    }

    GetChoices()
    {
        return this.#choices
    }

    ShuffleChoices()
    {
        //we use the Fisher-Yates shuffle
        let currentIndex = this.#choices.length,  randomIndex;

         // While there remain elements to shuffle.
        while (currentIndex != 0) {
            // Pick a remaining element.
            randomIndex = GetRandomInteger(0, currentIndex);
            --currentIndex;

            // And swap it with the current element.
            [this.#choices[currentIndex], this.#choices[randomIndex]] = [this.#choices[randomIndex], this.#choices[currentIndex]];
        }
    }
}

//implementation to quiz
let quizBody;
let questions = new Array;
let questionsToAsk = new Array;
let currentQuestion;
let questionNumber;
let currentCookieName;

function Init(){
    //init elements to put in variables
    quizBody = document.querySelector("#quiz-body");

    //init the name of cookie
    let tempCookieArray = document.cookie.split(';');
    currentCookieName = "ans" + tempCookieArray.length;

    //add all questions to array
    questions.push(new CMultipleChoiceQuestion("What is a CPU?", //question
    "A CPU is the electronic circuitry that executes instructions comprising a computer program.", //answer
    //choices
    ["A CPU is electronic circuitry that executes instructions comprising a computer program.",
    "A CPU is a processor that executes instructions from a computer.",
    "A CPU is Central Processing Unit.",
    "A CPU is electronic circuitry that processes data to output results"]
    ))


    currentQuestion = questions[0];
    questionNumber = 1;
    SetQuestion(currentQuestion);
}

function EndGame()
{
    quizBody.innerHTML = "";
    let node = document.createElement("h1");
    node.innerHTML = "Your Score: " + GetCookie(currentCookieName).split("=")[1];
}

function SetQuestion()
{
    let choices = currentQuestion.GetChoices();
    if(!(currentQuestion instanceof CQuestion))
    {
        throw new Error("Cannot set currentQuestion with non CQuestion")
    }
    //Set what is asking the currentQuestion which will be a h1 in #quiz-body
    document.querySelector("#quiz-body h1").innerHTML = currentQuestion.GetQuestion();
   
    let choiceNode;
    let node;
    //Create choices
    for(let i = 1; i <= choices.length; ++i)
    {
        //create the button
        choiceNode = document.createElement("button");
        choiceNode.type = "button";
        choiceNode.value = i;
        choiceNode.id = i;
        choiceNode.classList = "flexbox flex-row flex-center-vertical choice";
        quizBody.appendChild(choiceNode);

        //append the choice number display
        node = document.createElement("div");
        node.innerHTML = i;
        node.classList = "choice-number flexbox flex-center";
        choiceNode.appendChild(node);

        //append the choice label
        node = document.createElement("label");
        node.for = i;
        node.innerHTML = choices[i - 1];
        choiceNode.appendChild(node);

        //add an event listener on the button
        choiceNode.addEventListener("click", ()=>{
            //create a cookie based on answer
            if(currentQuestion.CheckWithCorrectChoice(node.innerHTML) == false)
            {
                if(questionNumber > 1)
                {
                    document.cookie = GetCookie("ans" + currentCookieName) + " 0"
                }
                else
                {
                    SetCookie("ans" + currentCookieName, "0", 2);
                }
            }
            else
            {
                if(questionNumber > 1)
                {
                    document.cookie = GetCookie(currentCookieName) + " 1"
                }
                else
                {
                    SetCookie("ans" + currentCookieName, "1", 2);
                }
            }

            ++questionNumber;
            if(questionNumber <= questions.length)
            {
                currentQuestion = questions[questionNumber - 1];
                SetQuestion(currentQuestion);
            }
            else
            {
                EndGame();
            }
        })
    }
}

document.addEventListener("DOMContentLoaded", Init);