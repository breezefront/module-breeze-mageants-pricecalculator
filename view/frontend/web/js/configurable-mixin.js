define([
    'jquery',
    'FlooringProductInit'
], function ($, FlooringProductInit) {
    'use strict';

    $.mixinSuper('configurable', {
        _reloadPrice: function () {
            var result = this._super();
            var simpleSku = this.options.spConfig.skus[this.simpleProduct];

            if(FlooringProductInit.flooringEnable)
            {
                if(simpleSku && simpleSku != '' && typeof(simpleSku)!== "undefined") {
                    var confiurableprice = 0;
                    var confiurablespecialprice = 0;
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

                    FlooringProductInit.getFromSqftInput();
                }
            }

            return result;
        }
    });
});
