export function drag() {
    const table = document.getElementById("table");
    let draggingEle;
    let draggingRowIndex;
    let placeholder;
    let list;
    let isDraggingStarted = false;

    let x = 0;
    let y = 0;

    const swap = function (nodeA, nodeB) {
        const parentA = nodeA.parentNode;
        const siblingA =
            nodeA.nextSibling === nodeB ? nodeA : nodeA.nextSibling;
        nodeB.parentNode.insertBefore(nodeA, nodeB);
        parentA.insertBefore(nodeB, siblingA);
    };

    const isAbove = function (nodeA, nodeB) {
        const rectA = nodeA.getBoundingClientRect();
        const rectB = nodeB.getBoundingClientRect();

        return rectA.top + rectA.height / 2 < rectB.top + rectB.height / 2;
    };

    const cloneTable = function () {
        const rect = table.getBoundingClientRect();
        const width = parseInt(window.getComputedStyle(table).width);
        list = document.createElement("div");
        list.classList.add("clone-list");
        list.style.position = "absolute";
        list.style.left = `${rect.left}px`;
        list.style.top = `${rect.top}px`;
        table.parentNode.insertBefore(list, table);

        table.style.visibility = "hidden";

        table.querySelectorAll("tr").forEach(function (row) {
            const item = document.createElement("div");
            item.classList.add("draggable");

            const newTable = document.createElement("table");
            newTable.setAttribute("class", "clone-table");
            newTable.style.width = `${width}px`;

            const newRow = document.createElement("tr");
            const cells = [].slice.call(row.children);
            cells.forEach(function (cell) {
                const newCell = cell.cloneNode(true);
                newCell.style.width = `${parseInt(
                    window.getComputedStyle(cell).width
                )}px`;
                newRow.appendChild(newCell);
            });

            newTable.appendChild(newRow);
            item.appendChild(newTable);
            list.appendChild(item);
        });
    };

    const mouseDownHandler = function (e) {
        // Get the original row
        const originalRow = e.target.parentNode;
        draggingRowIndex = [].slice
            .call(table.querySelectorAll("tr"))
            .indexOf(originalRow);

        // Determine the mouse position
        x = e.clientX;
        y = e.clientY;

        // Attach the listeners to `document`
        document.addEventListener("mousemove", mouseMoveHandler);
        document.addEventListener("mouseup", mouseUpHandler);
    };

    const mouseMoveHandler = function (e) {
        if (!isDraggingStarted) {
            isDraggingStarted = true;
            cloneTable();
            draggingEle = [].slice.call(list.children)[draggingRowIndex];
            draggingEle.classList.add("dragging");
            placeholder = document.createElement("div");
            placeholder.classList.add("placeholder");
            draggingEle.parentNode.insertBefore(
                placeholder,
                draggingEle.nextSibling
            );
            placeholder.style.height = `${draggingEle.offsetHeight}px`;
        }
        draggingEle.style.position = "absolute";
        draggingEle.style.top = `${draggingEle.offsetTop + e.clientY - y}px`;
        draggingEle.style.left = `${draggingEle.offsetLeft + e.clientX - x}px`;
        x = e.clientX;
        y = e.clientY;
        const prevEle = draggingEle.previousElementSibling;
        const nextEle = placeholder.nextElementSibling;
        if (
            prevEle &&
            prevEle.previousElementSibling &&
            isAbove(draggingEle, prevEle)
        ) {
            swap(placeholder, draggingEle);
            swap(placeholder, prevEle);
            return;
        }
        if (nextEle && isAbove(nextEle, draggingEle)) {
            swap(nextEle, placeholder);
            swap(nextEle, draggingEle);
        }
    };

    const mouseUpHandler = function () {
        placeholder && placeholder.parentNode.removeChild(placeholder);
        draggingEle.classList.remove("dragging");
        draggingEle.style.removeProperty("top");
        draggingEle.style.removeProperty("left");
        draggingEle.style.removeProperty("position");
        const endRowIndex = [].slice.call(list.children).indexOf(draggingEle);
        isDraggingStarted = false;
        list.parentNode.removeChild(list);
        let rows = [].slice.call(table.querySelectorAll("tr"));
        draggingRowIndex > endRowIndex
            ? rows[endRowIndex].parentNode.insertBefore(
                  rows[draggingRowIndex],
                  rows[endRowIndex]
              )
            : rows[endRowIndex].parentNode.insertBefore(
                  rows[draggingRowIndex],
                  rows[endRowIndex].nextSibling
              );
        table.style.removeProperty("visibility");
        document.removeEventListener("mousemove", mouseMoveHandler);
        document.removeEventListener("mouseup", mouseUpHandler);
    };

    table &&
        table.querySelectorAll("tr").forEach(function (row, index) {
            if (index === 0) {
                return;
            }
            const firstCell = row.firstElementChild;
            firstCell.classList.add("draggable");
            firstCell.addEventListener("mousedown", mouseDownHandler);
        });
}

export function picker() {
    const pickr = Pickr.create({
        el: ".color-picker",
        theme: "nano",
        container: ".color-picker-view",
        showAlways: true,
        swatches: [
            "rgba(244, 67, 54, 1)",
            "rgba(233, 30, 99, 0.95)",
            "rgba(156, 39, 176, 0.9)",
            "rgba(103, 58, 183, 0.85)",
            "rgba(63, 81, 181, 0.8)",
            "rgba(33, 150, 243, 0.75)",
            "rgba(3, 169, 244, 0.7)",
            "rgba(0, 188, 212, 0.7)",
            "rgba(0, 150, 136, 0.75)",
            "rgba(76, 175, 80, 0.8)",
            "rgba(139, 195, 74, 0.85)",
            "rgba(205, 220, 57, 0.9)",
            "rgba(255, 235, 59, 0.95)",
            "rgba(255, 193, 7, 1)",
        ],

        components: {
            preview: true,
            opacity: false,
            hue: false,
            // Input / output Options
            interaction: {
                hex: true,
                rgba: true,
                hsla: false,
                hsva: false,
                cmyk: false,
                input: true,
                clear: false,
                save: true,
            },
        },
    });
    pickr.on("save", (...args) => {
        let color = args[0].toHEXA().toString();
        window.localStorage.setItem("choosenColor", color);
    });
}

export function fetchData() {
    function ID() {
        return "_" + Math.random().toString(36).substr(2, 9);
    }
    const intialData = [
        { id: ID(), name: "name1", type: "main", color: "#f4f4f4" },
        { id: ID(), name: "name2", type: "main", color: "#f4f4f4" },
        { id: ID(), name: "name3", type: "side", color: "#f8f8f8" },
    ];
    let colorsData =
        window.localStorage.getItem("colors") &&
        JSON.parse(window.localStorage.getItem("colors"));
    !colorsData
        ? window.localStorage.setItem("colors", JSON.stringify(intialData))
        : null;
}
