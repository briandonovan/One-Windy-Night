var OneWindyNight = function(objOpenTypeFont, intFontSizePx){
  this.font = objOpenTypeFont;
  this.intFontSizePx = intFontSizePx;
  this.strSvgNS = 'http://www.w3.org/2000/svg';
  this.nodeSvgElementOffscreen = this.createNodeSvgElementOffscreen();
  this.config = {};
  this.config.blnShowBorders = false;
  this.config.numCoeffVertOffsetInlineOWNedText = 0.355; // Decimal value
};

OneWindyNight.prototype.createNodeSvgElementOffscreen = function(){
  var nodeSvgElement = document.createElementNS(this.strSvgNS,'svg');
  nodeSvgElement.style.visibility='hidden';
  nodeSvgElement.style.position='absolute';
  nodeSvgElement.style.left = nodeSvgElement.style.top = '-500px';
  nodeSvgElement.style.height = nodeSvgElement.style.width = '100px';
  document.body.appendChild(nodeSvgElement);
  return nodeSvgElement;
}

OneWindyNight.prototype.getIntBaselineYPx = function(){
  return Math.floor(0.78*this.intFontSizePx) + 5;
}

OneWindyNight.prototype.getIntCanvasPixelsPadRtBott = function(){
  return 5 + Math.floor(0.1*this.intFontSizePx);
}

OneWindyNight.prototype.rtnNodeSpanContainingArgText = function(strText){
  var nodeSpanContainingArgText = document.createElement('span');
  nodeSpanContainingArgText.appendChild(document.createTextNode(strText));
  nodeSpanContainingArgText.setAttribute('style', 'color:blue; font-size:55px;');
  nodeSpanContainingArgText.setAttribute('class', 'OneWindyNight-dropcap');
  return nodeSpanContainingArgText;
}

OneWindyNight.prototype.rtnNodeSvgCircle = function(intRadius, intX, intY, strFillColor='red', blnHidden=false){
  var nodeSvgCircle = document.createElementNS(this.strSvgNS,"circle");
  nodeSvgCircle.setAttribute('fill', strFillColor);
  nodeSvgCircle.setAttribute('r', intRadius);
  nodeSvgCircle.setAttribute('cx', intX);
  nodeSvgCircle.setAttribute('cy', intY);
  if (blnHidden == true){
    nodeSvgCircle.style.visibility = 'hidden';
  }
  return nodeSvgCircle;
}

OneWindyNight.prototype.rtnNodeTitleForSvgText = function(strText) {
  var nodeTitleElement = document.createElementNS(this.strSvgNS,'title')
  var nodeTextForTitleEl = document.createTextNode(strText);
  nodeTitleElement.appendChild(nodeTextForTitleEl);
  return nodeTitleElement;
}

OneWindyNight.prototype.rtnObjDimensionsTextUsingOffscreenSvg = function(strText){
  var nodeSvgElement = this.nodeSvgElementOffscreen;
  var path = this.font.getPath(strText, 0, this.getIntBaselineYPx(), this.intFontSizePx);
  var nodeSvgElementPath = document.createElementNS(this.strSvgNS,'path');
  nodeSvgElementPath.style.fill='transparent';
  var strSvgPathData = path.toPathData(2);
  nodeSvgElementPath.setAttribute('d', strSvgPathData);
  nodeSvgElement.appendChild(nodeSvgElementPath);
  var rectBBox = nodeSvgElementPath.getBBox();
  var intSvgPathTotalLength = nodeSvgElementPath.getTotalLength();
  var objSvgPathInfoText = {'height': Math.ceil(rectBBox.height),
                            'width': Math.ceil(rectBBox.width),
                            'totallength': intSvgPathTotalLength,
                            'strpath': strSvgPathData};
  nodeSvgElementPath.remove();
  return objSvgPathInfoText;
}

