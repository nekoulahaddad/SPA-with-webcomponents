import { RouterHandler } from "../router/router-handler";
import { picker } from "../actions/controllers";
("use strict");

export class AddItem extends HTMLElement {
    constructor() {
        super();
        this.addListItem = this.addListItem.bind(this);
        this.picker = picker;
    }

    static get observedAttributes() {
        return [];
    }

    attributeChangedCallback(name, oldValue, newValue) {}

    disconnectedCallback() {}

    connectedCallback() {
        this.innerHTML = this.render();
        this.picker();
        const addElementButton = document.querySelector(
            ".editable-list-add-item"
        );
        addElementButton.addEventListener("click", this.addListItem, false);
    }

    addListItem(e) {
        const textInput = document.querySelector(".name-input");
        const typeInput = document.querySelector(".type-input");
        const colorInput = window.localStorage.getItem("choosenColor");
        if (textInput.value) {
            function ID() {
                return "_" + Math.random().toString(36).substr(2, 9);
            }
            const data = JSON.parse(window.localStorage.getItem("colors"));
            data.push({
                id: ID(),
                name: textInput.value,
                type: typeInput.value,
                color: colorInput,
            });
            window.localStorage.setItem("colors", JSON.stringify(data));
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

        .addItemButton{
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
          background-color:#424242;
          cursor:pointer;
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
          <div class="input_field"><label>Название цвета</label><input placeholder="Введите название" class="input name-input" type="text"></input></div>
          <div class="input_field">
          <label>Выберите тип</label>
          <select class="input select type-input">    
          <option value="main">Main</option>
          <option value="primary">Primary</option>
          <option value="secondary">Secondary</option>
          <option value="base">Base</option>
          </select>
          </div>
          <div class="button_container">
        <div class="color-picker"></div>
        <div  class="color-picker-view"></div>
        </div>
          <div class="button_container">
            <button class="editable-list-add-item addItemButton">Добавить</button>
          </div>
        </div>
`;
    }
}
