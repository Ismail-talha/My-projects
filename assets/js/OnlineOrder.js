
//alert('f');
var CompanyCode = "POS-87RCHB";
var cities = [];
var _domainPath = 'http://localhost/order/';
var SessionID = sessionStorage.getItem("session");
//var ApiDomainURL = "http://webplugin.marnpos.com/isales.svc/"
var ApiDomainURL = "http://api-v1.marnpos.com/api/"; //"http://app.isalespos.com/api/"; // "http://localhost:3762/api/";//http://app.isalespos.com/api/";

var currentItem = null;
var session = '';
var locationId = 0;
var objWebOrder = null;

var ScreenWidth = jQuery(window).width();
var ScreenHeight = jQuery(window).height();
var ReceiptPanel = "";
var ServerCustomerId = 0;
var LocationLen = 0;


function NewOrder(OrderID, TransactionNo, OrderNo, OfflineOrderID, OrderTakerID, OrderTaker,
                    CustomerID, CustomerName, OrderCreatedDate, OrderType, GuestCount,
                    DeliveryAddress, DeliveryAgentID, DeliveryAgentName, DeliveryTime, Points, Status, SessionID,
                    LocationID, CompanyCode, SyncStatus, isOnline, Mode, Total, itemArray, checkOutArray, CustomerMobile, OrderStatus, OrderTable, SubUserID) {
    this.OrderID = OrderID;
    this.TransactionNo = TransactionNo;
    this.OrderNo = OrderNo;
    this.OfflineOrderID = OfflineOrderID;
    this.OrderTakerID = OrderTakerID;
    this.OrderTaker = OrderTaker;
    this.CustomerID = CustomerID;
    this.CustomerName = CustomerName;
    this.OrderCreatedDate = OrderCreatedDate;
    this.OrderType = OrderType;
    this.GuestCount = GuestCount === null ? 1 : GuestCount;
    this.DeliveryAddress = DeliveryAddress;
    this.DeliveryAgentID = DeliveryAgentID;
    this.DeliveryAgentName = DeliveryAgentName;
    this.DeliveryTime = DeliveryTime;
    this.Points = Points;
    this.Status = Status;
    this.SessionID = SessionID;
    this.LocationID = LocationID;
    this.CompanyCode = CompanyCode;
    this.SyncStatus = SyncStatus;
    this.isOnline = isOnline;
    this.Mode = Mode;
    this.Total = Total;
    this.itemArray = itemArray;
    this.checkOutArray = checkOutArray;
    this.CustomerMobile = CustomerMobile;
    this.OrderStatus = OrderStatus;
    this.OrderTable = OrderTable;
    this.SubUserID = SubUserID;
}


function cModifier(modifierId, name, qty, price, total, status, mode) {
    this.modifierId = modifierId;
    this.name = name;
    this.qty = qty;
    this.price = price;
    this.total = total;
    this.status = status;
    this.mode = mode;
}


DefaultSetting()



function DefaultSetting() {

    document.getElementById("loaderText").innerText = 'Loading branches';
    document.getElementById("PreLoader").removeAttribute("style");

    $('.product-panel .sub-category').attr("style", "display:none");
    $('.product-panel .sub-category .item').attr("style", "display:none");
    $('.product-panel .sub-category .show-modifier').attr("style", "display:none");

    $('#ReturningCustomer').attr("style", "display:none");
    $('#GuestOrder').attr("style", "display:none");
    $('#RegisterYourself').attr("style", "display:none");
    $('.AmtSubTotal').html(0);

       sessionStorage.setItem("lics", CompanyCode);
    console.log(ApiDomainURL + "locationmp/" + sessionStorage.getItem("lics"));
    GetAPI(ApiDomainURL + "locationmp/" + sessionStorage.getItem("lics")).done(function (data) {
        console.log(data);


        if (data.Status === 1) {

            var arr = [];
            var closest = 1;
            var locationsView = '<h4 class="location-prev"></h4><h4 class="location-center"></h4><h4 class="location-next"></h4>';
            locationsView = '';
            cities = [];
            LocationLen = data.LocationsList.length;
            $.each(data.LocationsList, function (i, res) {
                cities.push([res.LocationID.toString(), eval(24.708241).toString(), eval(46.773526).toString(), res.Name]);

                var dfd = $.Deferred();



                var MinOrderAmount = res.MinOrderAmount;
                var DeliveryTime = res.DeliveryTime;
                var DeliveryCharges = res.DeliveryCharges;
                var SessionID = "POS-87RCHB786201708210725007534";//"POS-RK5SFX786201708100912178213";    //res.SessionID;

                locationsView += ' <div><div id="map-' + res.LocationID + '" class="map-box" address="' + res.Address + '" lat="' + eval(24.708241).toString() + '" lng="' + eval(46.773526).toString() + '"></div><img src="../wp-content/themes/therealburger/assets/images/map.png"  lat="' + eval(24.708241).toString() + '" lng="' + eval(46.773526).toString() + '" style="display:none" minOrderAmount="' + MinOrderAmount + '"  deliveryTime="' + DeliveryTime + '" deliveryCharges="' + DeliveryCharges + '" class="images-location-" id="' + i + '" locationid="' + res.LocationID + '" address="' + res.Address + '" sessionId="' + SessionID + '"  location="' + res.Name + '" /><h3>' + res.Name + '</h3></div>';
                arr.push(dfd.resolve());
            });

            $.when.apply($, arr).done(
                function () {

                    //initMap();
                    $('#waterwheelcarousel').html(locationsView);
                    console.log(cities);
                    //document.getElementById("PreLoader").setAttribute("style", "display:none");
                    var LocationImageID = 0;

                    $(document).ready(function () {

                        $('#waterwheelcarousel').slick({
                            centerMode: false,
                            infinite: false,
                            centerPadding: '10px',
                            slidesToShow: 3,
                            speed: 500, focusOnSelect: false,
                            responsive: [{
                                breakpoint: 768,
                                settings: {
                                    arrows: true,
                                    centerMode: false,
                                    centerPadding: '10px',
                                    slidesToShow: 1
                                }
                            }, {
                                breakpoint: 768,
                                settings: {
                                    arrows: true,
                                    centerMode: false,
                                    centerPadding: '10px',
                                    slidesToShow: 1
                                }
                            }]
                        });
                      //  alert('loadMapAll before');
                        loadMapAll();


                        // setTimeout(function(){
                        // locationId = sessionStorage.getItem("locationId");
                        // session = sessionStorage.getItem("sessionId");
                        // // alert("#map-"+locationId);
                        // console.log($("#map-"+locationId).next());
                        // $("#map-"+locationId).next().attr('src', "../wp-content/themes/therealburger/assets/images/select-map.png");

                        // $("#map-"+locationId).next().removeAttr("style");
                        // $("#map-"+locationId).addClass("mapbox-hide");
                        // },1500)

                    });


                    $('#waterwheelcarousel .map-box').click(function () {

                        $('.map-box').removeClass("mapbox-hide");
                        $(this).addClass("mapbox-hide");


                        $('.map-box').next().attr("style", "display:none");
                        $(this).next().removeAttr("style");


                        //  $('#waterwheelcarousel img').attr('src', "../wp-content/themes/therealburger/assets/images/map.png");
                        $(this).next().attr('src', "../wp-content/themes/therealburger/assets/images/select-map.png");


                        var $newCenterItem = $(this).next();
                        setTimeout(function () {

                            locationId = $newCenterItem.attr("locationid");
                            session = $newCenterItem.attr("sessionId");

                            var deliveryCharges = ($newCenterItem.attr("deliveryCharges") === "" || $newCenterItem.attr("deliveryCharges") === null) ? 0 : $newCenterItem.attr("deliveryCharges");
                            var deliveryTime = ($newCenterItem.attr("deliveryTime") === "" || $newCenterItem.attr("deliveryTime") === null) ? 0 : $newCenterItem.attr("deliveryTime");//$newCenterItem.attr("deliveryTime");
                            var minOrderAmount = ($newCenterItem.attr("minOrderAmount") === "" || $newCenterItem.attr("minOrderAmount") === null) ? 0 : $newCenterItem.attr("minOrderAmount");//$newCenterItem.attr("minOrderAmount");

                            // alert(locationId)
                            if (sessionStorage.getItem('objWebOrder') !== null) {
                                objWebOrder = JSON.parse(sessionStorage.getItem('objWebOrder'));
                                $('#' + ReceiptPanel).html(sessionStorage.getItem("receiptPanel"));
                            }
                            else {
                                objWebOrder = null;
                            }



                            sessionStorage.setItem("locationId", locationId);
                            sessionStorage.setItem("session", session);

                            sessionStorage.setItem("deliveryCharges", deliveryCharges);
                            sessionStorage.setItem("deliveryTime", deliveryTime);
                            sessionStorage.setItem("minAmount", minOrderAmount);

                            $('.AmtDelivery').html(deliveryCharges);
                            $('.deliveryTime').html(deliveryTime);
                            $('.minAmount').html(minOrderAmount);

                            //   gotoTab('step2', 2);


                        }, 500);



                    })

                    if (jQuery(window).width() < 767) {
                        ReceiptPanel = "receipt-mobile";
                    } else {
                        ReceiptPanel = "receipt";
                    }

                    // sessionStorage.setItem("receiptPanel", $('#' + ReceiptPanel).html());
                    $('#' + ReceiptPanel).html(sessionStorage.getItem("receiptPanel"));
                    calcInvoice();
                    //SetGridPosition();
                });
        }
        else {
            alert("No location found on api");

        }
    });
}




