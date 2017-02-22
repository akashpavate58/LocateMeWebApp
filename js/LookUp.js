var LABEL;


$(document).ready(function () {

    $('#qr_Code').attr('src', 'https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=' + location.href);

    $('#QRDownload').click(function () {
        var size = $('#QRSize').val();
        console.log(size);
        var a = $('<a>').attr('href', 'https://api.qrserver.com/v1/create-qr-code/?size=' + size + 'x' + size + '&data=' + location.href)
               .attr('download', 'qrcode.png');

        a[0].click();
    });

});

function initMap() {
    LABEL = decodeURIComponent($.urlParam('q'));
    console.log(LABEL);

    $.ajax({
        type: "GET",

        url: ServiceBaseUrl + "/api/Address/" + LABEL,

        success: function (data, status, xhr) {
            console.log(data);
            setAddress(data);
        },

        error: function (xhr, status, err) {
            console.log(xhr);
        }
    });

    
}

function setAddress(addr)
{
    var gloc = addr.Address.Pin;
    var map = new google.maps.Map(document.getElementById('map'), {
        zoom: 13,
        center: gloc
    });
    var marker = new google.maps.Marker({
        position: gloc,
        map: map
    });

    
    $('#Addr-Title').html(addr.Address.Title);
    $('#Addr-Desc').html(RenderAddressText(addr.Address));
    $('#Btn_Navigation').attr('href', 'http://maps.google.com/maps?daddr='+ gloc.lat +','+ gloc.lng +'');
}

function RenderAddressText(addr) {
    var NN = '<br />';
    return addr.Line1 + ', ' + addr.Line2 + NN + addr.City + ', ' + addr.State + ', ' + addr.ZipCode + NN +
            'Phone: ' + addr.Phone;
}

function onSizeSelectionChanged(val)
{
    console.log(val);
}

//function SendMail() {
//    var MailData = {
//             personalizations: [
//                 {
//                     to: [
//                         {
//                             email: "akashpavate58@gmail.com"
//                         }
//                     ],
//                     subject: "Hello, World!"
//                 }
//             ],
//             from: {
//                 email: "akshatasn411@gmail.com"
//             },
             
//             content: [
//                 {
//                     type: "text/plain", 
//                     value: "Heya!"
//                 }
//             ]
//    };

//    console.log(MailData);

//    $.ajax({
//        type: "POST",

//        url: "https://api.sendgrid.com/v3/mail/send",

//        headers: {
//            Authorization: "Bearer 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",
//            'Access-Control-Allow-Origin': 'https://sendgrid.api-docs.io',
//            'Access-Control-Allow-Headers': 'Authorization, Content-Type, On-behalf-of, x-sg-elas-acl',
//            'X-No-CORS-Reason': 'https://sendgrid.com/docs/Classroom/Basics/API/cors.html'

//        },
//        contentType: 'application/json',
//        data: MailData,

//        success: function (data, status, xhr) {
//            console.log(data);
//        },

//        error: function (xhr, status, err) {
//            console.log(xhr);
//        }
//    });
//}