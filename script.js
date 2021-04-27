var array = [];
var fArray = [];
var data;
var n;
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

        //console.log($("abv", this))
        var arr = []
        var ab = $("abv", this);
        ab.each(function () {
            arr.push($(this).text())
        })


        //console.log(arr)
        // console.log(result)

        var url = $('url', this).text();
        var date = $(this).attr('date');
        var item = {
            date: date,
            name: $('name', this).text(),
            price: $('price', this).text(),
            abv: arr,
            calories: $('calories', this).text(),
            description: $('description', this).text(),
            test: $('test', this).text(),
            url: url
        }
        array.push(item);
        //console.log(array)
    });

    $("#results").DataTable({
        data: array,
        autowidth: false,
        columns: [
            {
                "data": "date", className: "date", render: function (d) {
                    return moment(d).format("MM/DD/YYYY")
                }
            },
            { "data": "name", className: "px200" },
            { "data": "price", className: "px200" },
            { "data": "abv", className: "px200" },
            { "data": "calories", className: "px200" },
            { "data": "description", className: "px200" },
            { "data": "test", className: "px200" },
            { "data": "url", className: "px200" },

        ],
        columnDefs: [
            {
                targets: 1,
                //autowidth:false,
                render: function (d, t, r, m) {
                    //  console.log(r)

                    r.name = "<a href=" + r.url + ">" + r.name + "</a>"

                    return r.name;
                },
                // render: function (d, t, r) { return d.substr(0, 30); },
                // targets: 1,
            },
            // { targets: 1, render: function (d, t, r) { return d.substr(0, 30); } }

        ],
        "deferRender": true,
        initComplete: function () {
            var abv = this.api().column(3);
            //console.log(abv)
            var columns = this.api($("#results")).data();



            var name = $('<select id="test" class="filter"><option class="subject" value="">All NAME</option></select>')
            name.appendTo('#triggerName')
                .on('change', function () {
                    var val = $(this).val();
                    columns.search(val ? '' + val + '' : '', true, false).draw();
                    //columns.search(val).draw()
                });

            var selects = $('<select class="filter"><option value="">All ABVS</option></select>')
                .appendTo('#triggerAbv')
            selects.on('change', function () {
                name.empty().append("<option value=''>All Names</option>")
                for (var i = 0; i < columns.length; i++) {
                    var row = columns[i];
                    //console.log(row.abv)

                    var val = $(this).val();
                    console.log(val)
                    // val = val.search("^"+this.value + "$", true,true,false)
                    abv.search(val ? '' + $(this).val() + '' : val, true, false).draw()
                    //console.log(row)
                    for (var j = 0; j < row.abv.length; j++) {
                        var a = row.abv[j];
                        console.log(a)
                        if (val === a) {
                            name.append('<option>' + row.description + '</option>');
                        }
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
                //get description based off of the ABV chosen.
                var arr = []
                for (var j = 0; j < columns.length; j++) {
                    var abv = columns[j].abv;
                    for (var t = 0; t < abv.length; t++) {
                        var x = abv[t]

                        if (x === a) {
                            //remove duplicates
                            var seen = {};
                            selects.children().each(function () {
                                var txt = $(this).text();
                                if (seen[txt])
                                    $(this).remove();
                                else
                                    seen[txt] = true;
                            });
                            //append option to selection
                            selects.append("<option value=" + x + ">" + b + "</option>")
                            //console.log(selects)
                        }
                    }
                }
            })
        },

    })
}


// console.log(a)
// for (var j = 0; j < columns.length; j++){
//     var row = columns[j];
//     console.log(row.abv);

//     if(row.abv === a){
//         selects.append('<option value="' +  + '">' + b + '</option>')
//     }
// }



$(document).ready(function () {
    getData();
})