function RefreshObjectArray() {
    if (objWebOrder !== null) {
        if (objWebOrder.itemArray == [] || objWebOrder.itemArray == null || objWebOrder.itemArray == "") {
            //sessionStorage.setItem("receiptPanel", "");
            //$('#receipt-mobile').html("");
            //$('#receipt').html("");
        }
        else {
            objWebOrder = JSON.parse(sessionStorage.getItem("objWebOrder"));
        }
    }
    else {
        objWebOrder = JSON.parse(sessionStorage.getItem("objWebOrder"));

    }
}

function GetAPI(url) {
    var deferred = $.Deferred();
    var xhr = new XMLHttpRequest();
    $.ajax({
        url: url,
        dataType: "json",
        processData: true,
        crossDomain: true,
        statusCode: {
            404: function (xhr) {
                document.getElementById("PreLoader").setAttribute("style", "display:none");
                MessageBox('There is an error on calling api.');
            }
        },
        beforeSend: function (xhr) {
            xhr.overrideMimeType('application/json');
        },
        success: function (data, xhr) {
            deferred.resolve(data);
        },
        complete: function (data) {
        },
        error: function (model, response) {
            document.getElementById("PreLoader").setAttribute("style", "display:none");
            deferred.reject("HTTP error: " + response.responseText);
        },
        xhrFields: {
            onprogress: function (e) {
            }
        },
    });


    return deferred.promise();
}

function calcInvoice() {
    if (objWebOrder !== null) {
        var subTotal = 0;
        var arr = [];
        $(objWebOrder.itemArray).each(function (index, value) {

            var drd = $.Deferred();
            subTotal += value.totalPrice;

            $(value.modifiersArray).each(function (ind, val) {
                var drd = $.Deferred();
                subTotal += parseFloat(val.total);
                arr.push(drd.resolve());
            });

            arr.push(drd.resolve());
        });



        $.when.apply($, arr).then(
            function () {
                $('.AmtSubTotal').text(subTotal);
                if (subTotal > 0)
                    objWebOrder.Total = parseFloat(sessionStorage.getItem('deliveryCharges')) + parseFloat(subTotal);
                else
                    objWebOrder.Total = 0;
                $('.AmtDelivery').text(sessionStorage.getItem('deliveryCharges'));
                $('.AmtGrandTotal').text(objWebOrder.Total);

                console.log("+++objWebOrder+++");
                console.log(objWebOrder);


                sessionStorage.setItem("objWebOrder", JSON.stringify(objWebOrder));
                //alert($('#' + ReceiptPanel).html());
                if (objWebOrder.itemArray.length > 0) {
                    sessionStorage.setItem("receiptPanel", $('#' + ReceiptPanel).html());
                }





                //  if (jQuery(window).width() < 767) {
                //       ReceiptPanel = "receipt-mobile";
                //  } else {
                //       ReceiptPanel = "receipt";
                //  }
                //  $('#' + ReceiptPanel).html(sessionStorage.getItem("receiptPanel"));
                // calcInvoice();
            });
    }
}

function currentdate() {
    try {
        var currentdate = new Date();
        var datetime = currentdate.getDate() + "/" + (currentdate.getMonth() + 1) + "/" + currentdate.getFullYear() + " ";
        var hours = currentdate.getHours();
        var mint = currentdate.getMinutes();
        var sec = currentdate.getSeconds();
        var time = hours + ":" + mint + ":" + sec;
        return datetime + time;
    }
    catch (ex) {
        alert(ex.message);
    }
}

function CurrentDateSync() {

    //2000-01-01-00-00-00


    var currentdate = new Date();

    var hr = currentdate.getHours().toString().length == 1 ? '0' + currentdate.getHours() : currentdate.getHours();
    var min = currentdate.getMinutes().toString().length == 1 ? '0' + currentdate.getMinutes() : currentdate.getMinutes();
    var sec = currentdate.getSeconds().toString().length === 1 ? '0' + currentdate.getSeconds() : currentdate.getSeconds();

    var year = currentdate.getFullYear().toString().length == 1 ? '0' + currentdate.getFullYear() : currentdate.getFullYear();
    var mon = (currentdate.getMonth() + 1).toString().length == 1 ? '0' + (currentdate.getMonth() + 1) : (currentdate.getMonth() + 1);
    var date = currentdate.getDate().toString().length == 1 ? '0' + currentdate.getDate() : currentdate.getDate();

    var datetime = year + "-" + mon + "-" + date + "-" + hr + "-" + min + "-" + sec



    return datetime;
}

Array.prototype.removeAt = function (index) {
    for (var item in this) {
        if (parseInt(this[item].index) == index) {
            this.splice(item, 1);
            return true;
        }
    }
    return false;
}

Array.prototype.removeModifierAt = function (val) {
    for (var item in this) {
        if (parseInt(this[item].modifierId) == parseInt(val)) {
            this.splice(item, 1);
            return true;
        }
    }
    return false;
}

//order sync api call
function syncToServer() {
    try {
        document.getElementById("loaderText").innerText = 'Saving order';
        document.getElementById("PreLoader").removeAttribute("style");

        var e = document.getElementById("txtGuest_City");
        var city = e.options[e.selectedIndex].value;


        objWebOrder.DeliveryAddress = document.getElementById("txtGuest_PostalCode").value + ", " + document.getElementById("txtGuest_Address").value + ", " + city + ", " + document.getElementById("txtGuest_Country").value;
        ///alert( objWebOrder.DeliveryAddress);
        var deferred = $.Deferred();
        var _url = "" + ApiDomainURL + "order/";
        var data = createOrderJson();
        console.log(data);
        // ---- AJAX Call ---- //
        $.ajax({
            url: _url,
            type: "POST",
            dataType: "json",
            crossDomain: true,
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify(data),
            statusCode: {
                404: function () {
                    document.getElementById("PreLoader").setAttribute("style", "display:none");
                    MessageBox('There is an error on calling api.');

                },
                405: function () {
                    document.getElementById("PreLoader").setAttribute("style", "display:none");
                    MessageBox('There is an error on calling api.');
                }
            },
            beforeSend: function (xhr) {
            },
            success: function (data) {
                document.getElementById("PreLoader").setAttribute("style", "display:none");

                deferred.resolve(data);
            },
            complete: function (data) {
            },
            error: function (response) {
                MessageBox('There is an error on calling api.' + "<br/>Exception Description: " + "XMLHttpRequest cannot load");
                deferred.reject("HTTP error: " + response.responseText);
            }
        });

        return deferred.promise();
        deferred.reject("HTTP error: No New Entry");

    }
    catch (ex) {
        MessageBox('There is an error on calling api.' + "<br/>Exception Description: " + ex.message);
    }
}

//order JSON For Send on API
function createOrderJson() {

    try {
        var objData;
        var orderedItems = [];
        var _Items = objWebOrder.itemArray;


        var arr = [];

        $(objWebOrder.itemArray).each(function (index, value) {
            var dfd = $.Deferred();
            var fmItems = [];
            $(value.modifiersArray).each(function (ind, val) {
                var drd = $.Deferred();
                fmItems.push({ date: currentdate(), "flag": "-", "itemID": parseInt(val.modifierId), "mode": "Add", "name": btoa(unescape(encodeURIComponent(val.name))), "price": parseFloat(val.price), "quantity": parseFloat(val.qty), "status": "102" });
                arr.push(drd.resolve());
            });
            orderedItems.push(new JsonItems(parseFloat(value.price), currentdate(), fmItems, 0, 1, '', parseInt(value.itemId), btoa(unescape(encodeURIComponent(value.name))), 0, "Add", parseFloat(value.quantity), 0, 102));
            arr.push(dfd.resolve());
        });



        $.when.apply($, arr).then(


            function () {
                console.log('done')
                objData = {
                    AgentID: 0,
                    AgentName: "-",
                    CategoryID: 0,
                    CustomerID: parseInt(objWebOrder.CustomerID),
                    Date: CurrentDateSync(),//_Date,
                    GuestCount: 0,
                    Items: orderedItems,
                    Mode: "New",
                    OfflineOrderID: "",
                    OrderNo: 0,
                    OrderStatus: 301,
                    OrderTakerID: "1",
                    OrderType: objWebOrder.OrderType,// "Walk in",
                    ReturnID: 0,
                    Sessionid: sessionStorage.getItem("session"), //"POS-KXCBSG786201608021138147801",// sessionStorage.getItem("session"),
                    TableNO: 0,
                    Transactionno: 0,
                    deliveryAddress: objWebOrder.DeliveryAddress,
                    deliveryTime: ""
                };
                console.log(JSON.stringify(objData));
            }, function () {
                console.log('fail')
            });
        return objData;
    }
    catch (ex) {
        MessageBox("Exception Description: " + ex.message);
    }

}

