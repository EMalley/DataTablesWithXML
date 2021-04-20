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
            { "data": "abv" },
            { "data": "calories" },
            {
                "data": "description"
            },
            { "data": "test" },
            { "data": "url" },

        ],
        columnDefs: [

            // {
            //     targets: 1,
            //     "width": "20",
            //     render: function (d, t, r, m) {
            //         // console.log(data)

            //         r.name = "<a href=" + r.url + ">" + r.name + "</a>"

            //         return r.name;
            //     },
            // render: function (d, t, r) { return d.substr(0, 30); },
            // targets: 1,


            //},
            { targets: 1, render: function (d, t, r) { return d.substr(0, 30); } }

        ],
        "deferRender": true,
        initComplete: function () {
            var abv = this.api().column(3);
            var columns = this.api($("#results")).data();

            var name = $('<select id="test" class="filter"><option class="subject" value="">All NAME</option></select>')
            name.appendTo('#triggerName')
                .on('change', function () {
                    var val = $(this).val();
                    //columns.search(val ? '^' + $(this).val() + '$' : val, true, false).draw();
                    columns.search(val).draw()
                });

            var selects = $('<select class="filter"><option value="">All ABVS</option></select>')
                .appendTo('#triggerAbv')
                .on('change', function () {
                    name.empty().append("<option value=>All Names</option>")
                    var val = $(this).val();
                    // val = val.search("^"+this.value + "$", true,true,false)
                    abv.search(val ? '^' + $(this).val() + '$' : val, true, false).draw()
                    for (var i = 0; i < columns.length; i++) {
                        var row = columns[i];
                        if (val == row.abv) {
                            var seen = {};
                            $("option").each(function () {
                                var txt = $(this).text();
                                console.log(txt)
                                if (seen[txt])
                                $(this).remove();
                                else
                                seen[txt] = true;
                            });
                            name.append('<option>' + row.description + '</option>');
                        }

                    }
                });

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
                        if (!~abvs.indexOf(d)) {
                            abvs.push(d)
                            //console.log(row)
                            //console.log(abvs)
                            if (d === a) {
                                selects.append('<option value="' + d + '">' + b + '</option>')
                            }
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
