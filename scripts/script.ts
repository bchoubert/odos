
import JsonType from './JsonType';

import * as anime from 'animejs';

const host = 'https://odos-bertrand-choubert.c9users.io';

// GETTING THE DATASET
const dataFolder = '/data/';
const datasetFolder = '6-storm';
var data = null;

const title: HTMLElement = document.getElementById('title');
const mainContent: HTMLElement = document.getElementById('mainContent');
const imagesContent: HTMLElement = document.getElementById('imagesContent');

const templates = {
    selector: (color, id, index) => { return `
        <div class='selector' style='background-color:${color}' data-selector='${id}' data-index='${index}' data-choice='0' >
            <img class='arrow-t arrow' src='dist/images/arrow-t.png' data-type='up' />
            <img class='arrow-b arrow' src='dist/images/arrow-b.png' data-type='down' />
        </div>`;
    },
    image: (image, id, index) => {
        return `<img class='choice' data-selector='${id}' src='${image}' style='z-index: ${index}' />`;
    },
    imageElement: (image, id, index) => {
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
request.onreadystatechange = () => {
    if (request.readyState == 4 && request.status == 200) {
        parseDataset(request.responseText);
    }
}
request.open('GET', host + dataFolder + datasetFolder + '/datafile.json');
request.send();

var parseDataset = (dataset) => {
    data = <JsonType> JSON.parse(dataset);
    
    // FIXING TITLE
    title.innerHTML = `Get your ${data.productName}!`;
    
    anime({
        targets: '#title',
        fontSize: ['300%', '250%'],
        direction: 'alternate',
        loop: true,
        duration: 300,
        delay: 100,
        easing: 'easeInQuad'
    });
    
    data.selectors.forEach((selector, index) => {
        var color = selector.choices[0].color;
        mainContent.innerHTML += templates.selector(color, selector.name, index + 1);
        imagesContent.innerHTML += templates.image(host + dataFolder + datasetFolder + '/' + selector.choices[0].picture, selector.name, index + 1);
    });
};

mainContent.addEventListener('click', (e) => {
   if ((<any> e.target).classList.contains('arrow')) {
       
        var arrowElement = e.target;
        var selectorElement = (<any> arrowElement).parentNode;
        
        var oldChoice: number = (<any> selectorElement).getAttribute('data-choice');
        var selectorId: string = (<any> selectorElement).getAttribute('data-selector');
        var type: string = (<any> arrowElement).getAttribute('data-type');
        var selector = data.selectors.filter(selector => selector.name === selectorId)[0];
        var choiceLength: number = selector.choices.length;
        
        var newChoice: number = oldChoice;
        if (type === 'up') {
            newChoice = +oldChoice - 1;
        } else {
            newChoice = +oldChoice + 1;
        }
        
        if (newChoice < 0) {
            newChoice = choiceLength - 1;
        }
        if (newChoice >= choiceLength) {
            newChoice = 0;
        }
        
        var choice = selector.choices[newChoice];
        
        // Manage selector attributes
        selectorElement.setAttribute('data-choice', newChoice);
        selectorElement.style.backgroundColor = choice.color;
        
        // Manage images
        var imagesToDelete = document.querySelectorAll(`img[data-selector='${selectorId}']`);
        (<any> Array).from(imagesToDelete).forEach((imageToDelete) => imageToDelete.parentNode.removeChild(imageToDelete));
        
        //imagesContent.innerHTML += templates.image(host + dataFolder + datasetFolder + '/' + choice.picture, selectorId);
        
        imagesContent.appendChild(templates.imageElement(host + dataFolder + datasetFolder + '/' + choice.picture, selectorId, selectorElement.getAttribute('data-index')));
   }
});