//set item arrat for order api
function JsonItems(Price, date, fmItems, isComplementory, isTabbed, itemDesc, itemID, itemName, itemType, mode, quantity, serverItemDetailId, status) {
    this.Price = Price;
    this.date = date;
    this.fmItems = fmItems;
    this.isComplementory = isComplementory;
    this.isTabbed = isTabbed;
    this.itemDesc = itemDesc;
    this.itemID = itemID;
    this.itemName = itemName;
    this.itemType = itemType;
    this.mode = mode;
    this.quantity = quantity;
    this.serverItemDetailId = serverItemDetailId;
    this.status = status;
    // this.status = status;
    //this.SubCategoryID = SubCategoryID;
}


var RowItemNo = 0;

function AddModifiers(_this) {


    try {

        var itemid = 0;
        var _items = "";
        if (currentItem !== null) {
            var bool = false;
            $(_this).parent().parent().parent().parent().find('.modifiersRows').each(function (index, value) {
                if ($(this).find('input[type="checkbox"]').prop("checked") === true) {
                    var ModifierId = $(this).attr('ModifierId');
                    var modifierprice = $(this).attr('modifierprice');
                    var Name = $(this).attr('ModifierName');
                    var Qty = $(this).find('.mqty').val();
                    var Total = $(this).find('.MTotal').text();
                    itemid = $(this).attr('itemid');

                    var oModifier = new cModifier(parseInt(ModifierId), Name, parseFloat(Qty), parseFloat(modifierprice), parseFloat(Total), 102, "Add");
                    currentItem.modifiersArray.push(oModifier);


                    _items += '<div class="row row-modifiers" ModifierId="' + ModifierId + '" modifierprice="' + modifierprice + '" Name="' + Name + '" itemid="' + itemid + '"><div class="two wide column "></div><div class="seven wide column modifier-name"><img src="../wp-content/themes/therealburger/assets/images/delete-icon-gray.png" onclick="modifierDelete(this,' + currentItem.index + ',' + ModifierId + ')" style="width: 10px;height: 10px; margin-right:5px;" />' + Name + '</div><div class="four wide column modifier-qty">' + Qty + '</div><div class="three wide column price total">' + Total + '</div></div>';


                }
                else {
                }

            });

        }

        $('#' + ReceiptPanel + ' .pnl-items').each(function (index, value) {
            if (parseInt($(this).attr("index")) === parseInt(currentItem.index)) {
                $(this).next().append(_items);
                calcInvoice();
                $('.product-steps .item').removeClass('active');
                $('.show-modifier').remove();
            }
        });
        // sessionStorage.setItem("receiptPanel", $('#' + ReceiptPanel).html());
    }
    catch (ex) {
        MessageBox("Exception Description: " + ex.message);
    }
}



$('.mobileReceipt').click(function () {

    $('.pusher').removeClass("dimmed");
    $('.RightMenuInvoice').sidebar('setting', 'transition', 'overlay').sidebar('toggle');
    //$('#' + ReceiptPanel).html(sessionStorage.getItem("receiptPanel"));
});


function inti_step2() {

    $('.btn-checkout').html("Continue Order");



    setTimeout(function () {

        calcInvoice();
    }, 1500)


    BindProducts();
}


$(function () {
    $("#accordion").accordion({ header: ".heading-title-accordian", collapsible: true, active: false });
});


function customAccordian(_this, currentVisibleElement) {

    $('#ReturningCustomer').attr("style", "display:none");
    $('#GuestOrder').attr("style", "display:none");
    $('#RegisterYourself').attr("style", "display:none");

    $('.btn-accordian-heading').removeAttr("style");
    $('.heading-title-accordian').removeAttr("style");

    $(_this).attr("style", "display:none");
    $(_this).next().attr("style", "display:none");

    $('#' + currentVisibleElement).removeAttr("style");



}



function SelectOrderType(_this, OrderType) {
    $('.icon-feature i').removeClass("active");
    $(_this).addClass("active");
    console.log("Order Type: " + OrderType);

    if (objWebOrder !== null) {
        objWebOrder.OrderType = OrderType;
    }
}

function continueCheckout() {
   
    // alert('d');
    try {

        if (parseInt(sessionStorage.getItem("minAmount")) >= parseInt($('.AmtSubTotal').html())) {
            MessageBox('You can not continue order. Sub Total Minimum : ' + sessionStorage.getItem("minAmount") + '');
        }
        else {
            // gotoTab('step3', 3);
            $('#step1').attr("style", "display:none");
            $('#step2-2').attr("style", "display:none");
            $('.category').attr("style", "display:none");
           // $('.invoice-panel').attr("style", "display:none");
            $('#invoicepanel').attr("style", "display:none");

            $('#confirmOrder').removeAttr("style");
            $('#mainmenu a').removeClass("active");
            $("#btn-step-3").addClass("active");

            //$('.btn-pick').addClass("active");
            SelectOrderType($('.btn-pickup'), 'pickup')


            $("#eleven").addClass("sisteen").removeClass("eleven");
            $("#five").attr("style", "display:none");
            $("#mainRow").attr("class","ui one column stackable grid");
            
            $("# btn-step-2").attr("style", "pointer-events: none;");
            $("# btn-step-1").attr("style", "pointer-events: none;");

            //Bind Confirm Order
            
            if (ScreenWidth < 767) {

                $('.mobileReceipt').click();
            }




            var _header = `
<div class="column">Products</div>
<div class="column">
<div class="ui grid">
<div class="five wide column align-center">Price</div>
<div class="five wide column align-center">Qty</div>
<div class="six wide column align-center">Total</div>
</div>
</div>
<div class="border-line"></div>
`;


            var _row = "";
            var cInvoiceData = objWebOrder.itemArray;

            for (var i = 0; i < cInvoiceData.length; i++) {
                _row += '<div class="column rowspace">' + cInvoiceData[i].name + ' </div><div class="column rowspace"><div class="ui grid"><div class="five wide column align-center">' + cInvoiceData[i].price + '</div><div class="five wide column align-center">' + cInvoiceData[i].quantity + '</div> <div class="six wide column align-center">' + cInvoiceData[i].totalPrice + '</div></div></div>';

                if (cInvoiceData[i].modifiersArray != null) {
                    for (var j = 0; j < cInvoiceData[i].modifiersArray.length; j++) {
                        //alert('c');
                        _row += '<div class="column rowspace-min cmodifiers"> - ' + cInvoiceData[i].modifiersArray[j].name + ' </div><div class="column rowspace-min cmodifiers"><div class="ui grid"><div class="five wide column align-center">' + cInvoiceData[i].modifiersArray[j].price + '</div><div class="five wide column align-center">' + cInvoiceData[i].modifiersArray[j].qty + '</div> <div class="six wide column align-center">' + cInvoiceData[i].modifiersArray[j].total + '</div></div></div>';
                    }
                }
            }


            var fnalInvoice = _header + _row;

            $('.ciDate').html(objWebOrder.OrderCreatedDate.split(' ')[0]);
            $('.ciTime').html(objWebOrder.OrderCreatedDate.split(' ')[1]);




            $('#ConfirmInvoice').html(fnalInvoice);

            $('html, body').animate({ scrollTop: 650 }, 'fast');
            sessionStorage.setItem("CurrentStep", "step3");
        }

    }
    catch (ex) {
        MessageBox("Exception Description: " + ex.message)
    }
}
function confirmCheckout() {
    try {
        $('#confirmOrder').attr("style", "display:none");
        $('.invoice-panel').removeAttr("style");
        gotoTab('step3', 3);

    }
    catch (ex) {
        MessageBox("Exception Description: " + ex.message)
    }
}





function ContinueCheckoutFromMenu(_this) {
    try {
        if (parseInt(sessionStorage.getItem("minAmount")) >= parseInt($('.AmtSubTotal').text())) {


            MessageBox('You can not continue order. Sub Total Minimum : ' + sessionStorage.getItem("minAmount") + '');


        }
        else {
            // gotoTab('step3', _this);
            continueCheckout();

        }
    }
    catch (ex) {
        MessageBox("Exception Description: " + ex.message);
    }
}

function RemoveMessageBox() {
    $('#messagebox').attr("style", "display:none");
    $('#messagebox1').attr("style", "display:none");
}

//$('.btn-login-dark').on('click', function () {
//    $(".continueCheckout").removeAttr("style");
//    $(".continueCheckout").attr("onclick", "finalCheckout();");
//});

