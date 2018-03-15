(function(){
    function main(platform){
        return {

            start: function (config, element, state) {

                
                return new Promise(function (resolve, reject) {
                   return platform.assets.get("hospital.css", "text")
                        .then(function (text) {
                            var head = document.head || document.getElementsByTagName('head')[0];
                            var style = document.createElement("style");
                            style.type = 'text/css';
                            style.innerHTML = text;
                            head.appendChild(style);

                            var body = document.body || document.getElementsByTagName('body')[0];
                            var container = document.createElement('div');
                            var canvas = document.createElement('canvas');
                            var drhospital = document.createElement('div');
                            canvas.id = "canvas_hospital";
                            container.id = "container";
                            container.className = "center-this";
                            drhospital.id = "drhospital";
                            drhospital.appendChild(canvas);
                            container.appendChild(drhospital);

                            body.appendChild(container);
                            return Promise.resolve();
                        }).then(function () {

                            return platform.insertScript("scripts/vendor/TweenMax.min.js").then(function () {
                                    return platform.insertScript("scripts/vendor/pixi.min.js").then(function () {
                                            return platform.insertScript("scripts/vendor/createjs.min.js").then(function () {
                                                    return platform.insertScript("scripts/vendor/vendor.min.js").then(function () {
                                                            return platform.insertScript("scripts/vendor/jquery-3.1.1.slim.min.js").then(function () {
                                                                    return platform.insertScript("scripts/vendor/howler.min.js").then(function () {
                                                                                return platform.insertScript("scripts/main.min.js").then(function () {
                                                                                     return platform.loadScript("startGame.js").then(function (main) {
                                                                                         main(platform, element, resolve);  
                                                                                        });

                                                                                });
                                                                        });
                                                                });
                                                        });
                                                });
                                        });
                           });
                       });
                        }).catch(reject);
                
            },
            stop: function(){
                //return Promise.resolve();
            },
            suspend: function(){},
            removeAll: function(){}
        };
    };
    return main;
})();
