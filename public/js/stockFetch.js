$(window).load(function () {
            StockPriceTicker();
            setInterval(function() {StockPriceTicker();} , 60000);
        });
        function StockPriceTicker() {
            var Symbol = "", CompName = "", Price = "", ChnageInPrice = "", PercentChnageInPrice = ""; 
            var CNames = "^FTSE,AAPL,BBBY,NVDA,GOOG,AMZN,UA,^VIX,NFLX";
            var flickerAPI = "https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20yahoo.finance.quotes%20where%20symbol%20in%20(%22" + CNames + "%22)&env=store://datatables.org/alltableswithkeys";
            var StockTickerHTML = "";
            
            var StockTickerXML = $.get(flickerAPI, function(xml) {
                $(xml).find("quote").each(function () {
                    Symbol = $(this).attr("symbol");
                    $(this).find("Name").each(function () {
                        CompName = $(this).text();
                    });
                    $(this).find("LastTradePriceOnly").each(function () {
                        Price = $(this).text();
                    });
                    $(this).find("Change").each(function () {
                        ChnageInPrice = $(this).text();
                    });
                    $(this).find("PercentChange").each(function () {
                        PercentChnageInPrice = $(this).text();
                    });
                    
                    var PriceClass = "GreenText", PriceIcon="up_green";
                    if(parseFloat(ChnageInPrice) < 0) { PriceClass = "RedText"; PriceIcon="down_red"; }
                    StockTickerHTML = StockTickerHTML + "<span class='" + PriceClass + "'>";
                    StockTickerHTML = StockTickerHTML + "<span class='quote'>" + CompName + " (" + Symbol + ")</span> ";
                    
                    StockTickerHTML = StockTickerHTML + parseFloat(Price).toFixed(2) + " ";
                    StockTickerHTML = StockTickerHTML + "<span class='" + PriceIcon + "'></span>" + parseFloat(Math.abs(ChnageInPrice)).toFixed(2) + " (";
                    StockTickerHTML = StockTickerHTML + parseFloat( Math.abs(PercentChnageInPrice.split('%')[0])).toFixed(2) + "%)</span>";
                });
				
                $("#dvStockTicker").html(StockTickerHTML);
                $("#dvStockTicker").jStockTicker({interval: 30, speed: 2});
            });
        }