OneWindyNight.prototype.rtnNodeCanvasContainingArgText = function(strText){
  var objDimensionsText = this.rtnObjDimensionsTextUsingOffscreenSvg(strText);
  var nodeCanvasContainingText = document.createElement('canvas');
  nodeCanvasContainingText.appendChild(document.createTextNode(strText));
  nodeCanvasContainingText.setAttribute('height', objDimensionsText.height + this.getIntCanvasPixelsPadRtBott());
  nodeCanvasContainingText.setAttribute('width', objDimensionsText.width + this.getIntCanvasPixelsPadRtBott());
  if (this.config.blnShowBorders == true){
    nodeCanvasContainingText.style.border = '1px solid green';
  }
  var ctx = nodeCanvasContainingText.getContext('2d');
  //ctx.setTransform(1, .05, 0, 1, 0, 0);
  var path = this.font.getPath(strText, 0, this.getIntBaselineYPx(), this.intFontSizePx);
  path.draw(ctx);
  return nodeCanvasContainingText;
}

OneWindyNight.prototype.rtnNodeSvgContainingArgText = function(strText, strColor='red'){
  var objDimensionsText = this.rtnObjDimensionsTextUsingOffscreenSvg(strText);
  var nodeSvgElement = document.createElementNS(this.strSvgNS,'svg');
  nodeSvgElement.setAttribute('height', objDimensionsText.height + this.getIntCanvasPixelsPadRtBott());
  nodeSvgElement.setAttribute('width', objDimensionsText.width + this.getIntCanvasPixelsPadRtBott());
  if (this.config.blnShowBorders == true){
    nodeSvgElement.style.border = '1px solid orange';
  }
  var nodeSvgElementPath = document.createElementNS(this.strSvgNS,'path');
  nodeSvgElementPath.style.fill=strColor;
  nodeSvgElementPath.setAttribute('d', objDimensionsText.strpath);
  nodeSvgElement.appendChild(nodeSvgElementPath);
  nodeSvgElement.appendChild(this.rtnNodeTitleForSvgText(strText));
  return nodeSvgElement;
}

OneWindyNight.prototype.runOWNonFirstLetterInOneNode = function(nodeOWNtarget, blnSVG=false){
  if(nodeOWNtarget.textContent.length > 0) {
    var twTargetNodeTextNodeChildren = document.createTreeWalker(nodeOWNtarget, NodeFilter.SHOW_TEXT);
    var nodeExactTarget = twTargetNodeTextNodeChildren.firstChild();
    nodeExactTarget.normalize();
    var nodeOWNedFirstLetter = null;
    if (blnSVG == true){
      nodeOWNedFirstLetter = this.rtnNodeSvgContainingArgText(nodeExactTarget.textContent.charAt(0));
      nodeOWNedFirstLetter.setAttribute('class', 'OneWindyNight OWN-1stletter-svg');
    } else {
      nodeOWNedFirstLetter = this.rtnNodeCanvasContainingArgText(nodeExactTarget.textContent.charAt(0));
      nodeOWNedFirstLetter.setAttribute('class', 'OneWindyNight OWN-1stletter-canvas');
    }
    nodeExactTarget.textContent = nodeExactTarget.textContent.substring(1, nodeExactTarget.textContent.length);
    nodeExactTarget.parentNode.insertBefore(nodeOWNedFirstLetter, nodeExactTarget);
    return nodeOWNedFirstLetter;
  }
}

OneWindyNight.prototype.runOWNonFirstWordInOneNode = function(nodeOWNtarget, blnSVG=false){
  if(nodeOWNtarget.textContent.length > 0) {
    var twTargetNodeTextNodeChildren = document.createTreeWalker(nodeOWNtarget, NodeFilter.SHOW_TEXT);
    var nodeExactTarget = twTargetNodeTextNodeChildren.firstChild();
    var strFirstWord = nodeExactTarget.textContent.split(' ', 1)[0];
    var nodeOWNedFirstWord = null;
    if (blnSVG == true){
      nodeOWNedFirstWord = this.rtnNodeSvgContainingArgText(strFirstWord);
    } else {
      nodeOWNedFirstWord = this.rtnNodeCanvasContainingArgText(strFirstWord);
    }
    nodeExactTarget.textContent = nodeExactTarget.textContent.substring(strFirstWord.length, nodeExactTarget.textContent.length);
    nodeExactTarget.parentNode.insertBefore(nodeOWNedFirstWord, nodeExactTarget);
    return nodeOWNedFirstWord;
  }
}

