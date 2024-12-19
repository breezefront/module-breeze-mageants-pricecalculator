define([
    "jquery",
    'priceUtils',
    'loader'
], function ($, priceUtils) {
    'use strict';

    var priceFormat = {};
    var FlooringProductInit = {
        FlooringProductInit: function (config) {
            console.log(config);
            this.config = config;
            if(config && config.isflooring) {
                var self = this;
                this.coverage           = parseFloat(config.coverage);
                this.sqftInputId    = "#flooring_input";
                this.price = config.price;
                this.specialprice = config.specialprice;
                this.taxPercent = config.tax_percent * 1;
                this.currencyRate = config.currency_rate * 1;
                this.includeTax = config.include_tax * 1;
                this.unitPrice = config.unit_price;
                this.wastage    = config.wastage * 1;
                this.taxDisplay = config.tax_display_type;
                this.newTier = config.new_tier;
                this.sample_price = config.sample_price;
                this.price_type = config.price_type;
                this.final_price = parseFloat(config.final_price);
                this.incl_price = parseFloat(config.incl_price);
                this.excl_price = parseFloat(config.excl_price);
                this.product_type = config.product_type;
                this.config_simple_prices = config.config_simple_prices;
                this.config_simple_covrage = config.config_simple_covrage;
                this.flooringEnable = config.isflooring;
                this.config_simple_specialprices = config.config_simple_specialprices;

                self.load();

                console.log("tax....."+this.taxPercent)
            }
        },
        load : function(){
            var self = this;
            localStorage.setItem('confiurableprice', 0);
            localStorage.setItem('configurablecoverage', 0);
            localStorage.setItem('confiurablespecialprice', 0);

            //$('.loader-example').spinner(true); // Breeze fix: commented

            // To disable loader
            // $('.loader-example').loader('hide');
            setTimeout(function() {
                $('.loader-example').spinner(false); // Breeze fix: loader => spinner
                $('.product-info-main .product-info-price').show();
                self.getFromSqftInput();
            }, 1500);

            // hide normal tier prices block if new tier is active
            if(this.newTier == 1){
                $('.prices-tier').hide();
                $('#tier-price').show();

            }else{
                $('#tieredPriceTable').hide();
            }

            var sample_price = self.sample_price;

            totalBoxWrapper('#TotalCartonContainer');

            function totalBoxWrapper(boxselecter)
            {
                if ($(boxselecter).length) {
                  self.getFromSqftInput();
                }
                else {
                    setTimeout(function() {
                        totalBoxWrapper(boxselecter);
                    }, 3000);
                }
            }


            var sqftInput = $(this.sqftInputId);
            sqftInput.on('keyup', function(){ // Breeze fix: keyup => on('keyup')
                sqftInput.val(sqftInput.val().replace(/[^0-9.]/g,''));
                self.getFromSqftInput();
            });

            $('#qty').on('keyup', function(){ // Breeze fix: keyup => on('keyup')
                $('#qty').val($('#qty').val().replace(/[^0-9]/g,''));
                self.getFromQties();
            });

            $('.catalog-product-view .decrease').click(function () {
                $('#qty').val($('#qty').val().replace(/[^0-9]/g,''));
                self.getFromQties();
            });
            $('.catalog-product-view .increase').click(function () {
               $('#qty').val($('#qty').val().replace(/[^0-9]/g,''));
                self.getFromQties();
            });

          //for configurable product selection
            //get the selected simple product price
            var confPriceAdd = 0;
            var selectedPrice = 0;
            var _self = this;
            $('.super-attribute-select').click(function (el) {
                console.log("clicked...........");
                var temp = false;
                selectedPrice = parseFloat($('option:selected', this).attr('price'));
                if(selectedPrice)
                {
                    confPriceAdd = confPriceAdd + selectedPrice;

                    var intervalrefresh = setInterval(function () {
                        if(temp==false){
                            _self.getFromSqftInput();
                        }
                        temp = true;
                        clearInterval(intervalrefresh);
                    }, 100);
                }

            });

       $( ".product-options-wrapper .swatch-opt" ).click(function() {
          //  var selProId = ($('[data-role=swatch-options]').data('mage-SwatchRenderer').getProduct());
           // console.log(_self.config_simple_prices[selProId]);
            _self.getFromSqftInput();
        });

            //for custom option selection

            var confPriceAdd = 0;
            var selectedPrice = 0;
            $('select.product-custom-option').click(function (el) {
                var temp = false;
                selectedPrice = parseFloat($('option:selected', this).attr('price'));
                if(selectedPrice)
                {
                    confPriceAdd = confPriceAdd + selectedPrice;
                }

                    var intervalrefresh = setInterval(function () {
                        if(temp==false){
                            _self.getFromSqftInput();
                        }
                        temp = true;
                        clearInterval(intervalrefresh);
                    }, 100);

            });

            $('.product-custom-option').on('click', function(){ // Breeze fix: click => on('click')
                var temp = false;
                if(this.checked)
                {
                    selectedPrice = parseFloat($(this).attr('price'));
                    confPriceAdd = confPriceAdd + selectedPrice;
                }
                    var intervalrefresh = setInterval(function () {
                    if(temp==false){
                        _self.getFromSqftInput();
                    }
                    temp = true;
                    clearInterval(intervalrefresh);
                }, 100);
            });


            $(document).on('click', '.catalog-product-view .qty-wrapper.qty-arrows .qty-switcher-inc', function() {// Breeze fix: jQuery => $
                self.getFromQties();
            });
            $(document).on('click', '.catalog-product-view .qty-wrapper.qty-arrows .qty-switcher-dec', function() {// Breeze fix: jQuery => $
                self.getFromQties();
            });


            if($('#wastage') !== undefined){
                $('#wastage').click(function () {
                    self.getFromSqftInput();
                });
            }

            if($('#free_sample') !== undefined){
                $('#free_sample').on('click', function(){ // Breeze fix: click => on('click')
                    if ($(this).is(':checked')) {
                        sqftInput.val(null);
                        sqftInput.prop('disabled',true);
                        $('#wastage').prop('disabled', true);
                        $('#qty').val(1);
                        self.getFromQty();
                        $('#qty').prop('disabled',true);
                        if($('#ActualSquareFeetContainer') != undefined){
                            $('#ActualSquareFeetContainer').html(0);
                        }
                        if($('#CartonPriceContainer') != undefined){
                            $('#CartonPriceContainer').html(priceUtils.formatPrice(0,priceFormat));
                        }
                        if($('#TotalPriceContainer') != undefined){
                            $('#TotalPriceContainer').html(priceUtils.formatPrice(self.sample_price,priceFormat));
                        }
                        if($('#TotalCartonContainer') != undefined){
                            $('#TotalCartonContainer').html(0) ;
                        }


                    }else {
                        sqftInput.prop('disabled',false);
                        $('#wastage').prop('disabled', false);
                        $('#qty').prop('disabled',false);
                        if(parseInt($('#qty').val()) == 0){
                            $('#qty').val(1);
                        }
                        self.getFromQty();
                    }
                });
            }




            var configurablecovrage = 0;
            configurablecovrage = localStorage.getItem('configurablecoverage');
            console.log(".........configurablecoverage 1======="+configurablecovrage);

            var coverage = this.coverage;

            if(configurablecovrage != 0)
            {
                coverage = parseFloat(configurablecovrage);
            }
            else
            {
                 if(this.config)
                {
                    if(this.config.coverage)
                    {
                        coverage = this.config.coverage;
                    }
                }
            }

            self.getFromQty();
            if(this.config){
                if(this.config.options){
                    $.each(this.config.options, function (index, option){
                        $(this).on('click', function(){ // Breeze fix: click => on('click')
                            sqftInput.prop('enabled',true);
                            $('#qty').prop('enabled',true);
                            if(parseInt($('#qty').val()) == 0){
                                $('#qty').val(1);
                            }
                            self.getFromQty();
                        });
                    });
                }
                if(this.config.checkbox){
                    $.each(this.config.checkbox, function (idx, option){
                        $(this).on('click', function(){ // Breeze fix: click => on('click')
                            self.getFromSqftInput();
                        });
                    });
                }
            }

            //for configurable product selection
            $('.super-attribute-select').each(function (el) {
                $(this).on('change', function () { // Breeze fix: change => on('change')
                    self.getFromSqftInput();
                })
            });
            //for configurable product selection
            //for custom option selection
            $('.product-custom-option').each(function (el) {
                $(this).on('change', function () { // Breeze fix: change => on('change')
                    self.getFromSqftInput();
                })
            });

            //for custom option selection
        },
        getFormattedNumber : function(n){
            if (!n) return 0;
            return (Math.round(n * 100)/100).toString();
        },
        getFromSqftInput : function(){
            var val = parseFloat($(this.sqftInputId).val());
            var coverage = this.coverage;

            var configurablecovrage = 0;
            configurablecovrage = localStorage.getItem('configurablecoverage');
            console.log(".........configurablecoverage 2======="+configurablecovrage);

            if(configurablecovrage != 0)
            {
                coverage = parseFloat(configurablecovrage);
            }
            else
            {
                if(this.config)
                {
                    if(this.config.coverage){
                         coverage = this.config.coverage;
                    }
                }
            }



            if (!val || val <= 0){
                val = coverage;
            }

            var unitPrice = this.unitPrice;
            if(this.config)
            {
                if(this.config.unitPrice){
                    if(this.config.unitPrice=="0"){
                        this.unitPrice = false;
                    }else{
                        this.unitPrice = true;
                    }
                }
            }
            var wastage = 0;
            if($('#wastage').is(":checked")){
                wastage = this.wastage;
            }


            if(wastage > 0){
                val = val * (1 + wastage/100);
            }

            var boxes = parseInt(val / coverage);
            var check = val / coverage;

            if (boxes < check){
                boxes = boxes + 1;
            }
            if (boxes < 1){
                boxes = 1;
            }
            $('#qty').val(boxes);

            this.getFromQty();
        },
        getFromQty : function(){
            var  boxes = parseInt($('#qty').val());
            if (boxes < 1) {
                boxes = 1;
                $('#qty').val(boxes);
            }

            var coverage = this.coverage;

            var configurablecovrage = 0;
            configurablecovrage = localStorage.getItem('configurablecoverage');
            console.log(".........configurablecoverage 3======="+configurablecovrage);

            if(configurablecovrage != 0)
            {
                coverage = parseFloat(configurablecovrage);
            }
            else
            {
                if(this.config){
                    if(this.config.coverage){
                         coverage = this.config.coverage;
                    }
                }
            }

            var coverageValue = this.getFormattedNumber(coverage);
            if($('#converage-class') != undefined){
                $('#converage-class').html(coverageValue);
            }

            var actual = this.getFormattedNumber(coverage * boxes);
            if($('#ActualSquareFeetContainer') != undefined){
                $('#ActualSquareFeetContainer').html(actual);
            }

            this.getPrice();
        },
        getFromQties : function(){
            var  boxes = parseInt($('#qty').val());
            if (boxes < 1) {
                boxes = 1;
                $('#qty').val(boxes);
            }
            var coverage = this.coverage;

            var configurablecovrage = 0;
            configurablecovrage = localStorage.getItem('configurablecoverage');
            console.log(".........configurablecoverage 4======="+configurablecovrage);

            if(configurablecovrage != 0)
            {
                coverage = parseFloat(configurablecovrage);
            }
            else
            {
                if(this.config){
                    if(this.config.coverage){
                         coverage = this.config.coverage;
                    }
                }
            }

            console.log("new coverae..."+coverage);

            var coverageValue = this.getFormattedNumber(coverage);
            if($('#converage-class') != undefined){
                $('#converage-class').html(coverageValue);
            }

            var actual = this.getFormattedNumber(coverage * boxes);
            if($('#ActualSquareFeetContainer') != undefined){
                $('#ActualSquareFeetContainer').html(actual);
            }

            $(this.sqftInputId).val(actual);
            this.getPrice();
        },
        getPrice : function(){
            var val = parseInt($('#qty').val());

            if($('#TotalCartonContainer') != undefined){
                $('#TotalCartonContainer').html(val) ;
            }

            var price   = parseFloat(this.price * 1);

            var configurablePrice = 0;
            configurablePrice = localStorage.getItem('confiurableprice');
            console.log(".........configurablePrice======="+configurablePrice);

            var configurableSpecialPrice = 0;
            configurableSpecialPrice = localStorage.getItem('confiurablespecialprice');
            console.log(".........configurablespecialPrice======="+configurableSpecialPrice);

           /* if($('.old-price.no-display').length)
            {
                $('.old-price.no-display').hide();
            }*/


            var configurablecovrage = 0;
            configurablecovrage = localStorage.getItem('configurablecoverage');
            console.log(".........configurablecoverage 5======="+configurablecovrage);

            var specialprice   = parseFloat(this.specialprice * 1);

            var coverage = parseFloat(this.coverage * 1);

            if(configurablecovrage != 0)
            {
                coverage = parseFloat(configurablecovrage * 1);
            }
            else
            {
                if(this.config){
                    if(this.config.coverage){
                         coverage = parseFloat(this.config.coverage * 1);

                    }
                }
            }

            var tprice = 0;
            var rate = this.currencyRate;
            var inclTax = this.includeTax;
            var displayTax = this.taxDisplay;
            var config = this.config;

            var unitPrice = this.unitPrice;

            if(this.config){
            if(this.config.unitPrice){
                if(this.config.unitPrice==false){
                     this.unitPrice = false;
                }else{
                     this.unitPrice = true;
                }
            }
            }

            if(unitPrice && this.config.price_type!="2"){
                val = val * coverage;
            }

            if(rate == 0){
                rate = 1;
            }
            var taxPercent = parseFloat(this.taxPercent * 1);
            if(this.config){
            if(this.config.taxPercent){
                taxPercent = parseFloat(this.config.taxPercent * 1);
            }
            }

            var includeTax = this.includeTax;
         if(this.config){
            if(this.config.price){
                price = this.config.price;
            }
            }
        if(this.config){
            if(this.config.price_type=="2"){
                if (this.config.prices){
                        $.each(this.config.prices, function (indx, item){
                           var qty = parseFloat(item.price_qty);
                            if (val >= qty){
                                tprice = parseFloat(item.website_price);
                            }
                        });
                        if (tprice && (tprice < price)){
                            price = tprice;
                        }
                }
            }
            if(this.config.price_type=="1" || this.config.price_type=="0"){
                if (this.config.prices){
                        $.each(this.config.prices, function (indx, item){
                            var qty = parseFloat(item.price_qty);
                            if(unitPrice){
                                var qty = parseFloat(item.price_qty)*coverage;
                            }
                            if (val >= qty){
                                price = parseFloat(item.website_price);
                            }
                        });
                }
            }
        }

        //for configurable product selection
        //get the selected simple product price
        var confPriceAdd = 0;
        var selectedPrice = 0;
        $('.super-attribute-select').each(function (el) {
            var selectedPrice = parseFloat($('option:selected', this).attr('price'));
            confPriceAdd = confPriceAdd + selectedPrice;
        });
        //for configurable product selection

        //for custom option selection

        var confPriceAdd = 0;
        var selectedPrice = 0;
        $('select.product-custom-option').each(function (el) {
            var selectedPrice = parseFloat($('option:selected', this).attr('price'));
            confPriceAdd = confPriceAdd + selectedPrice;
        });

        var _self = this;
        $('.product-custom-option').each(function (el) {

            if(this.checked)
            {
                var selectedPrice = parseFloat($(this).attr('price'));
                confPriceAdd = confPriceAdd + selectedPrice;

            }

        });

        //for custom option selection

        if(confPriceAdd) {
            price = price + confPriceAdd;
            specialprice = specialprice + confPriceAdd;
        }
        if(configurablePrice != 0)
        {
            price = configurablePrice;
            console.log("if......."+configurablePrice);
        }
        else
        {
            price = price;
            console.log("else......."+price);
        }

        if(configurableSpecialPrice != 0)
        {
            specialprice = configurableSpecialPrice;
            console.log("if specialprice......."+configurableSpecialPrice);
        }
        else
        {
            specialprice = specialprice;
            console.log("else specialprice......."+specialprice);
        }

        if(this.taxPercent > 0)
        {
            var pricetaxamount = (price*this.taxPercent)/100;
            var includingpricetax = parseFloat(price)+parseFloat(pricetaxamount.toFixed(2));
            $('#sqFtActualprice').html(priceUtils.formatPrice(includingpricetax,priceFormat));
        }
        else
        {
            $('#sqFtActualprice').html(priceUtils.formatPrice(price,priceFormat));
        }

      //  price = 500;

        var boxPrice = rate * price;
        console.log("price...."+price);
        console.log("boxPrice...."+boxPrice);
        console.log("specialprice...."+specialprice);
        var specialboxprice = rate * specialprice;


        if(unitPrice && this.config.price_type!="2"){
            boxPrice = rate * price * coverage;
            specialboxprice = rate * specialprice * coverage;
        }

        var sqftPrice = rate * (price/coverage);
        var specialsqftPrice = rate * (specialprice/coverage);
        if(unitPrice && this.config.price_type!="2"){
              sqftPrice = rate * price;
              specialsqftPrice = rate * specialprice;
        }

        var taxamount = (boxPrice.toFixed(2)*this.taxPercent)/100;

        var includingPrice = parseFloat(boxPrice)+parseFloat(taxamount.toFixed(2));

        if($('#CartonPriceContainer') != undefined){
            $('#CartonPriceContainer').html(priceUtils.formatPrice(includingPrice,priceFormat));
        }

        if($('#PricePerSqMetreContainer') != undefined){
            $('#PricePerSqMetreContainer').html(priceUtils.formatPrice(sqftPrice,priceFormat));
        }

        var added = 0;
    if(this.config){
        if(this.config.options){
            $.each(this.config.options, function (indx, option){
                if($(this).checked == true){
                    added = parseFloat(option.price);
                }
            });
        }
        }

        var total = 0;
        var specialpricetotal = 0;

        total = rate * (price + added);
        specialpricetotal = rate * (specialprice + added);
        total = total * val;
        specialpricetotal = specialpricetotal * val;

        var totalExclTax = 0;
        var totalInclTax = 0;
        var specialpricetotalExclTax = 0;
        var specialpricetotalInclTax = 0;

        if(inclTax == 1){
            totalInclTax = total.toFixed(2);
            specialpricetotalInclTax = specialpricetotal.toFixed(2);
            totalExclTax = total * 100/(taxPercent +100 );
            specialpricetotalExclTax = specialpricetotal * 100/(taxPercent +100 );
        }else {
            var qty = parseInt($('#qty').val());
            totalInclTax = (parseFloat(includingPrice).toFixed(2)*qty);
            //totalInclTax = total.toFixed(2) * (1+taxPercent.toFixed(2)/100);
            specialpricetotalInclTax = specialpricetotal.toFixed(2) * (1+taxPercent.toFixed(2)/100);
            /*line added start*/
            var final_price = this.final_price;
            if(this.config){
            if(this.config.final_price){
                final_price = this.config.final_price;
            }
            }
            total = final_price * val;
            /*line added end */
            totalExclTax = total;
            specialpricetotalExclTax = specialpricetotal;
        }

        var excludeTax = priceUtils.formatPrice(totalExclTax,priceFormat);

        var includeTax = priceUtils.formatPrice(totalInclTax,priceFormat);

        var specialpricetotalExclTax = priceUtils.formatPrice(specialpricetotalExclTax,priceFormat);
        var specialpricetotalInclTax = priceUtils.formatPrice(specialpricetotalInclTax,priceFormat);

        console.warn("Found product base prices "+includeTax);

        if($('#TotalPriceInclTaxContainer') != undefined){
            $('#TotalPriceInclTaxContainer').html(includeTax);
        }
        $('.product-info-main .price-including-tax span[data-price-type="finalPrice"] .price').html(includeTax);
        $('.product-info-main span[data-price-type="finalPrice"] .price').each(function(j) {
            if(includeTax != "€ 0,00"){
                console.warn("Found product base prices includeTax"+includeTax);
            $(this).html(includeTax);
            }
        });
        $('.product-info-main .price-including-tax span[data-price-type="finalPrice"] .price').each(function(j) {
        if(includeTax != "€ 0,00"){
            $(this).html(includeTax);
        }
        });

        $('.product-info-main span[data-price-type="oldPrice"] .price').each(function(j) {
            $(this).html(specialpricetotalInclTax);
        });

        $('.product-info-main span[data-price-type="basePrice"] .price').each(function(j) {
            $(this).html(excludeTax);
        });

        // jQuery('.product-view-style-03 .product-info-main .price-box').css({
//'display': 'block;'
//});


        var check = priceUtils.formatPrice(rate * (price + added),priceFormat);
        this.addTierRowClass(check);

        },
        addTierRowClass : function(bs){
            $("#tieredPriceTable tr").css({"background":"none", "font-weight": "normal"});
            //$("#tieredPriceTable tr:contains("+bs+")").css({"background":"#FDFCDC", "font-weight": "bold"});

            $(".prices-tier li").css({"background":"none", "font-weight": "normal"});
            //$(".prices-tier li:contains("+bs+")").css({"background":"#FDFCDC", "font-weight": "bold"});
        },


    };


    return FlooringProductInit;
});
