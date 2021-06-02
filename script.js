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

        var arr = []
        var ab = $("abv", this);
        ab.each(function () {
            arr.push($(this).text())
        })

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

    });

    var table = $("#results").DataTable({

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
                render: function (d, t, r, m) {
                    r.name = "<a href=" + r.url + ">" + r.name + "</a>"
                    return r.name;
                },
            },
        ],
        "deferRender": true,
        initComplete: function () {
            // var toggle = table.columns($(this).attr("data-column"))
            // console.log(toggle)
            var abv = this.api().column(3);
            console.log(abv)
            var columns = this.api($("#results")).data();
            console.log(columns)

            $('#but_showhide').click(function () {
                var checked_arr = []; var unchecked_arr = [];
        
                // Read all checked checkboxes
                $.each($('input[type="checkbox"]:checked'), function (key, value) {
                    checked_arr.push(this.value);
                });
        
                // Read all unchecked checkboxes
                $.each($('input[type="checkbox"]:not(:checked)'), function (key, value) {
                    unchecked_arr.push(this.value);
                });
        
                // Hide the checked columns
                table.columns(checked_arr).visible(false);
        
                // Show the unchecked columns
                table.columns(unchecked_arr).visible(true);
            });



            $('a.toggle-vis').on('click', function (e) {
                e.preventDefault();
                // Get the column API object
                var c = $("<a></a>")
                c.addClass("toggle-vis");
                c.attr("data-column",)
                // Toggle the visibility
                column.visible(!column.visible());
            });

            var name = $('<select id="test" class="filter"><option class="subject" value="">All NAME</option></select>')
            name.appendTo('#triggerName')
                .on('change', function () {
                    var val = $(this).val();
                    columns.search(val ? '' + val + '' : '', true, false).draw();
                });

            var selects = $('<select class="filter"><option value="">All ABVS</option></select>')
                .appendTo('#triggerAbv')
            selects.on('change', function () {
                name.empty().append("<option value=''>All Names</option>")
                for (var i = 0; i < columns.length; i++) {
                    var row = columns[i];
                    console.log(row)

                    var val = $(this).val();
                    console.log(val)
                    // val = val.search("^"+this.value + "$", true,true,false)
                    abv.search(val ? '' + $(this).val() + '' : val, true, false).draw()
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
    // Hide & show columns
});

