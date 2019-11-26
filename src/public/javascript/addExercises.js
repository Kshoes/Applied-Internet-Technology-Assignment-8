
let exerciseCount = 0;

document.addEventListener('load', function() {

    document.getElementById('addExerciseButton').addEventListener('click', function() {

    // function addExercise(){
        exerciseCount++;
        const exerciseContainer = document.getElementById("exerciseContainer");

        exerciseContainer.appendChild(document.createTextNode("Exercise " + exerciseCount + " name: "));
        const nameInput = document.createElement("input");
        nameInput.type = "text";
        nameInput.name = "ex" + exerciseCount + "Name";
        exerciseContainer.appendChild(nameInput);

        exerciseContainer.appendChild(document.createTextNode("Sets: "));
        const setsInput = document.createElement("input");
        setsInput.type = "number";
        setsInput.name = "ex" + exerciseCount + "Sets";
        exerciseContainer.appendChild(setsInput);

        exerciseContainer.appendChild(document.createTextNode("Reps: "));
        const repsInput = document.createElement("input");
        repsInput.type = "number";
        repsInput.name = "ex" + exerciseCount + "Reps";
        exerciseContainer.appendChild(repsInput);

        exerciseContainer.appendChild(document.createTextNode("Weight: "));
        const weightInput = document.createElement("input");
        weightInput.type = "number";
        weightInput.name = "ex" + exerciseCount + "Weight";
        exerciseContainer.appendChild(weightInput);
    // }


    });  
})

    // function addExercise(){
    //     exerciseCount++;
    //     const exerciseContainer = document.getElementById("exerciseContainer");

    //     exerciseContainer.appendChild(document.createTextNode("Exercise " + exerciseCount + " name: "));
    //     const nameInput = document.createElement("input");
    //     nameInput.type = "text";
    //     nameInput.name = "ex" + exerciseCount + "Name";
    //     exerciseContainer.appendChild(nameInput);

    //     exerciseContainer.appendChild(document.createTextNode("Sets: "));
    //     const setsInput = document.createElement("input");
    //     setsInput.type = "number";
    //     setsInput.name = "ex" + exerciseCount + "Sets";
    //     exerciseContainer.appendChild(setsInput);

    //     exerciseContainer.appendChild(document.createTextNode("Reps: "));
    //     const repsInput = document.createElement("input");
    //     repsInput.type = "number";
    //     repsInput.name = "ex" + exerciseCount + "Reps";
    //     exerciseContainer.appendChild(repsInput);

    //     exerciseContainer.appendChild(document.createTextNode("Weight: "));
    //     const weightInput = document.createElement("input");
    //     weightInput.type = "number";
    //     weightInput.name = "ex" + exerciseCount + "Weight";
    //     exerciseContainer.appendChild(weightInput);
    // }

function getQuestions() {
    const req = new XMLHttpRequest();

    const url = 'questions/';

    req.open('GET', url);

    // function addToDOM() {
    //     // insert code here
    // }

    // fetch(url)   // alternative
    //      .then(res => res.json())
    //      .then(addToDOM);

    // const res = await fetch(url);    // final form
    // const messages = await res.json();
    // addToDOM(messages);



    req.addEventListener('load', function() {
        console.log(req.status, req.responseText);
        if(req.status >= 200 && req.status < 300) {

            const questions = JSON.parse(req.responseText);
            
            for(const q of questions) {

                const qABlock = document.getElementById('content').appendChild(document.createElement('article')); // question/answer block
                qABlock.className = "qABlock";
                console.log(q + ' ' + q._id);
                qABlock.id = q._id;

                const qDiv = qABlock.appendChild(document.createElement('h3')); // question
                qDiv.textContent = q.question; console.log(q.question);

                const answers = q.answers;  
                const aList = qABlock.appendChild(document.createElement('ul')); // answer list
                for(const a of answers) {
                    const aDiv = aList.appendChild(document.createElement('li'));
                    aDiv.textContent = a;
                }

                const addAnswerBtn = qABlock.appendChild(document.createElement('input')); // create add answer button
                addAnswerBtn.className = "addAnswerBtn";
                addAnswerBtn.type = "button";
                addAnswerBtn.value = "Add an Answer";
                const answerBtns = document.getElementsByClassName("addAnswerBtn");
                for(const a of answerBtns) {
                    a.addEventListener('click', function() {
                        showAnswerModal();
                        const questionId = document.getElementById('question-id'); // set correct question id for answer block
                        questionId.value = a.parentNode.id;
                    });
                }

            }

        }
    });
    req.addEventListener('error', function(evt) {
        document.body.appendChild(document.createTextNode('uh-oh, something went wrong ' + evt));
    });

    // setTimeout - delay call 
    // setInterval - repeat call with specific interval
    // use setTimeout to avoid race conditions

    req.send();
}

// function showQuestionModal() {
//     const questionModal = document.getElementById("modal-question");
//     // questionModal.style.display = "block";
//     // console.log(questionModal.style.display);
//     // console.log(questionModal.classList);
//     questionModal.classList.add('open');
// }

// function showAnswerModal() {
//     const answerModal = document.getElementById("modal-answer");
//     answerModal.classList.add('open');
// }

// function hideModal() {
//     const modals = document.getElementsByClassName("modal");
//     for(const m of modals) {
//         // m.style.display = "none";
//         m.classList.remove('open');
//     }
// }

function submitQuestion() {
    const question = document.getElementById('question-text').value;
    const req = new XMLHttpRequest();
    req.open('POST', '/questions/', true);
    req.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
    req.send('question=' + question);

    req.addEventListener('load', function() {

        const reqResponse = JSON.parse(req.responseText);
        console.log(reqResponse);

        const qABlock = document.getElementById('content').appendChild(document.createElement('article')); // question/answer block
        qABlock.className = "qABlock";
        const qDiv = qABlock.appendChild(document.createElement('h3')); // question
        qDiv.textContent = question;

        qABlock.appendChild(document.createElement('ul')); // create answer list

        console.log(reqResponse._id);
        qABlock.id = reqResponse._id;

        const addAnswerBtn = qABlock.appendChild(document.createElement('input'));
        addAnswerBtn.className = "addAnswerBtn";
        addAnswerBtn.type = "button";
        addAnswerBtn.value = "Add an Answer";

        const answerBtns = document.getElementsByClassName("addAnswerBtn");
        for(const a of answerBtns) {
            a.addEventListener('click', function() {
                showAnswerModal();
                const questionId = document.getElementById('question-id'); // set correct question id for answer block
                questionId.value = a.parentNode.id;
            });
        }

        hideModal();
        // console.log(req.status, req.responseText);
    });
    req.addEventListener('error', function() {
        console.log('error adding new question');
    });

}