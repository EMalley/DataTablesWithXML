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
        array.push(item);
    });

    var table = $("#results").DataTable({
        data: array,
        columns: [
            {
                "data": "date", render: function (d) {
                    return moment(d).format("MM/DD/YYYY")
                }
            },
            { "data": "name" },
            { "data": "price" },
            { "data": "abv" },
            { "data": "calories" },
            {
                "data": "description"
            },
            { "data": "test" },
            { "data": "url" },

        ],
        columnDefs: [
            {

                targets: 1,
                render: function (data, t, r, m) {
                    // console.log(data)

                    r.name = "<a href=" + r.url + ">" + r.name + "</a>"

                    return r.name;
                },
                // targets: 5,
                // visible: false,

            },

        ],
        "deferRender": true,
        initComplete: function () {
         
            var abv = this.api().column(3);
            var columns = this.api().column(5);
            var val = $(this).val();

            abv.search(val ? '^' + $(this).val() + '$' : val, true, false).draw();

            var selects = $('<select class="filter"><option value="">All</option></select>')
                .appendTo('#triggerAbv')
                .on('change', function () {
                    var val = $(this).val();

                    // val = val.search("^"+this.value + "$", true,true,false)
                    abv.search(val ? '^' + $(this).val() + '$' : val, true, false).draw()
                });

            var name = $('<select class="filter"><option value="">All</option></select>')
                name.appendTo('#triggerName')
                    .on('change', function () {
                        var val = $(this).val();

                        //column.search(val ? '^' + $(this).val() + '$' : val, true, false).draw();
                        columns.search(val).draw()
                    });
    
            var names = [];
            columns.data().toArray().forEach(function (t) {
                console.log
                t = t.split('""');
                t.forEach(function (h) {
                    if (!~names.indexOf(h)) {
                        names.push(h)
                        name.append('<option value="' + h + '">' + h + '</option>');
                    }
                })
            })

            /////////////////////////
            var foodObj = {
                ft: "French Toast",
                bb: "Berry's Berry",
                bw: "Belgian Waffles",
                hb: "Homestyle Breakfast",
                sbw: "StrawBerry Belgian Waffles",
                habcabc: "HomeStle Test"
            }
            $.each(foodObj, function (a, b) {
                var abvs = []
                //get description based off of the ABV chosen. 

                abv.data().toArray().forEach(function (s) {
                    s = s.split(',');
                    s.forEach(function (d) {
                        //console.log(i)
                        if (!~abvs.indexOf(d)) {
                            abvs.push(d)
                            //console.log(abvs)
                            if (d === a) {
                                selects.append('<option value="' + a + '">' + b + '</option>');
                                // $("#triggerName").append('<option value="' + b + '">' + h + '</option>');
                            }
                        }
                    });

                })
            })
        },

    })
}
// t.forEach(function (h) {
//     if (!~names.indexOf(h)) {
//         names.push(h)
//          if (d === a) {
//         name.append('<option value="' + d + '">' + h + '</option>');
//         }
//     }
// })



$(document).ready(function () {
    getData();

})



