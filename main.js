//Funciones para uso global
function removeChild(parentId) {
    const parentElement = document.getElementById(parentId);
    while (parentElement.firstChild) {
        parentElement.removeChild(parentElement.firstChild);
    }
}


function displayMessage(msgText, msgType, funcion) {
    let msgArea = document.querySelector(".msgArea");
    let panel = document.createElement("div");
    panel.setAttribute("class", "msgBox");
    msgArea.appendChild(panel);

    let msg = document.createElement("p");
    msg.textContent = msgText;
    panel.appendChild(msg);

    let closeBtn = document.createElement("button");
    closeBtn.textContent = "Cancelar";
    panel.appendChild(closeBtn);

    let agreeBtn = document.createElement("button");
    agreeBtn.textContent = "Continuar";
    panel.appendChild(agreeBtn);

    closeBtn.onclick = function () {
        panel.parentNode.removeChild(panel);
        document.getElementById("personDeleteAlert").style.display = "none";
    };

    agreeBtn.onclick = funcion;

    if (msgType === "warning") {
        panel.style.backgroundColor = "rgb(000)";
    } else if (msgType === "info") {
        panel.style.backgroundColor = "white";
    } else {
        msg.style.paddingLeft = "20px";
    }

    document.getElementById("personDeleteAlert").style.display = "block";



}


function deletePerson(person) {

    // Remueve la persona del peopleArray
    const indexToDelete = peopleArray.findIndex(p => p.name === person.name);

    if (indexToDelete !== -1) {
        // La persona se encontró en el array, la eliminamos
        peopleArray.splice(indexToDelete, 1);

        // Elimina la ficha de la persona del DOM
        const personCardToDelete = document.querySelector(".person-card[data-name='" + person.name + "']");
        if (personCardToDelete) {
            personCardToDelete.remove();
        }

        // Cierra el modal de detalles
        personDetailsModal.style.display = "none";


        // Remueve las personCard de peopleContainer 
        removeChild("peopleContainer");

        // Vuelve a agregar las fichas con la información actualizada del peopleArray
        peopleArray.forEach(person => addPersonCard(person));

    }
    document.getElementById("personDeleteAlert").style.display = "none";



}




// Constructor de persona
function Person(name, surname, company, mail, state) {
    this.name = name;
    this.surname = surname;
    this.company = company;
    this.mail = mail;
    this.state = state;
}


// Array para almacenar personas
const peopleArray = [];



//FORMULARIO - NUEVA PERSONA

// Muestra y oculta el modal del Formulario
document.getElementById("openFormButton").addEventListener("click", function () {
    document.getElementById("personFormModal").style.display = "block";
    document.getElementById("state").value = "";
});

document.getElementById("closeFormButton").addEventListener("click", function () {
    document.getElementById("personFormModal").style.display = "none";
});


// Envío del formulario
document.getElementById("personForm").addEventListener("submit", function (event) {
    event.preventDefault();

    // Obtienen los valores del formulario
    const name = document.getElementById("name").value;
    const surname = document.getElementById("surname").value;
    const company = document.getElementById("company").value;
    const mail = document.getElementById("mail").value;
    const state = document.getElementById("state").value

    const newPerson = new Person(name, surname, company, mail, state); // Crea una nueva instancia de persona
    peopleArray.push(newPerson); // Agrega la nueva persona al array
    addPersonCard(newPerson); // Agrega la ficha de la persona al contenedor

    // Limpia los campos del formulario
    document.getElementById("name").value = "";
    document.getElementById("surname").value = "";
    document.getElementById("company").value = "";
    document.getElementById("mail").value = "";
    document.getElementById("state").value = "";

});


// Agrega una ficha de cada nueva persona
function addPersonCard(person) {
    const personCard = document.createElement("div");
    personCard.classList.add("personCard");

    const fieldsToDisplay = [
        { label: "Nombre", property: "name" },
        { label: "Apellido", property: "surname" },
        { label: "Empresa", property: "company" },
        { label: "Correo Electrónico", property: "mail" },
        { label: "Estado", property: "state" },
    ];

    // Agrega los elementos al "person-card" utilizando un bucle
    fieldsToDisplay.forEach(fieldInfo => {
        const fieldElement = document.createElement("p");
        fieldElement.textContent = fieldInfo.label + ": " + person[fieldInfo.property];
        personCard.appendChild(fieldElement);
    });

    // Agrega la ficha de la persona al contenedor de personas
    document.getElementById("peopleContainer").appendChild(personCard);

    //Ejecuta la función para ver el detalle de la persona al hacer click en la ficha
    personCard.addEventListener("click", function () {
        displayPersonDetails(person);
    });
}





//BARRA DE BUSQUEDA Y VIZUALIZACION

// Búsqueda de personas en tiempo real
function searchPeopleRealTime() {
    const searchTerm = document.getElementById("searchInput").value.trim().toLowerCase(); // Elimina espacios en blanco al principio y al final

    if (searchTerm !== "") { // Verifica si el campo de búsqueda no está vacío ni contiene solo espacios en blanco
        const resultsContainer = document.getElementById("searchResults");
        resultsContainer.innerHTML = ""; // Limpia la lista de resultados

        // Realiza la búsqueda
        const results = peopleArray.filter(person => {
            const fullName = (person.name + " " + person.surname).toLowerCase();
            return fullName.includes(searchTerm) || person.company.toLowerCase().includes(searchTerm);
        });

        // Muestra los resultados en la lista
        results.forEach(person => {
            const listItem = document.createElement("li");

            listItem.textContent = person.name + " " + person.surname + " | Company: " + person.company;

            listItem.addEventListener("click", function () { // Agrega un evento de clic al elemento de la lista

                displayPersonDetails(person); // Abre el modal de Person Details

            });

            resultsContainer.appendChild(listItem);
        });
    } else {
        document.getElementById("searchResults").innerHTML = ""; // Si el campo de búsqueda está vacío, limpia la lista de resultados
    }
}

