function validate() {
    return false;
}

/*
 * TODO: Fetch a cookie and check boxes according to what it says
 */
function checkCookie() {

    checkboxes = document.getElementsByClassName('romajicheckbox');
    cookie = getCookie();
    for (var i = 0, n = checkboxes.length; i < n; i++) {
        checkboxes[i].checked = cookie[i].checked;
    }
}

/*
 * TODO: checkRow and checkAllBox must also check if all romajicheckboxes (except for
 * the one named "all") are checked. This will not be implemented until then.
 */
function checkAll(source) {
    checkboxes = document.getElementsByClassName('romajicheckbox');
    for (var i = 0, n = checkboxes.length; i < n; i++) {
        checkboxes[i].checked = source.checked;
    }

	setSize();
	
	checkDakuten();
}

function checkIfAll() {
    checkboxes = document.getElementsByClassName('romajicheckbox');
    allbox = checkboxes[0];
    checkboxes = shift(checkboxes);

    allchecked = true;
    for (var i = 0, n = checkboxes.length; i < n; i++) {
        if (checkboxes[i].checked == false) {
            allchecked = false;
        }
    }

    allbox.checked = allchecked;
}

/*SHIFT*/
function shift(source) {
    temp = [];
    for (var i = 1, n = source.length; i < n; i++) {
        temp.push(source[i]);
    }

    return temp;
}

/*CONTAINS*/
function contains(source, element) {
	//alert("contains called!");
	contain = false;
	//alert("success!");
	for (var i = 0, n = source.length; i < n; i++) {
		//alert("loop successful!");
		if (source[i] == element) {
			contain = true;
		}
	}
	return contain;
}

/*
 * Called when an all-box is clicked. Checks or unchecks all boxes in a row.
 */
function checkRow(source) {
    childname = source.name.replace("all", "");

    checkboxes = document.getElementsByName(childname);
    for (var i = 0, n = checkboxes.length; i < n; i++) {
        checkboxes[i].checked = source.checked;
    }

    setSize();

    checkIfAll();
	
	checkDakuten();
}

/*
 * Called when a non all-box is clicked. If the box was checked, it will check if
 * all other boxes are checked; if so, it will check the corresponding all-box. 
 * If the box was unchecked, it will uncheck the corresponding all-box.
 */
function checkAllBox(source) {
    if (source.checked == true) {
        checkboxes = document.getElementsByName(source.name);
        allchecked = true;
        for (var i = 0, n = checkboxes.length; i < n; i++) {
            if (checkboxes[i].checked == false) {
                allchecked = false;
            }
        }
        if (allchecked == true) {
            master = document.getElementsByName("all" + source.name);
            master[0].checked = true;
        }

    } else {
        master = document.getElementsByName("all" + source.name);
        master[0].checked = false;
    }

    //setSize();

    checkIfAll();
	
	checkDakuten();
}

function checkDakuten() {
	dakuten = document.getElementById('dakuten').checked;
	
	if (dakuten) {
		setSize();
		a1 = ["ka","ki","ku","ke","ko","sa","shi","su","se","so","ta","chi","tsu","te","to"];
		a2 = ["ha","hi","fhu","he","ho"];
		number = 0;
		
		checkboxes = document.getElementsByClassName('romajicheckbox');
		for (var i = 0, n = a1.length; i < n; i++) {
			for (var j = 0, o = checkboxes.length; j < o; j++) {
				if (checkboxes[j].value == a1[i] && checkboxes[j].checked == true) {
					number++;
				}
			}
		}
		for (var a = 0, b = a2.length; a < b; a++) {
			for (var c = 0, d = checkboxes.length; c < d; c++) {
				if (checkboxes[c].value == a2[a] && checkboxes[c].checked == true) {
					number = number + 2;
				}
			}
		}
		
		numberOfRomaji = parseInt(document.getElementById('number01').value);
		numberOfRomaji = numberOfRomaji + number;
		//alert(numberOfRomaji);
		document.getElementById('number01').value = numberOfRomaji;
	
	} else {
		setSize();
		
	}
	
}

/*
 * Called when the Submit button is clicked.
 */
function generate() {
    numberOfRomaji = document.getElementById('number01').value;
    checkboxes = document.getElementsByClassName('romajicheckbox');
    
	somethingchecked = false;
	dakuten = document.getElementById('dakuten').checked;
	
    for (var i = 0, n = checkboxes.length; i < n; i++) {
        if (checkboxes[i].checked == true) {
            somethingchecked = true;
        }
    }

    if (somethingchecked == false) { //if nothing is checked
        window.alert("You need to select some romaji!");
    } else if (numberOfRomaji == "" || numberOfRomaji <= 0) { //if "generate how many romaji" is zero or null
        window.alert("You must generate at least one romaji!");
    } else {
        var values = [];
        var randomizedList = [];
        var s = "";

        //gets all checkboxes, and then pushes the non all-box ones into the values array
        allcheckboxes = document.getElementsByClassName('romajicheckbox');
        for (var j = 0, n = allcheckboxes.length; j < n; j++) {
            if (!allcheckboxes[j].name.includes("all") && allcheckboxes[j].checked == true) {
                values.push(allcheckboxes[j].value);
            }
        }

		if (dakuten) {
			addDakuten(values);
		}

		//generate the list of romaji
        var current = "";
        var previous = "";
        k = 0;
        while (k < numberOfRomaji) {
            current = values[Math.floor(Math.random() * (values.length))];

            //if the current element is not a duplicate of the previous
            if (current != previous) {
                randomizedList.push(current);
                previous = current;
                k++;
            }
        }

        var columns = 10;
        var x = 0;
        s = s + "<table><tr>"
        while (x < randomizedList.length) {
            s = s + "<td>" + randomizedList[x] + "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</td>";
            if ((x + 1) % columns == 0 && x > 0) {
                s = s + "</tr><tr>";
            }
            x++;
        }
        s = s + "</tr></table>";


        window.open("data:text/html, <html><head><style>td{padding:20px;}</style></head><body>Generated " + randomizedList.length + " randomized romaji. Print this!<br><br>" + s + "</body></html>");
    }
}

function addDakuten(source) {
	temp = source;
	
	a1 = ["ka","ki","ku","ke","ko","sa","shi","su","se","so","ta","chi","tsu","te","to"];
	a1_1 = ["ga","gi","gu","ge","go","za","zji","zu","ze","zo","da","dji","dzu","de","do"];
	
	for (var i = 0, n = a1.length; i < n; i++) {
		if (contains(source, a1[i])) {
			temp.push(a1_1[i]);
		}
	}
	//alert("addDakuten successful!");
	
	a2 = ["ha","hi","fhu","he","ho"];
	a2_1 = ["pa","pi","pu","pe","po"];
	a2_2 = ["ba","bi","bu","be","bo"];
	
	for (var i = 0, n = a2.length; i < n; i++) {
		if (contains(source, a2[i])) {
			temp.push(a2_1[i]);
			temp.push(a2_2[i]);
		}
	}
	
	//alert(temp);
}

function setSize() {
    var values = [];

    allcheckboxes = document.getElementsByClassName('romajicheckbox');

    for (var j = 0, n = allcheckboxes.length; j < n; j++) {
        if (!allcheckboxes[j].name.includes("all") && allcheckboxes[j].checked == true) {
            values.push(allcheckboxes[j].value);
        }
    }
    numberSelector = document.getElementById('number01');
    numberSelector.value = values.length;
}

function setCookie() {
    checkboxes = document.getElementsByClassName('romajicheckbox');
    document.cookie = checkboxes;
}

function getCookie() {
    checkboxes = document.cookie;
    return checkboxes;
}