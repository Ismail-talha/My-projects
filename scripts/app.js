var app = angular.module('BURGERAPP', ['ui.router']);
app.config(function ($stateProvider, $urlRouterProvider, $locationProvider) {
    $urlRouterProvider.otherwise('/home');

    $stateProvider
    .state('home', {
        url: '/home',
        templateUrl: 'views/home.html',
        controller: 'HomeCtrl',

    })
    .state('about', {
        url: '/about',
        templateUrl: 'views/aboutus.html',
        controller: 'HomeCtrl',

    })
    .state('contact', {
        url: '/contact',
        templateUrl: 'views/contactus.html',
        controller: 'HomeCtrl',
    })
    .state('onlineorder', {
        url: '/onlineorder',
        templateUrl: 'views/onlineorder.html',
        controller: 'OrderCtrl',
    })

    .state('locationmobile', {
        url: '/location',
        templateUrl: 'views/locationmobile.html',
        controller: 'locationCtrl',
    })

    .state('realMenu', {
        url: '/realMenu',
        templateUrl: 'views/real_menu.html',
        controller: 'realMenuCtrl',
    })

        .state('add_to_cart', {
            url: '/add_to_cart',
            templateUrl: 'views/add_to_cart.html',
            controller: 'addtocartCtrl',
        })

       .state('register', {
           url: '/register',
           templateUrl: 'views/register.html',
           controller: 'registerCtrl',
       })

           .state('order_more', {
               url: '/order_more',
               templateUrl: 'views/order_more.html',
               controller: 'order_moreCtrl',
           })

});
app.factory('MyService', function () {
    return {
        data: {
            firstName: 'Checkout',
            realburger: 'https://webapi-v1.marnpos.com',
            OrderJSON: [{
                OrderID: 0,
                TransactionNo: 0,
                OrderNo: 0,
                OfflineOrderID: 0,
                OrderTakerID: 0,
                OrderTaker: '',
                CustomerID: 0,
                CustomerName: '',
                OrderCreatedDate: currentdate(),
                OrderType: 'Web Order',
                GuestCount: 0,
                DeliveryAddress: '',
                DeliveryAgentID: 0,
                DeliveryAgentName: '',
                DeliveryTime: '',
                Points: 0,
                Status: 301,
                SessionID: null,
                LocationID: null,
                CompanyCode: null,
                SyncStatus: 0,
                isOnline: 1,
                Mode: 'New',
                Total: 0,
                itemArray: [],
                checkOutArray: [],
                CustomerMobile: '',
                OrderStatus: 301,
                OrderTable: 0,
                SubUserID: 0
            }]

        }
    };
});

/////////////////////////HomeCtrl////////////////////////

app.controller('HomeCtrl', function ($scope, $state, $rootScope) {
    MenuHideShow();

    $scope.ordrtolocation = function () {
        $state.go('locationmobile');
        localStorage.clear();
    }

    //////////////////////ORDER ONLINE ACCORDION///////////////
    $scope.closeexcept = function (param1, param2) {
        document.getElementsByClassName(param1)[0].style.display = "none";
        document.getElementsByClassName(param2)[0].style.display = "none";
        $("html, body").animate({ scrollTop: $(document).height() - $(window).height() });
    }
});

//////////////LOCATION CONTROLLER/////////////////////

app.controller("locationCtrl", function ($scope, $state, $rootScope, $http, MyService) {

    $scope.backtoorder = function () {
        $state.go('home');
    }
    ///////////////////////Locations API//////////////////

    $scope.branches = [];
    $scope.localSave = undefined;  //object
    $scope.selectedlocation = ''

    $scope.setSession = function (session) {
        $scope.localSave = session;
        $scope.selectedlocation = session.SessionID; //$scope.selectedlocation = session;
        $scope.locationselected = session;
        MyService.data.SessionID = session.SessionID;
        
        
    }

    $scope.saved = function () {
        localStorage.setItem("Session_ID", JSON.stringify($scope.selectedlocation));//localStorage.setItem("Session_ID", $scope.selectedlocation.SessionID);
        localStorage.setItem("Session_ID", $scope.locationselected.SessionID);
        console.log('location');
        console.log(MyService.data.OrderJSON[0]);
        console.log($scope.selectedlocation);
        console.log($scope.locationselected);

        MyService.data.OrderJSON[0].LocationID = $scope.locationselected.LocationID;
        MyService.data.OrderJSON[0].CompanyCode = $scope.locationselected.CompanyCode;

        console.log(MyService.data.OrderJSON[0]);
    }

    $scope.Getdata = function () {
        $http.get(MyService.data.realburger + '/api/locationmp/POS-RK5SFX')
.then(function (response) {
  //paste here
   
    $scope.branches = response.data.LocationsList;
    localStorage.setItem('branches', JSON.stringify($scope.branches));
})

.catch(function (response) {

})

.finally(function () {
    //console.log("Successed");
    $scope.loading = false;
});
    }




    $scope.chkselected = function (ID) {
        angular.forEach($scope.branches, function (temp, key) {
            if (ID === temp.SessionID) {
                temp.isselected = true;
            }
            else
                temp.isselected = false;
        })
    }

    /////////////////////End///////////////////////////////

    $scope.nexttorealmenu = function () {
        $state.go('realMenu');
    }

    if (localStorage.getItem('branches') == undefined || localStorage.getItem('branches') == null) {

        $scope.loading = true;
        $scope.Getdata();
    }

    else {
        $scope.branches = JSON.parse(localStorage.getItem('branches'));
        angular.forEach($scope.branches, function (temp, key) {
            temp.isselected = false;
            if (localStorage.getItem("Session_ID") != undefined) {//   
              //  $scope.getLocation = localStorage.getItem("Session_ID");
                $scope.getLocation = localStorage.Session_ID;
                $scope.setData = $scope.getLocation;
               
                if (JSON.stringify($scope.setData) === JSON.stringify(temp.SessionID)) {

                    console.log(temp);
                    temp.isselected = true;
                }
            }
        })
    }
});