function finalCheckout() {
    try {

        if (objWebOrder.OrderType === '' || objWebOrder.OrderType === undefined || objWebOrder.OrderType === null || objWebOrder.OrderType === 'Web Order') {
            MessageBox('Please Select a Order Type.');
            $("#mobileReceipt").click();
        }
        else {



            syncToServer().done(function (data) {

                try {
                    console.log(data);
                    if (data.Status === 1) {
                        $('.product-panel .sub-category').attr("style", "display:none");
                        $('.product-panel .sub-category .item').attr("style", "display:none");
                        $('.product-panel .sub-category .show-modifier').attr("style", "display:none");

                        $('#ReturningCustomer').attr("style", "display:none");
                        $('#GuestOrder').attr("style", "display:none");
                        $('#RegisterYourself').attr("style", "display:none");


                        sessionStorage.removeItem('receiptPanel');
                        sessionStorage.removeItem('objWebOrder');

                        //calcInvoice();

                        //$("#receipt-mobile").html('');
                        // $("#receipt").html('');
                        //$('.AmtSubTotal').html(0);


                        $('#messagebox').find('.header').html('');
                        $('#messagebox').attr("style", "display:none !important");


                        LocationLen = 0;
                        $('#step2-3').attr("style", "display:none !important");
                        document.getElementById("step-finished").removeAttribute("style");
                        // $('.AmtSubTotal').html(0);
                        objWebOrder = new NewOrder(0, 0, 0, 0, 0, '', 0, '', currentdate(), 'Web Order', 0, '', 0, '', '', 0, 301, session, locationId, sessionStorage.getItem("lics"), 0, 1, 'New', sessionStorage.getItem('deliveryCharges'), [], [], '', 301, 0, 0);
                        session = '';
                        locationId = 0;
                        // ReceiptPanel = "";
                        ServerCustomerId = 0;
                        LocationLen = 0;
                        currentItem = null;

                        $("#pnlOrderStatus").html('Your order has successfully submitted. Your order number is :' + data.OrderNo + " and Transaction No is : " + data.TransactionNO) + "";


                        $(".receipt").attr("style", "pointer-events: none;")


                        //gotoTab('step1', 1);

                    }
                    else {

                        MessageBox(data.Description);
                    }

                }
                catch (ex) {
                    MessageBox("Exception Description: " + ex.message);
                }
            });


        }
    }
    catch (ex) {
        MessageBox("Exception Description: " + ex.message);
    }
}

function newordercontinue() {
    $("#receipt-mobile").html('');
    $("#receipt").html('');
    $('.AmtSubTotal').html(0);

    $('.icon-feature i').removeClass("active");

    $(".continueCheckout").removeAttr("style");
    $(".continueCheckout").attr("onclick", "continueCheckout();");
    gotoTab('step1', 1);
}

function itemDelete(_this) {

    _this = _this;
    try {


        var id = parseInt($(_this).parent().parent().attr("itemid"));
        var ind = parseInt($(_this).parent().parent().attr("index"));

        $(_this).parent().parent().next().next().remove();
        $(_this).parent().parent().next().remove();
        //$(_this).parent().parent().remove();

        $(_this).parent().parent().attr("style", "display:none");

        objWebOrder.itemArray.removeAt(ind);
        // sessionStorage.setItem("receiptPanel", $('#' + ReceiptPanel).html());

        calcInvoice();
        currentItem = null;
    }
    catch (ex) {
        MessageBox("Exception Description: " + ex.message);
    }
}


function modifierDelete(_this, index, modifierId) {
    try {
        var obj = objWebOrder.itemArray.filter(function (obj) {
            return parseInt(obj.index) === parseInt(index);
        })[0];

        obj.modifiersArray.removeModifierAt(modifierId);
        // $(_this).parent().parent().remove();


        $(_this).parent().parent().attr("style", "display:none");
        //  sessionStorage.setItem("receiptPanel", $('#' + ReceiptPanel).html());
        calcInvoice();
    }
    catch (ex) {
        MessageBox("Exception Description: " + ex.message);
    }
}


function gotoTab(tabname, _this) {
    try {


        $(_this).each(function (index, value) {

            if (tabname == 'step1') {


                $('#step1').removeAttr("style");
                $('#step2').attr("style", "display:none");

                $('#step2-2').attr("style", "display:none");
                $('#step2-3').attr("style", "display:none");

                $('#waterwheelcarousel').slick('slickGoTo', 2);
                $("#step-finished").attr("style", "display:none");


                $('#confirmOrder').attr("style", "display:none");

                //  alert(sessionStorage.getItem("locationId"));
                if (sessionStorage.getItem("locationId") == undefined || sessionStorage.getItem("locationId") == null) {

                    $("#receipt-mobile").html('');
                    $("#receipt").html('');
                    $('.AmtSubTotal').html(0);
                    calcInvoice();
                }
                calcInvoice();



                sessionStorage.setItem("CurrentStep","step1");
            }
            if (tabname == 'step2') {

                //  alert(sessionStorage.getItem("locationId"));
                if (sessionStorage.getItem("locationId") == undefined || sessionStorage.getItem("locationId") == null) {

                    MessageBox("Select a Location");
                }
                else {
                    $('#step2').removeAttr("style");
                    $('#step2-2').removeAttr("style");
                    $('#step1').attr("style", "display:none");

                    $('.category').removeAttr("style");
                    $(".continueCheckout").removeAttr("style")
                    $('#step2-3').attr("style", "display:none");
                    $('.ui.dropdown').dropdown();
                    $("#step-finished").attr("style", "display:none");
                    $('.invoice-panel').removeAttr("style");
                    $('#confirmOrder').attr("style", "display:none");
                    inti_step2();
                }

                sessionStorage.setItem("CurrentStep", "step2");

            }
            if (tabname == 'step3') {


                $('#step2-3').removeAttr("style");
                $('#step1').attr("style", "display:none");
                $('#step2').removeAttr("style");
                $('.category').attr("style", "display:none !important");
                $('#step2-2').attr("style", "display:none");

                $('.ui.form.ReturningCustomer').form(formValidationRules, LoginCustomer);
                $('.ui.form.RegisterYourself').form(formValidationRulesRegisterCustomer, RegisterCustomer);
                $('.ui.form.GuestOrder').form(formValidationRulesRegisterCustomer, GuestOrderRegister);
                $("#step-finished").attr("style", "display:none");

                //$("#txtDOB").datepicker();
                $("#txtDOB").datepicker({
                    changeMonth: true,
                    changeYear: true,
                    //showButtonPanel: true,
                    maxDate: new Date(),
                    yearRange: '1900:' + (new Date).getFullYear(),
                    dateFormat: 'dd-mm-yy'
                });



                $('.ui.checkbox').checkbox();
            }

        });

        if (sessionStorage.getItem("locationId") !== null) {
            $('#mainmenu a').removeClass("active");
            if (_this === 1) {
                $("#btn-step-1").addClass("active");
                $(".continueCheckout").removeAttr("style")
            }
            else if (_this === 2) {

                $("#btn-step-2").addClass("active");
                $(".continueCheckout").removeAttr("style");


            }
            else if (_this === 3) {
                $("#btn-step-3").addClass("active");
                $(".continueCheckout").attr("style", "pointer-events: none;")

                // $('.ui.form').form(formValidationRules, RegisterCustomer);
            } else {
                $(_this).addClass("active");
            }
        }
    }
    catch (ex) {

        // $('#messagebox').find('.list').html("Exception Description: " + ex.message);
        // $('#messagebox').removeAttr("style");

        MessageBox("Exception Description: " + ex.message);
    }
}


function PostApiData(url, _data, callback) {
    try {
        var xhr = new XMLHttpRequest();
        $.ajax({
            type: "POST",
            url: url, dataType: "json",
            data: JSON.stringify(_data),
            contentType: "application/json; charset=utf-8",
            processData: true,
            crossDomain: true,
            statusCode: {
                404: function (xhr) {
                    document.getElementById("PreLoader").setAttribute("style", "display:none");
                    alert('Page not found');
                }
            },
            beforeSend: function (xhr) {
                xhr.overrideMimeType('application/json');
            },
            success: function (data, xhr) {
                callback(data);
            },
            complete: function (data) {
            },
            error: function (model, response) {
                document.getElementById("PreLoader").setAttribute("style", "display:none");
                //alert("Exception Description: " + response.responseText);
                //$('#messagebox').find('.list').html("Exception Description: " + response.responseText);
                //$('#messagebox').removeAttr("style");

                MessageBox("Exception Description: " + response.responseText);
            },
            xhrFields: {
                onprogress: function (e) {
                }
            },
        });

    }
    catch (ex) {

        //$('#messagebox').find('.list').html("Exception Description: " + ex.message);
        //$('#messagebox').removeAttr("style");

        MessageBox("Exception Description: " + ex.message);
    }
}
function GetApiData(url, callback) {
    try {
        var xhr = new XMLHttpRequest();
        $.ajax({
            url: url, dataType: "json",
            processData: true,
            crossDomain: true,
            statusCode: {
                404: function (xhr) {
                    document.getElementById("PreLoader").setAttribute("style", "display:none");
                    alert('Page not found');
                }
            },
            beforeSend: function (xhr) {
                xhr.overrideMimeType('application/json');
            },
            success: function (data, xhr) {
                callback(data);
            },
            complete: function (data) {
            },
            error: function (model, response) {
                document.getElementById("PreLoader").setAttribute("style", "display:none");
                //alert("Exception Description: " + response.responseText);
                //$('#messagebox').find('.list').html("Exception Description: " + response.responseText);
                //$('#messagebox').removeAttr("style");

                MessageBox("Exception Description: " + response.responseText);
            },
            xhrFields: {
                onprogress: function (e) {
                }
            },
        });

    }
    catch (ex) {

        //$('#messagebox').find('.list').html("Exception Description: " + ex.message);
        //$('#messagebox').removeAttr("style");

        MessageBox("Exception Description: " + ex.message);
    }
}

