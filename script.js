var textArea = document.querySelector("#Area");
var returnBtn = document.querySelector("#ReturnBtn");
var returnText = document.querySelector("#ReturnText");

allCode = [];
varName = [];
varValue = [];
varType = [];
funcName = [];
funcStartLine = [];
funcLastLine = [];
var lastCodeLine = 0;

returnBtn.addEventListener('click', () => {
    var allText = document.getElementById('Area').value;
    ReadCode(allText);
});

function ReadCode(codeText) {
    allCode = codeText.split('\n');
    varName = [];
    varValue = [];
    varType = [];
    funcName = [];
    funcStartLine = [];
    funcLastLine = [];
    lastCodeLine = 0;
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
                } else if (newCode.indexOf("B ") == 0) {
                    var newVarName=  newCode.slice(2, newCode.indexOf("<") - 1);
                    var newVarValue = newCode.slice(newCode.indexOf("<") + 3);
                    if (Number(newVarValue) != 0 && Number(newVarValue) != 1) {
                        alert("Error : line" + (i + 1) + ", Bool타입 변수는 1, 0만 들어갈 수 있습니다.")
                    }
                    if (varName.indexOf(newVarName) >= 0) {
                        var nowVarIndex = varName.indexOf(newVarName);
                        if (varType[nowVarIndex] != "B") {
                            alert("Error : line " + (i + 1) + ", 변수 타입은 변경할 수 없습니다.");
                            return;
                        }
                        varValue[nowVarIndex] = newVarValue;
                    } else {
                        varName.push(newVarName);
                        varValue.push(newVarValue);
                        varType.push("B")
                    }
                } else if (newCode.indexOf("Go ") == 0) {
                    var lineIndex = Number(newCode.slice(3));
                    if (isNaN(lineIndex) || lineIndex % 1 != 0 || lineIndex < 1) {
                        alert("Error : line" + (i + 1) + ", Go명령어 뒤에는 정수만 들어올 수 있습니다.");
                        return;
                    } else {
                        i = lineIndex - 2;
                    }
                } else if (newCode.indexOf("Add ") == 0) {
                    var nowVarName = newCode.split(" ")[1];
                    if (varName.indexOf(nowVarName) < 0 || varType[varName.indexOf(nowVarName)] != "N" || isNaN(Number(newCode.split(" ")[2]))) {
                        alert("Error : line" + (i + 1) + ", Add명령어는 존재하는 숫자 변수 이름과 더할 값을 차례로 나타내야 합니다.")
                        return;
                    } else {
                        varValue[varName.indexOf(nowVarName)] = Number(varValue[varName.indexOf(nowVarName)]) + Number(newCode.split(" ")[2]);
                    }
                } else if (newCode.indexOf("Mul ") == 0) {
                    var nowVarName = newCode.split(" ")[1];
                    if (varName.indexOf(nowVarName) < 0 || varType[varName.indexOf(nowVarName)] != "N" || isNaN(Number(newCode.split(" ")[2]))) {
                        alert("Error : line" + (i + 1) + ", Mul명령어는 존재하는 숫자 변수 이름과 더할 값을 차례로 나타내야 합니다.")
                        return;
                    } else {
                        varValue[varName.indexOf(nowVarName)] = Number(varValue[varName.indexOf(nowVarName)]) * Number(newCode.split(" ")[2]);
                    }
                } else if (newCode.indexOf("If ") == 0) {
                    if (newCode.split(" ")[2] == "Do") {
                        if (Number(newCode.split(" ")[1]) == 1) {
                            var lineIndex = Number(newCode.split(" ")[3]);
                            if (isNaN(lineIndex) || lineIndex % 1 != 0 || lineIndex < 1) {
                                alert("Error : line" + (i + 1) + ", Do명령어 뒤에는 정수만 들어올 수 있습니다.");
                                return;
                            } else {
                                i = lineIndex - 2;
                            }
                        } else if (isNaN(Number(newCode.split(" ")[1])) || Number(newCode.split(" ")[1]) != 0) {
                            alert("Error : line" + (i + 1) + ", 0 혹은 1의 숫자형 혹은 Bool형의 값만 대입할 수 있습니다.");
                            return;
                        }
                    }
                } else if (newCode.indexOf("F ") == 0 && newCode.indexOf("->") >= 0) {
                    var nowFuncName = newCode.slice(2, newCode.indexOf("->"));
                    if (codeArray.indexOf("<-" + nowFuncName) < 0) {
                        alert("Error: line" + (i + 1) + ", 함수 선언 시 닫는 코드가 필요합니다.");
                        return;
                    }
                    funcName.push(nowFuncName);
                    funcStartLine.push(i);
                    funcLastLine.push(codeArray.indexOf("<-" + nowFuncName) + 1);
                    i = codeArray.indexOf("<-" + nowFuncName);
                } else if (newCode.indexOf("DoF ") == 0) {
                    var nowFuncName = newCode.split(" ")[1];
                    var funcNum = funcName.indexOf(nowFuncName);
                    lastCodeLine = i;
                    i = funcStartLine[funcNum];
                } else if (newCode.indexOf("<-") == 0) {
                    if (funcName.indexOf(newCode.slice(2)) >= 0) {
                        i = lastCodeLine;
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
