let jq = document.createElement("script");
let ts = document.createElement("script")

jq.src = "https://s3.pstatp.com/cdn/expire-1-M/jquery/3.4.0/jquery.min.js";

ts.src = "https://cdnjs.cloudflare.com/ajax/libs/jquery.tablesorter/2.31.3/js/jquery.tablesorter.min.js";
document.body.appendChild(jq);
document.body.appendChild(ts);

jq.onload = ts.onload = () => {
    console.log(window.jQuery);
    console.log($("table"));
    $("table").tablesorter()
}

document.querySelector("body").appendChild(ts);

$("body").append('<script src="https://cdnjs.cloudflare.com/ajax/libs/jquery.tablesorter/2.31.3/js/jquery.tablesorter.min.js" defer></script>');

($().tablesorter() != undefined)(function () { $(".t-list table").tablesorter(); });

$(function () {
    $(".t-list table").tablesorter();
});

$("body").append('<script src="https://cdnjs.cloudflare.com/ajax/libs/jquery.tablesorter/2.31.3/js/jquery.tablesorter.min.js" defer></script>');
$(".reference").prepend("<thead>");
$(".reference thead").prepend($(".reference tr:first")[0].outerHTML);
$(".reference tbody tr:first").remove();
$(function () {
    $(".reference").tablesorter();
});

$("body").append('<script src="https://cdnjs.cloudflare.com/ajax/libs/jquery.tablesorter/2.31.3/js/jquery.tablesorter.min.js" defer></script>');
$("#pointbyarea table").prepend("<thead>");
$("#pointbyarea table thead").prepend($("#pointbyarea tr:first")[0].outerHTML);
$("#pointbyarea table tbody tr:first").remove();
$(function () {
    $("#pointbyarea table").tablesorter();
});