function imgError(image) {
    if (image.src)
        image.onerror = "";

    //  image.src = "http://uat.isalespos.com/images/app_images/default_thumb_image.png";
    image.src = "../wp-content/themes/therealburger/assets/images/default_thumb_image.png";
    //image.src = "../wp-content/themes/therealburger/assets/images/defaultCategoryIcon.png";
    ////$(image).parent().addClass("noimage")
    ////$(image).parent().append("<span>Picture Comming Soon</span>")
    return true;
}


function BindProducts() {

    var url = ApiDomainURL + "Product/" + sessionStorage.getItem("session") + "/2000-01-01-00-00-00";
    // url="http://localhost:8080/beta-realburger/products.json";

    console.log(url);
    document.getElementById("loaderText").innerText = 'Loading Products';
    document.getElementById("PreLoader").removeAttribute("style");
    var _content = "";
    var _content_subcat = "";
    var subcategory_count = 0;
    GetApiData(url, function (data) {
        console.log(data[0]);
        data = data[0];

        sessionStorage.setItem("products", JSON.stringify(data));
        try {
            //alert(data[0].Category);
            if (data.Category !== null) {

                if (data.Category.length > 0) {
                    $.each(data.Category, function (i, res_cat) {
                        _content += '<div class="column" categoryid="' + res_cat.categoryID + '"><div class="image"><img src="' + res_cat.imageURL + '" onerror=imgError(this);></div> <div class="extra">' + res_cat.name + '<div class="ui star rating" data-rating="4"></div></div></div>';
                        document.getElementById("ddlCategory").innerHTML = _content;

                        $.each(res_cat.subCategory, function (j, res_subcat) {
                            subcategory_count = subcategory_count + 1;
                            _content_subcat += '<div class="ui six column stackable doubling grid ui pointing menu product-steps sub-category" categoryid="' + data.Category[i].categoryID + '"><div class="one column row heading-title subcategory" subcategoryid="' + data.Category[i].subCategory[j].subCategoryID + '"> <div class="column"><label>' + subcategory_count + ". " + data.Category[i].subCategory[j].name + ': </label></div></div>';

                            if (res_subcat.items != null) {
                                $.each(res_subcat.items, function (l, res_items) {
                                    _content_subcat += '<a class="item column" categoryid="' + data.Category[i].categoryID + '" subcategoryid="' + data.Category[i].subCategory[j].subCategoryID + '" itemid="' + res_items.itemID + '" price="19" name="' + res_items.name + '"><div class="column product-items"><div class="ui fluid image"><span class="ui fluid image red right corner label"></span><span class="price-tag"> ' + res_items.price + ' SR</span><img src="' + res_items.imageURL + '" onerror=imgError(this);> <label>' + res_items.name + '</label><input type="radio" name="item"><label></label></div></div></a>';
                                    if (res_items.childItems !== null) {
                                        $.each(res_items.childItems, function (k, res) {
                                        });
                                    }
                                });
                                _content_subcat += '<div class="ui section divider"></div></div>';
                            }
                        });
                    });
                    document.getElementById("step2-2").innerHTML = _content_subcat;
                }
                else {
                    //alert("No Items were found");

                    //$('#messagebox').find('.list').html('No Items were found.');
                    //$('#messagebox').removeAttr("style");

                    MessageBox('No Items were found.');

                    document.getElementById("step2-2").innerHTML = "";
                    document.getElementById("ddlCategory").innerHTML = "";
                }
            } else {
                //alert("No Items were found");
                //$('#messagebox').find('.list').html('No Items were found.');
                //$('#messagebox').removeAttr("style");
                MessageBox('No Items were found.');
                document.getElementById("step2-2").innerHTML = "";
                document.getElementById("ddlCategory").innerHTML = "";
            }
            debugger
            document.getElementById("PreLoader").setAttribute("style", "display:none");
            initFunctions();



            $('.product-panel .sub-category').each(function (index, value) {
                if (parseInt($(this).attr('categoryid')) === data.Category[0].categoryID) {
                    $(this).removeAttr("style");
                }
                else {
                    $(this).attr("style", "display:none");
                }
            });


            $('.product-panel .sub-category .item').each(function (index, value) {

                if (data.Category[0].categoryID === parseInt($(this).attr('subcategoryid')) && data.Category[0].categoryID === parseInt($(this).attr('categoryid'))) {
                    $(this).removeAttr("style");
                }
                else {
                    $(this).attr("style", "display:none");
                }

            });

            SetGridPosition();

        }
        catch (ex) {

            //$('#messagebox').find('.list').html("Exception Description: " + ex.message);
            //$('#messagebox').removeAttr("style");

            MessageBox("Exception Description: " + ex.message);
        }
    });



}
var CurrentItemElement = null;
function initFunctions() {

    try {


        $('.product-panel .sub-category').attr("style", "display:none");
        $('.product-panel .sub-category .item').attr("style", "display:none");
        $('.product-panel .sub-category .show-modifier').attr("style", "display:none");

        $('#ReturningCustomer').attr("style", "display:none");
        $('#GuestOrder').attr("style", "display:none");
        $('#RegisterYourself').attr("style", "display:none");


        $('.product-items').click(function () {
            //remove already selected items
            $('.product-items').children().removeClass("active");
            $('.product-items').find('input[type=radio]').removeAttr("checked");

            //active current selected item
            $(this).children().addClass("active");
            $(this).find("input[type=radio]").prop("checked", true);
        });



        $('.product-steps .item').on('click', function () {
            $('.product-steps .item').removeClass('active');
            $(this).addClass('active');
        });



        //Category Click Event
        $('.category .column').on('click', function () {
            var categoryid = $(this).attr('categoryid');
            $('.product-panel .sub-category').each(function (index, value) {
                //alert(parseInt($(this).attr('categoryid')) + " " + categoryid)
                if (parseInt($(this).attr('categoryid')) === parseInt(categoryid)) {
                    $(this).removeAttr("style");
                }
                else {
                    $(this).attr("style", "display:none !important");
                }


                $('.product-panel .sub-category .show-modifier').attr("style", "display:none !important");
            });


            SetGridPosition();
        });


        //Sub Category Click Event
        $('.product-panel .sub-category .subcategory').on('click', function () {

            var subcategoryid = parseInt($(this).attr('subcategoryid'));
            var categoryid = parseInt($(this).parent().attr('categoryid'));


            $('.product-panel .sub-category .item').each(function (index, value) {

                CurrentItemElement = this;
                if (subcategoryid === parseInt($(this).attr('subcategoryid')) && categoryid === parseInt($(this).attr('categoryid'))) {
                    $(this).removeAttr("style");
                }
                else {
                    $(this).attr("style", "display:none !important");
                }
                $('.product-panel .sub-category .show-modifier').attr("style", "display:none !important");
            });
        });



        $('.product-panel .sub-category .item').on('click', function () {

            _this = this;



            getMaxIndex().done(
         function (ind) {



             var categoryid = parseInt($(_this).attr('categoryid'));
             var subcategoryid = parseInt($(_this).attr('subcategoryid'));
             var itemid = parseInt($(_this).attr('itemid'));
             var price = parseInt($(_this).attr('price'));
             var name = $(_this).attr('name');

             var qty = 1;
             var totalPrice = parseFloat(price) * parseFloat(qty);

             var ObjectOrderDetail = new Object();
             ObjectOrderDetail.itemId = itemid;
             ObjectOrderDetail.name = name;
             ObjectOrderDetail.quantity = parseFloat(qty);
             ObjectOrderDetail.price = parseFloat(price);
             ObjectOrderDetail.totalPrice = totalPrice;
             ObjectOrderDetail.loyalityPoints = 0;
             ObjectOrderDetail.clientOrderTakerDT = currentdate();
             ObjectOrderDetail.isComplementory = 0;
             ObjectOrderDetail.sessionID = sessionStorage.getItem("session");
             ObjectOrderDetail.status = 102;
             ObjectOrderDetail.mode = "Add";
             ObjectOrderDetail.isOpenItem = parseFloat(0);
             ObjectOrderDetail.byWeight = parseFloat(0);
             ObjectOrderDetail.index = ind;
             ObjectOrderDetail.modifiersArray = [];
             ObjectOrderDetail.SubCategoryID = parseInt(subcategoryid);
             objWebOrder.itemArray.push(ObjectOrderDetail);
             currentItem = ObjectOrderDetail;

             RowItemNo = RowItemNo + 1;
             var _items = '<div class="ui grid pnl-items" rowid=' + RowItemNo + ' index = ' + ObjectOrderDetail.index + ' item-price=' + ObjectOrderDetail.price + ' name="' + ObjectOrderDetail.name + '" itemid=' + ObjectOrderDetail.itemId + '>' +
                                                     '<div class="row row-items">' +
                                                         '<div class="two wide column delete" onclick="itemDelete(this)"><img src="../wp-content/themes/therealburger/assets/images/delete%20icon.png"  style="margin-left: 10px;" /></div>' +
                                                         '<div class="seven wide column item-name">' + ObjectOrderDetail.name + '</div>' +
                                                         '<div class="four wide column"><input type="number" value="1" class="spiner-qty item-qty" onchange="plusQty(this);" /></div>' +
                                                         '<div class="three wide column price">SR <span class="total-price">' + ObjectOrderDetail.price + '</span></div>' +
                                                     '</div>' +
                                                 '</div>' +

                                         '<div class="ui grid pnl-modidiers"></div>' +
                                         ' <div class="ui section divider item-divider"></div>';

             $('#' + ReceiptPanel).append(_items);
             $('.product-panel .sub-category .show-modifier').attr("style", "display:none !important");
             $(_this).parent().find('.show-modifier').removeAttr("style");


             populateModifiers(_this);
             sessionStorage.setItem("objWebOrder", JSON.stringify(objWebOrder));


             //   sessionStorage.setItem("receiptPanel", $('#' + ReceiptPanel).html());

             calcInvoice();

         });

        });


        if (objWebOrder === null) {
            objWebOrder = new NewOrder(0, 0, 0, 0, 0, '', 0, '', currentdate(), 'Web Order', 0, '', 0,
                                        '', '', 0, 301, session, locationId, sessionStorage.getItem("lics"),
                                        0, 1, 'New', sessionStorage.getItem('deliveryCharges'), [], [], '', 301, 0, 0);
        }

    }
    catch (ex) {

        //$('#messagebox').find('.list').html("Exception Description: " + ex.message);
        //$('#messagebox').removeAttr("style");

        MessageBox("Exception Description: " + ex.message);
    }
}



