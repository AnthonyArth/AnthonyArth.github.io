import { CMultipleChoiceQuestion} from "./CMultipleChoiceQuestion";

let questions = new Array;
let currentQuestion;

function Init(){
    let question;

    question = new CMultipleChoiceQuestion("What is a CPU", "B", ["A", "B", "C", "D"]);

    document.querySelector("#quiz-body h1").innerHTML = question.GetQuestion();
}

document.addEventListener("DOMContentLoaded", Init);