OneWindyNight.prototype.getPxMoveDownForInline = function(numFontSize=this.intFontSizePx){
  var intOffset = Math.floor(this.config.numCoeffVertOffsetInlineOWNedText*this.intFontSizePx);
  return intOffset;
}

OneWindyNight.prototype.runOWNonFirstWordInAllElementsWithTagName = function(strTagName='', blnSVG=false, blnInline=true, blnMatchFontSize=false){
  var ndcolTargets  = document.getElementsByTagName(strTagName);
  if (ndcolTargets.length == 0) {return false;}
  var intSavedFontSize = this.intFontSizePx;
  var nodeOWNedFirstWord = null;
  for (var i=0; i<ndcolTargets.length; i++){
    if (blnMatchFontSize == true){this.intFontSizePx = parseFloat(window.getComputedStyle(ndcolTargets[i]).fontSize);}
    nodeOWNedFirstWord = this.runOWNonFirstWordInOneNode(ndcolTargets[i], blnSVG);
    if (blnInline == true){
      nodeOWNedFirstWord.style.position = 'relative';
      nodeOWNedFirstWord.style.top = this.getPxMoveDownForInline()+'px';
    }
  }
  this.intFontSizePx = intSavedFontSize;
  return true;
}

OneWindyNight.prototype.runOWNonFirstLetterInAllElementsWithTagName = function(strTagName='', blnSVG=false, blnInline=true){
  var ndcolTargets  = document.getElementsByTagName(strTagName);
  if (ndcolTargets.length == 0) {return false;}
  var intSavedFontSize = this.intFontSizePx;
  var nodeOWNedFirstLetter = null;
  for (var i=0; i<ndcolTargets.length; i++){
    if (blnMatchFontSize == true){this.intFontSizePx = parseFloat(window.getComputedStyle(ndcolTargets[i]).fontSize);}
    nodeOWNedFirstLetter = this.runOWNonFirstLetterInOneNode(ndcolTargets[i], blnSVG);
    if (blnInline == true){
      nodeOWNedFirstLetter.style.position = 'relative';
      nodeOWNedFirstLetter.style.top = this.getPxMoveDownForInline()+'px';
    }
  }
  this.intFontSizePx = intSavedFontSize;
  return true;
}

OneWindyNight.prototype.runOWNonAllTextOfElementWithId = function(strElementId='', blnSVG=false, blnInline=true){
  var nodeTarget = document.getElementById(strElementId);
  if (nodeTarget == null) {return false;}
  nodeTarget.normalize();
  var nodeOWNedText = null;
  if (blnSVG == true){
    nodeOWNedText = this.rtnNodeSvgContainingArgText(nodeTarget.textContent, 'blue');
    nodeTarget.replaceChild(nodeOWNedText, nodeTarget.childNodes[0]);
  } else {
    nodeOWNedText = this.rtnNodeCanvasContainingArgText(nodeTarget.textContent, 'blue');
    nodeTarget.replaceChild(nodeOWNedText, nodeTarget.childNodes[0]);
  }
  if (blnInline == true){
    nodeOWNedText.style.position = 'relative';
    nodeOWNedText.style.top = this.getPxMoveDownForInline()+'px';
  }
  return true;
}

