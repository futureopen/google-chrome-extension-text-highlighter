var range, selection, parentEl=null;
var clearPreviousSelection, hlWithNewColor;
var ctr = 1

function completeHighlight() {
   chrome.storage.local.get(['clearPreviousSelection', 'hlWithNewColor'], function(items) {
      //console.log("ITEMS FETCHED"+items);
      hlWithNewColor = items['hlWithNewColor'];
      clearPreviousSelection = items['clearPreviousSelection'];
		var text = getSelectedText().trim();
		var color, className;
		if (text){
			//console.log('clearPreviousSelection::'+clearPreviousSelection)
			//console.log('hlWithNewColor::'+hlWithNewColor)
			if (clearPreviousSelection)
				clearHighlights(document.body)
			if (hlWithNewColor){
				color = randomRGB()
				className = createCSS(ctr, color);
				ctr += 1
			}
			highlightWord(document.body, text, color, className);
			//Set the selection back what was selected
			if (range && parentEl){
				elems = parentEl.getElementsByClassName('highlighted')
				if (elems){
					var elem = elems[0];
					for(var i=0; i<elems.length; ++i){
						if (elems[i].innerText == text){
							elem = elems[i];
							continue;
						}
					}
					range.selectNodeContents(elem);
					selection.removeAllRanges();
					selection.addRange(range);
				}
			}
		}
   })
}

function getSelectedText() {
   var text = "";
   if (window.getSelection){
      text = window.getSelection().toString();
      //Next steps are to get the element where the selection occured.
      //This is all to make sure, we end up re-selecting the word after the double-click
		//Still need to improve this logic.Not complete yet
      selection = window.getSelection();
      if (selection.rangeCount) {
         parentEl = selection.getRangeAt(0).commonAncestorContainer;
         if (parentEl.nodeType != 1) {
            parentEl = parentEl.parentNode;
            range = document.createRange();
         }
      }
   }
   else if (document.selection && document.selection.type != "Control")
      text = document.selection.createRange().text;
   return text;
}

function highlightWord(root, word, color, className){
   textNodeChildren(root).forEach(highlightWords);

   function textNodeChildren(root){
      var treeWalker = document.createTreeWalker(root,NodeFilter.SHOW_TEXT,null,false), textNodes=[], node;
      while(node=treeWalker.nextNode()) textNodes.push(node);
      return textNodes;
   }
    
   function highlightWords(node){
      for (var item; (item=node.nodeValue.indexOf(word, item)) > -1; node=replacementNode){
         var replacementNode = node.splitText(item+word.length);
         var highlighted = node.splitText(item);
         var span = document.createElement('span');
			if (typeof className == 'undefined')
				//Need this in case we dont send a class name, when we want to keep clearing every next text selection
				className = 'highlighted'
			span.className = className;
         span.appendChild(highlighted);
         replacementNode.parentNode.insertBefore(span, replacementNode);
      }
   }
}

function createCSS(ctr, color){
	//Dynamically create the CSS to highlight the selected text with a specific color
	var className = 'highlighted'+ctr;
	var style = document.createElement('style');
	style.type = 'text/css';
	style.innerHTML = '.'+className+'{background:'+color+'}';
	document.getElementsByTagName('head')[0].appendChild(style);
	return className
}

function randomRGB(){
	var hexLetters = '0123456789ABCDEF';
	var colorHex = '#';
	for (var i=0; i<6; i++ ) {
		colorHex += hexLetters[Math.floor(Math.random() * 16)];
	}
	return colorHex;
}
function clearHighlights(rootNode){
	var toClearItem = 'span.highlighted'
	//Clear all highlighted span classes
	//Dynamically created ones
	for(var i=1; i<=ctr; ++i){
		clearClassNameHighlights(rootNode, toClearItem+i)
	}
	//The static one too
	clearClassNameHighlights(rootNode, toClearItem)
	//Reset the "ctr" 
	ctr = 1
}

function clearClassNameHighlights(rootNode, className){
	[].forEach.call(rootNode.querySelectorAll(className), function(node){
		node.parentNode.replaceChild(node.firstChild, node);
	});
}
document.body.ondblclick = completeHighlight;