// Agregar un evento de entrada al campo de búsqueda
document.getElementById("searchInput").addEventListener("input", searchPeopleRealTime);




// Agrega un evento para detectar el cambio en el desplegable de filtro de estado
document.getElementById("stateFilter").addEventListener("change", function () {
    const selectedState = this.value; // Obtiene el estado seleccionado

    // Limpia el contenedor de personas antes de aplicar el filtro
    const peopleContainer = document.getElementById("peopleContainer");
    peopleContainer.innerHTML = "";

    // Aplica el filtro según el estado seleccionado
    if (selectedState === "Todos") {
        peopleArray.forEach(person => {
            addPersonCard(person);
        });
    } else {
        const filteredPeople = peopleArray.filter(person => person.state === selectedState);
        filteredPeople.forEach(person => {
            addPersonCard(person);
        });
    }
});



//DETALLE DE PERSONAS

// Obtiene el modal de detalles y el botón para cerrarlo
const personDetailsModal = document.getElementById("personDetailsModal");
const closeDetailsButton = document.getElementById("closeDetailsButton");

// Cierra el modal de detalles
closeDetailsButton.addEventListener("click", function () {
    personDetailsModal.style.display = "none";
});


function displayPersonDetails(person) {
    const personDetails = document.getElementById("personDetails");
    personDetails.innerHTML = "";

    // Define los campos que se mostrarán y si son editables
    const fields = [
        { label: "Nombre", property: "name", editable: true },
        { label: "Apellido", property: "surname", editable: true },
        { label: "Empresa", property: "company", editable: true },
        { label: "Correo Electrónico", property: "mail", editable: true },
    ];

    // Crea un botón "Editar" para habilitar la edición de campos
    const editButton = document.createElement("button");
    editButton.textContent = "Editar";
    editButton.addEventListener("click", function () {
        // Habilita la edición solo en los campos editables
        fields.forEach(fieldInfo => {
            if (fieldInfo.editable) {
                const contentElement = personDetails.querySelector(`[data-property="${fieldInfo.property}"]`);
                if (contentElement) {
                    contentElement.contentEditable = true;

                }
            }
        });

        // Habilita el selector de estado
        stateSelect.disabled = false;

        // Muestra un botón "Guardar Cambios"
        saveButton.style.display = "inline-block";

        // Oculta el botón "Editar"
        editButton.style.display = "none";
    });

    // Crea un boton "Eliminar Persona"
    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Eliminar persona";
    deleteButton.classList.add("btn-danger");
    deleteButton.addEventListener("click", function () {
        displayMessage("Esta acción eliminará a la persona y todos sus datos. ¿Estás seguro que deseas continuar?", "warning", function () {
            deletePerson(person); // Llama a deletePerson con la persona actual
        });
    });

    // Crea un botón "Guardar Cambios" (oculto por defecto)
    const saveButton = document.createElement("button");
    saveButton.textContent = "Guardar Cambios";
    saveButton.style.display = "none";
    saveButton.addEventListener("click", function () {
        // Guarda los cambios en los campos editables
        fields.forEach(fieldInfo => {
            if (fieldInfo.editable) {
                const contentElement = personDetails.querySelector(`[data-property="${fieldInfo.property}"]`);
                if (contentElement) {
                    person[fieldInfo.property] = contentElement.textContent;
                }
            }
        });

        person.state = stateSelect.value;


        // Deshabilita la edición de los campos
        fields.forEach(fieldInfo => {
            if (fieldInfo.editable) {
                const contentElement = personDetails.querySelector(`[data-property="${fieldInfo.property}"]`);
                if (contentElement) {
                    contentElement.contentEditable = false;
                }
            }
        });

        // Deshabilita el selector de estado
        stateSelect.disabled = true;

        // Oculta el botón "Guardar Cambios"
        saveButton.style.display = "none";

        // Vuelve a mostrar el boton "Editar"
        editButton.style.display = "inline-block";

        // Remueve las personCard de peopleContainer 
        removeChild("peopleContainer");

        // Vuelve a agregar las fichas con la información actualizada del peopleArray
        peopleArray.forEach(person => addPersonCard(person));
    });

    // Agrega los elementos al modal de detalles
    fields.forEach(fieldInfo => {
        const labelElement = document.createElement("p");
        labelElement.textContent = fieldInfo.label + ": ";

        const contentElement = document.createElement("span");
        contentElement.textContent = person[fieldInfo.property];
        contentElement.dataset.property = fieldInfo.property;
        labelElement.appendChild(contentElement);
        personDetails.appendChild(labelElement);
    });

    // Crea el selector de estado
    const stateSelect = document.createElement("select");
    stateSelect.name = "state";
    const options = ["Cliente Potencial", "Envío de propuesta", "Negociación", "Cierre de venta", "Activo", "Inactivo", "Cliente Recurrente"];
    options.forEach(option => {
        const optionElement = document.createElement("option");
        optionElement.value = option;
        optionElement.text = option;
        stateSelect.appendChild(optionElement);
    });
    stateSelect.value = person.state;
    stateSelect.disabled = true;

    personDetails.appendChild(stateSelect);

    // Agrega el botón "Editar" y el botón "Guardar Cambios"
    personDetails.appendChild(editButton);
    personDetails.appendChild(saveButton);
    personDetails.appendChild(deleteButton);

    

    // Abre el modal de detalles
    personDetailsModal.style.display = "block";
}