////////////////////REALMENU CONTROLLER ////////////////
app.controller("realMenuCtrl", function ($scope, $state, $rootScope, $http, MyService, $filter) {

    /////////////////////////PRODUCT API//////////////////////////////////
    $scope.menu = [];
    $scope.SubCategory = [];
    $scope.Items = [];
    $scope.Modifiers = [];
    $scope.CategorylocalSave = undefined; //Object
    $scope.selectedmodel = undefined;

    if (localStorage.getItem('Products') == undefined || localStorage.getItem('Products') == null) {
        $scope.loading = true;
        $http.get(MyService.data.realburger + '/api/Product/POS-RK5SFX20171224114239928900/2000-01-01-00-00-00')
       .then(function (response) {

           $scope.products = response.data[0].Category;
           $scope.selectedCategory = $scope.products[0];
           $scope.selectedSubCategory = $scope.products[0].subCategory[0];
           localStorage.setItem('Products', JSON.stringify($scope.products));
           console.log($scope.selectedSubCategory);
       })
       .catch(function (response) {
           console.error('Error', response.status, response.data);
       })
     .finally(function () {
         $scope.loading = false;

     });
    }
    else {
        $scope.products = JSON.parse(localStorage.getItem('Products'));
        $scope.selectedSubCategories = JSON.parse(localStorage.getItem('selectedSubCategory'));
        $scope.selectedCategory = $scope.products[0];
        $scope.selectedSubCategory = $scope.products[0].subCategory[0];
    }
    ///////////////////////////END//////////////////////////

    $scope.modd = true;
    $scope.openModifier = function (res) {
        $scope.selectedmodel = res;
        $scope.itemname = res.name;
        $scope.itemprice = res.price;
        var qty = 1;
        var totalPrice = parseFloat(res.price) * parseFloat(qty);
        $scope.selectedItems = new Object();
        $scope.selectedItems.itemId = res.itemID;
        $scope.selectedItems.name = res.name;
        $scope.selectedItems.quantity = parseFloat(qty);
        $scope.selectedItems.price = parseFloat(res.price);
        $scope.selectedItems.totalPrice = totalPrice;
        $scope.selectedItems.loyalityPoints = 0;
        $scope.selectedItems.clientOrderTakerDT = currentdate();
        $scope.selectedItems.isComplementory = 0;
        $scope.selectedItems.sessionID = localStorage.getItem("Session_ID");
        $scope.selectedItems.status = 102;
        $scope.selectedItems.mode = "Add";
        $scope.selectedItems.isOpenItem = parseFloat(0);
        $scope.selectedItems.byWeight = parseFloat(0);
        //$scope.selectedItems.index = ind;
        $scope.selectedItems.modifiersArray = [];
        $scope.selectedItems.SubCategoryID = parseInt($scope.selectedSubCategory.subCategoryID);

        console.log(MyService.data.OrderJSON[0]);
        // $scope.CurrentItem = $scope.selectedItems;
        // MyService.data.OrderJSON[0].itemArray.push($scope.selectedItems)
        // console.log(MyService.data.OrderJSON[0]);  

        $scope.Modifiers = res.childItems;
        angular.forEach($scope.Modifiers, function (temp, key) {
            temp.isselected = false;
            temp.qty = 1;
        })
        $scope.modd = false;
    }
    $scope.moddFalse = function () {
        $scope.modd = true;
    }

    $scope.boxselected = function (modifier, index, command) {//modifier Selected
        $scope.selectedCategory = $scope.products[0];
        console.log($scope.products);
        $scope.SelectedModifiers = new Object();
        $scope.SelectedModifiers.modifierId = parseInt(modifier.ModifierID);
        $scope.SelectedModifiers.name = modifier.name;
        $scope.SelectedModifiers.qty = $scope.Modifiers[index].qty;
        $scope.SelectedModifiers.price = modifier.price;
        $scope.SelectedModifiers.total = parseFloat($scope.SelectedModifiers.qty) * parseFloat($scope.SelectedModifiers.price);
        $scope.SelectedModifiers.status = 102;
        $scope.SelectedModifiers.mode = "Add";
        var temp = $filter('filter')($scope.selectedItems.modifiersArray, function (item) { return item.modifierId == modifier.ModifierID; });
        if (temp.length == 0)
            $scope.selectedItems.modifiersArray.push($scope.SelectedModifiers)
        else {
            $scope.selectedItems.modifiersArray = $filter('filter')($scope.selectedItems.modifiersArray, function (item) { return item.modifierId != modifier.ModifierID; });
        }
        console.log(MyService.data.OrderJSON[0]);
    }

    ////////////////////// COUNTER////////////////////////
    $scope.decrement = function (index) {
        if ($scope.Modifiers[index].qty >= 2) {
            $scope.Modifiers[index].qty--;
        }
    };

    $scope.increment = function (index) {
        $scope.Modifiers[index].qty++;
    };
    $scope.qtyMod = function () {
        for (var i = 0; i < $scope.Modifiers.length; i++) {
            $scope.Modifiers[i].qty = $scope.value;
        }
    }

    $scope.carttoaddtocart = function () {
        MyService.data.OrderJSON[0].itemArray.push($scope.selectedItems)
        $state.go('add_to_cart');

    }
    ////////////////////END////////////////////////////

    $scope.getLocation = {};
    $scope.backtolocationmobile = function () {
        $state.go('locationmobile');
        $scope.getLocation = localStorage.getItem("Session_ID");
        $scope.setData = $scope.getLocation;
        // $scope.setData = JSON.parse($scope.getLocation);
        //$scope.id = $scope.setData.SessionID;//$scope.id = $scope.setData.SessionID;
       // localStorage.setItem("Id", JSON.stringify($scope.id));
    }
    $scope.burgertocart = function (res) {
        $scope.Modifiers = [];
    }

    $scope.bindSubCategory = function (res) {
        $scope.SubCategory = JSON.parse(res).subCategory;
    }
    $scope.bindItems = function (res) {
        $scope.Items = JSON.parse(res).items;
    }
});



