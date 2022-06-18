const fetchOptions = {
    "method": "get",
    "mode": "cors",
    "headers": new Headers(),
    "cache": "no-cache"
};
const orderOfKeys = ["id", "fname", "lname", "age", "job"];
const dbURL = "http://localhost:3000/users";
let tableBody = document.querySelector("#tableBody");

function getJsonDB() {
    tableBody.innerHTML = '';
    newUserLine(tableBody);
    fetch(dbURL, fetchOptions).then(
        response => response.json(),
        err => console.error(err)
    )
        .then(
            response => drawTable(response)
        );
}

function newUserLine(tBody) {
    let NewInputLine = [];
    NewInputLine[0] = {};
    for (let k of orderOfKeys) {
        NewInputLine[0][k] = '';
    }
    drawTable(NewInputLine);

}

function drawTable(jsonReadDatas) {
    let newTR;
    let newTD;
    let newInput;
    for (let user of jsonReadDatas) {
        newTR = elementCreator('tr');
        for (let property of orderOfKeys) {
            newTD = elementCreator('td');
            newTR.appendChild(newTD);
            newInput = elementCreator('input', { 'value': user[property], 'class': 'form-control text-center', 'name': property });
            newTD.appendChild(newInput);
            if (property == 'id') {
                newInput.setAttribute('disabled', 'disabled');
            }
        }
        createActionButtons(newTR);
        tableBody.appendChild(newTR);
    }

}

function createActionButtons(newTR) {
    let td = elementCreator('td');
    let div = elementCreator('div', { class: 'btn btn-group  d-flex' });
    //ha már rendelkezik child-elementtel akkor update /Delete gombok
    if (tableBody.firstChild) {
        let buttonUpdate = elementCreator('button', { class: 'btn btn-info', onclick: 'updateThisRow(this)' });
        buttonUpdate.innerHTML = '<i class="fa-solid fa-rotate"></i>';
        div.appendChild(buttonUpdate);
        let buttonDelete = elementCreator('button', { class: 'btn btn-danger', onclick: 'deleteThisRow(this)' });
        buttonDelete.innerHTML = '<i class="fa-solid fa-trash-can"></i>';
        div.appendChild(buttonDelete);
    }
    //ha még nem rendelkezik child-elementtel akkor létrehozás gomb
    else {
        let buttonCreateNewUser = elementCreator('button', { class: 'btn btn-danger', onclick: 'createNewUser(this)' });
        buttonCreateNewUser.innerHTML = '<i class="fa-solid fa-circle-plus">';
        div.appendChild(buttonCreateNewUser);
    }
    td.appendChild(div);
    newTR.appendChild(td);
    return newTR;
}

function elementCreator(element, attributes) {
    let newElement = document.createElement(element);
    for (let k in attributes) {
        newElement.setAttribute(k, attributes[k]);
    }
    return newElement;
}

function updateThisRow(rowToUpdate) {
    let refreshedDatas = new Object();
    let RTU = Array.from(rowToUpdate.parentElement.parentElement.parentElement.querySelectorAll('.form-control'));
    for (let value of RTU) {
        refreshedDatas[value.name] = value.value;
    }
    let fetchOptions = {
        "method": "put",
        "mode": "cors",
        "cache": "no-cache",
        "headers": {
            "content-type": "application/json"
        },
        body: JSON.stringify(refreshedDatas)
    }
    fetch(`${dbURL}/${refreshedDatas.id}`, fetchOptions)
        .then(response => response.json(),
            err => console.error(err))
        .then(data => getJsonDB);
    ;

}

function deleteThisRow(rowToDelete) {
    let RTD = new Object();
    let idToDel = rowToDelete.parentElement.parentElement.parentElement.querySelector('input[name="id"]').value;

    let fetchOptions = {
        'method': 'delete',
        'mode': 'cors',
        'cache': 'default',
    }
    fetch(`${dbURL}/${idToDel}`, fetchOptions)
        .then(response => response.json(),
            err => console.error(err)).then
        (getJsonDB);
}

function createNewUser(callerTag) {
    let newDatasFromInput = callerTag.parentElement.parentElement.parentElement.querySelectorAll('.form-control');
    let newJsonInput = new Object();
    for (k of newDatasFromInput) {
        if (k.name != 'id') {
            newJsonInput[k.name] = k.value;
        }
    }
    console.table(newJsonInput);
    const fetchOptions={
        method:"post",
        mode:"cors",
        cache:"default",
        headers:{
            "content-type":"application/json"
        },
        body: JSON.stringify(newJsonInput)
    }
    fetch(dbURL,fetchOptions)
    .then(response=> response.json(),
    err=> console.error(err)).then(
        response => console.table(response)
    ).then(getJsonDB);
    
}
let buttonShowData = document.querySelector("#showData");
buttonShowData.addEventListener('click', getJsonDB);