OneWindyNight.prototype.runOWNonAllTextOfElementWithClassName = function(strClassName='', blnSVG=false, blnInline=true, blnMatchFontSize=false){
  var ndcolTargets = document.getElementsByClassName(strClassName);
  if (ndcolTargets.length == 0) {return false;}
  var intSavedFontSize = this.intFontSizePx;
  for (var i=0; i<ndcolTargets.length; i++){
    var nodeTarget = ndcolTargets[i];
    nodeTarget.normalize();
    var numFontSize = parseFloat(window.getComputedStyle(nodeTarget).fontSize);
    if (blnMatchFontSize == true){this.intFontSizePx = parseFloat(window.getComputedStyle(nodeTarget).fontSize);}
    var nodeOWNedText = null;
    if (blnSVG == true){
      nodeOWNedText = this.rtnNodeSvgContainingArgText(nodeTarget.textContent, 'blue');
      nodeTarget.replaceChild(nodeOWNedText, nodeTarget.childNodes[0]);
    } else {
      nodeOWNedText = this.rtnNodeCanvasContainingArgText(nodeTarget.textContent, 'blue');
      nodeTarget.replaceChild(nodeOWNedText, nodeTarget.childNodes[0]);
    }
    if (blnInline == true){
      nodeOWNedText.style.position = 'relative';
      nodeOWNedText.style.top = this.getPxMoveDownForInline(numFontSize)+'px';
    }
  }
  this.intFontSizePx = intSavedFontSize;
  return true;
}

OneWindyNight.prototype.rtnNodeSvgDottedOutlinesArgText = function(strText, strColor='red'){
  var objDimensionsText = this.rtnObjDimensionsTextUsingOffscreenSvg(strText);
  var nodeSvgElement = document.createElementNS(this.strSvgNS,'svg');
  nodeSvgElement.appendChild(this.rtnNodeTitleForSvgText(strText));
  nodeSvgElement.setAttribute('class', 'OneWindyNight OWN-dropcap-svg');
  nodeSvgElement.setAttribute('height', objDimensionsText.height + this.getIntCanvasPixelsPadRtBott());
  nodeSvgElement.setAttribute('width', objDimensionsText.width + this.getIntCanvasPixelsPadRtBott());
  if (this.config.blnShowBorders == true){
    nodeSvgElement.style.border = '1px solid red';
  }
  var nodeSvgElementPath = document.createElementNS(this.strSvgNS,'path');
  nodeSvgElementPath.style.fill='transparent';
  nodeSvgElementPath.setAttribute('d', objDimensionsText.strpath);
  nodeSvgElement.appendChild(nodeSvgElementPath);
  var objSvgPoint = null;
  var nodeSvgCircle = null;
  for (var i=0; i<objDimensionsText.totallength; i+=40) {
    objSvgPoint = nodeSvgElementPath.getPointAtLength(i);
    nodeSvgCircle = this.rtnNodeSvgCircle(0.65, Math.ceil(objSvgPoint.x), Math.ceil(objSvgPoint.y), 'rgb(100,100,100)');
    nodeSvgElement.appendChild(nodeSvgCircle);
  }
  return nodeSvgElement;
}

