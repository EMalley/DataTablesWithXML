var array = [];
var fArray = [];
var data;
function getData() {
    $.ajax({
        type: "GET",
        url: "xmlDemo.xml",
        dataType: "xml",

        error: function (e) {
            alert("An error occurred while processing XML file");
            console.log("XML reading Failed: ", e);
        },
        success: function (response) {
            data = response;
            buildTable(data)
        }
    });
}

function buildTable(response) {
    $(response).find("food").each(function () {

        var url = $('url', this).text();
        var date = $(this).attr('date');
        var item = {
            date: date,
            name: $('name', this).text(),
            price: $('price', this).text(),
            abv: $('abv', this).text(),
            calories: $('calories', this).text(),
            description: $('description', this).text(),
            test: $('test', this).text(),
            url: url
        }

        //console.log(item.date)
        //console.log(array)
        array.push(item);
    });

    $("#results").DataTable({
        data: array,
        columns: [
            {
                "data": "date", render: function (d) {
                    return moment(d).format("MM/DD/YYYY")
                }
            },
            { "data": "name" },
            { "data": "price" },
            { "data": "abv"},
            { "data": "calories" },
            { "data": "description" },
            { "data": "test" }
        ],
        columnDefs: [
            {

                targets: 1,
                render: function (data, t, r, m) {
                   // console.log(data)
                    if (r.name) {
                        r.name = "<a href=" + r.url + ">" + r.name + "</a>"
                    }
                    return data;
                },
                // targets: 5,
                // visible: false,

            },
            {
                targets: 0,
                render: function (data, type, row) {
                 console.log(data)
                }
            }
        ],
        "deferRender": true,
        initComplete: function () {
            var column = this.api().column(6);

            var select = $('<select class="filter"><option value="">All</option></select>')
                .appendTo('#triggerFilter')
                .on('change', function () {
                    var val = $(this).val();
                    //column.search(val ? '^' + $(this).val() + '$' : val, true, false).draw();
                    column.search(val).draw()
                });

            var values = [];
            column.data().toArray().forEach(function (s) {
                s = s.split(',');
                s.forEach(function (d) {
                    if (!~values.indexOf(d)) {
                        values.push(d)
                        select.append('<option value="' + d + '">' + d + '</option>');
                    }
                })
            })

            var columns = this.api().column(1);
            var date = $('<select class="filter"><option value="">All</option></select>')
                .appendTo('#triggerName')
                .on('change', function () {
                    var val = $(this).val();
                    //column.search(val ? '^' + $(this).val() + '$' : val, true, false).draw();
                    columns.search(val).draw()
                });
            var dates = [];
            // console.log(dates)
            columns.data().toArray().forEach(function (s) {
                s = s.split(',');
                s.forEach(function (d) {
                    if (!~dates.indexOf(d)) {
                        dates.push(d)
                        date.append('<option value="' + d + '">' + d + '</option>');
                    }
                })
            })
            ///////////////////////
            var abv = this.api().column(3);
            
            var selects = $('<select class="filter"><option value="">All</option></select>')
                .appendTo('#triggerAbv')
                .on('change', function () {
                     var val = $(this).val();
                    // val = val.search("^"+this.value + "$", true,true,false)
                    //column.search(val ? '^' + $(this).val() + '$' : val, true, false).draw();
                    //abv.search("^" + this.value, true, false, true).draw()
                });
            var foodObj = {
                ft: "French Toast",
                bb: "Berry's Berry",
                bw: "Belgian Waffles",
                hb: "Homestyle Breakfast",
                sbw: "StrawBerry Belgian Waffles",
                habcabc: "HomeStle Test"
            }
            $.each(foodObj, function (a, b) {
                var abvs = [];
                abv.data().toArray().forEach(function (s, t) {
                    s = s.split(',');
                    s.forEach(function (d) {
                        if (!~abvs.indexOf(d)) {
                            abvs.push(d)
                           $("#triggerAbv").on('change', function(){
                              // if(d === a ){
                                   selects.append('<option value="' + d + '">' + b + '</option>');
                                //};
                            }) 
                        }
                    })
                })
            })

        },

    })
}



$(document).ready(function () {
    getData();

})