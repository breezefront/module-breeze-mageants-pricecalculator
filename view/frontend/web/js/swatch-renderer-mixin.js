define([
    'jquery',
    'FlooringProductInit'
], function ($, FlooringProductInit) {
    'use strict';

    $.mixinSuper('SwatchRenderer', {
        _UpdatePrice: function () {
            var allSelected = true;
            for(var i = 0; i<this.options.jsonConfig.attributes.length;i++){
                if (!$('div.product-info-main .product-options-wrapper .swatch-attribute.' + this.options.jsonConfig.attributes[i].code).attr('data-option-selected')){
                    allSelected = false;
                }
            }
            var simpleSku = $('div.product-info-main .sku .value').html();
            if(FlooringProductInit.flooringEnable) {
                // if (allSelected){
                //     var products = this._CalcProducts();
                //     simpleSku = this.options.jsonConfig.skus[products.slice().shift()];
                // }
                var products = this._CalcProducts();
                if (products) {
                    simpleSku = this.options.jsonConfig.skus[products.slice().shift()];
                }

                var confiurableprice = 0;
                var confiurablespecialprice=0;
                var configCovrage = FlooringProductInit.coverage;

                confiurableprice = FlooringProductInit.config_simple_prices[simpleSku];

                localStorage.setItem('confiurableprice', confiurableprice);

                confiurablespecialprice = FlooringProductInit.config_simple_specialprices[simpleSku];

                localStorage.setItem('confiurablespecialprice', confiurablespecialprice);


                configCovrage = FlooringProductInit.config_simple_covrage[simpleSku];
                localStorage.setItem('configurablecoverage', configCovrage);

                if (typeof FlooringProductInit.config_simple_oldprices_html[simpleSku] != 'undefined') {
                    var simple_oldprices = FlooringProductInit.config_simple_oldprices_html[simpleSku];
                    $('p#msrpTitle').html(simple_oldprices);
                    $('p#msrpTitle').show();
                } else {
                    $('p#msrpTitle').hide();
                    $('p#msrpTitle').html('');
                }

                $('div.product-info-main .sku .value').html(simpleSku);
            }

            var result = this._super();
            if(FlooringProductInit.flooringEnable) {
                FlooringProductInit.getFromSqftInput();
            }
            return result;
        }
    });
});