OneWindyNight.prototype.rtnNodeSvgAnimContainingArgText_SeeingSpots = function(strText, strSpotColor='rgb(50,50,50)'){
  var objDimensionsText = this.rtnObjDimensionsTextUsingOffscreenSvg(strText);
  var nodeSvgElement = document.createElementNS(this.strSvgNS,'svg');
  nodeSvgElement.setAttribute('class', 'OneWindyNight OWN-dropcap-svg OWN-anim-seeing-spots');
  nodeSvgElement.setAttribute('height', objDimensionsText.height + this.getIntCanvasPixelsPadRtBott());
  nodeSvgElement.setAttribute('width', objDimensionsText.width + this.getIntCanvasPixelsPadRtBott());
  if (this.config.blnShowBorders == true){
    nodeSvgElement.style.border = '1px solid red';
  }
  var nodeSvgElementPath = document.createElementNS(this.strSvgNS,'path');
  nodeSvgElementPath.style.fill='transparent';
  nodeSvgElementPath.setAttribute('d', objDimensionsText.strpath);
  nodeSvgElement.appendChild(nodeSvgElementPath);
  var objSvgPoint = null;
  var nodeSvgCircle = null;
  //---------------------
  var nodeSvgGrpShowAlways = document.createElementNS(this.strSvgNS,'g');
  nodeSvgGrpShowAlways.setAttribute('class', 'always');
  var nodeSvgGrpMod05 = document.createElementNS(this.strSvgNS,'g');
  nodeSvgGrpMod05.setAttribute('class', 'mod05');
  var nodeSvgGrpMod12 = document.createElementNS(this.strSvgNS,'g');
  nodeSvgGrpMod12.setAttribute('class', 'mod12');
  var nodeSvgGrpMod08 = document.createElementNS(this.strSvgNS,'g');
  nodeSvgGrpMod08.setAttribute('class', 'mod08');
  var nodeSvgGrpMod06 = document.createElementNS(this.strSvgNS,'g');
  nodeSvgGrpMod06.setAttribute('class', 'mod06');
  var nodeSvgGrpModRest = document.createElementNS(this.strSvgNS,'g');
  nodeSvgGrpModRest.setAttribute('class', 'modrest');
  //---------------------
  for (var i=0; i<objDimensionsText.totallength; i+=2) {
    objSvgPoint = nodeSvgElementPath.getPointAtLength(i);
    if (i % 20 == 0) {
      nodeSvgCircle = this.rtnNodeSvgCircle(0.65, Math.ceil(objSvgPoint.x), Math.ceil(objSvgPoint.y), strSpotColor);
      nodeSvgGrpShowAlways.appendChild(nodeSvgCircle);
    } else {
      nodeSvgCircle = this.rtnNodeSvgCircle(0.65, Math.ceil(objSvgPoint.x), Math.ceil(objSvgPoint.y), strSpotColor);
      if (i % 5 == 0) {
        nodeSvgGrpMod05.appendChild(nodeSvgCircle);
      } else if (i % 12 == 0) {
        nodeSvgGrpMod12.appendChild(nodeSvgCircle);
      } else if (i % 8 == 0) {
        nodeSvgGrpMod08.appendChild(nodeSvgCircle);
      } else if (i % 6 == 0) {
        nodeSvgGrpMod06.appendChild(nodeSvgCircle);
      } else {
        nodeSvgGrpModRest.appendChild(nodeSvgCircle);
      }
    }
  }
  //---------------------
  nodeSvgElement.appendChild(nodeSvgGrpShowAlways);
  nodeSvgElement.appendChild(nodeSvgGrpMod05);
  nodeSvgElement.appendChild(nodeSvgGrpMod12);
  nodeSvgElement.appendChild(nodeSvgGrpMod08);
  nodeSvgElement.appendChild(nodeSvgGrpMod06);
  nodeSvgElement.appendChild(nodeSvgGrpModRest);
  //---------------------
  return nodeSvgElement;
}

