//useful functions
//get a random integer
function GetRandomInteger(min, max) {
    //error checking
    if(Number.isInteger(min) == false)
    {
        throw new Error("min cannot be a non integer")
    }
    else if(Number.isInteger(max) == false)
    {
        throw new Error("max cannot be a non integer")
    }
    else if(min > max)
    {
        throw new Error("min cannot exceed max")
    }
    //return a random int
    return Math.floor(Math.random() * (max - min) ) + min;
}

//shuffle an array
function Shuffle(array){
    //check if array is an array
    if(Array.isArray(array) == false)
    {
        //throw error if so
        throw new Error("Cannot shuffle non array")
    }

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
        //we want anser to be an array since there may be multiple answers
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
let currentQuizNumber;
let questionIndicator;

function Init(){
    //init elements to put in variables
    quizBody = document.querySelector("#quiz-body");
    questionIndicator = document.querySelector("#question-indicator");

    //init the name of the current quiz
    currentQuizNumber = "ans" + localStorage.length;

    //add all questions to array
    questions.push(new CMultipleChoiceQuestion("What is a CPU?", //question
    ["A CPU is the electronic circuitry that executes instructions comprising a computer program."], //answer
    //choices
    ["A CPU is electronic circuitry that executes instructions comprising a computer program.",
    "A CPU is a processor that executes instructions from a computer.",
    "A CPU is Central Processing Unit.",
    "A CPU is electronic circuitry that processes data to output results."]
    ));

    questions.push(new CMultipleChoiceQuestion("What is a GPU?", //question
    ["A GPU is a specialized electronic circuit designed to manipulate and alter memory to accelerate the creation of images in a frame buffer intended for output to a display device."], //answer
    //choices
    ["A GPU is a specialized electronic circuit designed to manipulate and alter memory to accelerate the creation of images in a frame buffer intended for output to a display device.",
    "A GPU is a processor that generates images.",
    "A GPU is Graphics Processing Unit.",
    "A GPU is a specialized electronic circuit designed to manipulate and alter memory to create images in a frame buffer intended for output to a display device."]
    ));

    questions.push(new CMultipleChoiceQuestion("What was considered to be the first computer?", //question
    ["The babbage difference engine."], //answer
    //choices
    ["The babbage difference engine.",
    "The abacus.",
    "The universal turing machine.",
    "The differential analyzer."]
    ));

    questions.push(new CMultipleChoiceQuestion("Most microprocessors are made from transistors. True or False.", //question
    ["True"], //answer
    //choices
    ["True",
    "False"]
    ));

    //delete the current quiz storage used if quit abruptly
    unloadEventListener = window.addEventListener("unload", RemoveLocal);

    //shuffle questions
    Shuffle(questions);
    //set the first question
    currentQuestion = questions[0];
    questionNumber = 1;
    SetQuestion(currentQuestion);
}

function RemoveLocal()
{
    localStorage.removeItem(currentQuizNumber);
}

//function that sets up the end of quiz screen
function EndGame()
{
    //create the result array
    let resultArray = localStorage.getItem(currentQuizNumber).split(",");

    //make quiz body into input field
    quizBody.innerHTML = "<p>Press enter to submit name</p><form id='form'><input id='name' type='text'></input></form>";

    document.querySelector("#form").addEventListener("submit", (f) => {
        f.preventDefault(); //prevent default behaviour of submit event
        window.removeEventListener("unload", RemoveLocal)
        localStorage.setItem(currentQuizNumber, localStorage.getItem(currentQuizNumber) + "," + document.querySelector("#name").value)
        window.location.href = "./quiz.html";
    });

    //create the score indicator
    let node = document.createElement("h1");

    let score = 0;
    //get the score
    for(let i = 0; i < resultArray.length; ++i)
    {
        score += parseInt(resultArray[i]);
    }
    //set the score
    node.innerHTML = "Your Score: " + score + "/" + resultArray.length;
    quizBody.appendChild(node);

    //create the full results view
    let resultBox = document.createElement("div");
    resultBox.classList.add("flexbox", "flex-row", "flex-center");
    resultBox.id = "results-full";
    for(let i = 0; i < questions.length; ++i)
    {
        node = document.createElement("div");
        node.classList.add("results-box");
        if(resultArray[i] === "0")
        {
            node.classList.add("results-box-wrong")
        }
        else
        {
            node.classList.add("results-box-correct")
        }

        node.innerHTML = "<div class='results-box-number flexbox flex-center'>" + (i + 1)+ "</div>"; //can also add elements like this
        resultBox.appendChild(node);
    }
    quizBody.appendChild(resultBox);

    //create the full results collapse button;
    node = document.createElement("div");
    node.classList.add("results-collapse-button");
    //add event listener
    node.addEventListener("click", () => {
        //to make the results appear
        if(resultBox.classList.contains("slide-in"))
        {
            resultBox.classList.remove("slide-in");
        }
        else
        {
            resultBox.classList.add("slide-in");
        }

        //to make the button rotate
        if(node.classList.contains("rotate-180"))
        {
            node.classList.remove("rotate-180");
        }
        else
        {
            node.classList.add("rotate-180");
        }
    });
    quizBody.insertBefore(node, resultBox);
    
}

//function that sets the current question
function SetQuestion()
{
    //delete buttons if there are any
    let quizBodyInitialLength = quizBody.children.length;
    for(let i = 0; i < quizBodyInitialLength - 2 ; ++i)
    {
        quizBody.removeChild(quizBody.children[1]);
    }

    //get the choices
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
            //store different values into local storage based on answer
            if(currentQuestion.CheckWithCorrectChoice(node.innerHTML) == false)
            {
                if(questionNumber > 1)
                {
                    localStorage.setItem(currentQuizNumber, localStorage.getItem(currentQuizNumber) + ",0")
                }
                else
                {
                    localStorage.setItem(currentQuizNumber, "0");
                }
            }
            else
            {
                if(questionNumber > 1)
                {
                    localStorage.setItem(currentQuizNumber, localStorage.getItem(currentQuizNumber) + ",1")
                }
                else
                {
                    localStorage.setItem(currentQuizNumber, "0");
                }
            }

            ++questionNumber;
            //if not after last question
            if(questionNumber <= questions.length)
            {
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

//run init on DOMContentLoaded
document.addEventListener("DOMContentLoaded", Init);