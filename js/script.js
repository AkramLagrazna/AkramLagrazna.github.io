$(function () {
    'use strict';

    var dropTarget = $('.b-drop-target'),
        dropResult = $('.b-drop-result'),
        dataCanvas = $('.b-data-canvas'),
        colorsList = $('.b-colors-list'),
        loader = $('.b-loader'),
        ctx = document.getElementById('b-data-canvas').getContext('2d');

    var kMeans;
    kMeans = function(imageData, type) {
        var w = imageData.width,
            h = imageData.height,
            data = imageData.data,
            pixels = [],
            clusters = [],
            step = 4,
            k = 5, // HERE YOU CAN CHANGE COUNT OF CLUSTERS
            i = 0, max = 0;

        /**
         * Prepare pixels data
         */
        for (var y = 0; y < h; y++) {
            for (var x = 0; x < w; x++) {
                var r = 0,
                    g = 0,
                    b = 0;

                r = data[( (w * y) + x ) * step];
                g = data[( (w * y) + x ) * step + 1];
                b = data[( (w * y) + x ) * step + 2];

                pixels.push([r, g, b]);
            }
        }

        var pixelsIsEqual;
        pixelsIsEqual = function(p1, p2, near) {
            if (near) {
                var treshold = 25;
                if ( ( p1[0] > p2[0] - treshold &&
                       p1[0] < p2[0] + treshold ) &&
                     ( p1[1] > p2[1] - treshold &&
                       p1[1] < p2[1] + treshold ) &&
                     ( p1[2] > p2[2] - treshold &&
                       p1[2] < p2[2] + treshold) ) {
                    return true;
                }
            } else {
                if (p1[0] === p2[0] && p1[1] === p2[1] && p1[2] === p2[2]) {
                    return true;
                }
            }
            return false;
        };

        /**
         * Select init claster
         */
        var prevColor = [255, 255, 255],
            clusterNumber = 0;

        for (i = 0, max = pixels.length; i < max; i++) {
            if (clusterNumber === k) { break; }
            if (!pixelsIsEqual(pixels[i], prevColor) && !pixelsIsEqual(pixels[i], [255, 255, 255], true)) {
                clusters.push({
                    'old_center': [],
                    'center': [pixels[i][0], pixels[i][1], pixels[i][2]],
                    'pixels_count': 0,
                    'sum': [0, 0, 0]
                });

                clusterNumber++;
                prevColor = pixels[i];
            }
        }


        /**
         * Refer color to cluster
         */
        var continueWhile = true;
        while (continueWhile) {
            for (i = 0, max = pixels.length; i < max; i++) {
                if (pixelsIsEqual(pixels[i], [255, 255, 255])) {  // Ignoring white color
                    continue;
                }

                var whichCluster = false,
                    min_dist = 999999;

                for (var j = 0, max2 = clusters.length; j < max2; j++) {
                    var dr = pixels[i][0] - clusters[j].center[0],
                        dg = pixels[i][1] - clusters[j].center[1],
                        db = pixels[i][2] - clusters[j].center[2];

                    var dist = Math.floor( Math.sqrt( Math.pow(dr,2) + Math.pow(dg,2) + Math.pow(db,2) ) );

                    if (dist < min_dist) {
                        min_dist = dist;
                        whichCluster = j;
                    }
                }

                clusters[whichCluster].sum[0] += pixels[i][0];
                clusters[whichCluster].sum[1] += pixels[i][1];
                clusters[whichCluster].sum[2] += pixels[i][2];
                clusters[whichCluster].pixels_count += 1;
            }

            /**
             * Recalculate clusters centres
             */
            var notChanged = [];
            for (i = 0, max = clusters.length; i < max; i++) {
                clusters[i].old_center = [clusters[i].center[0], clusters[i].center[1], clusters[i].center[2]];
                if (clusters[i].pixels_count !== 0) {
                    clusters[i].center[0] = Math.ceil(clusters[i].sum[0] / clusters[i].pixels_count);
                    clusters[i].center[1] = Math.ceil(clusters[i].sum[1] / clusters[i].pixels_count);
                    clusters[i].center[2] = Math.ceil(clusters[i].sum[2] / clusters[i].pixels_count);
                }

                if (pixelsIsEqual(clusters[i].old_center, clusters[i].center)) {
                    notChanged.push(true);
                } else {
                    notChanged.push(false);
                }
            }


            for (i = 0, max = notChanged.length; i < max; i++) {
                if (notChanged[i] === false) {
                    continueWhile = true;
                    break;
                } else {
                    continueWhile = false;
                }
            }
        }

        var result = [];
        for (i = 0, max = clusters.length; i < max; i++) {
            result.push([clusters[i].center[0], clusters[i].center[1], clusters[i].center[2], clusters[i].pixels_count]);
        }

        result = result.sort(function (a, b) {
            if (a[3] < b[3]) {
                return 1;
            } else if (a[3] > b[3]) {
                return -1;
            }
            return 0;
        });

        loader.hide();
        showResult(result);
    };

    var getHex;
    getHex = function(color) {
        var r = color[0].toString(16),
            g = color[1].toString(16),
            b = color[2].toString(16);

        if (r.length < 2) {
            r = '0' + r;
        }
        if (g.length < 2) {
            g = '0' + g;
        }
        if (b.length < 2) {
            b = '0' + b;
        }

        return '#' + r + g + b;
    };

    var shadeColor = function (hex, percent) {
        var num = parseInt(hex.replace('#',''), 16),
            amt = Math.round(2.55 * percent),
            R = (num >> 16) + amt,
            B = (num >> 8 & 0x00FF) + amt,
            G = (num & 0x0000FF) + amt;

        return '#' + (0x1000000 + (R<255?R<1?0:R:255)*0x10000 + (B<255?B<1?0:B:255)*0x100 + (G<255?G<1?0:G:255)).toString(16).slice(1);
    };

    var showResult;
    showResult = function(colors) {

        var firstHex = getHex(colors[0]),
            shaded = shadeColor(firstHex, -14),
            style = '';

        style += 'background-image: -webkit-linear-gradient(top right, ' + firstHex + ' 0%, ' + shaded + ' 100%);';
        style += ' background-image: -webkit-gradient(linear, right top, left bottom, color-stop(0, ' + firstHex + '), color-stop(1, ' + shaded + ');';
        style += ' background-image: -o-linear-gradient(top right, ' + firstHex + ' 0%, ' + shaded + ' 100%);';
        style += ' background-image: -moz-linear-gradient(top right, ' + firstHex + ' 0%, ' + shaded + ' 100%);';

        $('html').attr('style', 'background-image: -webkit-linear-gradient(top right, ' + firstHex + ' 0%, ' + shaded + ' 100%)');

        for (var i = 0, max = colors.length; i < max; i++) {
            // console.log(colors[i]);
            var color =  '<li style="background: ' + getHex(colors[i]) + ';" class="b-colors-list_item">';
                color +=     '<span class="b-colors-list_item_title">' + getHex(colors[i]) + '</span>';
                color += '</li>';

            colorsList.append(color);
        }
    };

    dropTarget.bind({
        dragenter: function(evt) {
            evt.preventDefault();
            evt.stopPropagation();

            dropTarget.addClass('b-drop-target__drag-enter');
        },
        dragover: function() {
            return false;
        },
        dragleave: function(evt) {
            evt.preventDefault();
            evt.stopPropagation();

            dropTarget.removeClass('b-drop-target__drag-enter');
        },
        drop: function(evt) {
            evt.preventDefault();
            evt.stopPropagation();
            dropTarget.removeClass('b-drop-target__drag-enter');

            var dt = evt.originalEvent.dataTransfer;
            var loadStatus = 0,
                imgW = 0,
                imgH = 0;
            var file = dt.files[0],
                type = file.type.split('/')[1];

            if (type === 'jpeg' || type === 'png') {
                dropTarget.hide();
                dropResult.removeClass('b-drop-result__hiden');
                loader.show();

                var reader = new FileReader();

                reader.onload = function (evt) {
                    dropResult.attr('src', evt.target.result);

                    var img = new Image();
                    img.src = evt.target.result;

                    img.onload = function(evt) {
                        imgW = $(this)[0].width;
                        imgH = $(this)[0].height;

                        dataCanvas.width(imgW);
                        dataCanvas.height(imgH);

                        ctx.canvas.width = imgW;
                        ctx.canvas.height = imgH;

                        ctx.drawImage(img, 0, 0);

                        if (loadStatus === 1) {
                            setTimeout(function () {
                                kMeans(ctx.getImageData(0, 0, imgW, imgH), type);
                            }, 300);

                        } else {
                            loadStatus = 1;
                        }
                    };

                    dropResult.on('load', function () {
                        if (loadStatus === 1) {
                            setTimeout(function () {
                                kMeans(ctx.getImageData(0, 0, imgW, imgH), type);
                            }, 300);
                        } else {
                            loadStatus = 1;
                        }
                    });
                };

                reader.readAsDataURL(file);

            } else {
                alert('Not an image!');
                return false;
            }
        }
    });
});