app.controller("navCtrl", function ($scope, $rootScope) {
    $scope.openNav = function () {
        document.getElementById("mySidenav").style.width = "250px";
        document.body.style.backgroundColor = "rgba(0,0,0,0.4)";
    }

    $scope.closeNav = function () {
        document.getElementById("mySidenav").style.width = "0";
        document.body.style.backgroundColor = "white";
    }
});

app.controller("order_moreCtrl", function ($scope, $state, $rootScope) {
    $scope.cart = function () {
        $state.go('realMenu');
    }
});

app.controller("registerCtrl", function ($scope, $state, $rootScope, MyService) {
    $scope.gotoaddtocart = function () {
        $state.go('add_to_cart');
    }

    $scope.chk = function () {
        MyService.data.firstName = "PlaceOrder";
        $state.go('add_to_cart');
    }
});

app.controller("addtocartCtrl", function ($scope, $state, $rootScope, MyService) {

    var quantity = 1;
    $scope.Checkout = MyService.data.firstName;
    $scope.values = MyService.data.OrderJSON[0].itemArray;
    $scope.items = MyService.data.OrderJSON[0].itemArray[0].modifiersArray;
    $scope.grandTotal = 0;
    $scope.priceSet = 0;
    $scope.dltPrice = 0;
    MyService.data.firstName = 'Checkout';

    angular.forEach($scope.values, function (temp, key) {
        var tempprice = 0;
        var quantity = 1;
        tempprice = $scope.values[key].price;
        var modifiersArray = [];

        angular.forEach($scope.values[key].modifiersArray, function (temp1, key) {
            tempprice += temp1.total;
            modifiersArray.push(temp1.name);
        }
            )
        temp.totalPrice = tempprice;
        $scope.grandTotal += (temp.quantity * temp.totalPrice);
        temp.modifiersName = modifiersArray.join(", ");
    })

    $scope.registr = function (Checkout) {
        if (Checkout == 'Checkout') {
            $state.go('register');
        }
        else {
            $state.go('order_more');
        }
    }
    $scope.backtorealmenu = function () {
        $state.go('realMenu');
    }

    $scope.decrease = function (index, quantity, totalPrice) {
        if ($scope.values[index].quantity > 1) {
            $scope.values[index].quantity--;
            $scope.grandTotal -= parseFloat(totalPrice);
        }
    };
    $scope.increase = function (index, quantity, totalPrice) {
        $scope.values[index].quantity++;
        $scope.grandTotal += parseFloat(totalPrice);
    };

    $scope.deleteItem = function (item) {
        $scope.val = MyService.data.OrderJSON[0].itemArray;
        $scope.index = MyService.data.OrderJSON[0].itemArray.indexOf(item);
        $scope.val.splice($scope.index, 1);
        $scope.grandTotal = $scope.grandTotal - item.totalPrice;
    }

    $scope.cnfrmPickup = function () {
        $state.go('register');
    }
});

app.controller("OrderCtrl", function ($scope) {

    MenuHideShow();

  // setTimeout(() => {
    DefaultSetting();
    $("#accordion").accordion({ header: ".heading-title-accordian", collapsible: true, active: false });
  // }, 1000);
});

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