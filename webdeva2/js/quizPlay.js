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
    #choices;

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
        //check if answer is an array
        if(Array.isArray(answer) == false)
        {
            //if not throw an error
            throw new Error("Cannot input answer as a non array");
        }
        this.#answer = answer;
    }

    SetChoices(choices)
    {
        //check if choices is an array
        if(Array.isArray(choices) == false)
        {
            //if not throw an error
            throw new Error("Cannot input choices as a non array");
        }

        for(let i = 0; i < choices.length; ++i)
        {
            //check if choices is an array of strings
            if(typeof choices[i] != "string")
            {
                //if not throw an error
                throw new Error("choices cannot contain non string");
            }
        }
        this.#choices = [...choices];
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

class CMultipleChoiceQuestion extends CQuestion{
    constructor(question, answer, choices){
        super();
        this.SetQuestion(question);
        this.SetAnswer(answer);

        let correctChoice = new Array;
        for(let i = 0; i < choices.length; ++i)
        {
            for(let x = 0; x < answer.length; ++x)
            {
                //check if answer is in choices
                if(answer[x].localeCompare(choices[i]))
                {
                    correctChoice.push(choices[i]);
                }
            }
        }

        //if answer is not in choices
        if(correctChoice.length == 0)
        {
            //throw an error
            throw new Error("answer is not in list of choices");
        }

        this.SetChoices(choices);
    }

    CheckWithCorrectChoice(input){
        //since this is not a checkbox question we just return true if the correct choice is found
        for(let i = 0; i < this.GetAnswer().length; ++i)
        {
            if(input.localeCompare(this.GetAnswer()[i]))
            {
                return true;
            }
        }
        return false;
    }
}

//implementation to quiz
let quizBody;
let questions = new Array;
let questionsToAsk = new Array;
let currentQuestion;
let questionNumber;
let currentCookieName;
let questionIndicator

function Init(){
    //init elements to put in variables
    quizBody = document.querySelector("#quiz-body");
    questionIndicator = document.querySelector("#question-indicator");

    //init the name of cookie
    let tempCookieArray = document.cookie.split(';');
    currentCookieName = "ans" + tempCookieArray.length;

    //add all questions to array
    questions.push(new CMultipleChoiceQuestion("What is a CPU?", //question
    ["A CPU is the electronic circuitry that executes instructions comprising a computer program."], //answer
    //choices
    ["A CPU is electronic circuitry that executes instructions comprising a computer program.",
    "A CPU is a processor that executes instructions from a computer.",
    "A CPU is Central Processing Unit.",
    "A CPU is electronic circuitry that processes data to output results."]
    ))

    questions.push(new CMultipleChoiceQuestion("What is a GPU", //question
    ["A GPU is a specialized electronic circuit designed to manipulate and alter memory to accelerate the creation of images in a frame buffer intended for output to a display device."], //answer
    //choices
    ["A GPU is a specialized electronic circuit designed to manipulate and alter memory to accelerate the creation of images in a frame buffer intended for output to a display device.",
    "A GPU is a processor that generates images.",
    "A GPU is Graphics Processing Unit.",
    "A GPU is a specialized electronic circuit designed to manipulate and alter memory to create images in a frame buffer intended for output to a display device."]
    ))

    questions.push(new CMultipleChoiceQuestion("What was considered to be the first computer", //question
    ["The babbage difference engine."], //answer
    //choices
    ["The babbage difference engine.",
    "The abacus.",
    "The universal turing machine.",
    "The differential analyzer."]
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
    quizBody.appendChild(node);
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

    //before creating the choices we shuffle them
    currentQuestion.ShuffleChoices();
   
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
        quizBody.insertBefore(choiceNode, quizBody.children[i]);

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
                    document.cookie = GetCookie(currentCookieName) + ",0"
                }
                else
                {
                    SetCookie(currentCookieName, "0", 2);
                }
            }
            else
            {
                if(questionNumber > 1)
                {
                    document.cookie = GetCookie(currentCookieName) + ",1"
                }
                else
                {
                    SetCookie(currentCookieName, "1", 2);
                }
            }

            ++questionNumber;
            //if not after last question
            if(questionNumber <= questions.length)
            {
                //delete buttons
                let quizBodyInitialLength = quizBody.children.length;
                for(let i = 0; i < quizBodyInitialLength - 2 ; ++i)
                {
                    quizBody.removeChild(quizBody.children[1]);
                }

                //go to the next question
                currentQuestion = questions[questionNumber - 1];
                SetQuestion(currentQuestion);
            }
            else
            {
                //end the quizS
                EndGame();
            }
        })
    }

    document.querySelector("#question-indicator").innerHTML = questionNumber + "/" + questions.length;
}

document.addEventListener("DOMContentLoaded", Init);