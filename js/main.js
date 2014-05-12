(function ($) {

var parser,
    parser2,
    grammarEditor,
    sourceEditor,
    alert_classes = 'alert-info alert-success alert-danger alert-warning';

var printOut = function (str) { $("#out").html(str); };

$(document).ready(function () {
    $('#myTab a').click(function (e) {
      e.preventDefault();
      $(this).tab('show');
    })
    $("#process_btn").click(processGrammar);
    $("#parse_btn").click(runParser);
    //$("#grammar").linedtextarea();
    grammarEditor = CodeMirror.fromTextArea(grammar, {
        mode:  "javascript",
        theme: "neat",
        lineNumbers: true
    });
    grammarEditor
    grammarEditor.setSize('auto', 500);

    sourceEditor = CodeMirror.fromTextArea(source, {
        //mode:  "javascript",
        theme: "neat",
        lineNumbers: true
    });
    /*$("#examples").change(function(ev) {
        var file = this.options[this.selectedIndex].value;
        $(document.body).addClass("loading");
        $.get("/jison/examples/"+file, function (data) {
                $("#grammar").val(data);
                $(document.body).removeClass("loading");
            });
    });*/
});

function processGrammar () {
    var type = "lalr";
    var grammar = grammarEditor.getValue();
    try {
        var cfg = JSON.parse(grammar);
    } catch(e) {
        try {
            var cfg = bnf.parse(grammar);
        } catch (e) {
            $("#gen_out").html("Оей, что-то пошло не так...\n"+e).parent().removeClass(alert_classes).addClass('alert-danger');
            $("#out").html('Сначала сгенерируйте парсер').parent().removeClass('alert_classes').addClass('alert-info');
            $("#parse_btn,#download_btn").prop('disabled', true);
            return;
        }
    }

    Jison.print = function () {};
    parser = Jison.Generator(cfg, {type: type});

    $("#out").removeClass("good").removeClass("bad").html('');
    $("#gen_out").removeClass("good").removeClass("bad");
    if (!parser.conflicts) {
        $("#gen_out").html('Парсер успешно сгенерирован!').parent().removeClass(alert_classes).addClass('alert-success');
        $("#out").html('Скрипт еще не запускался').parent().removeClass('alert_classes').addClass('alert-info');
        $("#parse_btn,#download_btn").prop('disabled', false);
    } else {
        $("#gen_out").html('Найденные конфликты:<br/>').removeClass('alert_classes').addClass('alert-warning');
        $("#out").html('Сначала сгенерируйте парсер').parent().removeClass('alert_classes').addClass('alert-info');
        $("#parse_btn,#download_btn").prop('disabled', true);
    }

    $("#download_btn").click(function () {
            window.location.href = "data:application/javascript;charset=utf-8;base64,"+Base64.encode(parser.generate());
        }).removeAttr('disabled');

    parser.resolutions.forEach(function (res) {
        var r = res[2];
        if (!r.bydefault) return;
        $("#gen_out").append(r.msg+"\n"+"("+r.s+", "+r.r+") -> "+r.action);
    });

    parser2 = parser.createParser();
}

function runParser () {
    if (!parser) processGrammar();
    printOut("Parsing...");
    var source = sourceEditor.getValue();
    try {
        $("#out").parent().removeClass(alert_classes).addClass('alert-success');
        printOut(JSON.stringify(parser2.parse(source)));
    } catch(e) {
        $("#out").parent().removeClass(alert_classes).addClass('alert-danger');
        printOut("Оей, что-то пошло не так...\n" + (e.message || e));
    }
}

})(jQuery);