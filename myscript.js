var range, selection, parentEl=null;

function myFunction() {
   var text = getSelectedText();
   if (text){
      clearHighlights(document.body)
      highlightWord(document.body, text);
      if (range && parentEl){
         elems = parentEl.getElementsByClassName('highlighted');
         if (elems){
            range.selectNodeContents(elems[0]);
            selection.removeAllRanges();
            selection.addRange(range);  
         }         
      }
   }
}
function getSelectedText() {
   var text = "";
   if (window.getSelection){
      text = window.getSelection().toString();
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

function highlightWord(root, word){
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
         span.className = 'highlighted';
         span.appendChild(highlighted);
         replacementNode.parentNode.insertBefore(span, replacementNode);
      }
   }
}

function clearHighlights(rootNode){     
  [].forEach.call(rootNode.querySelectorAll('span.highlighted'), function(node){
    node.parentNode.replaceChild(node.firstChild, node);
  });
}
//chrome.browserAction.onClicked.addListener(function(tab) {
   document.body.ondblclick = myFunction;
//});