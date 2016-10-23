var clearPreviousSelection = true
var hlWithNewColor = true

var varMapping = {}

function validate(primary, secondary, primaryTT, secondaryTT){
	//this will work only work for current set of 2 options.
	//Will need to refactor/simplify this
   if (primary.checked){
		enable(primary)
		disable(secondary)
		secondary.checked = false
		varMapping[primary.id] = true
		varMapping[secondary.id] = false
		setToolTip(primary, '')
		setToolTip(secondary, secondaryTT)
   }
	else{
		disable(primary)
		enable(secondary)
		primary.checked = false
		secondary.checked = true
		varMapping[primary.id] = false
		varMapping[secondary.id] = true
		setToolTip(primary, primaryTT)
		setToolTip(secondary, '')
   }
	//console.log('Validate::'+varMapping)
}

function validate_clearPreivous(){
	var [clearPreivous, newColorHighlight] = getRuleElements()
	validate(clearPreivous, newColorHighlight, 'Disabled, because all new highlights will be of different color', 'Disabled, because all previous highlights will be cleared')
}

function validate_newColorHighlight(){
   var [clearPreivous, newColorHighlight] = getRuleElements()
	validate(newColorHighlight, clearPreivous, 'Disabled, because all previous highlights will be cleared', 'Disabled, because all new highlights will be of different color')
}

function savePreferences(){
	var [clearPreivous, newColorHighlight] = getRuleElements()
	data = {'clearPreviousSelection': varMapping[clearPreivous.id], 'hlWithNewColor': varMapping[newColorHighlight.id]}
	chrome.storage.local.set(data, function(){
		if(chrome.runtime.lastError)
			alert("Settings not saved\n!!"+chrome.runtime.lastError.message)
		alert('Settings saved')
   })
}

function cancel(){
   window.close()
}

function getRuleElements(){
	return [document.getElementById('cb_clear_previous_highlight'), document.getElementById('cb_highlight_with_new_color')]
}
window.onload = function() {
   var [clearPreivous, newColorHighlight] = getRuleElements()
	
	chrome.storage.local.get(['clearPreviousSelection', 'hlWithNewColor'], function(items) {
		//console.log('<--clearPreviousSelection::'+items['clearPreviousSelection'])
		//console.log('<--hlWithNewColor::'+items['hlWithNewColor'])
		if (items['clearPreviousSelection']){
			clearPreivous.checked = true;
			newColorHighlight.checked = false;
			validate_clearPreivous()
		}
		else if (items['hlWithNewColor']){
			newColorHighlight.checked = true;
			clearPreivous.checked = false;
			validate_newColorHighlight()
		}
		else{
			varMapping[clearPreivous.id] = true
			varMapping[newColorHighlight.id] = false
		}
		clearPreivous.onchange = validate_clearPreivous
		newColorHighlight.onchange = validate_newColorHighlight
		document.getElementById('bt_save').onclick = savePreferences
		document.getElementById('bt_cancel').onclick = cancel
		validate_clearPreivous()
   })
}

function disable(elem){
    elem.setAttribute('disabled', 'disabled')
}

function enable(elem){
   elem.removeAttribute('disabled')
}

function setToolTip(elem, message){
    elem.setAttribute("title", message)
}

function removeToolTip(elem){
    elem.removeAttribute("title")
}