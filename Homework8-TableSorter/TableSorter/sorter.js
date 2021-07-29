/* 
  Homework 8 - Table Sorter
  廖雨轩 18322043

  All the comments are below. 
*/
// use regular expression to trim string
function regularTrim(str) {
    return str.replace(/[<][t][d][>]/g, "").replace(/[<][/][t][d][>]/g, "");
}

// use an array as hash table to store the boolean condition if it's ascending
let ascending = new Array();
for (let i = 0; i < $("th").length; i++) {
    ascending.push(false);
}

// make sure that jquery and lodash are loaded, then excute the function
($ || _)(function () {
    for (let i = 0; i < $("th").length; i++) {
        $(`th:nth-child(${i + 1})`).click(function (e) {
            // get an array of th's innerHTML to get index
            let tmp = _.map($("th"), (e) => {
                return e.innerHTML;
            });
            let index = tmp.indexOf(e.target.innerHTML);

            // get the rows under that th
            let todoData = $(e.target).parents("table").children("tbody").find("tr");
            todoData = _.sortBy(todoData, (e) => {
                return e.cells[i].outerHTML;
            });

            // remove the column data then fill the sorted data
            $(e.target).parents("table").children("tbody").find("tr").remove();

            if (ascending[index] === false) {
                // if it's not ascending, then make it sorted and clear other columns' condition
                _.fill(ascending, false);
                for (let j = 0; j < ascending.length; j++) {
                    $(`th:eq(${j})`).removeClass('active');
                }
                ascending[index] = true;
                $(`th:eq(${index})`).addClass('active');
                $('img').remove();
                $(`th:eq(${index})`).append('<img src="assets/ascend.png" alt="▲" class="denote">');
                for (let j = 0; j < todoData.length; j++) {
                    // use append to make sure it's ascending
                    $(e.target).parents("table").children("tbody").append(todoData[j]);
                }
            } else if (ascending[index] === true) {
                // if it's already ascending, clear all columns' condition
                _.fill(ascending, false);
                $('img').remove();
                $(`th:eq(${index})`).append('<img src="assets/descend.png" alt="▼" class="denote">');
                for (let j = 0; j < todoData.length; j++) {
                    // use prepend to make sure it's desending
                    $(e.target).parents("table").children("tbody").prepend(todoData[j]);
                }
            }
        });
    }
});
