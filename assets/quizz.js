var answers = [];
var questionIndex = 1;

// Public

const start = function () {
    var hash = window.location.hash;

    if (hash) {
        answers = atob(hash.substr(1, hash.length-1)).split(',');
        questionIndex = answers.length + 1;
    }

    question();
};

const question = function () {
    $.getJSON('/assets/questions.json', function(data) {

        if (questionIndex > data.length) {
            displayResult();
            return;
        }

        var question = data[questionIndex - 1];
        showQuestion(question)
    });
};

const nextQuestion = function () {
    const answer = $('input[name=answer]:checked', '#form').val();

    if (answer === undefined) {
        return;
    }

    saveAnswer(answer);
    questionIndex++;
    question();
}

const displayResult = function () {
    window.location = 'result.html?answers=' + btoa(answers.join(','));
};

const parseAnswers = function () {
    return atob(getUrlParameter('answers'))
        .split(",")
        .reduce(function (acc, value) {
            acc[value] += 1;
            return acc;
        }, { connard : 0, tocard : 0 });
};


// Private

const showQuestion = function (question) {
    $('#number .index').text(questionIndex);

    $('#question').text(question.question);

    $('#answers').empty();
    for(var i= 0; i < question.answers.length; i++)
    {
        var answer = question.answers[i];
        $('#answers').append(
            '<li class="answer btn btn-secondary">' +
            '    <input type="radio" id="answer'+i+'" name="answer" value="'+answer.value+'" />' +
            '    <label for="answer'+i+'">'+answer.text+'</label>' +
            '</li>'
        );
    }
};

const saveAnswer = function (answer) {
    answers[questionIndex-1] = answer;
    window.location.href = 'quizz.html#' + btoa(answers.join(','));
};

const getUrlParameter = function getUrlParameter(sParam) {
    var sPageURL = decodeURIComponent(window.location.search.substring(1)),
        sURLVariables = sPageURL.split('&'),
        sParameterName,
        i;

    for (i = 0; i < sURLVariables.length; i++) {
        sParameterName = sURLVariables[i].split('=');

        if (sParameterName[0] === sParam) {
            return sParameterName[1] === undefined ? true : sParameterName[1];
        }
    }
};
