import { RouterHandler } from "../router/router-handler";
import { drag, fetchData } from "../actions/controllers";
("use strict");
export class Dashboard extends HTMLElement {
    constructor() {
        super();
        this.headers = [
            "Цвет",
            "Название",
            "Тип",
            "Код",
            "Изменить",
            "Удалить",
        ];
        this.mapOrder = this.mapOrder.bind(this);
        this.saveTable = this.saveTable.bind(this);
        this.drag = drag.bind(this);
        this.fetchData = fetchData.bind(this);
        this.handleItemListeners = this.handleItemListeners.bind(this);
        this.removeListItem = this.removeListItem.bind(this);
    }

    static get observedAttributes() {
        return [];
    }

    attributeChangedCallback(name, oldValue, newValue) {}

    disconnectedCallback() {}

    connectedCallback() {
        this.fetchData();
        this.colorsData =
            window.localStorage.getItem("colors") &&
            JSON.parse(window.localStorage.getItem("colors"));
        this.innerHTML = this.render();
        this.drag();
        const removeElementButtons = [
            ...document.querySelectorAll(".color-picker-remove-item"),
        ];
        const editElementButtons = [
            ...document.querySelectorAll(".color-picker-edit-item"),
        ];
        this.handleItemListeners(removeElementButtons, editElementButtons);
        const saveElementButton = document.querySelector(
            ".color-picker-save-item"
        );
        saveElementButton.addEventListener("click", this.saveTable, false);
    }

    handleItemListeners(arrayOfRemoveElements, arrayOfEditElements) {
        arrayOfRemoveElements.forEach((element) => {
            element.addEventListener("click", this.removeListItem, false);
        });
        arrayOfEditElements.forEach((element) => {
            element.addEventListener("click", this.editListItem, false);
        });
    }

    mapOrder(array, order, key) {
        array.sort(function (a, b) {
            var A = a[key],
                B = b[key];

            if (order.indexOf(A) > order.indexOf(B)) {
                return 1;
            } else {
                return -1;
            }
        });

        return array;
    }

    saveTable() {
        const oldData =
            window.localStorage.getItem("colors") &&
            JSON.parse(window.localStorage.getItem("colors"));
        const table = document.getElementById("table");
        let rows = table.getElementsByTagName("tr");
        let ids = [...rows].map((e) => e.getAttribute("id"));
        let ordered = this.mapOrder(oldData, ids, "id");
        window.localStorage.setItem("colors", JSON.stringify(ordered));
    }

    editListItem(e) {
        let selectedColorForEditing = e.currentTarget.id.slice(1);
        window.localStorage.setItem("edit", selectedColorForEditing);
        RouterHandler.instance.router.navigate("#/editItem");
    }

    removeListItem(e) {
        e.currentTarget.parentNode.parentNode.remove();
        const data = JSON.parse(window.localStorage.getItem("colors"));
        const newData = data.filter(
            (element) => element.id !== e.currentTarget.id
        );
        window.localStorage.setItem("colors", JSON.stringify(newData));
    }

    render() {
        return `
                <style>
          :host{
            font-size: 2.5vh;
          }
          table{
                border-collapse: collapse;
                border-spacing: 0;
                width: 100%;
                border: 1px solid #313131;
          }
          th {
              padding: 1em;
              border: 1px solid #313131;
              color:#BFBFBF;
              background-color:#424242;
              font-weight: normal;
          }
        button {
          background: none;
          color: inherit;
          border: none;
          padding: 0;
          font: inherit;
          cursor: pointer;
          outline: inherit;
        }
        .button_container{
          width:100%;
          display:flex;
          justify-content:center;
        }
        .page-title{
          padding-top:30px;
          padding-bottom:10px;
          color:#ffffff;
          text-align:center;
        }
        .edit{
          stroke:#BFBFBF;
        }
        .edit:hover{
          stroke:#53CBF1;
        }
        .trash:hover{
          stroke:#CA4C4C;
        }
        .draggable {
            cursor: move;
            user-select: none;
        }
        .addItemButton{
          color:#ffffff;
          margin:20px;
          border: 1px solid #53CBF1;
          width:220px;
          height: 35px;
          border-radius:20px;
          text-decoration: none;
          display: inline-flex;
          align-items: center; 
          justify-content:center;
        }
        .table_labels{
          color:#ffffff;
          font-weight:bold;
        }
        .color_box{
          pointer-events: none;
          margin:auto;
          width: 10vh;
          height: 10vh;
        }
        .color-picker-save-item {
                position: absolute;
    right: 25px;
    top: 29px;
        }
        </style>
 <div>
        <h3 style="position:relative;" class="page-title">Таблица цветов
 <button class="color-picker-save-item icon">
        <svg width="25" height="25" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
<path fill-rule="evenodd" clip-rule="evenodd" d="M19 9.49323V19H6V6H15.1985L19 9.49323ZM15.5882 5L20 9.05405V20H5V5H15.5882Z" fill="#8D8D8D"/>
<path fill-rule="evenodd" clip-rule="evenodd" d="M16 15H9V19H16V15ZM8 14V20H17V14H8Z" fill="#8D8D8D"/>
</svg>
</button>
</h3>
        <div style="overflow-x:auto;">
        <table id="table" class="table item-list">
          <tr>
          ${this.headers
              .map((header) => `<th class="table_labels">${header}</th>`)
              .join("")}
          </tr>
          ${
              this.colorsData &&
              this.colorsData
                  .map(
                      (item) => `
            <tr id=${item.id}>
              <th><div class="color_box" style=background-color:${item.color}></div></th>
              <th>${item.name}</th>
              <th>${item.type}</th>
              <th>${item.color}</th>
              <th><button id=_${item.id} class="color-picker-edit-item"><svg class="edit" width="20" height="20" viewBox="0 0 28 27" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M20.7402 1.80782C21.0858 1.47245 21.4962 1.20642 21.9478 1.02492C22.3994 0.843415 22.8834 0.75 23.3722 0.75C23.8612 0.75 24.3452 0.843415 24.7968 1.02492C25.2484 1.20642 25.6586 1.47245 26.0044 1.80782C26.35 2.14319 26.6242 2.54134 26.8112 2.97952C26.9982 3.4177 27.0946 3.88735 27.0946 4.36163C27.0946 4.83592 26.9982 5.30555 26.8112 5.74373C26.6242 6.18191 26.35 6.58006 26.0044 6.91543L8.2381 24.1536L1 26.069L2.97402 19.0461L20.7402 1.80782Z" 
 stroke-linecap="round" stroke-linejoin="round"/>
</svg></button></th>
              <th><button id=${item.id} class="color-picker-remove-item icon">
<svg class="trash" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
<path  fill-rule="evenodd" clip-rule="evenodd" d="M15 4H4L5.26923 16H13.7308L15 4ZM13.8887 5H5.11135L6.16904 15H12.831L13.8887 5Z" fill="#BFBFBF
"/>
</svg>
              </button></th>
            </tr>
          `
                  )
                  .join("")
          }
        </table>
        </div>
        <div class="button_container">
          <a href="#/addItem" class="color-picker-add-item addItemButton">Добавить цвет</a>
        </div>

</div>
`;
    }
}