function SetGridPosition() {

    try {
        var i = 1;
        if (ScreenWidth < 767) {

            $('.product-steps.sub-category a').each(function (index, value) {
                $(this).attr("rowItemNo", "1")
            });
        }
        else if (ScreenWidth < 987) {
            $('.product-steps.sub-category').each(function (index, value) {
                var cat = parseInt($(this).children().attr("subcategoryid"));
                $('.product-steps.sub-category a').each(function (index, value) {


                    if (parseInt($(this).attr("subcategoryid")) === cat) {
                        if (i == 1) {
                            $(this).attr("rowItemNo", "1")
                        }
                        if (i == 2) {
                            $(this).attr("rowItemNo", "2")
                        }
                        if (i == 3) {
                            $(this).attr("rowItemNo", "3")
                        }

                        else if (i == 4) {
                            i = 1;
                            $(this).attr("rowItemNo", "1")
                        }
                        i = i + 1;
                    }
                    else {
                        i = 1;
                    }
                });
            });
        }
        else if (ScreenWidth > 987) {
            $('.product-steps.sub-category').each(function (index, value) {
                var cat = parseInt($(this).children().attr("subcategoryid"));
                $('.product-steps.sub-category a').each(function (index, value) {
                    if (parseInt($(this).attr("subcategoryid")) === cat) {
                        if (i == 1) {
                            $(this).attr("rowItemNo", "1")
                        }
                        if (i == 2) {
                            $(this).attr("rowItemNo", "2")
                        }
                        if (i == 3) {
                            $(this).attr("rowItemNo", "3")
                        }
                        if (i == 4) {
                            $(this).attr("rowItemNo", "4")
                        }
                        if (i == 5) {
                            $(this).attr("rowItemNo", "5")
                        }
                        if (i == 6) {
                            $(this).attr("rowItemNo", "6")
                        }
                        else if (i == 7) {
                            i = 1;
                            $(this).attr("rowItemNo", "1")
                        }
                        i = i + 1;
                    }
                    else {
                        i = 1;
                    }
                });

            });
        }
    }
    catch (ex) {

        //$('#messagebox').find('.list').html("Exception Description: " + ex.message);
        //$('#messagebox').removeAttr("style");
        MessageBox("Exception Description: " + ex.message)
    }
}



function populateModifiers(_this) {

    try {
        var categoryid = parseInt($(_this).attr('categoryid'));
        var subcategoryid = parseInt($(_this).attr('subcategoryid'));
        var itemid = parseInt($(_this).attr('itemid'));

        var price = parseInt($(_this).attr('price'));
        var name = $(_this).attr('name');

        var rowitemno = parseInt($(_this).attr('rowitemno'));


        var parsed = JSON.parse(sessionStorage.getItem("products"))

        var category = parsed.Category.filter(function (obj) {
            return parseInt(obj.categoryID) === parseInt(categoryid);
        })[0];

        var subCategory = category.subCategory.filter(function (obj) {
            return parseInt(obj.subCategoryID) === parseInt(subcategoryid);
        })[0];



        var items = subCategory.items.filter(function (obj) {
            // alert(parseInt(obj.itemID) === parseInt(itemid));
            return parseInt(obj.itemID) === parseInt(itemid);
        })[0];

        console.log("items");

        var _content_modifier = "";
        if (items.childItems !== undefined && items.childItems !== null) {

            if (items.childItems.length > 0) {
                _content_modifier += '<div class="ui segment show-modifier" modifieritemid="' + itemid + '"><p><div class="ui grid "><div class="one column row heading-title"><div class="column"><label>Select Modifiers </label></div></div>'
                $.each(items.childItems, function (i, res) {
                    _content_modifier += '<div class="row modifiersRows" ModifierId="' + res.ModifierID + '" ModifierName="' + res.name + '" modifierprice="' + res.price + '" itemid="' + itemid + '"> <div class="two wide column "> <input type="checkbox" ModifierID="' + res.ModifierID + '" class="input_class_checkbox"> </div> <div class="five wide column border-bottom"> ' + res.name + '</div><div class="four wide column border-bottom"><input type="number" value="1" class="spiner-qty mqty" onchange="ModifierQtyChange(this)" /></div> <div class="four wide column border-bottom price"> <span class="MTotal">' + res.price + '</span> SR</div></div>';
                });

                _content_modifier += '<div class="row"> <h5 class="lbl-additional">Aditional Comments or Instructions?</h5></div>';
                _content_modifier += '<div class="row"><div class="six wide column "><textarea class="txt-additional" style=""></textarea></div> <div class="two wide column"></div><div class=" five wide column "><input type="button" value="Add" class="add-modifier" style="float: right;" onclick="AddModifiers(this);"></div> <div class="two wide column"></div></div>';
                _content_modifier += '</div></p></div>';


                $('.show-modifier').attr("style", "display:none");
                $('.show-modifier').remove();

                $(_this).parent().find('.divider').attr("class", "clear");



                if (ScreenWidth < 767) {
                    $(_this).after(_content_modifier);
                } else if (ScreenWidth < 987) {


                    if (rowitemno == 1) {
                        if ($(_this).next().attr("rowitemno") === undefined) {
                            $(_this).after(_content_modifier);
                        }
                        else {
                            $(_this).next().next().after(_content_modifier);
                        }
                    }
                    else if (rowitemno == 2) {
                        if ($(_this).next().attr("rowitemno") === undefined) {
                            $(_this).after(_content_modifier);
                        }
                        else {
                            $(_this).next().after(_content_modifier);
                        }
                    }
                    else if (rowitemno == 3) {
                        if ($(_this).next().attr("rowitemno") === undefined) {
                            $(_this).after(_content_modifier);
                        }
                        else {
                            $(_this).after(_content_modifier);
                        }
                    }
                    else {
                        $('.show-modifier').remove();
                    }

                }
                else if (ScreenWidth > 987) {
                    if (rowitemno == 1) {
                        if ($(_this).next().attr("rowitemno") === undefined) {
                            $(_this).after(_content_modifier);
                        }
                        else {
                            $(_this).next().next().next().next().next().after(_content_modifier);
                        }
                    }
                    else if (rowitemno == 2) {
                        if ($(_this).next().attr("rowitemno") === undefined) {
                            $(_this).after(_content_modifier);
                        }
                        else {
                            $(_this).next().next().next().next().after(_content_modifier);
                        }
                    }
                    else if (rowitemno == 3) {
                        if ($(_this).next().attr("rowitemno") === undefined) {
                            $(_this).after(_content_modifier);
                        }
                        else {
                            $(_this).next().next().next().after(_content_modifier);
                        }
                    }
                    else if (rowitemno == 4) {
                        if ($(_this).next().attr("rowitemno") === undefined) {
                            $(_this).after(_content_modifier);
                        }
                        else {
                            $(_this).next().next().after(_content_modifier);
                        }
                    }
                    else if (rowitemno == 5) {
                        if ($(_this).next().attr("rowitemno") === undefined) {
                            $(_this).after(_content_modifier);
                        }
                        else {
                            $(_this).next().after(_content_modifier);
                        }
                    }
                    else if (rowitemno == 6) {
                        if ($(_this).next().attr("rowitemno") === undefined) {
                            $(_this).after(_content_modifier);
                        }
                        else {
                            $(_this).after(_content_modifier);
                        }
                    } else {
                        $('.show-modifier').remove();
                    }
                }
            }
            else {
                //alert("No Any Modifiers with this Item");

                //$('#messagebox').find('.list').html('No any modifiers with seelcted item.');
                // $('#messagebox').removeAttr("style");
                MessageBox('No any modifiers with selected item.');


                $('.product-steps .item').removeClass('active');
                $('.show-modifier').remove();
            }
            $('.input_class_checkbox').each(function () {
                $(this).hide().after('<div class="class_checkbox" />');

            });

            $('.class_checkbox').on('click', function () {
                $(this).toggleClass('checked').prev().prop('checked', $(this).is('.checked'))
            });

        }
        else {
            MessageBox('No any modifiers with seelcted item.');
            // $('#messagebox').find('.list').html('No any modifiers with selected item.');
            // $('#messagebox').removeAttr("style");

            //alert("No Any Modifiers with this Item");
            $('.product-steps .item').removeClass('active');
            $('.show-modifier').remove();

            $('.input_class_checkbox').each(function () {
                $(this).hide().after('<div class="class_checkbox" />');

            });

            $('.class_checkbox').on('click', function () {
                $(this).toggleClass('checked').prev().prop('checked', $(this).is('.checked'))
            });

        }


        $('.product-steps.sub-category a').each(function (index, value) {
            $(this).parent().find('.divider').attr("class", "clear");
            $(this).parent().append('<div class="ui section divider"></div>');
        });


    }
    catch (ex) {

        //$('#messagebox').find('.list').html("Exception Description: " + ex.message);
        //$('#messagebox').removeAttr("style");

        MessageBox("Exception Description: " + ex.message);
    }
}


