define("script", ["require", "exports", "animejs"], function (require, exports, anime) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var host = 'https://odos-bertrand-choubert.c9users.io';
    var dataFolder = '/data/';
    var datasetFolder = '6-storm';
    var data = null;
    var title = document.getElementById('title');
    var mainContent = document.getElementById('mainContent');
    var imagesContent = document.getElementById('imagesContent');
    var templates = {
        selector: function (color, id, index) {
            return "<div class='selector' style='background-color:" + color + "' data-selector='" + id + "' data-index='" + index + "' data-choice='0' >\n            <img class='arrow-t arrow' src='dist/images/arrow-t.png' data-type='up' />\n            <img class='arrow-b arrow' src='dist/images/arrow-b.png' data-type='down' />\n        </div>";
        },
        image: function (image, id, index) {
            return "<img class='choice' data-selector='" + id + "' src='" + image + "' style='z-index: " + index + "' />";
        },
        imageElement: function (image, id, index) {
            var imgNode = document.createElement("IMG");
            var classAttr = document.createAttribute('class');
            classAttr.value = 'choice';
            var selectorAttr = document.createAttribute('data-selector');
            selectorAttr.value = id;
            var srcAttr = document.createAttribute('src');
            srcAttr.value = image;
            var styleAttr = document.createAttribute('style');
            styleAttr.value = 'z-index: ' + index;
            imgNode.setAttributeNode(classAttr);
            imgNode.setAttributeNode(selectorAttr);
            imgNode.setAttributeNode(srcAttr);
            imgNode.setAttributeNode(styleAttr);
            return imgNode;
        }
    };
    var request = new XMLHttpRequest();
    request.onreadystatechange = function () {
        if (request.readyState == 4 && request.status == 200) {
            parseDataset(request.responseText);
        }
    };
    request.open('GET', host + dataFolder + datasetFolder + '/datafile.json');
    request.send();
    var parseDataset = function (dataset) {
        data = JSON.parse(dataset);
        title.innerHTML = "Get your " + data.productName + "!";
        anime({
            targets: '#title',
            fontSize: ['300%', '250%'],
            direction: 'alternate',
            loop: true,
            duration: 300,
            delay: 100,
            easing: 'easeInQuad'
        });
        data.selectors.forEach(function (selector, index) {
            var color = selector.choices[0].color;
            mainContent.innerHTML += templates.selector(color, selector.name, index + 1);
            imagesContent.innerHTML += templates.image(host + dataFolder + datasetFolder + '/' + selector.choices[0].picture, selector.name, index + 1);
        });
    };
    mainContent.addEventListener('click', function (e) {
        if (e.target.classList.contains('arrow')) {
            var arrowElement = e.target;
            var selectorElement = arrowElement.parentNode;
            var oldChoice = selectorElement.getAttribute('data-choice');
            var selectorId = selectorElement.getAttribute('data-selector');
            var type = arrowElement.getAttribute('data-type');
            var selector = data.selectors.filter(function (selector) { return selector.name === selectorId; })[0];
            var choiceLength = selector.choices.length;
            var newChoice = oldChoice;
            if (type === 'up') {
                newChoice = +oldChoice - 1;
            }
            else {
                newChoice = +oldChoice + 1;
            }
            if (newChoice < 0) {
                newChoice = choiceLength - 1;
            }
            if (newChoice >= choiceLength) {
                newChoice = 0;
            }
            var choice = selector.choices[newChoice];
            selectorElement.setAttribute('data-choice', newChoice);
            selectorElement.style.backgroundColor = choice.color;
            var imagesToDelete = document.querySelectorAll("img[data-selector='" + selectorId + "']");
            Array.from(imagesToDelete).forEach(function (imageToDelete) { return imageToDelete.parentNode.removeChild(imageToDelete); });
            imagesContent.appendChild(templates.imageElement(host + dataFolder + datasetFolder + '/' + choice.picture, selectorId, selectorElement.getAttribute('data-index')));
        }
    });
});
//# sourceMappingURL=script.js.map