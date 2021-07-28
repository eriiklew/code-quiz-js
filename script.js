const startBtn = document.querySelector("#startBtn");
const prevBtn = document.querySelector("#prev");
const nextBtn = document.querySelector("#next");
const question = document.querySelector("#question");
const answers = document.querySelector("#answers");
const wrapper = document.getElementsByTagName('main')[0];
var scores;
const storeScores = []
const count = 3*60*1000
var index = 0
var selectedAnswers = []
var answerSelected = false

prevBtn.style.visibility = "hidden"
nextBtn.style.visibility = "hidden"


function checkStorage() {
    if(localStorage.getItem('scores')) {
        scores = JSON.parse(localStorage.getItem('scores'))
    }
}


function startQuiz() {
    timer();
    createProgressBar()
    startBtn.style.display = "none"
    nextBtn.style.visibility = "visible"
    prevBtn.style.visibility = "visible"
    updateUI(index)
    
}




function updateUI(x) {
    answerSelected = false
        question.textContent = questions[x].question;
        while(answers.firstChild) {
            answers.removeChild(answers.firstChild)
        }
        for(i = 0; i < questions[x].answers.length; i++) {
            var label = document.createElement('label')
            var ans = document.createElement("input")
            ans.setAttribute("type", "radio")
            ans.setAttribute('name', 'answer')
            ans.setAttribute('id', `${i}`)
            ans.addEventListener('click', function(e) {
                answerSelected = true
                if(questions[x].correctAnswer === e.target.value) {
                    selectedAnswers[x] = true
                } else {
                    selectedAnswers[x] = false
                }
            })
            ans.value = questions[x].answers[i]
            label.appendChild(ans)
            label.append(`${questions[x].answers[i]}`)
            answers.append(label)
        }
    
}

function nextQuestion() {
    if(answerSelected === false) {
        alert('please select an answer first')
    } else {
        if(index === questions.length - 1) {
            updateUI(index)
            endQuiz()
        } else {
            updateProgressBar(index)
            updateUI(index += 1)
        }
    }
    
}

function endQuiz() {
    while(wrapper.firstChild) wrapper.removeChild(wrapper.firstChild)
    renderResults()
}

function renderResults() {
    const score = document.createElement('h1')
    var count = 0
    for(var i = 0; i < selectedAnswers.length; i++) {
        if(selectedAnswers[i] === true) {
            count += 1
        }
    }
    score.setAttribute('id', 'score')
    score.textContent = `Your Score\n${(count/5 * 100)}%`
    wrapper.appendChild(score)
    renderSaveScore(count)
}

function prevQuestion() {
    if(index !== 0) {
        updateUI(index -= 1)
    }
}

function renderSaveScore(x) {
    checkStorage()
    const ul = document.createElement('ul')
    const saveForm = document.createElement('form');
    const input = document.createElement('input');
    const btn = document.createElement('button');
    const h = document.createElement('h4');
    h.textContent = 'High Scores';

    ul.setAttribute('id', 'scores');
    ul.appendChild(h);
    if(scores.length > 0) {
        for(i=0; i < scores.length; i++) {
            const li = document.createElement('li');
            li.textContent = scores[i];
            ul.appendChild(li);
        }
    }
    saveForm.id = 'saveForm';
    input.id = 'formInput';
    btn.id = 'formBtn';
    btn.type = 'button';
    btn.textContent = 'Save Score';
    btn.addEventListener('click', function() {
        const li = document.createElement('li');
        li.textContent = `${input.value} - ${x/5 *100}%`
        scores.push(`${input.value} - ${x/5 *100}%`)
        
        localStorage.setItem('scores', JSON.stringify(scores))
        ul.append(li)
    })

    saveForm.append(input, btn);
    wrapper.append(saveForm, ul);
}


function createProgressBar() {
    const progressBar = document.createElement('div')
    progressBar.setAttribute('class', 'progressBar')
    const marks = []
    for(var i = 0; i < questions.length; i++) {
        const mark = document.createElement('div')
        mark.setAttribute('class', 'mark')
        progressBar.appendChild(mark)
    }
    wrapper.appendChild(progressBar)
}
function updateProgressBar(x) {
    const mark = document.getElementsByClassName('mark')[x]
    mark.style.backgroundColor = 'lightblue'
}


function timer(){
    const time = document.createElement('h3')
    time.setAttribute('id', 'timer')
    wrapper.appendChild(time)
    var sec = 45;
    var timer = setInterval(function(){
        time.textContent = `Time Left: ${sec}`
        sec--;
        console.log(sec)
        if (sec < 0) {
            clearInterval(timer);
            endQuiz()
        }
        
    }, 1000);
}

startBtn.addEventListener("click", startQuiz)
prevBtn.addEventListener("click", prevQuestion)
nextBtn.addEventListener("click", nextQuestion)