OneWindyNight.prototype.makeAnim_SeeingSpots = function(strText){
  var nodeAnimSeeingSpots = this.rtnNodeSvgAnimContainingArgText_SeeingSpots(strText);
  nodeAnimSeeingSpots.appendChild(this.rtnNodeTitleForSvgText(strText));
  document.head.innerHTML += `<style type="text/css">
  .OWN-anim-seeing-spots .always circle {
    animation-iteration-count: infinite;
    animation-direction: alternate;
    animation-duration: 9s;
    animation-name: OWNanimSeeingSpotsAlways;
  }
  .OWN-anim-seeing-spots .mod05 {
    animation-iteration-count: infinite;
    animation-direction: alternate;
    animation-duration: 1.25s;
    animation-name: OWNanimSeeingSpotsA;
  }
  .OWN-anim-seeing-spots .mod12 {
    animation-iteration-count: infinite;
    animation-direction: alternate;
    animation-duration: 4.25s;
    animation-name: OWNanimSeeingSpotsB;
  }
  .OWN-anim-seeing-spots .mod08 {
    animation-iteration-count: infinite;
    animation-direction: alternate;
    animation-duration: 3.5s;
    animation-name: OWNanimSeeingSpotsC;
  }
  .OWN-anim-seeing-spots .mod06 {
    animation-iteration-count: infinite;
    animation-direction: alternate;
    animation-duration: 6.5s;
    animation-name: OWNanimSeeingSpotsD;
  }
  .OWN-anim-seeing-spots .modrest {
    animation-iteration-count: infinite;
    animation-direction: alternate;
    animation-duration: 5.75s;
    animation-name: OWNanimSeeingSpotsE;
  }
  @keyframes OWNanimSeeingSpotsAlways {
    from {
      fill: currentColor;
      stroke: transparent;
      stroke-width: 0px;
    }
    40% {
      fill: blue;
      stroke: blue;
      stroke-width: 1px;
    }
    60% {
      fill: transparent;
      stroke: transparent;
      stroke-width: 0px;
    }
    to {
      fill: currentColor;
      stroke: transparent;
      stroke-width: 0px;
    }
  }
  @keyframes OWNanimSeeingSpotsA {
    from {
      opacity: 1.0;
      stroke-width: 0px;
    }
    to {
      opacity: 0.0;
      stroke-width: 0.5px;
    }
  }
  @keyframes OWNanimSeeingSpotsB {
    from {
      opacity: 1.0;
    }
    to {
      opacity: 0.0;
    }
  }
  @keyframes OWNanimSeeingSpotsC {
    from {
      opacity: 1.0;
    }
    to {
      opacity: 0.0;
    }
  }
  @keyframes OWNanimSeeingSpotsD {
    from {
      opacity: 1.0;
    }
    to {
      opacity: 0.0;
    }
  }
  @keyframes OWNanimSeeingSpotsE {
    from {
      opacity: 1.0;
      fill: red;
      stroke: red;
      stroke-width: 1px;
    }
    to {
      opacity: 0.0;
      fill: currentColor;
      stroke: transparent;
      stroke-width: 0px;
    }
  }
  </style>`;
  return nodeAnimSeeingSpots;
}

OneWindyNight.prototype.makeSvgAnim_SeeingSpots_onFirstWordInOneNode = function(nodeOWNtarget){
  if(nodeOWNtarget.textContent.length > 0) {
    var twTargetNodeTextNodeChildren = document.createTreeWalker(nodeOWNtarget, NodeFilter.SHOW_TEXT);
    var nodeExactTarget = twTargetNodeTextNodeChildren.firstChild();
    var strFirstWord = nodeExactTarget.textContent.split(' ', 1)[0];
    var nodeOWNedFirstWord = this.makeAnim_SeeingSpots(strFirstWord);
    nodeExactTarget.textContent = nodeExactTarget.textContent.substring(strFirstWord.length, nodeExactTarget.textContent.length);
    nodeExactTarget.parentNode.insertBefore(nodeOWNedFirstWord, nodeExactTarget);
    return true;
  }
}

OneWindyNight.prototype.makeSvgAnim_SeeingSpots_onFirstLetterInOneNode = function(nodeOWNtarget){
  if(nodeOWNtarget.textContent.length > 0) {
    var twTargetNodeTextNodeChildren = document.createTreeWalker(nodeOWNtarget, NodeFilter.SHOW_TEXT);
    var nodeExactTarget = twTargetNodeTextNodeChildren.firstChild();
    nodeExactTarget.normalize();
    var nodeOWNedFirstLetter = this.makeAnim_SeeingSpots(nodeExactTarget.textContent.charAt(0));
    nodeExactTarget.textContent = nodeExactTarget.textContent.substring(1, nodeExactTarget.textContent.length);
    nodeExactTarget.parentNode.insertBefore(nodeOWNedFirstLetter, nodeExactTarget);
    return true;
  }
}
