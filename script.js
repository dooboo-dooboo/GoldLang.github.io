var textArea = document.querySelector("#Area");
var returnBtn = document.querySelector("#ReturnBtn");
var returnText = document.querySelector("#ReturnText");

allCode = [];
varName = [];
varValue = [];
varType = [];

returnBtn.addEventListener('click', () => {
    var allText = document.getElementById('Area').value;
    ReadCode(allText);
});

function ReadCode(codeText) {
    allCode = codeText.split('\n');
    varName = [];
    varValue = [];
    varType = [];
    CodeToResult(allCode);
}

function CodeToResult(codeArray) {
    var results = [];

    if (codeArray.indexOf("Script->") >= 0) {
        for (var i = 0; i < codeArray.length; i++) {
            var newCode = codeArray[i];
            if (varName.length > 0) {
                for (var j = 0; j < varName.length; j++) {
                    
                    if (newCode.indexOf("[" + varName[j] + "]") >= 0) {
                        newCode = newCode.replaceAll("[" + varName[j] + "]", varValue[j]);
                    }
                }
                console.log(newCode);
            }
            if (i > codeArray.indexOf("Script->") && i < codeArray.indexOf("<-Script")) {
                if (newCode.indexOf("Show <") == 0) {
                    results.push(newCode.replace("Show <", "").split("").reverse().join("").replace(">", "").split("").reverse().join(""));
                } else if (newCode.indexOf("N ") == 0) {
                    var newVarName=  newCode.slice(2, newCode.indexOf("<") - 1);
                    var newVarValue = newCode.slice(newCode.indexOf("<") + 3);
                    if (varName.indexOf(newVarName) >= 0) {
                        if (isNaN(Number(newVarValue))) {
                            alert("Error : line " + (i + 1) + ", 변수 타입이 맞지 않습니다.");
                            return;
                        }
                        var nowVarIndex = varName.indexOf(newVarName);
                        if (varType[nowVarIndex] != "N") {
                            alert("Error : line " + (i + 1) + ", 변수 타입은 변경할 수 없습니다.");
                            return;
                        }
                        varValue[nowVarIndex] = newVarValue;
                    } else {
                        if (isNaN(Number(newVarValue))) {
                            alert("Error : line " + (i + 1) + ", 변수 타입이 맞지 않습니다.");
                            return;
                        }
                        varName.push(newVarName);
                        varValue.push(newVarValue);
                        varType.push("N")
                    }
                } else if (newCode.indexOf("S ") == 0) {
                    var newVarName=  newCode.slice(2, newCode.indexOf("<") - 1);
                    var newVarValue = newCode.slice(newCode.indexOf("<") + 3);
                    if (varName.indexOf(newVarName) >= 0) {
                        var nowVarIndex = varName.indexOf(newVarName);
                        if (varType[nowVarIndex] != "S") {
                            alert("Error : line " + (i + 1) + ", 변수 타입은 변경할 수 없습니다.");
                            return;
                        }
                        varValue[nowVarIndex] = newVarValue;
                    } else {
                        varName.push(newVarName);
                        varValue.push(newVarValue);
                        varType.push("S")
                    }
                }
            }
        }
    }
    

    ShowResult(results);
}

function ShowResult(resultText) {
    var t = '';
    for (var i = 0; i < resultText.length; i++) {
        t += resultText[i];
        t += "\n";
    }
    document.getElementById('ReturnText').innerText = t;
}