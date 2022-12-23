import { RouterHandler } from "../router/router-handler";
import { picker } from "../actions/controllers";
("use strict");

export class EditItem extends HTMLElement {
    constructor() {
        super();
        this.editListItem = this.editListItem.bind(this);
        this.picker = picker;
        this.data = JSON.parse(window.localStorage.getItem("colors"));
        this.editedObject = this.data.find(
            (e) => e.id == window.localStorage.getItem("edit")
        );
    }

    static get observedAttributes() {
        return [];
    }

    attributeChangedCallback(name, oldValue, newValue) {}

    disconnectedCallback() {}

    connectedCallback() {
        this.innerHTML = this.render();
        const optionInput = document.querySelector(
            `#${this.editedObject.type}`
        );
        optionInput && optionInput.setAttribute("selected", "selected");
        this.picker();
        const editElementButton = document.querySelector(
            ".editable-list-add-item"
        );
        editElementButton.addEventListener("click", this.editListItem, false);
    }

    editListItem(e) {
        const textInput = document.querySelector(".name-input");
        const typeInput = document.querySelector(".type-input");
        const colorInput = window.localStorage.getItem("choosenColor");
        this.editedObject.name = textInput.value;
        this.editedObject.type = typeInput.value;
        this.editedObject.color = colorInput;
        let newData = this.data.filter((e) => e.id !== this.editedObject.id);
        if (textInput.value) {
            newData.push(this.editedObject);
            window.localStorage.setItem("colors", JSON.stringify(newData));
            textInput.value = "";
            RouterHandler.instance.router.navigate("#/");
        }
    }

    render() {
        return `
   <style>
          .pcr-app {
    position: inherit;
}
        .container{
          display:flex;
          justify-content:center;
          flex-direction: column;
        }
        .container>h3{
          text-align:center;
          color:#ffffff;
          font-weight:bold;
        }
        .color-picker{
            display:none !important;
        }

        .EditItemButton{
          color:#A0A0A0;
          margin:20px;
          border: 1px solid #5f5f5f;
          width:22.25em;
          height: 40px;
          border-radius:20px;
          text-decoration: none;
          display: inline-flex;
          align-items: center; 
          justify-content:center;
          background-color: #424242;
          cursor:pointer
        }
        .button_container{
          width:100%;
          display:flex;
          justify-content:center;
        }
        .input_field{
          display:flex;
          justify-content:center;
          align-items:center;
          margin-bottom:1em;
          color:#A0A0A0;
        }
        .input{
          color:#A0A0A0;
          background-color:#424242;
          outline: none;
          border:none;
          margin-left:1em;
          border-radius:8px;
          border: 1px solid #5F5F5F;
          width:175px;
          height:40px;
          padding-left:1em;
        }
        .input::placeholder {
          color: #A0A0A0;
        }
        .type-input{
          padding-left:1em;
          margin-left:1.6em;
          width:193px;
          height: 42px
        }
        .pickr .pcr-button {
            display:none;
        }
     .select * {

        }
        </style>
        <div class="container">
          <h3>Добавление цвета</h3>
          <div class="input_field"><label>Название цвета</label><input value=${this.editedObject.name} placeholder="Введите название" class="input name-input" type="text"></input></div>
          <div class="input_field">
          <label>Выберите тип</label>
          <select class="input select type-input">    
          <option id="main" value="main">Main</option>
          <option id="primary" value="primary">Primary</option>
          <option id="secondary" value="secondary">Secondary</option>
          <option id="base" value="base">Base</option>
          </select>
          </div>
          <div class="button_container">
        <div class="color-picker"></div>
        <div  class="color-picker-view"></div>
        </div>
          <div class="button_container">
            <button class="editable-list-add-item EditItemButton">Изменить</button>
          </div>
        </div>
`;
    }
}