$(window).resize(function () {
    try {

        ScreenWidth = jQuery(window).width();
        ScreenHeight = jQuery(window).height();

        console.log(ScreenWidth);

        if (ScreenWidth < 767) {
            ReceiptPanel = "receipt-mobile";
            $('#' + ReceiptPanel).html(sessionStorage.getItem("receiptPanel"))
        }
        else {
            ReceiptPanel = "receipt";
            $('#' + ReceiptPanel).html(sessionStorage.getItem("receiptPanel"))



            $('.ui.right.sidebar.menu').removeClass("overlay").removeClass("visible");
            $('.pusher').removeClass("dimmed");
        }

        SetGridPosition();
    }
    catch (ex) {

        //$('#messagebox').find('.list').html("Exception Description: " + ex.message);
        //$('#messagebox').removeAttr("style");

        MessageBox("Exception Description: " + ex.message);
    }
});


function getMaxIndex() {

    try {
        var ind = 0;
        var dfd = $.Deferred();
        var arr = [];


        ///  alert(JSON.stringify(objWebOrder));
        $(objWebOrder.itemArray).each(function (i, val) {
            var drd = $.Deferred();
            if (parseInt(val.index) > ind) {
                ind = val.index;
            }
            arr.push(drd.resolve());
        });


        $.when.apply($, arr).then(
            function () {
                dfd.resolve(ind + 1);
            });
        return dfd.promise();

        //for (var i = 0; i < objWebOrder.itemArray.length; i++) {
        //    if (objWebOrder.itemArray[i].index > ind) {
        //        ind = objWebOrder.itemArray[i].index;
        //    }
        //}

        //return ind++;
    }
    catch (ex) {

        //$('#messagebox').find('.list').html("Exception Description: " + ex.message);
        //$('#messagebox').removeAttr("style");

        MessageBox("Exception Description: " + ex.message);
    }
}



function plusQty(_this) {
    try {
        var id = $(_this).parent().parent().parent().attr('itemid');
        var index = $(_this).parent().parent().parent().attr('index');

        var selectedItem = objWebOrder.itemArray.filter(function (obj) {
            return parseInt(obj.index) === parseInt(index) && parseInt(obj.itemId) == parseInt(id);
        })[0];


        // selectedItem.quantity = parseInt(selectedItem.quantity) + 1;
        selectedItem.quantity = parseInt($(_this).parent().parent().parent().find('.item-qty').val());
        selectedItem.totalPrice = parseInt(selectedItem.quantity) * parseFloat(selectedItem.price);

        //totalPrice = qty * parseInt(price);
        $(_this).parent().parent().find('.total-price').text(selectedItem.totalPrice);
        $(_this).parent().parent().parent().find('.item-qty').val(selectedItem.quantity);

        $(_this).parent().parent().parent().find('.item-qty').attr('value', selectedItem.quantity)

        //  sessionStorage.setItem("receiptPanel", $('#' + ReceiptPanel).html());
        //alert();
        calcInvoice();

    }
    catch (ex) {

        //$('#messagebox').find('.list').html("Exception Description: " + ex.message);
        //$('#messagebox').removeAttr("style");

        MessageBox("Exception Description: " + ex.message);
    }

}



function MessageBox(_msg) {

    $('#messagebox').find('.list').html(_msg);
    $('#messagebox').removeAttr("style");


    $('#messagebox1').find('.list').html(_msg);
    $('#messagebox1').removeAttr("style");


    $('html, body').animate({ scrollTop: 650 }, 'fast');




    setTimeout(function () {
        $('#messagebox').find('.list').html("");
        $('#messagebox').attr("style", "display:none");

        $('#messagebox1').find('.list').html("");
        $('#messagebox1').attr("style", "display:none");
    }, 10000);

}

function ModifierQtyChange(_this) {
    try {

        var ModifierId = $(_this).parent().parent().attr('modifierid');

        if ($(_this).parent().parent().find('input[type="checkbox"]').prop("checked") === true) {
            var qty = $(_this).parent().parent().find('.mqty').val();
            var price = parseFloat($(_this).parent().parent().attr('modifierprice'));


            qty = qty;
            price = parseInt(qty) * parseInt(price);

            $(_this).parent().parent().find('.MTotal').text(price);

        }
        else {

            //$('#messagebox').find('.list').html('Please select modifier first.');
            //$('#messagebox').removeAttr("style");

            MessageBox('Please select modifier first.');
            //alert('Please Select Modified');
            $(_this).parent().parent().find('.mqty').val('1');
        }

    }
    catch (ex) {

        //$('#messagebox').find('.list').html("Exception Description: " + ex.message);
        //$('#messagebox').removeAttr("style");

        MessageBox("Exception Description: " + ex.message)
    }
}




//form validation

var LoginCustomer =
   {
       onSuccess: function () {

           checkMobileNumberFormat(document.getElementById("txtContact").value, function (res) {
               if (res === 1) {
                   alert('Need Login API');
                   //ReturningCustomerLoginApi(function (response) {

                   //    console.log(response);
                   //    if (parseInt(response.status) === 1) {
                   //        alert('Success Validation');

                   //        $(".continueCheckout").removeAttr("style");
                   //        $(".continueCheckout").attr("onclick", "finalCheckout();");

                   //    }
                   //    else {
                   //        alert(response.statusDesc);
                   //    }

                   //})



                   $('#ReturningCustomer').attr("style", "display:none");
                   $('#GuestOrder').attr("style", "display:none");
                   $('#RegisterYourself').attr("style", "display:none");

                   $('.btn-accordian-heading').removeAttr("style");
                   $('.heading-title-accordian').removeAttr("style");





                   return true;
               }
               else {
                   alert("Mobile number is invalid. Example: +966542926290");

                   return false;
               }


           })


           return false;
       },
   }

var formValidationRules =
    {
        on: 'blur',
        mobile: {
            identifier: 'mobile',
            rules: [
              {
                  type: 'empty',

                  //prompt: 'Please enter a valid e-mail'
              }
            ]
        },
        password: {
            identifier: 'password',
            rules: [
              {
                  type: 'empty',
                  //prompt: 'Please enter a valid e-mail'
              }

            ]
        },

        terms: {
            identifier: 'terms',
            rules: [
              {
                  type: 'checked',
                  // prompt: 'You must agree to the terms and conditions'
              }
            ]
        }

    }

//$('.ui.form').form(formValidationRules, RegisterCustomer);

function checkMobileNumberFormat(txtnumber, callback) {
    //var text = '+966542926290';
    //var text = '0542926291';
    //var regex = new RegExp(/^(009665|9665|\+9665|05)(5|0|3|6|4|9|1|8|7)([0-9]{7})$/i); //saudi mobile number format
    var text = txtnumber;
    var regex = new RegExp(/^\+(?:[0-9] ?){11,11}[0-9]$/i);
    var match = regex.exec(text);
    if (match !== null) {
        callback(1);
    }
    else {
        callback(0);
    }
}

