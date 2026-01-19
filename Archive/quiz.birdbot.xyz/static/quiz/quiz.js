    function getLeaderboard() {
        $.get("leaderboard").done(data => {
        $("#leaderboard").html(data);
    });
    }

    $(document).ready(function () {
    let questionBox = $("#questionBox");
    let avatar = $("#avatar");
    let form = $("#userSubmitForm");
    let answer = $("#userInput");
    let submit = $("#userSubmit")
    let endCounter = $("#endCounter");
    let questionMenu = $("#questionMenu");
    let questionMenuButton = $("#questionMenuButton");
    let questionNumber = 0;


    toastr.options = {
        showDuration: 100,
        timeOut: 5000,
        positionClass: "toast-bottom-full-width",
        //preventDuplicates: true   //uncomment in production
        progressBar: true,
        newestOnTop: false
    };
    function getAllQuestions() {
        $.get("getAllQuestions")
            .done(data => {
                for(e in data.data){
                    var div_data='<option value='+e+'>'+e+'</option>';
                    questionMenu.append(div_data);
                }
            })
            .fail(() => {
                questionBox.html("<h2>An error occurred, please refresh the page.</h2>")
                           .addClass("text-danger");
            });
    }
    function getQuestion(value) {
        $.get("getQuestion?question="+value)
            .done(data => {
                submit.prop('disabled', false);
                answer.prop('disabled', false);
                submit.html("Submit")
                questionBox.html(`<img src="${data.questionPath}" />`)
                           .removeClass("text-danger");
                questionNumber = data.questionNumber;
                answer.attr('type', data.questionType);
                if (data.hint) {
                    console.log("here");
                    questionBox.append("<blockquote style='border-left: 5px solid #FF0000;'> <h3> result of your code is as follows </h3>"
                    + data.hint +"</blockquote>");
                }
            })
            .fail(() =>
                questionBox.html("<h2>An error occurred, please refresh the page.</h2>")
                           .addClass("text-danger"));
    }

    questionMenu.change(function () {
        questionNumber = this.value;
        getQuestion(this.value)
    });

    function getUserInfo() {
        $.get("getUserInfo").done(data => {
            avatar.attr("src", data.avatar_url);
            let endEventDate = new Date(data.endtime).getTime();
            console.log(endEventDate)
            let x = setInterval(function() {
                let now = new Date()
                let endDistance =  endEventDate - now.getTime();
                let endHours = Math.floor((endDistance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                let endMinutes = Math.floor((endDistance % (1000 * 60 * 60)) / (1000 * 60));
                let endSeconds = Math.floor((endDistance % (1000 * 60)) / 1000);
                if ( endHours > 0) {
                    endCounter.html(endHours + "h " + endMinutes + "m " + endSeconds + "s ");
                } else if ( endMinutes > 0) {
                    if (endCounter.hasClass("text-white"))
                    {
                        endCounter.addClass("text-danger");
                        endCounter.removeClass("text-white")
                    }
                    endCounter.html(endMinutes + "m " + endSeconds + "s ");
                } else if (endSeconds > 0) {
                    endCounter.html(endSeconds + "s ");
                    endCounter.addClass("text-danger");
                } else {
                    endCounter.html("Quiz Has Ended");
                }
            }, 1000);
        });
    }
    function doneHandler(data) {
        if (data.result === "correct") {
            toastr.success("Correct!");
            answer.val("");
        } else if (data.result === "incorrect") {
            toastr.error("Incorrect!");
        } else if (data.result === "invalidRequest") {
            console.error("This incident has been reported to the internet police.");
        } else if (data.result === "wrongQuestion") {
            toastr.info("Seems like you answered this question already, please try to use the same window.");
        } else if (data.result === "quizEnded") {
            window.location.replace("https://birdbot.quiz.com/logout");
        }
    }
    getAllQuestions();
    getQuestion(0);
    getUserInfo();

    form.submit(function (event) {
        let postData = {
            questionNumber: questionNumber
        };
        alert(questionNumber)
        if ((answer.attr("type") === "file"))  {
            var form_data = new FormData($('#userSubmitForm')[0]);
            form_data.append('questionNumber', postData.questionNumber)
            $.ajax({
                type: 'POST',
                url: 'submitQuestion',
                data: form_data,
                contentType: false,
                cache: false,
                processData: false,
                async: false,
            })
            .done(doneHandler)
            .fail(() => {
                toastr.warning("Submitting too quickly!");
            });
            event.preventDefault();
            return;
        } else if (answer.val() === "") {
            toastr.warning("No answer provided!");
            event.preventDefault();
            return;
        } else {
            postData.answer = answer.val()
        }
        $.post({
            url: "submitQuestion",
            data: postData,
            dataType: "json"
        })
        .done(doneHandler)
        .fail(() => {
            toastr.warning("Submitting too quickly!");
        });

        event.preventDefault();
    });

});