function CustomerRegisterApi(callback) {
    //Api Customer Code
    var _customername = (document.getElementById("txtCustomerName").value === "") ? "-" : document.getElementById("txtCustomerName").value;
    var _dob = "-";//(document.getElementById("txtDOB").value === "") ? "-" : document.getElementById("txtDOB").value;
    var _email = (document.getElementById("txtEmail").value === "") ? "-" : document.getElementById("txtEmail").value;
    var gender = "-";//(document.getElementById("txtGender").value === "") ? "-" : document.getElementById("txtGender").value;
    var customermobile = (document.getElementById("txtContact").value === "") ? "-" : document.getElementById("txtContact").value;
    var _fromdate = "-";
    var _todate = "-";
    var _totalValidDays = "0";
    var _note = "-";
    var _holddays = "-";
    var _country = "Saudia";//(document.getElementById("txtCountry").value === "") ? "Saudia" : document.getElementById("txtCountry").value;
    var _city = "Riyadh";//(document.getElementById("txtCity").value === "") ? "Riyadh" : document.getElementById("txtCountry").value;
    var _area = "0";
    var _city = "-";//(document.getElementById("txtPostal").value === "") ? "-" : document.getElementById("txtPostal").value;
    var _zip = "0";

    var url = "" + ApiDomainURL + "/customerRegister/0/" + _customername + "/" + _dob + "/" + gender + "/1/" + _email + "/" + btoa(unescape(encodeURIComponent(customermobile))) + "/0/Saudia/Riyadh/0/-/Add/" + _fromdate + "/" + _todate + "/" + _totalValidDays + "/" + _holddays + "/" + _note + "/" + sessionStorage.getItem("session");

    //var url = "" + ApiDomainURL + "/customerRegister/0/" + _customername + "/" + _dob + "/" + gender + "/1/" + _email + "/" + customermobile + "/0/" + _country + "/" + _city + "/" + _area + "/" + _zip + "/Add/" + _fromdate + "/" + _todate + "/" + _totalValidDays + "/" + _holddays + "/" + _note + "/" + sessionStorage.getItem("session");
    console.log(url);
    GetApiData(url, function (response) {
        if (response.status === 1) {
            ServerCustomerId = response.customerID;
            objWebOrder.CustomerID = response.customerID;
            // ChangeStep('step-5', '1');
            callback(response);
        }
        else {
            //alert(response.statusDesc);
            callback(response);
        }

    });

}

function ReturningCustomerLoginApi(callback) {
    var url = "" + ApiDomainURL + "/LoginCustomer/" + sessionStorage.getItem("session");

    //var url = "" + ApiDomainURL + "/customerRegister/0/" + _customername + "/" + _dob + "/" + gender + "/1/" + _email + "/" + customermobile + "/0/" + _country + "/" + _city + "/" + _area + "/" + _zip + "/Add/" + _fromdate + "/" + _todate + "/" + _totalValidDays + "/" + _holddays + "/" + _note + "/" + sessionStorage.getItem("session");
    console.log(url);
    GetApiData(url, function (response) {
        if (response.status === 1) {
            ServerCustomerId = response.customerID;
            objWebOrder.CustomerID = response.customerID;
            // ChangeStep('step-5', '1');
            callback(response);
        }
        else {
            //alert(response.statusDesc);
            callback(response);
        }

    });
}


function GuestCustomerRegisterApi(callback) {
    //Api Customer Code
    var _customername = (document.getElementById("txtGuestName").value === "") ? "-" : document.getElementById("txtGuestName").value;
    var _dob = "2000-01-01";//(document.getElementById("txtGuestDOB").value === "") ? "-" : document.getElementById("txtGuestDOB").value;
    var _email = (document.getElementById("txtGuestEmail").value === "") ? "-" : document.getElementById("txtGuestEmail").value;
    var gender = "-";//(document.getElementById("txtGuestGender").value === "") ? "-" : document.getElementById("txtGuestGender").value;
    var customermobile = (document.getElementById("txtGuestContact").value === "") ? "-" : document.getElementById("txtGuestContact").value;
    var _fromdate = "2000-01-01";
    var _todate = "2000-01-01";
    var _totalValidDays = 0;
    var _note = "-";
    var _holddays = 0;
    var _country = "Saudia";//(document.getElementById("txtCountry").value === "") ? "Saudia" : document.getElementById("txtCountry").value;
    var _city = "Riyadh";//(document.getElementById("txtCity").value === "") ? "Riyadh" : document.getElementById("txtCountry").value;
    var _area = "0";
    var _city = "-";//(document.getElementById("txtPostal").value === "") ? "-" : document.getElementById("txtPostal").value;
    var _zip = "0";

    //var url = "" + ApiDomainURL + "/customerRegister/0/" + _customername + "/" + _dob + "/" + gender + "/2/" + _email + "/" + btoa(unescape(encodeURIComponent(customermobile))) + "/0/Saudia/Riyadh/0/-/Add/" + _fromdate + "/" + _todate + "/" + _totalValidDays + "/" + _holddays + "/" + _note + "/" + sessionStorage.getItem("session");
    var url = "" + ApiDomainURL + "/customeradd/";



    var _data =
                {
                    "Fullname": _customername,
                    "Customertype": 2,
                    "Email": _email,
                    "DOB": _dob,
                    "Gender": gender,
                    "Mobile": customermobile,
                    "Cardno": "-",
                    "fromdate": _fromdate,
                    "todate": _todate,
                    "totaldays": _totalValidDays,
                    "holddays": _holddays,
                    "note": _note,
                    "SessionId": sessionStorage.getItem("session")

                }
    // console.log(JSON.stringify(_data));
    // _data = {
    //                     "Fullname": "shiraz ahmed",
    //                     "Customertype": 1,
    //                     "Email": "shiraz@wizsoft.pk",
    //                     "DOB": "1992-10-17",
    //                     "Gender": "Male",
    //                     "Mobile": "03323191909",
    //                     "Cardno": "POS-4WL59R786201701261209469658",
    //                     "fromdate": "2017-02-01",
    //                     "todate": "2017-03-01",
    //                     "totaldays": 0,
    //                     "holddays": 0,
    //                     "note": "-",
    //                     "SessionId": sessionStorage.getItem("session")

    //                 }

    console.log(JSON.stringify(_data));


    console.log(url);
    PostApiData(url, _data, function (response) {
        if (response.Status === 1) {
            ServerCustomerId = response.CustomerID;
            objWebOrder.CustomerID = response.CustomerID;
            // ChangeStep('step-5', '1');
            callback(response);
        }
        else {
            //alert(response.statusDesc);
            callback(response);
        }

    });

}


var RegisterCustomer =
   {
       onSuccess: function () {

           // alert('Success RegisterCustomer');

           checkMobileNumberFormat(document.getElementById("txtContact").value, function (res) {
               if (res === 1) {

                   CustomerRegisterApi(function (response) {

                       console.log(response);
                       if (parseInt(response.status) === 1) {


                           MessageBox("Customer has been Added")




                           $(".continueCheckout").removeAttr("style");
                           $(".continueCheckout").attr("onclick", "finalCheckout();");


                           $('#ReturningCustomer').attr("style", "display:none");
                           $('#GuestOrder').attr("style", "display:none");
                           $('#RegisterYourself').attr("style", "display:none");

                           $('.btn-accordian-heading').removeAttr("style");
                           $('.heading-title-accordian').removeAttr("style");







                           // document.getElementById("txtCustomerName").value = "";
                           // document.getElementById("txtDOB").value = "";
                           // document.getElementById("txtEmail").value = "";
                           // document.getElementById("txtGender").value = "";
                           //  document.getElementById("txtContact").value = "";
                       }
                       else {
                           alert(JSON.stringify(response.statusDesc));


                       }

                   })


                   return true;
               }
               else {
                   alert("Mobile number is invalid. Example: +966542926290");

                   return false;
               }


           })





           return false;

       },
   }

var formValidationRulesRegisterCustomer =
    {
        on: 'blur',
        name: { identifier: 'name', rules: [{ type: 'empty', }] },
        email: { identifier: 'email', rules: [{ type: 'email', }] },
        contact: { identifier: 'contact', rules: [{ type: 'empty', }] },
        //  birthdate: { identifier: 'birthdate', rules: [{ type: 'empty', }] },
        //  gender: { identifier: 'gender', rules: [{ type: 'empty', }] },
        addresscustomer: { identifier: 'addresscustomer', rules: [{ type: 'empty', }] }

    }



var GuestOrderRegister =
   {
       onSuccess: function () {

           // alert('Success RegisterCustomer');

           checkMobileNumberFormat(document.getElementById("txtGuestContact").value, function (res) {
               if (res === 1) {

                   GuestCustomerRegisterApi(function (response) {
                       console.log("GuestCustomerRegisterApi response");
                       console.log(response);


                       if (parseInt(response.Status) === 1) {
                           $(".continueCheckout").removeAttr("style");
                           $(".continueCheckout").attr("onclick", "finalCheckout();");



                           $('#ReturningCustomer').attr("style", "display:none");
                           $('#GuestOrder').attr("style", "display:none");
                           $('#RegisterYourself').attr("style", "display:none");

                           $('.btn-accordian-heading').removeAttr("style");
                           $('.heading-title-accordian').removeAttr("style");


                       }
                       else {
                           alert(response.Description);
                       }

                   })


                   return true;
               }
               else {
                   alert("Mobile number is invalid. Example: +966123456789");

                   return false;
               }


           })



           return false;

       },
   }


function CartContinue()
{
 
    if (sessionStorage.getItem("CurrentStep")=="step1")
    {

    }
    else if (sessionStorage.getItem("CurrentStep") == "step2") {
        continueCheckout();
    }
    else if (sessionStorage.getItem("CurrentStep") == "step3")
    {
        confirmCheckout();
    }
}
